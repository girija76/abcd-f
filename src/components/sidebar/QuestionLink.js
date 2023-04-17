import React from 'react';
import classnames from 'classnames';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import './QuestionLink.scss';

let colorCodes = ['#f4f7f7', '#ff9898', '#ff9898', '#bedb39', '#bedb39'];

export class QuestionLink extends React.Component {
	render() {
		let {
			MyQuestions,
			CurrSection,
			CurrQuestion,
			questionNo,
			questionOffsets,
			disabled,
			disableReason,
			questionNumberingConfig,
		} = this.props;

		const offset =
			questionNumberingConfig === 'section-wise-increasing'
				? 0
				: questionOffsets[CurrSection].offset;

		const active = CurrQuestion === questionNo;

		let colorCode = 0;
		if (
			MyQuestions.sections &&
			MyQuestions.sections[CurrSection] &&
			MyQuestions.sections[CurrSection].questions &&
			MyQuestions.sections[CurrSection].questions[questionNo]
		) {
			colorCode = MyQuestions.sections[CurrSection].questions[questionNo].state
				? MyQuestions.sections[CurrSection].questions[questionNo].state
				: 0;
		}

		const className = classnames('sidebar-question-link', {
			isDisabled: disabled,
			isLastColumn: questionNo % 4 === 3,
			isActive: active,
			isMarked: includes([2, 4], colorCode),
		});

		const button = (
			<span className="sidebar-question-link-wrapper">
				<button
					disabled={disabled}
					className={classnames(className, 'mock')}
					style={{ backgroundColor: colorCodes[colorCode] }}
					onClick={
						disabled
							? () => {}
							: this.props.moveToQuestion.bind(this, {
									section: CurrSection,
									question: questionNo,
							  })
					}
				>
					{offset + questionNo + 1}
				</button>

				<span
					className={className}
					style={{ backgroundColor: 'transparent' }}
					onClick={
						disabled
							? () => {}
							: this.props.moveToQuestion.bind(this, {
									section: CurrSection,
									question: questionNo,
							  })
					}
				></span>
			</span>
		);

		if (disabled) {
			return (
				<Tooltip placement="bottomRight" title={disableReason}>
					{button}
				</Tooltip>
			);
		} else {
			return button;
		}
	}
}

const mapStateToProps = (state, ownProps) => ({
	MyQuestions: state.api.MyQuestions,
	CurrQuestion: state.api.CurrQuestion,
});

export default connect(mapStateToProps)(QuestionLink);
