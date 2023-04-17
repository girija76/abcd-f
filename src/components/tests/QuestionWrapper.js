import React from 'react';
import { connect } from 'react-redux';
import { cloneDeep, filter, forEach, get, includes, join, map } from 'lodash';
import Question from 'components/question/Question';
import { checkLastQuestion, checkLastQuestionOfSection } from '../libs/lib';
import {
	updateMyQuestions,
	initializeAssessment,
	moveToQuestion,
	updateFlow,
} from '../api/ApiAction';
import { actions } from 'reducers/liveTest';

import './QuestionWrapper.css';
import { getVerifiedFlowState } from 'utils/flow';

function isAnswerSelected(questionResponse) {
	return (
		get(questionResponse, 'answer') !== null &&
		typeof get(questionResponse, 'answer') !== 'undefined'
	);
}

function countAnsweredQuestion(response, sectionIndex, questionGroup) {
	return filter(
		filter(get(response, ['sections', sectionIndex, 'questions']), (q, index) =>
			includes(questionGroup.questions, index)
		),
		isAnswerSelected
	).length;
}

function shouldDisableAnswerSelection(
	test,
	myQuestions,
	sectionIndex,
	questionIndex
) {
	let isDisabled = false;
	let reason = null;
	forEach(
		get(test, ['sections', sectionIndex, 'questionGroups']),
		questionGroup => {
			if (includes(questionGroup.questions, questionIndex)) {
				const answeredFromGroup = countAnsweredQuestion(
					myQuestions,
					sectionIndex,
					questionGroup
				);
				if (answeredFromGroup >= questionGroup.selectNumberOfQuestions) {
					isDisabled = true;
					let questionOffset = 0;
					test.sections.forEach((section, index) => {
						if (index < sectionIndex) {
							questionOffset += section.questions.length;
						}
					});
					const questionListString = join(
						map(
							questionGroup.questions,
							questionNo => questionOffset + questionNo + 1
						),
						', '
					);
					reason = `you have already answered ${questionGroup.selectNumberOfQuestions} questions from ${questionListString} questions`;
				}
			}
		}
	);
	return { isDisabled, reason };
}
export class QuestionWrapper extends React.Component {
	onAnswerUpdate = answer => {
		// NEEDS to be updated for match the columns
		const { CurrSection, CurrQuestion, MyQuestions, test } = this.props;
		const lastState =
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state;

		const newTypeMap = {
			LINKED_MULTIPLE_CHOICE_SINGLE_CORRECT: 'MULTIPLE_CHOICE_SINGLE_CORRECT',
			LINKED_MULTIPLE_CHOICE_MULTIPLE_CORRECT: 'MULTIPLE_CHOICE_MULTIPLE_CORRECT',
			LINKED_RANGE: 'RANGE',
		};

		const type = test.sections[CurrSection].questions[CurrQuestion].question.type;

		const questionType = newTypeMap[type] ? newTypeMap[type] : type;

		const MyQuestionsCopy = cloneDeep(MyQuestions);

		if (questionType === 'MATCH_THE_COLUMNS') {
			MyQuestionsCopy.sections[CurrSection].questions[
				CurrQuestion
			].answer = answer;
		} else if (questionType === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT') {
			if (answer === null) {
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].answer = [];
			} else if (
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].answer ===
				null
			) {
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].answer = [
					answer,
				];
			} else {
				const index = MyQuestionsCopy.sections[CurrSection].questions[
					CurrQuestion
				].answer.indexOf(answer);
				if (index === -1) {
					MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].answer.push(
						answer
					);
				} else {
					MyQuestionsCopy.sections[CurrSection].questions[
						CurrQuestion
					].answer.splice(index, 1);
				}
			}
			answer =
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].answer;
		} else {
			MyQuestionsCopy.sections[CurrSection].questions[
				CurrQuestion
			].answer = answer;
		}

		if (Array.isArray(answer) && !answer.length) {
			if (lastState === 3)
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 1;
			else if (lastState === 4)
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 2;
		} else if (answer != null && answer !== '' && answer !== '-') {
			if (lastState === 2 || lastState === 4)
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 4;
			else MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 3;
		} else {
			if (lastState === 3)
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 1;
			else if (lastState === 4)
				MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].state = 2;
		}
		this.updateMyQuestions(MyQuestionsCopy);
	};

	toggleMark = () => {
		const { CurrSection, CurrQuestion, MyQuestions } = this.props;
		const lastState =
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state;

		const MyQuestionsCopy = Object.assign({}, MyQuestions);
		if (lastState === 1)
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state = 2;
		else if (lastState === 2)
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state = 1;
		else if (lastState === 3)
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state = 4;
		else if (lastState === 4)
			MyQuestions.sections[CurrSection].questions[CurrQuestion].state = 3;
		this.updateMyQuestions(MyQuestionsCopy);
	};

	handleFlowUpdate = () => {
		const { verifiedFlow } = this.props;
		this.props.updateFlow(verifiedFlow);
		this.props.requestFlowSync();
	};

	updateMyQuestions = MyQuestions => {
		// this.handleFlowUpdate();
		this.props.updateMyQuestions(MyQuestions);
	};

	skip = () => {
		const { CurrSection, CurrQuestion, test } = this.props;
		let updatedSection = CurrSection;
		let updatedQuestion = CurrQuestion;
		if (test.sections[CurrSection].questions.length === CurrQuestion + 1) {
			updatedSection += 1;
			updatedQuestion = 0;
		} else {
			updatedQuestion += 1;
		}
		this.props.moveToQuestion({
			section: updatedSection,
			question: updatedQuestion,
		});

		this.handleFlowUpdate();
	};

	render() {
		const {
			MyQuestions,
			CurrSection,
			CurrQuestion,
			test,
			questionOffsets,
			previouslyElapsedTime,
		} = this.props;

		const dataUpdated = Object.keys(MyQuestions).length;

		const myQuestion = dataUpdated
			? MyQuestions.sections[CurrSection].questions[CurrQuestion]
			: null;

		const section = dataUpdated ? test.sections[CurrSection] : null;

		const isLastQuestion = dataUpdated
			? checkLastQuestion(test, CurrSection, CurrQuestion)
			: null;

		const isLastQuestionOfSection = dataUpdated
			? checkLastQuestionOfSection(test, CurrSection, CurrQuestion)
			: null;

		const currQuestionNumber = dataUpdated
			? questionOffsets[CurrSection].offset +
			  questionOffsets[CurrSection].questions[CurrQuestion] +
			  1
			: null;

		const { question, timeLimit } = dataUpdated
			? test.sections[CurrSection].questions[CurrQuestion]
			: { question: null };

		const correctMark = dataUpdated
			? test.sections[CurrSection].questions[CurrQuestion].correctMark
			: 0;

		const incorrectMark = dataUpdated
			? test.sections[CurrSection].questions[CurrQuestion].incorrectMark
			: 0;

		const {
			isDisabled: isAnswerSelectionDisabled,
			reason: answerDisableReason,
		} = !isAnswerSelected(
			get(MyQuestions, ['sections', CurrSection, 'questions', CurrQuestion])
		)
			? shouldDisableAnswerSelection(test, MyQuestions, CurrSection, CurrQuestion)
			: { isDisabled: false };
		return (
			<div
				style={{
					display: 'flex',
					flex: 1,
					alignItems: 'start',
				}}
				className="question-wrapper-wrapper"
			>
				{dataUpdated ? (
					<Question
						onTimerEnd={this.props.onTimerEnd}
						previouslyElapsedTime={previouslyElapsedTime}
						question={question}
						response={myQuestion.answer}
						correctMark={correctMark}
						incorrectMark={incorrectMark}
						marked={myQuestion.state === 2 || myQuestion.state === 4}
						save={this.save}
						toggleMark={this.toggleMark}
						skip={this.skip}
						currSection={CurrSection}
						currQuestion={CurrQuestion}
						isLastQuestion={isLastQuestion}
						currQuestionNumber={currQuestionNumber}
						sectionName={section.name}
						onAnswerUpdate={this.onAnswerUpdate}
						attemptMode={true}
						nextDisabled={isLastQuestionOfSection}
						isAnswerSelectionDisabled={isAnswerSelectionDisabled}
						answerDisableReason={answerDisableReason}
						timeLimit={timeLimit}
					/>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	MyQuestions: state.api.MyQuestions,
	Flow: state.api.Flow,
	CurrSection: state.api.CurrSection,
	CurrQuestion: state.api.CurrQuestion,
	QuestionStartTime: state.api.QuestionStartTime,
	verifiedFlow: getVerifiedFlowState(state),
});

const mapDispatchToProps = dispatch => {
	return {
		updateMyQuestions: myQuestions => dispatch(updateMyQuestions(myQuestions)),
		initializeAssessment: data => dispatch(initializeAssessment(data)),
		moveToQuestion: data => dispatch(moveToQuestion(data)),
		updateFlow: flow => dispatch(updateFlow(flow)),
		setTimeSpentInQuestionsByKey: (...args) =>
			dispatch(actions.setTimeSpentInQuestionsByKey(...args)),
		requestFlowSync: () => dispatch(actions.requestFlowSync()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionWrapper);
