import React, { useMemo, useState } from 'react';
import Editor from '../../Editor';
import { Checkbox, List, Pagination, Radio } from 'antd';
import { forEach } from 'lodash';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

const optionNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const getCorrectColorStyle = attemptMode =>
	attemptMode
		? {
				display: 'flex',
				alignItems: 'baseline',
				padding: '16px 28px',
				cursor: 'pointer',
		  }
		: {
				display: 'flex',
				alignItems: 'baseline',
				padding: '16px 28px',
				backgroundColor: '#93c572',
		  };
const getDefaultStyle = hasCursorPointer => ({
	display: 'flex',
	alignItems: 'baseline',
	padding: '16px 28px',
	cursor: hasCursorPointer ? 'pointer' : '',
});

const createAnswers = (type, options, answers) => {
	const allAnswers = [];
	allAnswers.push(
		options
			.filter(o => {
				return o.isCorrect;
			})
			.map(o => o._id)
	);
	forEach(answers, answer => {
		if (type === 'SINGLE_CORRECT') {
			allAnswers.push([answer]);
		} else {
			allAnswers.push(answer);
		}
	});
	return allAnswers;
};

const Options = ({
	answers,
	attemptMode,
	isAnswerSelectionDisabled,
	optionChecked,
	showAnswers,
	dataType,
	options,
	bonus,
	type,
	onAnswerUpdate,
}) => {
	const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
	const allAnswers = useMemo(() => createAnswers(type, options, answers), [
		answers,
		options,
		type,
	]);
	const currentAnswer = useMemo(() => allAnswers[currentAnswerIndex], [
		allAnswers,
		currentAnswerIndex,
	]);
	const correctStyle = useMemo(() => getCorrectColorStyle(attemptMode), [
		attemptMode,
	]);
	const defaultStyle = getDefaultStyle(
		attemptMode && !isAnswerSelectionDisabled
	);

	const checkedOptions = {};
	if (Array.isArray(optionChecked)) {
		optionChecked.forEach(o => {
			checkedOptions[o] = true;
		});
	}
	return (
		<>
			<List
				itemLayout="vertical"
				dataSource={options}
				renderItem={(item, index) => (
					<List.Item
						key={item._id}
						onClick={
							attemptMode && !isAnswerSelectionDisabled
								? () => onAnswerUpdate(item._id)
								: null
						}
						style={
							showAnswers && currentAnswer.indexOf(item._id) > -1 && !bonus
								? correctStyle
								: defaultStyle
						}
					>
						<div>
							{type === 'MULTIPLE_CORRECT' ? (
								<Checkbox
									disabled={isAnswerSelectionDisabled}
									checked={checkedOptions[item._id]}
								></Checkbox>
							) : (
								<Radio
									disabled={isAnswerSelectionDisabled}
									checked={optionChecked === item._id}
									name="option"
									classes={
										optionChecked === item._id
											? {
													root: 'custom-radio-button-active',
											  }
											: {
													root: 'custom-radio-button-inactive',
											  }
									}
									color="primary"
								/>
							)}
						</div>
						<div className="question-option-content">
							{dataType === 'image'
								? optionNames[index] + ')'
								: item.content &&
								  item.content.rawContent && (
										<Editor
											key={item._id}
											rawContent={item.content.rawContent}
											customStyleMap={customStyleMap}
										/>
								  )}
						</div>
					</List.Item>
				)}
				size="large"
			/>
			{!attemptMode && allAnswers && allAnswers.length > 1 ? (
				<div style={{ padding: 12 }}>
					<div style={{ marginBottom: 8 }}>{allAnswers.length} correct answers</div>
					<Pagination
						current={currentAnswerIndex + 1}
						total={allAnswers.length}
						onChange={page => setCurrentAnswerIndex(page - 1)}
						pageSize={1}
					/>
				</div>
			) : null}
		</>
	);
};

export default Options;
