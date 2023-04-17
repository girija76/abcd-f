import { Button, message, Modal } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { QuestionContext } from '../QuestionContext';
import Limiter from 'async-limiter';
import questionApi from 'apis/addQuestions';
import { types } from '../initialProps';
import { useParams } from 'react-router';
import draftApi from 'apis/draft';
import _ from 'lodash';
import { useBoolean } from 'use-boolean';

const UpdateDraft = () => {
	const { id } = useParams();

	const questionContext = useContext(QuestionContext);
	const finalData = questionContext.finalData;

	const [savingQuestions, setSavingQuestions] = useState(false);
	const [updateRequired, setUpdateRequired] = useState(false);
	const [showingProgress, showProgress, hideProgress] = useBoolean(false);

	const limiter = new Limiter({ concurrency: 5 });
	let successfulItems = [];
	let failedQuestions = [];

	const UpdateDraft = async sortedSections => {
		const fetchedDraft = await draftApi.getDraft(id);

		const sections = await fetchedDraft.sections.map((sec, index) => {
			return {
				...sec,
				name: finalData[index].name,
				questions: sortedSections[index],
			};
		});

		fetchedDraft.sections.length === successfulItems.length
			? draftApi
					.updateDraft({
						id: id,
						sections: JSON.stringify(sections),
					})
					.then(() => {
						message.success('draft updated');
						successfulItems = [];
						hideProgress();
					})
			: message.success('cant add new sections');
	};

	const onComplete = failedItems => {
		limiter.onDone(() => {
			if (failedQuestions.length > 0) {
				Modal.error({
					content: `${failedQuestions.length} items failed. Click retry to try again. Close to cancel.`,
					onOk: () => {
						failedQuestions = [];
						uploadQuestions(failedItems);
					},
					onCancel: () => {
						failedQuestions = [];
						onComplete();
					},
					okText: 'Retry',
				});
			} else {
				message.success('Questions added successfully');
				const sortedSections = successfulItems.map(sec => _.sortBy(sec, 'index'));
				UpdateDraft(sortedSections);
			}
		});
	};

	const uploadQuestions = data => {
		const failedItems = [];
		data.map((sec, index) => {
			!successfulItems[index] && successfulItems.push([]);
			failedItems.push([]);
			sec.map((ques, i) => {
				ques.question._id !== undefined && ques.question.hasChanged === false
					? successfulItems[index].push({
							index: ques.question.index,
							question: ques.question._id,
							correctMark: ques.question.correctMark,
							incorrectMark: ques.question.incorrectMark,
					  })
					: limiter.push(cb => {
							questionApi
								.uploadQuestions(
									ques.question._id === undefined ||
										ques.question.type !== ques.question.savedType
										? types.find(t => t.key === ques.question.type).param
										: types.find(t => t.key === ques.question.type).updateParam,

									ques
								)
								.then(res => {
									successfulItems[index].push({
										index: ques.question.index,
										question: res.savedQuestion
											? res.savedQuestion._id
											: res.updatedQuestion._id,
										correctMark: ques.question.correctMark,
										incorrectMark: ques.question.incorrectMark,
									});
									cb();
								})
								.catch(e => {
									failedItems[index].push(ques);
									failedQuestions.push(ques);
									cb();
								});
					  });
			});
		});

		onComplete(failedItems);
	};

	const parseQuestions = async () => {
		setSavingQuestions(false);

		const parsedData = await finalData.map(sec => {
			return sec.questions.map((ques, index) => {
				return {
					question: {
						_id: ques._id, //update
						index: index,
						type: ques.type,
						savedType: ques.savedType, //update
						hasChanged: ques.hasChanged, //update
						rawQuestion: ques.rawQuestion,
						content: { rawContent: ques.rawQuestion }, //update
						verificationModal: false,
						correctMark: ques.markingScheme.find(i => i.key === 'Correct').value,
						incorrectMark: ques.markingScheme.find(i => i.key === 'Incorrect').value,
						rawSolution: ques.rawSolution || {},
						solution: { rawContent: ques.rawSolution || {} },
						rawHint: ques.rawHint || {},
						hint: { rawContent: ques.rawHint || {} },
						processedOptions: ques.options.map(o => {
							return {
								isCorrect: o.isCorrect,
								content: o.rawOption,
							};
						}),

						options: ques.options.map(o =>
							o._id === undefined
								? {
										isCorrect: o.isCorrect,
										content: { rawContent: o.rawOption },
								  }
								: {
										_id: o._id,
										isCorrect: o.isCorrect,
										content: { rawContent: o.rawOption },
								  }
						),
						multiOptions: ques.options.map(o =>
							o._id === undefined
								? {
										isCorrect: o.isCorrect,
										content: { rawContent: o.rawOption },
								  }
								: {
										_id: o._id,
										isCorrect: o.isCorrect,
										content: { rawContent: o.rawOption },
								  }
						),
						answer: ques.integer ? ques.integer : '12',
						range: ques.range && {
							start: ques.range.start,
							end: ques.range.end,
						},
						dataType: 'text',
						category: '',
						concepts: [],
						hasEquation:
							(ques.rawQuestion &&
								ques.rawQuestion.entityMap &&
								Object.keys(ques.rawQuestion.entityMap).length > 0) ||
							(ques.rawSolution &&
								ques.rawSolution.entityMap &&
								Object.keys(ques.rawSolution.entityMap).length > 0) ||
							(ques.rawHint &&
								ques.rawHint.entityMap &&
								Object.keys(ques.rawHint.entityMap).length > 0)
								? true
								: false,
						hasImage: true,
						isVerified: false,
						level: 2,
						tag: '',
						tags: [],
					},
				};
			});
		});

		uploadQuestions(parsedData);
	};

	const saveAllQuestions = () => {
		questionContext.setFinalData(data =>
			data.map(sec => {
				return {
					...sec,
					questions: sec.questions.map(ques => {
						return {
							...ques,
							active: false,
						};
					}),
				};
			})
		);
	};

	useEffect(() => {
		if (savingQuestions) {
			const findActiveQuestion = finalData.find(sec =>
				sec.questions.find(ques => ques.active === true)
			);
			if (!findActiveQuestion) {
				const findUnsavedQuestion = finalData.find(sec =>
					sec.questions.find(ques => ques.isSaved === false)
				);
				if (!findUnsavedQuestion) {
					parseQuestions();
				}
			}
		}
	}, [finalData, savingQuestions]);

	useEffect(() => {
		if (!updateRequired) {
			const findActiveQuestion = finalData.find(sec =>
				sec.questions.find(ques => ques.active === true)
			);
			if (findActiveQuestion) {
				setUpdateRequired(true);
			}
		}
	}, [finalData]);

	return (
		<div>
			<Button
				onClick={() => {
					setSavingQuestions(true);
					saveAllQuestions();
					showProgress();
					setUpdateRequired(false);
				}}
				disabled={!updateRequired}
				type="primary"
				style={{
					margin: '1rem 0 1rem 0',
				}}
			>
				Update
			</Button>
			<Modal
				width="60%"
				title="Updating Draft"
				visible={showingProgress}
				onOk={hideProgress}
				onCancel={hideProgress}
				centered
			>
				Updating...
			</Modal>
		</div>
	);
};

export default UpdateDraft;
