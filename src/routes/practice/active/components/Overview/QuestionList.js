import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getNewQuestion, setActiveQuestion } from 'actions/session';
import QuestionListItem from './QuestionListItem';

const getDummyQuestion = count => {
	const questions = [];
	for (let i = 0; i < count; i++) {
		questions.push(null);
	}
	return questions;
};

const getNumberOfQuestionsToShow = (
	questionsAttemptedCount,
	minQuestions,
	totalQuestions
) => {
	if (typeof totalQuestions === 'number') {
		return totalQuestions;
	}
	const remainingFromMin = minQuestions - questionsAttemptedCount;
	let questionsToShow = Math.max(questionsAttemptedCount, minQuestions);
	if (remainingFromMin <= 0) {
		questionsToShow = Math.floor((questionsToShow + 10) / 10) * 10;
	}
	return questionsToShow;
};

const QuestionList = ({
	className,
	questions: questionItems,
	activeQuestionId,
	sessionId,
	minQuestions,
	hasSessionEnded,
	setActiveQuestion,
	isLastQuestionAnsweredOrSkipped,
	sessionConfig,
	onNext,
	getAttemptForQuestionId,
	session,
	attemptsByQuestionId,
}) => {
	const numberOfQuestionsToShow = getNumberOfQuestionsToShow(
		questionItems.length,
		minQuestions,
		hasSessionEnded ? questionItems.length : sessionConfig.questions.total
	);
	const dummyQuestions = getDummyQuestion(
		numberOfQuestionsToShow - questionItems.length
	);
	const questionsToShow = [...questionItems, ...dummyQuestions];
	const firstDummyQuestionIndex = questionItems.length;
	return (
		<div className={className}>
			{questionsToShow.map((questionItem, index) => {
				return (
					<QuestionListItem
						key={index}
						index={index}
						questionItem={questionItem}
						activeQuestionId={activeQuestionId}
						firstDummyQuestionIndex={firstDummyQuestionIndex}
						session={session}
						isLastQuestionAnsweredOrSkipped={isLastQuestionAnsweredOrSkipped}
						onNext={onNext}
					/>
				);
			})}
		</div>
	);
};

QuestionList.propTypes = {
	questions: PropTypes.arrayOf(
		PropTypes.shape({
			isCorrect: PropTypes.bool,
		})
	),
	minQuestions: PropTypes.number,
	totalQuestions: PropTypes.number,
};

QuestionList.defaultProps = {
	questions: [],
	minQuestions: 20,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
	...ownProps,
	...stateProps,
	onNext: () => dispatchProps.getNewQuestion(ownProps.sessionId),
	setActiveQuestion: dispatchProps.setActiveQuestion,
});

export default connect(
	(state, ownProps) => {
		const { sessionId } = ownProps;
		const activeQuestionId = state.session.activeQuestionsBySessionId[sessionId];
		let session;
		try {
			session = state.session.sessionsById[sessionId];
		} catch (e) {
			session = null;
		}
		let lastQuestion;
		try {
			const questions = session.questions;
			lastQuestion = questions[questions.length - 1].question;
		} catch (e) {}
		let isLastQuestionAnsweredOrSkipped = false;
		try {
			const lastQuestionAttempt = state.session.attemptsByQuestionId[lastQuestion];
			isLastQuestionAnsweredOrSkipped =
				lastQuestionAttempt.isAnswered || lastQuestionAttempt.isSkipped;
		} catch (e) {}
		return {
			session,
			activeQuestionId,
			isLastQuestionAnsweredOrSkipped,
			sessionConfig: session.config,
			hasSessionEnded: session.hasEnded,
			attemptsByQuestionId: state.session.attemptsByQuestionId,
			getAttemptForQuestionId: id => {
				try {
					return state.session.attemptsByQuestionId[id] || {};
				} catch (e) {
					return {};
				}
			},
		};
	},
	{ setActiveQuestion, getNewQuestion },
	mergeProps
)(QuestionList);
