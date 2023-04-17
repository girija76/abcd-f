import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Tooltip } from 'antd';
import { setQuestionSelectionForSession } from 'actions/session';
import { getAttemptListSize } from 'utils/session';
import Clock from 'widgets/Clock';
import './style.scss';

const CompletionBanner = ({ startTime, totalTime }) => {
	const [timeSpent, setTimeSpent] = useState(
		Math.ceil((Date.now() - startTime) / 1000)
	);
	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeSpent(Math.ceil((Date.now() - startTime) / 1000));
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	});
	return (
		<span
			className="completion-banner"
			style={{ width: `${(100 * timeSpent) / totalTime}%` }}
		></span>
	);
};

const QuestionSelectionControls = ({ sessionId }) => {
	const dispatch = useDispatch();
	const [isFinishing, setIsFinishing] = useState(false);
	const [error, setError] = useState(null);
	const sessionStartTime = useSelector(
		state => state.session.sessionsById[sessionId].startTime
	);
	const timerLimit = useSelector(
		state =>
			state.session.sessionsById[sessionId].config.questionSelectionTimeLimit
	);
	const toAttemptCount = useSelector(state =>
		getAttemptListSize({ state, listKey: 'toAttemptList', sessionId })
	);
	const notToAttemptCount = useSelector(state =>
		getAttemptListSize({ state, listKey: 'notToAttemptList', sessionId })
	);
	const handleSetQuestionSelectionForSession = useCallback(() => {
		setIsFinishing(true);
		dispatch(setQuestionSelectionForSession(sessionId))
			.then(() => {
				console.log('error occurred');
			})
			.catch(error => {
				console.error(error);
				try {
					setError(error.message);
				} catch (e) {
					setError('Error occurred while finishing. Please retry.');
				}
				setIsFinishing(false);
			});
	}, [dispatch, sessionId]);
	return (
		<div className="question-selection-controls">
			<div className="marked-container">
				<Tooltip placement="topLeft" title="Number of skipped questions">
					<div className="marked-item">
						<span className="text ">
							<span>Skipped</span>
						</span>
						<span className="count">{notToAttemptCount}</span>
					</div>
				</Tooltip>
				<Tooltip placement="topRight" title="Number of selected questions">
					<div className="marked-item">
						<span className="text ">
							<span>Selected</span>
						</span>
						<span className="count">{toAttemptCount}</span>
					</div>
				</Tooltip>
			</div>
			<button
				disabled={isFinishing}
				className="question-selection-controls-primary-button"
				onClick={handleSetQuestionSelectionForSession}
			>
				<span className="completion-banner-container">
					<CompletionBanner startTime={sessionStartTime} totalTime={timerLimit} />
				</span>
				<span className="text">Finish selection</span>
				<Clock
					startTime={sessionStartTime}
					noHoursDisplay
					style={{ fontSize: 'inherit' }}
					type="timer"
					timerLimit={timerLimit}
					onEnd={handleSetQuestionSelectionForSession}
				/>
			</button>
			{error ? (
				<div style={{ marginTop: 8 }}>
					<Alert type="error" message={error} />
				</div>
			) : null}
		</div>
	);
};

const QuestionSelectionControlsWrapper = ({ sessionId }) => {
	const questionShouldAttempt = useSelector(state => {
		try {
			return state.session.sessionsById[sessionId].config.questions.shouldSelect;
		} catch (e) {
			console.error(e);
		}
		return false;
	});
	const selectedQuestionsToAttemptCount = useSelector(state => {
		try {
			return state.session.sessionsById[sessionId].selectedQuestionsToAttempt
				.length;
		} catch (e) {
			return 0;
		}
	});
	const hasSessionEnded = useSelector(
		state => state.session.sessionsById[sessionId].hasEnded
	);
	if (
		!questionShouldAttempt ||
		selectedQuestionsToAttemptCount ||
		hasSessionEnded
	) {
		return null;
	}
	return <QuestionSelectionControls sessionId={sessionId} />;
};

const OtherControls = ({ sessionId }) => (
	<QuestionSelectionControlsWrapper sessionId={sessionId} />
);

export default OtherControls;
