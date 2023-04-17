import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import { getCorrectIncorrectCount } from 'utils/session';

import Performance from './Performance';
import QuestionList from './QuestionList';

import { InfoCircleOutlined } from '@ant-design/icons';

const OverviewItem = ({ children, title }) => (
	<div className="item">
		<div className="title">{title}</div>
		<div className="content">{children}</div>
	</div>
);

const Overview = ({ session, baseClass, getAttemptForQuestionId }) => {
	const attemptPopulatedSession = {
		...session,
		questions: session.questions.map(q => ({
			attempt: getAttemptForQuestionId(q.question),
		})),
	};
	const {
		correct: correctCount,
		incorrect: incorrectCount,
		skipped: skippedCount,
	} = getCorrectIncorrectCount(attemptPopulatedSession);
	let canRattempt = false;
	try {
		canRattempt = !session.config.prevent.reattempt;
	} catch (e) {}
	return (
		<div className={`${baseClass}-overview`}>
			<div className="title" style={{ display: 'flex', alignItems: 'center' }}>
				<span style={{ marginRight: 8 }}>Session Overview</span>
				{session.hasEnded ? (
					<Tooltip title="This session has ended">
						<InfoCircleOutlined />
					</Tooltip>
				) : canRattempt ? (
					<Tooltip title="Answers and solutions will be available when you end this session.">
						<InfoCircleOutlined />
					</Tooltip>
				) : null}
			</div>
			<div>
				<QuestionList
					className={'question-list'}
					sessionId={session._id}
					questions={session.questions}
				/>
			</div>
			{(!canRattempt || session.hasEnded) && (
				<div className="number-list">
					<OverviewItem title="Correct">{correctCount}</OverviewItem>
					<OverviewItem title="Incorrect">{incorrectCount}</OverviewItem>
					{canRattempt ? (
						<OverviewItem title="Skipped">{skippedCount}</OverviewItem>
					) : null}
				</div>
			)}
			{(!canRattempt || session.hasEnded) && (
				<Performance
					className="session-performance"
					correctCount={correctCount}
					incorrectCount={incorrectCount}
					session={attemptPopulatedSession}
					size="small"
				/>
			)}
		</div>
	);
};
const mapStateToProps = (state, ownProps) => {
	return {
		getAttemptForQuestionId: id => {
			try {
				return state.session.attemptsByQuestionId[id] || {};
			} catch (e) {
				return {};
			}
		},
	};
};

export default connect(mapStateToProps)(Overview);
