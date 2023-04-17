import { Typography, Checkbox, Card, Button, Tooltip } from 'antd';
import { uniqueId } from 'lodash-es';
import React, { useContext, useEffect, useRef } from 'react';
import { QuestionContext } from './QuestionContext';
import PrepleafEditor from 'components/Editor';
import { getImagePolicy } from 'utils/image';
import { BiArrowFromTop, BiArrowToTop } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const OptionEditor = ({
	optionIndex,
	optionData,
	sectionId,
	questionId,
	isQuestionActive,
	handleOptionRef,
	questionType,
}) => {
	const styleSheet = {
		button: {
			display: 'inline-flex',
			alignItems: 'center',
			// marginLeft: 12,
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
	const finalData = questionContext.finalData;

	const initialOption = {
		option: '',
		id: uniqueId('addedOption_'),
		text: '',
		isCorrect: false,
	};

	const toogleAnswer = () => {
		questionContext.setFinalData(
			finalData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionId
									? {
											...q,
											options:
												questionType === 'MULTIPLE_CHOICE_SINGLE_CORRECT'
													? q.options.map(o =>
															o.id === optionData.id
																? {
																		...o,
																		isCorrect: true,
																  }
																: {
																		...o,
																		isCorrect: false,
																  }
													  )
													: q.options.map(o =>
															o.id === optionData.id
																? {
																		...o,
																		isCorrect: !o.isCorrect,
																  }
																: o
													  ),
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const handleAddOptionAbove = () => {
		const arr = finalData.slice();
		arr.map(sec =>
			sec.id === sectionId
				? {
						...sec,
						questions: sec.questions.map(q =>
							q.id === questionId
								? {
										...q,
										options: q.options.splice(
											optionIndex === 0 ? 0 : optionIndex - 1,
											0,
											initialOption
										),
								  }
								: q
						),
				  }
				: sec
		);
		questionContext.setFinalData(arr);
	};

	const handleAddOptionBelow = () => {
		const arr = finalData.slice();
		arr.map(sec =>
			sec.id === sectionId
				? {
						...sec,
						questions: sec.questions.map(q =>
							q.id === questionId
								? {
										...q,
										options: q.options.splice(optionIndex + 1, 0, initialOption),
								  }
								: q
						),
				  }
				: sec
		);
		questionContext.setFinalData(arr);
	};

	const handleDeleteOption = () => {
		questionContext.setFinalData(
			finalData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(q =>
								q.id === questionId
									? {
											...q,
											options: q.options.filter(o => o.id !== optionData.id),
									  }
									: q
							),
					  }
					: sec
			)
		);
	};

	const handleMoveUp = () => {
		const arr = finalData.slice();
		const opts = arr
			.find(sec => sec.id === sectionId)
			.questions.find(qu => qu.id === questionId).options;
		const f = opts.splice(optionIndex, 1)[0];
		// console.log("f", f);
		opts.splice(optionIndex === 0 ? 0 : optionIndex - 1, 0, f);
		questionContext.setFinalData(
			finalData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(ques =>
								ques.id === questionId
									? {
											...ques,
											options: opts,
									  }
									: ques
							),
					  }
					: sec
			)
		);
	};

	const handleMoveDown = () => {
		const arr = finalData.slice();
		const opts = arr
			.find(sec => sec.id === sectionId)
			.questions.find(qu => qu.id === questionId).options;
		const f = opts.splice(optionIndex, 1)[0];
		// console.log("f", f);
		opts.splice(optionIndex + 1, 0, f);
		questionContext.setFinalData(
			finalData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(ques =>
								ques.id === questionId
									? {
											...ques,
											options: opts,
									  }
									: ques
							),
					  }
					: sec
			)
		);
	};

	return (
		<div
			style={{
				display: 'flex',
				marginBottom: '1rem',
			}}
		>
			<Typography
				style={{
					marginRight: '1rem',
					fontWeight: 'bold',
					fontSize: '1rem',
				}}
			>
				{optionIndex + 1}
			</Typography>

			<Checkbox
				style={{ marginRight: '1rem' }}
				checked={optionData.isCorrect}
				onChange={toogleAnswer}
			></Checkbox>

			<div
				style={{
					width: '100%',
				}}
			>
				<PrepleafEditor
					getImagePolicy={getImagePolicy}
					readOnly={isQuestionActive ? false : true}
					rawContent={optionData.rawOption}
					customRef={ref => handleOptionRef(ref, optionData.id)}
				/>

				{isQuestionActive && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<Button style={styleSheet.button} onClick={handleAddOptionBelow}>
							Add Option <BiArrowFromTop style={styleSheet.iconRight} />
						</Button>
						<Button onClick={handleAddOptionAbove}>
							<BiArrowToTop style={styleSheet.icon} />
						</Button>
					</div>
				)}
			</div>

			{isQuestionActive && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginLeft: '0.5rem',
					}}
				>
					<Tooltip placement="left" title={'Move Up'}>
						<Button style={styleSheet.button} onClick={handleMoveUp}>
							<BiArrowToTop style={styleSheet.icon} />
						</Button>
					</Tooltip>
					<Tooltip placement="left" title={'Move Down'}>
						<Button style={styleSheet.button} onClick={handleMoveDown}>
							<BiArrowFromTop style={styleSheet.icon} />
						</Button>
					</Tooltip>
				</div>
			)}

			{isQuestionActive && (
				<Tooltip placement="right" title={'Delete'}>
					<Button
						style={{
							marginLeft: '0.5rem',
							// color:"red"
						}}
						onClick={e => {
							e.stopPropagation();
							handleDeleteOption();
						}}
					>
						<RiDeleteBin6Line style={styleSheet.icon} />
					</Button>
				</Tooltip>
			)}
		</div>
	);
};

export default OptionEditor;
