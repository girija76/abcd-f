import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Button,
	Card,
	Dropdown,
	Input,
	Typography,
	Menu,
	Checkbox,
	Space,
	Row,
	Col,
} from 'antd';
import PrepleafEditor from 'components/Editor';
import { getImagePolicy } from 'utils/image';
import { QuestionContext } from './QuestionContext';
import { uniqueId } from 'lodash-es';
import OptionEditor from './Option';
import TypeSelector from './TypeSelector';
import { initialMarkingScheme, types } from './initialProps';
import { BiArrowFromTop, BiArrowToTop } from 'react-icons/bi';

const QuestionCard = ({
	id,
	questionData,
	questionIndex,
	sectionIndex,
	sectionId,
	defautlType,
	defautlMarkingScheme,
}) => {
	const styleSheet = {
		button: {
			display: 'inline-flex',
			alignItems: 'center',
			marginLeft: 12,
		},
		icon: {
			fontSize: '1.25rem',
		},
		iconLeft: {
			fontSize: '1.25rem',
			marginRight: 6,
		},
		iconRight: {
			fontSize: '1.25rem',
			marginLeft: 6,
		},
	};
	const questionContext = useContext(QuestionContext);
	const sectionData = questionContext.finalData;
	const savedMarkingSchemes = questionContext.savedMarkingSchemes;

	const [questionType, setQuestionType] = useState(questionData.type);
	const [questionMarkingScheme, setQuestionMarkingScheme] = useState(
		questionData.markingScheme
	);

	const [addingSolution, setAddingSolution] = useState(
		questionData.hasSolution ? questionData.hasSolution : false
	);
	const [addingHint, setAddingHint] = useState(
		questionData.hasHint ? questionData.hasHint : false
	);
	const [integer, setInteger] = useState(
		questionData.integer ? questionData.integer : ''
	);
	const [range, setRange] = useState({
		start: questionData.range ? questionData.range.start : '',
		end: questionData.range ? questionData.range.end : '',
	});

	const [hasEdited, setHasEdited] = useState(false);

	const initialOption = {
		rawOption: {},
		id: uniqueId(),
		isCorrect: false,
	};

	const initialQuestion = {
		rawQuestion: {},
		options: [initialOption],
		range: '',
		type: questionType,
		id: uniqueId('addedQues_'),
		markingScheme: questionMarkingScheme,
		active: true,
		hasChanged: true,
	};

	const handleSelectType = e => {
		setQuestionType(e.key);
		setQuestionMarkingScheme(
			savedMarkingSchemes.length > 0
				? savedMarkingSchemes.find(s => s.type === e.key)
					? savedMarkingSchemes.find(s => s.type === e.key).scheme
					: initialMarkingScheme
				: initialMarkingScheme
		);
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionData.id
									? {
											...q,
											options: q.options.map(o => {
												return { ...o, isCorrect: false };
											}),
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const handleMarkingSchemeChange = (e, key) => {
		setQuestionMarkingScheme(
			questionMarkingScheme.map(i =>
				i.key === key ? { ...i, value: e.target.value } : i
			)
		);
	};

	const handleActiveQuestion = () => {
		questionContext.setFinalData(
			sectionData.map(sec => {
				return {
					...sec,
					questions: sec.questions.map(q =>
						q.id === questionData.id
							? {
									...q,
									active: true,
									isSaved: false,
							  }
							: {
									...q,
									active: false,
							  }
					),
				};
			})
		);
		questionContext.setSelectedNavigation({
			section: sectionIndex,
			question: questionIndex,
		});
	};

	const handleAddQuestion = () => {
		const arr = sectionData.slice();
		console.log('initialQuestion', initialQuestion);

		arr.map(sec =>
			sec.id === sectionId
				? {
						...sec,
						questions: sec.questions.splice(questionIndex + 1, 0, initialQuestion),
				  }
				: sec
		);
		questionContext.setFinalData(arr);
		questionContext.setSavedMarkingSchemes([
			...questionContext.savedMarkingSchemes,
			{
				scheme: questionMarkingScheme,
				type: questionType,
				section: sectionId,
			},
		]);
	};

	const handleDeleteQuestion = () => {
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.filter(q => q.id !== questionData.id),
					  }
					: sec
			)
		);
	};

	const handleAddOption = () => {
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionData.id
									? {
											...q,
											options: [...q.options, initialOption],
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const handleDeleteSolution = () => {
		setAddingSolution(false);
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionData.id
									? {
											...q,
											rawSolution: null,
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const handleDeleteHint = () => {
		setAddingHint(false);
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionData.id
									? {
											...q,
											rawHint: null,
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const refsByKey = useRef({
		solution: null,
		question: null,
		options: [],
		answer: null,
		hint: null,
	});

	const handleQuestionRef = ref => {
		refsByKey.current.question = ref;
	};

	const handleOptionRef = (ref, id) => {
		refsByKey.current.options.push({
			id: id,
			ref: ref,
		});
	};

	const handleSolutionRef = ref => {
		refsByKey.current.solution = ref;
	};

	const handleHintRef = ref => {
		refsByKey.current.hint = ref;
	};

	const handleSaveQuestion = () => {
		refsByKey.current.question &&
			questionContext.setFinalData(
				sectionData.map(sec =>
					sec.id === sectionId
						? {
								...sec,
								questions: sec.questions.map(q =>
									q.id === questionData.id
										? {
												...q,
												rawQuestion: refsByKey.current.question.value.rawContent,
												options: q.options.map(o => {
													return {
														...o,
														rawOption:
															refsByKey.current.options.length > 0 &&
															refsByKey.current.options.find(op => op.id === o.id).ref.value
																.rawContent,
													};
												}),
												rawSolution:
													refsByKey.current.solution &&
													refsByKey.current.solution.value.rawContent,
												rawHint:
													refsByKey.current.hint && refsByKey.current.hint.value.rawContent,
												integer: integer,
												range: range,
												type: questionType,
												hasChanged: true,
												isSaved: true,
										  }
										: q
								),
						  }
						: sec
				)
			);
	};

	const handleMoveUp = () => {
		const arr = sectionData.slice();
		const ques = arr.find(sec => sec.id === sectionId).questions;
		const f = ques.splice(questionIndex, 1)[0];
		// console.log("f", f);
		ques.splice(questionIndex === 0 ? 0 : questionIndex - 1, 0, f);
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: ques,
					  }
					: sec
			)
		);
	};

	const handleMoveDown = () => {
		const arr = sectionData.slice();
		const ques = arr.find(sec => sec.id === sectionId).questions;
		const f = ques.splice(questionIndex, 1)[0];
		// console.log("f", f);
		ques.splice(questionIndex + 1, 0, f);
		questionContext.setFinalData(
			sectionData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: ques,
					  }
					: sec
			)
		);
	};

	useEffect(() => {
		questionData.active
			? console.log('load', questionData.id)
			: handleSaveQuestion();
	}, [questionData.active]);

	return (
		<div id={id}>
			<Card
				title={questionData.active ? `Question-${questionIndex + 1}` : null}
				style={{ marginBottom: '1.5rem' }}
				bordered={questionData.active ? true : false}
				onClick={
					questionData.active
						? hasEdited
							? setHasEdited(true)
							: handleActiveQuestion
						: handleActiveQuestion
				}
				extra={
					questionData.active && (
						<Space>
							<Button
								onClick={e => {
									e.stopPropagation();
									handleMoveUp();
								}}
								style={styleSheet.button}
							>
								Move <BiArrowToTop style={styleSheet.iconRight} />
							</Button>
							<Button
								onClick={e => {
									e.stopPropagation();
									handleMoveDown();
								}}
							>
								<BiArrowFromTop style={styleSheet.icon} />
							</Button>
							<Button
								onClick={e => {
									e.stopPropagation();
									handleDeleteQuestion();
								}}
							>
								Delete
							</Button>
						</Space>
					)
				}
			>
				{questionData.active && (
					<div
						style={{
							marginBottom: '1.5rem',
							display: 'flex',
						}}
					>
						<div
							style={{
								flex: 1,
							}}
						>
							<TypeSelector
								types={types}
								selectedKey={questionData.type}
								onClick={handleSelectType}
								color="#d1d1d1"
							/>
						</div>
						<div
							style={{
								display: 'flex',

								alignItems: 'center',
								justifyContent: 'flex-end',
							}}
						>
							{/* <Typography
								style={{
									margin: '0 1rem 0 1rem',
									fontSize: '1.3rem',
								}}
							>
								Marking:
							</Typography> */}

							{questionMarkingScheme.map((scheme, index) => {
								return (
									<div
										key={index}
										style={{
											marginLeft: '0.5rem',
											width: '2.5rem',
										}}
									>
										<Input
											value={scheme.value}
											type="number"
											onChange={e => handleMarkingSchemeChange(e, scheme.key)}
											style={{
												backgroundColor: scheme.color,
											}}
										/>
									</div>
								);
							})}
						</div>
					</div>
				)}

				<div
					style={{
						display: 'flex',
						marginBottom: '1rem',
					}}
				>
					<Typography
						style={{
							fontSize: '1.3rem',
							fontWeight: 'bold',
							marginRight: '1rem',
						}}
					>
						Q{questionIndex + 1})
					</Typography>

					<PrepleafEditor
						getImagePolicy={getImagePolicy}
						readOnly={questionData.active ? false : true}
						rawContent={questionData.rawQuestion}
						customRef={handleQuestionRef}
					/>
				</div>

				{questionType === 'MULTIPLE_CHOICE_SINGLE_CORRECT' ||
				questionType === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT' ? (
					<div
						style={{
							marginBottom: '1.5rem',
						}}
					>
						{questionData.active && (
							<Typography
								style={{
									fontSize: '1.3rem',
									fontWeight: 'bold',
									margin: '1rem 0 1rem 0',
								}}
							>
								Options:
							</Typography>
						)}

						{questionData.options.map((option, index) => {
							return (
								<OptionEditor
									key={option.id}
									sectionId={sectionId}
									questionId={questionData.id}
									optionData={option}
									optionIndex={index}
									isQuestionActive={questionData.active}
									handleOptionRef={handleOptionRef}
									questionType={questionType}
								/>
							);
						})}

						{questionData.options.length === 0 && questionData.active && (
							<Button
								onClick={e => {
									e.stopPropagation();
									handleAddOption();
								}}
							>
								Add option
							</Button>
						)}
					</div>
				) : null}

				{questionType === 'INTEGER' && (
					<div>
						<Typography
							style={{
								fontSize: '1rem',
								fontWeight: 'bold',
								margin: '1rem 0 0.5rem 0',
							}}
						>
							Integer
						</Typography>

						<Input
							type="number"
							placeholder={'Answer'}
							value={integer}
							onChange={e => setInteger(e.target.value)}
							style={{
								marginBottom: '1rem',
								width: '20%',
							}}
						/>
					</div>
				)}

				{questionType === 'RANGE' && (
					<div>
						<Typography
							style={{
								fontSize: '1rem',
								fontWeight: 'bold',
								margin: '1rem 0 0.5rem 0',
							}}
						>
							Range
						</Typography>

						<Input
							type="number"
							placeholder="Start"
							value={range.start}
							onChange={e => {
								setRange({
									...range,
									start: e.target.value,
								});
							}}
							style={{
								marginBottom: '1rem',
								marginRight: '1rem',
								width: '20%',
							}}
						/>
						<Input
							type="number"
							placeholder="End"
							value={range.end}
							onChange={e => {
								setRange({
									...range,
									end: e.target.value,
								});
							}}
							style={{
								marginBottom: '1rem',
								width: '20%',
							}}
						/>
					</div>
				)}

				{addingSolution && (
					<Card
						title="Solution"
						style={{
							marginBottom: '1rem',
						}}
						extra={
							<Space>
								<Button
									onClick={e => {
										e.stopPropagation();
										handleDeleteSolution();
									}}
								>
									Delete Solution
								</Button>
							</Space>
						}
					>
						<PrepleafEditor
							getImagePolicy={getImagePolicy}
							readOnly={questionData.active ? false : true}
							rawContent={questionData.rawSolution}
							customRef={handleSolutionRef}
						/>
					</Card>
				)}
				{addingHint ? (
					<Card
						title="Hint"
						style={{
							marginBottom: '1rem',
						}}
						extra={
							<Space>
								<Button
									onClick={e => {
										e.stopPropagation();
										handleDeleteHint();
									}}
								>
									Delete Hint
								</Button>
							</Space>
						}
					>
						<PrepleafEditor
							getImagePolicy={getImagePolicy}
							readOnly={questionData.active ? false : true}
							rawContent={questionData.rawHint}
							customRef={handleHintRef}
						/>
					</Card>
				) : null}

				{questionData.active && (
					<div
						style={{
							display: 'flex',
							backgroundColor: '#f1f1ff',
							borderRadius: '0.5rem',
						}}
					>
						{addingSolution ? null : (
							<Button
								onClick={() => setAddingSolution(true)}
								style={{ margin: '1rem 0 1rem 1rem' }}
							>
								Add Solution
							</Button>
						)}
						{addingHint ? null : (
							<Button
								onClick={() => setAddingHint(true)}
								style={{ margin: '1rem 0 1rem 1rem' }}
							>
								Add Hint
							</Button>
						)}
					</div>
				)}

				{questionData.active && (
					<Button
						style={{ marginTop: '4rem' }}
						type="primary"
						onClick={e => {
							e.stopPropagation();
							handleAddQuestion();
						}}
					>
						Add Question
					</Button>
				)}

				{/* <Button
                onClick={handleReset}>
                handle submit
            </Button> */}
			</Card>
		</div>
	);
};

export default QuestionCard;
