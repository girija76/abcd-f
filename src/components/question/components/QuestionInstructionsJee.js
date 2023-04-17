import React, { Component } from 'react';
import Editor from '../../Editor';
import Columns from './Columns';
import { questionCounts } from './utils';

import './style.css';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

class QuestionHead extends Component {
	getNumericalInstructions = () => {
		const {
			totalQuestions,
			correctMark,
			incorrectMark,
			sectionsFound,
		} = this.props;

		if (sectionsFound && sectionsFound.length) {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						This section contains <b>{questionCounts[totalQuestions - 1]}</b>{' '}
						questions. The answer to each question is a <b>NUMERICAL VALUE</b>.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						For each question, enter the correct numerical value of the answer using
						the mouse and the on-screen virtual numeric keypad in the place designated
						to enter the answer. If the numerical value has more than two decimal
						places, <b>truncate/round-off</b> the value to <b>TWO</b> decimal places.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to each question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1, display: 'flex' }}>
									<div style={{ width: 16, marginRight: 14, textAlign: 'center' }}>
										+{correctMark}
									</div>{' '}
									If ONLY the correct numerical value is entered.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1, display: 'flex' }}>
									<div style={{ width: 16, marginRight: 14, textAlign: 'center' }}>
										0
									</div>{' '}
									In all other cases.
								</div>
							</div>
						</div>
					</li>
				</ul>
			);
		} else {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Enter the correct numerical value of the answer using the mouse and the
						on-screen virtual numeric keypad in the place designated to enter the
						answer. If the numerical value has more than two decimal places,{' '}
						<b>truncate/round-off</b> the value to <b>TWO</b> decimal places.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to this question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1, display: 'flex' }}>
									<div style={{ width: 16, marginRight: 14, textAlign: 'center' }}>
										+{correctMark}
									</div>{' '}
									If ONLY the correct numerical value is entered.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1, display: 'flex' }}>
									<div style={{ width: 16, marginRight: 14, textAlign: 'center' }}>
										0
									</div>{' '}
									In all other cases.
								</div>
							</div>
						</div>
					</li>
				</ul>
			);
		}
	};

	getSingleChoiceInstructions = () => {
		const {
			totalQuestions,
			correctMark,
			incorrectMark,
			sectionsFound,
		} = this.props;

		if (sectionsFound && sectionsFound.length) {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						This section contains <b>{questionCounts[totalQuestions - 1]}</b>{' '}
						questions.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Each question has <b>FOUR</b> options. <b>ONLY ONE</b> of these four
						options is the correct answer.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						For each question, choose the option corresponding to the correct answer.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to each question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1 }}>
									+{correctMark} if ONLY the correct option is choosen.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1 }}>
									0 if none of the options is chosen (i.e. the question is unanswered).
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Negative Marks:</div>
								<div style={{ flex: 1 }}>{incorrectMark} in all other cases.</div>
							</div>
						</div>
					</li>
				</ul>
			);
		} else {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						This question has <b>FOUR</b> options. <b>ONLY ONE</b> of these four
						options is the correct answer.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Choose the option corresponding to the correct answer.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to this question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1 }}>
									+{correctMark} if ONLY the correct option is choosen.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1 }}>
									0 if none of the options is chosen (i.e. the question is unanswered).
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Negative Marks:</div>
								<div style={{ flex: 1 }}>{incorrectMark} in all other cases.</div>
							</div>
						</div>
					</li>
				</ul>
			);
		}
	};

	getMultipleChoiceInstructions = () => {
		const {
			totalQuestions,
			correctMark,
			incorrectMark,
			sectionsFound,
		} = this.props;

		if (sectionsFound && sectionsFound.length) {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						This section contains <b>{questionCounts[totalQuestions - 1]}</b>{' '}
						questions.
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Each question has <b>FOUR</b> options. <b>ONE or MORE THAN ONE</b> of
						these four options is(are) the correct answer(s).
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						For each question, choose the option(s) corresponding to (all) the correct
						answer(s).
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to each question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1 }}>
									+{correctMark} if ONLY the correct option is choosen.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1 }}>
									0 if none of the options is chosen (i.e. the question is unanswered).
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Negative Marks:</div>
								<div style={{ flex: 1 }}>{incorrectMark} in all other cases.</div>
							</div>
						</div>
					</li>
				</ul>
			);
		} else {
			return (
				<ul
					style={{
						fontSize: 16,
					}}
				>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						This question has <b>FOUR</b> options. <b>ONE or MORE THAN ONE</b> of
						these four options is(are) the correct answer(s).
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Choose the option(s) corresponding to (all) the correct answer(s).
					</li>
					<li style={{ lineHeight: '19px', margin: '4px 0px', fontSize: 14 }}>
						Answer to this question will be evaluated according to the following
						marking scheme:
						<div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Full Marks:</div>
								<div style={{ flex: 1 }}>
									+{correctMark} if ONLY the correct option is choosen.
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Zero Marks:</div>
								<div style={{ flex: 1 }}>
									0 if none of the options is chosen (i.e. the question is unanswered).
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 140 }}>Negative Marks:</div>
								<div style={{ flex: 1 }}>{incorrectMark} in all other cases.</div>
							</div>
						</div>
					</li>
				</ul>
			);
		}
	};

	render() {
		const { type } = this.props;

		console.log('check type', type);

		const instructionFuncs = {
			RANGE: this.getNumericalInstructions,
			MULTIPLE_CHOICE_SINGLE_CORRECT: this.getSingleChoiceInstructions,
			MULTIPLE_CHOICE_MULTIPLE_CORRECT: this.getMultipleChoiceInstructions,
		};

		return instructionFuncs[type]();
	}
}

export default QuestionHead;
