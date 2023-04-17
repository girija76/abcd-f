import React from 'react';
import './QuestionLinkAnalysis.css';

let colorCodes = ['#f4f7f7', '#a5cd7c', '#cd7c7c'];
let classnames = [
	'color-not-visited',
	'color-not-answered',
	'color-not-answered-marked',
	'color-answered',
	'color-answered-marked',
];

export class QuestionLinkAnalysis extends React.Component {
	render() {
		let {
			currSection,
			questionNo,
			active,
			correct,
			offset,
			isBadChoice,
		} = this.props;
		let colorCode = 0;
		let classname = 'question-link-container';
		if (
			active &&
			!((this.props.questionNo + 1) % 4 === 0) &&
			colorCode !== 2 &&
			colorCode !== 4
		) {
			classname = 'question-link-container-active';
		} else if (
			active &&
			!((this.props.questionNo + 1) % 4 === 0) &&
			(colorCode === 2 || colorCode === 4)
		) {
			classname = 'question-link-container-active-marked';
		} else if (
			active &&
			(this.props.questionNo + 1) % 4 === 0 &&
			colorCode !== 2 &&
			colorCode !== 4
		) {
			classname = 'question-link-container-active-lastcolumn';
		} else if (
			active &&
			(this.props.questionNo + 1) % 4 === 0 &&
			(colorCode === 2 || colorCode === 4)
		) {
			classname = 'question-link-container-active-marked-lastcolumn';
		} else if (
			!active &&
			!((this.props.questionNo + 1) % 4 === 0) &&
			colorCode !== 2 &&
			colorCode !== 4
		) {
			classname = 'question-link-container';
		} else if (
			!active &&
			!((this.props.questionNo + 1) % 4 === 0) &&
			(colorCode === 2 || colorCode === 4)
		) {
			classname = 'question-link-container-marked';
		} else if (
			!active &&
			(this.props.questionNo + 1) % 4 === 0 &&
			colorCode !== 2 &&
			colorCode !== 4
		) {
			classname = 'question-link-container-lastcolumn';
		} else if (
			!active &&
			(this.props.questionNo + 1) % 4 === 0 &&
			(colorCode === 2 || colorCode === 4)
		) {
			classname = 'question-link-container-marked-lastcolumn';
		}

		return (
			<div
				className={classname}
				style={{ backgroundColor: colorCodes[correct], position: 'relative' }}
				onClick={this.props.moveToQuestion.bind(
					this,
					currSection,
					this.props.questionNo
				)}
			>
				{offset + questionNo + 1}
				{isBadChoice ? <span class="analysis-skull"></span> : null}
			</div>
		);
	}
}

export default QuestionLinkAnalysis;
