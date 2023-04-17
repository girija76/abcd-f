import React, { Component } from 'react';
import Editor from '../../Editor';
import Button from 'antd/es/button';
import List from 'antd/es/list';
import Radio from 'antd/es/radio';
import Checkbox from 'antd/es/checkbox';

import './style.css';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

class QuestionTools extends Component {
	render() {
		const {
			attemptMode,
			marked,
			isLastQuestion,
			optionChecked,
			nextDisabled,
			showAnswers,
		} = this.props;

		return (
			<div style={{ height: 55, borderTop: '1px solid #dadada' }}>
				{attemptMode ? (
					<div
						style={{
							display: 'flex',
							padding: '0px 12px',
							height: '100%',
							alignItems: 'center',
						}}
					>
						<div>
							<Button onClick={this.props.toggleMark}>
								{marked ? 'Unmark' : 'Mark for Review & Next'}
							</Button>
							<Button onClick={this.props.reset} style={{ marginLeft: 8 }}>
								Clear Response
							</Button>
						</div>
						<div style={{ flex: 1 }}></div>
						<div>
							<Button type="primary" onClick={this.props.savennext}>
								{isLastQuestion ? 'Save' : 'Save & Next'}
							</Button>
						</div>
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
							<Checkbox onChange={this.props.onShowAnswers} checked={showAnswers}>
								Show Answers
							</Checkbox>
						</div>
						<Button
							style={{ width: '100%' }}
							type="primary"
							className="gray-button question-tool-button"
							onClick={this.props.moveToPrev}
						>
							<LeftOutlined />
							Previous
						</Button>
						<Button
							style={{ width: '100%' }}
							type="primary"
							className="gray-button question-tool-button"
							onClick={this.props.moveToNext}
						>
							Next
							<RightOutlined />
						</Button>
					</div>
				)}
			</div>
		);
	}
}

export default QuestionTools;
