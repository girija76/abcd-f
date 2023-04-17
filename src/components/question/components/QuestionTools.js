import React from 'react';
import Button from 'antd/es/button';
import Checkbox from 'antd/es/checkbox';

import './style.css';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const QuestionTools = ({
	attemptMode,
	isLastQuestion,
	marked,
	moveToNext,
	moveToPrev,
	nextDisabled,
	onShowAnswers,
	reset,
	showAnswers,
	skip,
	toggleMark,
}) => {
	return (
		<div className="question-tool-wrapper">
			{attemptMode ? (
				<div className="question-button-container">
					<Button
						type="primary"
						className="gray-button question-tool-button"
						onClick={toggleMark}
					>
						{marked ? 'Unmark' : 'Mark'}
					</Button>
					<Button
						type="primary"
						className="gray-button question-tool-button"
						onClick={reset}
					>
						Reset
					</Button>
					<Button
						className="save-next question-tool-button"
						icon={<RightOutlined />}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						type="primary"
						onClick={skip}
						disabled={isLastQuestion || nextDisabled}
					>
						Next
					</Button>
				</div>
			) : (
				<div className="question-button-container">
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						className="question-tool-button show-answer-button"
					>
						<Checkbox onChange={onShowAnswers} checked={showAnswers}>
							Show Answers
						</Checkbox>
					</div>
					<Button
						style={{ width: '100%' }}
						type="primary"
						className="gray-button question-tool-button"
						onClick={moveToPrev}
					>
						<LeftOutlined />
						Previous
					</Button>
					<Button
						style={{ width: '100%' }}
						type="primary"
						className="gray-button question-tool-button"
						onClick={moveToNext}
					>
						Next
						<RightOutlined />
					</Button>
				</div>
			)}
		</div>
	);
};

export default QuestionTools;
