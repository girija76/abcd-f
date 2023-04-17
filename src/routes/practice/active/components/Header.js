import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { GoZap as Zap } from 'react-icons/go';

import Clock from 'widgets/Clock';
import { end as endSession } from 'actions/session';
import { logoDark, name as coachingName } from 'utils/config';
import EndButton from './EndButton';
import Instruction from './Instruction';

import '../styles.scss';

const Header = ({ baseClass, session, endSession, Topics }) => {
	let canReattemptQuestion;
	try {
		canReattemptQuestion = !session.config.prevent.reattempt;
	} catch (e) {
		canReattemptQuestion = false;
	}
	const logo = session.hasEnded ? (
		<Link to="/dashboard">
			<div className="logo-wrapper-session">
				<img className="logo" alt={coachingName} src={logoDark} />
			</div>
		</Link>
	) : (
		<div className="logo-wrapper-session">
			<img className="logo" alt={coachingName} src={logoDark} />
		</div>
	);

	return (
		<div className={baseClass}>
			<div id="practice-header-left" className="left-side">
				{logo}
				{(!canReattemptQuestion || session.hasEnded) && (
					<>
						<div className="divider" />
						<Tooltip
							getPopupContainer={() => document.querySelector('#practice-header-left')}
							placement="right"
							title="XP earned in this session"
						>
							<div className="xp-earned">
								<Zap size={24} />
								<span className="amount">{session.xpEarned}</span>
							</div>
						</Tooltip>
					</>
				)}
			</div>
			<div className="left-side">
				<Instruction session={session} Topics={Topics} />
			</div>
			<div style={{ flex: 1 }}></div>
			<div className="right-side">
				<div className="clock">
					<Clock
						startTime={session.startTime}
						endTime={session.endTime}
						type={
							!session.hasEnded && session.config.timeLimit ? 'timer' : 'stopwatch'
						}
						timerLimit={session.config.timeLimit}
						onEnd={() => endSession(session._id, !session.config.prevent.reattempt)}
						isRunning={!session.hasEnded}
					/>
				</div>
				{session.hasEnded ? (
					<a
						className="practice-detail-button"
						href={`/dashboard/activity/practice_session/session?s=${session._id}`}
					>
						View Session Performance
					</a>
				) : (
					<EndButton sessionId={session._id} />
				)}
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	Topics: state.api.Topics,
});

const mapDispatchToProps = {
	endSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
