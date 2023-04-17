import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { Spin, Tooltip, message } from 'antd';
import ReportQuestion from 'components/question/Report';
import Clock from 'widgets/Clock';
import {
	getNewQuestion,
	getQuestionAtPosition,
	setActiveQuestion,
	submitAnswer,
} from 'actions/session';
import {
	getNextQuestionId,
	getPreviousQuestionId,
	getTimeLimitForSessionQuestion,
	isQuestionDisabled as isQuestionDisabledFn,
	getBestPossibleActiveQuestion,
	getTooSlowTimeLimit,
	getTimeSpentInAttempt,
} from 'utils/session';
import { getTopicNameMapping } from 'components/libs/lib';

import Bookmark from './Bookmark';
import Discussion from './Discussion';
import Options from './Options';
import Question from './Question';
import Footer from './Footer';
import SelectivityOptions from './SelectivityOptions';
import Solution from './Solution';

import { LoadingOutlined, FlagOutlined } from '@ant-design/icons';

const ActiveQuestion = ({
	sessionId,
	question,
	attempt,
	session,
	sessionConfig,
	hasSessionEnded,
	topics,
	baseClass,
	submitAnswer,
	fetchQuestion,
	onNext,
	activeQuestionIndex,
	onPrevious,
	isRemoved,
}) => {
	const [onNextCalled, setOnNextCalled] = useState(0);
	const dispatch = useDispatch();
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);
	const [isReportQuestionModalOpen, setIsReportQuestionModalOpen] = useState(
		false
	);
	useEffect(() => {
		message.destroy();
	}, []);
	const handleSubmitAnswer = () => {
		return submitAnswer(
			sessionId,
			question._id,
			attempt.change && attempt.change.answer ? attempt.change.answer.data : ''
		);
	};
	const handleEndTime = () => {
		if (sessionConfig.prevent.reattempt) {
			return handleSubmitAnswer();
		} else {
			let questionLimit;
			try {
				questionLimit = sessionConfig.questions.total;
			} catch (e) {}
			if (questionLimit && activeQuestionIndex >= questionLimit - 1) {
				onPrevious();
			} else if (!onNextCalled) {
				setOnNextCalled(onNextCalled + 1);
				onNext();
			}
		}
	};
	const handleAlertTooSlow = () => {
		const startTime = Date.now();
		message.error(
			<span style={{ display: 'inline-flex' }}>
				<span>
					You are about to reach overtime limit. Try attempting some other question.
				</span>
				<span style={{ marginLeft: 12 }}>
					<Clock
						startTime={startTime}
						timerLimit={alertBeforeTooSlow}
						type="timer"
						noHoursDisplay
						noMinutesDisplay
						onEnd={() => {}}
					/>
				</span>
			</span>,
			alertBeforeTooSlow,
			() => {
				message.error(
					<span>
						You have spent too much time on this question. Please attempt other
						question.
					</span>,
					0
				);
			}
		);
	};
	const handleSkip = () => {
		// TODO: create this function
	};

	const handleFetchQuestion = () => {
		if (!question) {
			setIsFetching(true);
			setError(null);
			fetchQuestion()
				.then(() => {
					window.scrollTo(0, 0);
					// setIsFetching(false);
				})
				.catch(error => {
					setIsFetching(false);
					setError(error.message);
				});
		} else {
			window.scrollTo(0, 0);
		}
	};
	useEffect(() => {
		handleFetchQuestion();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isQuestionDisabled = useSelector(state => {
		const attemptsByQuestionId = state.session.attemptsByQuestionId;
		if (question) {
			return isQuestionDisabledFn({
				attemptsByQuestionId,
				session,
				questionId: question._id,
			});
		} else {
			return false;
		}
	});
	const attemptsByQuestionId = useSelector(
		state => state.session.attemptsByQuestionId
	);

	useEffect(() => {
		if (isQuestionDisabled && !isRemoved) {
			const bestPossibleActiveQuestion = getBestPossibleActiveQuestion(
				attemptsByQuestionId,
				session,
				question._id
			);
			dispatch(setActiveQuestion(session._id, bestPossibleActiveQuestion));
		}
	}, [
		isQuestionDisabled,
		session,
		question,
		dispatch,
		attemptsByQuestionId,
		isRemoved,
	]);

	if (!question) {
		if (isFetching) {
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ width: '64px', height: 80, marginBottom: 12 }}>
						<Spin indicator={<LoadingOutlined style={{ fontSize: '24px' }} />} />
					</div>
				</div>
			);
		} else if (error) {
			return <div>{error}</div>;
		} else {
			return <div>Question not loaded</div>;
		}
	}
	const alertBeforeTooSlow = sessionConfig.alertBeforeTooSlow;
	const perfectTimeLimitsMax = getTooSlowTimeLimit(attempt);

	const topicNameMapping = getTopicNameMapping(topics);
	const timeLimit = getTimeLimitForSessionQuestion(
		attempt,
		sessionConfig,
		session
	);
	const hasTimeLimit = !!timeLimit;
	const clockType = hasTimeLimit ? 'timer' : 'stopwatch'; // getClockTypeForSessionConfig(sessionConfig);

	const concept = question.concepts.length ? question.concepts[0].concept : null;
	const conceptName = topicNameMapping[concept]
		? topicNameMapping[concept]
		: null;

	return (
		<div className={`${baseClass}-question-container`}>
			<SelectivityOptions
				questionId={question._id}
				sessionId={sessionId}
				sessionConfig={sessionConfig}
			/>
			<div className={`${baseClass}-question-selectivity-options-container`}></div>
			<div className={`${baseClass}-question`}>
				<div className="header">
					<div className="left-side">
						<div className="topic">
							{0 ? topicNameMapping[question.topic] + ' > ' : ''}
							{topicNameMapping[question.sub_topic]}
							{conceptName ? ' > ' + conceptName : ''}
						</div>
					</div>
					<div className="right-side">
						<div className="clock">
							<div style={{ display: 'none' }}>
								{!hasSessionEnded &&
								typeof alertBeforeTooSlow &&
								getTimeSpentInAttempt(attempt, true) <
									perfectTimeLimitsMax - alertBeforeTooSlow ? (
									<Clock
										previouslyElapsedTime={attempt.time * 1000}
										key={question._id}
										onEnd={
											typeof alertBeforeTooSlow === 'number'
												? handleAlertTooSlow
												: undefined
										}
										type={
											typeof alertBeforeTooSlow === 'number'
												? 'timer'
												: attempt.isAnswered || attempt.isSkipped
												? 'stopwatch'
												: clockType
										}
										timerLimit={perfectTimeLimitsMax - alertBeforeTooSlow}
										isRunning={attempt.isAnswered || attempt.isSkipped}
										startTime={
											attempt.flow
												? attempt.flow[attempt.flow.length - 1].endTime
													? Date.now()
													: attempt.flow[attempt.flow.length - 1].startTime
												: attempt.startTime
										}
										endTime={attempt.endTime}
										noHoursDisplay
										showIcon
										style={{ fontSize: 'inherit' }}
									/>
								) : null}
							</div>
							{hasSessionEnded ? (
								<Clock
									isRunning={false}
									startTime={new Date()}
									endTime={new Date(Date.now() + attempt.time * 1000)}
									noHoursDisplay
									style={{ fontSize: 'inherit' }}
								/>
							) : (
								<Clock
									previouslyElapsedTime={attempt.time * 1000}
									key={question._id}
									onEnd={handleEndTime}
									type={
										attempt.isAnswered || attempt.isSkipped ? 'stopwatch' : clockType
									}
									timerLimit={timeLimit}
									isRunning={attempt.isAnswered || attempt.isSkipped}
									startTime={
										attempt.flow
											? attempt.flow[attempt.flow.length - 1].endTime &&
											  !(attempt.isAnswered || attempt.isSkipped)
												? Date.now()
												: attempt.flow[attempt.flow.length - 1].startTime
											: attempt.startTime
									}
									endTime={attempt.endTime}
									noHoursDisplay
									showIcon
									style={{ fontSize: 'inherit' }}
								/>
							)}
						</div>
						{attempt.isAnswered ? (
							<Bookmark questionId={question._id} sessionId={sessionId} />
						) : null}
						{attempt.isAnswered ? (
							<Tooltip placement="bottom" title="Report a problem">
								<button
									onClick={() => setIsReportQuestionModalOpen(true)}
									className="report-question-button"
								>
									<FlagOutlined />
								</button>
							</Tooltip>
						) : null}
						{isReportQuestionModalOpen ? (
							<ReportQuestion
								isOpen
								questionId={question._id}
								onRequestClose={() => setIsReportQuestionModalOpen(false)}
							/>
						) : null}
					</div>
				</div>
				<div className="content">
					<div className="question">
						<Question question={question} key={question._id} />
					</div>
					<Options
						classes={{
							root: `${baseClass}-question-option-list`,
							option: `${baseClass}-question-option-list-item`,
						}}
						questionId={question._id}
						sessionId={sessionId}
					/>
				</div>
				<Footer
					questionId={question._id}
					subtopic={question.sub_topic}
					sessionId={sessionId}
					baseClass={`${baseClass}-question-footer`}
					onNext={onNext}
					onSubmit={handleSubmitAnswer}
					onSkip={handleSkip}
					attempt={attempt}
					sessionConfig={sessionConfig}
					topics={topics}
				/>
			</div>
			{attempt.isAnswered || attempt.isSkipped ? (
				<React.Fragment>
					<Solution
						baseClass={`${baseClass}-question`}
						content={question.solution}
						questionId={question._id}
					/>
					<Discussion
						baseClass={`${baseClass}-question-threads`}
						questionId={question._id}
					/>
				</React.Fragment>
			) : null}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { sessionId } = ownProps;
	const session = state.session.sessionsById[sessionId];
	const activeQuestionId = state.session.activeQuestionsBySessionId[sessionId];
	const attempt = state.session.attemptsByQuestionId[activeQuestionId];

	const activeQuestion = state.session.questionsById[activeQuestionId];
	let activeQuestionIndex = -1;
	session.questions.forEach((q, i) => {
		if (q.question === activeQuestionId) {
			activeQuestionIndex = i;
		}
	});
	const previousQuestionId = getPreviousQuestionId({
		session: state.session.sessionsById[sessionId],
		questionId: activeQuestionId,
		attemptsByQuestionId: state.session.attemptsByQuestionId,
	});
	const nextQuestionId = getNextQuestionId({
		session: state.session.sessionsById[sessionId],
		questionId: activeQuestionId,
		attemptsByQuestionId: state.session.attemptsByQuestionId,
	});
	const bestPossibleActiveQuestion = getBestPossibleActiveQuestion(
		state.session.attemptsByQuestionId,
		session,
		activeQuestionId
	);
	return {
		// key: activeQuestionId,
		question: activeQuestion,
		attempt,
		sessionConfig: session.config,
		activeQuestionId,
		activeQuestionIndex,
		lastQuestionId: session.questions[session.questions.length - 1].question,
		isLastQuestionActive: activeQuestionIndex === session.questions.length - 1,
		topics: state.api.Topics,
		hasSessionEnded: session.hasEnded,
		nextQuestionId,
		bestPossibleActiveQuestion,
		previousQuestionId,
		session,
	};
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { getQuestionAtPosition, ...otherDispatchProps } = dispatchProps;
	const { activeQuestionIndex } = stateProps;
	return {
		...ownProps,
		...stateProps,
		...otherDispatchProps,
		fetchQuestion: () =>
			getQuestionAtPosition(ownProps.sessionId, activeQuestionIndex),
		onPrevious: () => {
			if (stateProps.previousQuestionId) {
				dispatchProps.setActiveQuestion(
					ownProps.sessionId,
					stateProps.previousQuestionId
				);
			}
		},
		onNext: () =>
			stateProps.isLastQuestionActive
				? dispatchProps.getNewQuestion(ownProps.sessionId)
				: dispatchProps.setActiveQuestion(
						ownProps.sessionId,
						stateProps.nextQuestionId || stateProps.bestPossibleActiveQuestion
				  ),
	};
};

const ActiveQuestionAnimator = props => {
	const [propsToPass, setPropsToPass] = useState(props);
	const [isRemovingOld, setIsRemovingOld] = useState(false);
	useEffect(() => {
		if (props.activeQuestionId === propsToPass.activeQuestionId) {
			setPropsToPass(props);
		} else {
			setIsRemovingOld(true);
			const callback = () => {
				setIsRemovingOld(false);
				setPropsToPass(props);
			};
			const timeoutId = setTimeout(callback, 200);
			return () => {
				setIsRemovingOld(false);
				clearTimeout(timeoutId);
			};
		}
	}, [props, propsToPass]);
	return (
		<div
			className={classnames(`${props.baseClass}-question-container-animator`, {
				removing: isRemovingOld,
			})}
		>
			{propsToPass ? (
				<ActiveQuestion
					isRemoved={isRemovingOld}
					key={propsToPass.activeQuestionId}
					{...propsToPass}
				/>
			) : null}
		</div>
	);
};

const ActiveQuestionWithConnect = connect(
	mapStateToProps,
	{ getQuestionAtPosition, setActiveQuestion, submitAnswer, getNewQuestion },
	mergeProps
)(ActiveQuestionAnimator);

export default ActiveQuestionWithConnect;
