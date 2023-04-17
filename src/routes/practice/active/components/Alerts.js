import React, { useMemo } from 'react';
import { Alert } from 'antd';
import { useSelector } from 'react-redux';

const SelectivityAlert = ({ sessionId, sessionConfig }) => {
	const numberOfQuestionsShouldSelect = useMemo(
		() => sessionConfig.questions.shouldSelect,
		[sessionConfig]
	);
	const totalQuestions = useMemo(() => sessionConfig.questions.total, [
		sessionConfig,
	]);
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
	return (
		<Alert
			message={
				<ul style={{ margin: 0 }}>
					<li>
						Select {numberOfQuestionsShouldSelect} questions out of {totalQuestions}{' '}
						questions to attempt.
					</li>
					<li>
						Click Finish Selection button after selecting the questions you want to
						attempt.
					</li>
				</ul>
			}
			type="info"
		/>
	);
};

const SessionAlerts = ({ sessionId, sessionConfig }) => {
	return (
		<div>
			<SelectivityAlert sessionId={sessionId} sessionConfig={sessionConfig} />
		</div>
	);
};
export default SessionAlerts;
