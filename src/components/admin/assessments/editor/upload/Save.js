import { Button, Input, message, Modal } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useBoolean } from 'use-boolean';

import { initialDraft, types } from '../initialProps';
import { QuestionContext } from '../QuestionContext';
import draftApi from 'apis/draft';
import questionApi from 'apis/addQuestions';
import Limiter from 'async-limiter';
import { useHistory } from 'react-router';
import NewDraftInfo from './NewDraftInfo';
import _ from 'lodash';
import { AiTwotoneSave } from 'react-icons/ai';

const SaveButton = () => {
	const questionContext = useContext(QuestionContext);
	const finalData = questionContext.finalData;

	const [savingQuestions, setSavingQuestions] = useState(false);

	const [creatingDraft, createDraft, hideDraft] = useBoolean(false);
	const [draft, setDraft] = useState(initialDraft);
	const history = useHistory();

	const getBody = async () => {
		const sections = await finalData.map(sec => {
			return {
				name: sec.name,
				duration: sec.duration,
			};
		});

		return {
			...draft,
			sections: sections,
		};
	};

	const successfulItems = [];

	const limiter = new Limiter({ concurrency: 5 });
	let failedQuestions = [];

	const UpdateDraft = (successfulItems, fetchedDraft) => {
		const sections = fetchedDraft.sections.map((sec, index) => {
			return {
				...sec,
				questions: successfulItems[index],
			};
		});

		draftApi
			.updateDraft({
				id: fetchedDraft._id,
				sections: JSON.stringify(sections),
			})
			.then(() => {
				hideDraft();
				history.push(`/dashboard/admin/assessments/draft/${fetchedDraft._id}`);
			});
	};

	const onComplete = (failedItems, fetchedDraft) => {
		limiter.onDone(() => {
			if (failedQuestions.length > 0) {
				Modal.error({
					content: `${failedQuestions.length} items failed. Click retry to try again. Close to cancel.`,
					onOk: () => {
						failedQuestions = [];
						handleSubmit(failedItems);
					},
					onCancel: () => {
						failedQuestions = [];
						onComplete();
					},
					okText: 'Retry',
				});
			} else {
				// setItems(null);
				message.success('Questions added successfully');
				const sortedSections = successfulItems.map(sec => _.sortBy(sec, 'index'));

				UpdateDraft(sortedSections, fetchedDraft);
			}
		});
	};

	const handleSubmit = (data, fetchedDraft) => {
		const failedItems = [];
		data.map((sec, index) => {
			successfulItems[index] ? console.log('looping') : successfulItems.push([]);
			failedItems.push([]);
			sec.map((ques, i) => {
				limiter.push(cb => {
					questionApi
						.uploadQuestions(
							types.find(t => t.key === ques.question.type).param,
							ques
						)
						.then(res => {
							successfulItems[index].push({
								index: ques.question.index,
								question: res.savedQuestion._id,
								correctMark: ques.question.correctMark,
								incorrectMark: ques.question.incorrectMark,
							});
							cb();
						})
						.catch(e => {
							failedItems[index].push(ques);
							failedQuestions.push('f');
							cb();
						});
				});
			});
		});

		onComplete(failedItems, fetchedDraft);
	};

	const handleSaveDraft = async () => {
		setSavingQuestions(false);

		const body = await getBody();

		const draftId = await draftApi.saveDraft(body).then(res => res.draftId);

		const fetchedDraft = await draftApi.getDraft(draftId);

		console.log('fetchedDraft', fetchedDraft);

		const parsedData = await finalData.map(sec => {
			return sec.questions.map((ques, index) => {
				return {
					question: {
						index: index,
						type: ques.type,
						rawQuestion: ques.rawQuestion,
						correctMark: ques.markingScheme.find(i => i.key === 'Correct').value,
						incorrectMark: ques.markingScheme.find(i => i.key === 'Incorrect').value,
						rawSolution: ques.rawSolution || {},
						rawHint: ques.rawHint || {},
						processedOptions: ques.options.map(o => {
							return {
								isCorrect: o.isCorrect,
								content: o.rawOption,
							};
						}),
						options: {},
						answer: ques.integer ? ques.integer : '12',
						range: {
							start: ques.range ? ques.range.start : '',
							end: ques.range ? ques.range.end : '',
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

		const uploads = await handleSubmit(parsedData, fetchedDraft);

		console.log('uploads', uploads);
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
					createDraft();
				}
			}
		}
	}, [finalData, savingQuestions]);

	return (
		<div>
			<Button
				onClick={() => {
					setSavingQuestions(true);
					saveAllQuestions();
				}}
				// type="primary"
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					marginTop: '1rem',
				}}
			>
				<AiTwotoneSave style={{ fontSize: '1rem', marginRight: 6, color: '' }} />{' '}
				Save
			</Button>

			<NewDraftInfo
				creatingDraft={creatingDraft}
				handleSaveDraft={handleSaveDraft}
				hideDraft={hideDraft}
				draft={draft}
				setDraft={setDraft}
			/>
		</div>
	);
};

export default SaveButton;
