import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import classnames from 'classnames';
import { connect, useSelector } from 'react-redux';
import {
	setActiveQuestion,
	getNewQuestion,
	setAnswer,
	saveAnswer,
} from 'actions/session';
import {
	getPreviousQuestionId,
	getNextQuestionId,
	getActiveQuestionIndex,
} from 'utils/session';

import TopicNote from 'components/note/TopicNote';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getTopicNameMapping } from 'components/libs/lib';
import './style.css';

const getPerformanceText = (speed, isCorrect) => {
	let text = '';
	if (isCorrect) {
		if (speed === 0) {
			text = 'Too slow, Correct';
		} else if (speed === 5) {
			text = 'Perfect, Correct';
		} else {
			text = 'Too fast, Correct';
		}
	} else {
		if (speed === 0) {
			text = 'Overtime, Incorrect';
		} else if (speed === 5) {
			text = 'Incorrect';
		} else {
			text = 'Too fast, Incorrect';
		}
	}
	return text;
};

const Footer = ({
	attempt,
	sessionConfig,
	baseClass,
	hasSessionEnded,
	onNext,
	onSubmit,
	moveToNextQuestion,
	moveToPreviousQuestion,
	nextQuestionId,
	previousQuestionId,
	questionId,
	sessionId,
	clearAnswer,
	activeQuestionIndex,
	subtopic,
	isNextDisabled,
	topics,
}) => {
	const hasSelectedAnswer =
		attempt.answer || (attempt.change && attempt.change.answer);
	const { isAnswered, isSkipped, isCorrect, speed } = attempt;
	const [isCheckDisabled, setIsCheckDisabled] = useState(
		sessionConfig.prevent.tooFast ||
			(!hasSelectedAnswer && !isAnswered && !isSkipped)
	);
	const questionsShouldSelect = useMemo(
		() => sessionConfig.questions.shouldSelect,
		[sessionConfig]
	);
	const selectedQuestionsToAttempt = useSelector(
		state => state.session.sessionsById[sessionId].selectedQuestionsToAttempt
	);
	const [performanceText, setPerformaceText] = useState(null);
	const [showNotes, setShowNotes] = useState(false);
	useEffect(() => {
		let timeOutId;
		if (isAnswered || isSkipped) {
			return;
		}
		if (sessionConfig.prevent.tooFast) {
			const startTime = new Date(attempt.startTime);
			const timeRemaining =
				attempt.perfectTimeLimits.min * 1000 - (Date.now() - startTime);
			timeOutId = setTimeout(() => {
				setIsCheckDisabled(!hasSelectedAnswer);
			}, timeRemaining);
		} else {
			setIsCheckDisabled(!hasSelectedAnswer);
		}
		return () => {
			clearTimeout(timeOutId);
		};
	}, [
		sessionConfig.prevent.tooFast,
		attempt.perfectTimeLimits.min,
		attempt.startTime,
		hasSelectedAnswer,
		isAnswered,
		isSkipped,
	]);
	useEffect(() => {
		if (attempt.isAnswered) {
			setPerformaceText(getPerformanceText(attempt.speed, attempt.isCorrect));
		}
	}, [attempt.speed, attempt.isCorrect, attempt.isAnswered]);
	const handleSkip = () => {
		// TODO: submit with flag skippedBy: user
		onSubmit().then(() => {
			onNext();
		});
	};
	let questionLimit;
	try {
		questionLimit = sessionConfig.questions.total;
	} catch (e) {}

	if (
		questionsShouldSelect &&
		(!Array.isArray(selectedQuestionsToAttempt) ||
			selectedQuestionsToAttempt.length === 0)
	) {
		return null;
	}

	const topicNameMapping = getTopicNameMapping(topics);

	const currentSupergroup = localStorage.getItem('currentSupergroup');
	const showNotes__ =
		currentSupergroup === '5d10e42744c6e111d0a17d0a' ? true : false;

	return (
		<div
			className={classnames(`${baseClass}-root`, {
				'is-answered': isAnswered,
				'is-correct': isAnswered && isCorrect,
				'is-incorrect': isAnswered && !isCorrect,
				[`speed-${speed}`]: isAnswered,
			})}
		>
			{hasSessionEnded || attempt.isAnswered || attempt.isSkipped ? (
				<React.Fragment>
					<div className="left-side" style={{ flex: 1 }}>
						<div className="performance-text">{performanceText}</div>
					</div>
					{showNotes__ ? (
						<Button
							type="primary"
							size="small"
							onClick={() => {
								setShowNotes(true);
							}}
						>
							Check Notes
						</Button>
					) : null}
					<div className="right-side">
						{!hasSessionEnded && (
							<button
								data-ga-on="click"
								data-ga-event-action="Change Question"
								data-ga-event-category="Navigation in Session"
								data-ga-event-label="Go to Next Question"
								className="next-button"
								onClick={onNext}
								type="button"
							>
								Next
							</button>
						)}
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
					<div className="left-side" style={{ flex: 1 }}>
						{!sessionConfig.prevent.reattempt && (
							<button className="clear-button" onClick={clearAnswer}>
								Clear Answer
							</button>
						)}
					</div>
					{showNotes__ ? (
						<Button
							type="primary"
							size="small"
							onClick={() => {
								setShowNotes(true);
							}}
						>
							Check Notes
						</Button>
					) : null}
					<div className="right-side">
						{sessionConfig.prevent.reattempt && (
							<button
								className="check-button"
								disabled={isCheckDisabled}
								type="button"
								onClick={onSubmit}
								data-ga-on="click"
								data-ga-event-action="Check Answer"
								data-ga-event-category="Submit Answer"
								data-ga-event-label="Practice Session"
							>
								Check
							</button>
						)}
						{!sessionConfig.prevent.reattempt && (
							<button
								disabled={!previousQuestionId}
								className="move-to-question-button mr"
								type="button"
								onClick={moveToPreviousQuestion}
							>
								<LeftOutlined />
								<span>Previous</span>
							</button>
						)}
						{!sessionConfig.prevent.reattempt && (
							<button
								className="move-to-question-button"
								type="button"
								disabled={questionLimit ? isNextDisabled : false}
								onClick={moveToNextQuestion}
							>
								<span>Next</span>
								<RightOutlined />
							</button>
						)}
						{sessionConfig.prevent.reattempt && !sessionConfig.prevent.skip ? (
							<button
								data-ga-on="click"
								data-ga-event-action="Change Question"
								data-ga-event-category="Navigation in Session"
								data-ga-event-label="Skip Question"
								className="skip-button"
								type="button"
								onClick={handleSkip}
							>
								Skip
							</button>
						) : null}
					</div>
				</React.Fragment>
			)}
			<Modal
				title={`Notes - ${topicNameMapping[subtopic]}`}
				visible={showNotes}
				onCancel={() => {
					setShowNotes(false);
				}}
				footer={null}
				className="notes-modal"
			>
				<TopicNote id={subtopic} />
			</Modal>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { questionId, sessionId } = ownProps;
	const session = state.session.sessionsById[sessionId];
	const nextQuestionId = getNextQuestionId({
		session,
		questionId,
		attemptsByQuestionId: state.session.attemptsByQuestionId,
	});
	const isNextDisabled = !(nextQuestionId
		? true
		: session.questions.length < session.config.questions.total);
	const activeQuestionIndex = getActiveQuestionIndex(
		state.session.sessionsById[sessionId],
		questionId
	);
	const hasSessionEnded = state.session.sessionsById[sessionId].hasEnded;
	const previousQuestionId = getPreviousQuestionId({
		session: state.session.sessionsById[sessionId],
		questionId,
		attemptsByQuestionId: state.session.attemptsByQuestionId,
	});
	const questionsInSession =
		state.session.sessionsById[sessionId].questions.length;
	const totalQuestions =
		state.session.sessionsById[sessionId].config.questions.total;
	return {
		nextQuestionId,
		isNextDisabled,
		previousQuestionId,
		activeQuestionIndex,
		hasSessionEnded,
		totalQuestions,
		questionsInSession,
	};
};
const mapDispatchToProps = {
	setActiveQuestion,
	getNewQuestion,
	setAnswer,
	saveAnswer,
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return {
		...ownProps,
		...stateProps,
		moveToNextQuestion: () => {
			if (stateProps.nextQuestionId) {
				dispatchProps.setActiveQuestion(
					ownProps.sessionId,
					stateProps.nextQuestionId
				);
			} else {
				dispatchProps.getNewQuestion(ownProps.sessionId);
			}
		},
		moveToPreviousQuestion: () => {
			if (stateProps.previousQuestionId) {
				dispatchProps.setActiveQuestion(
					ownProps.sessionId,
					stateProps.previousQuestionId
				);
			}
		},
		clearAnswer: () => {
			dispatchProps.setAnswer(ownProps.sessionId, ownProps.questionId, {});
			dispatchProps.saveAnswer(ownProps.sessionId, ownProps.questionId, undefined);
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Footer);
