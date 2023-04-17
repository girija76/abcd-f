import React from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import { URLS } from 'components/urls';
import {
	getCorrectIncorrectCount,
	getTitle as getTitleForSession,
} from 'utils/session';
import { end as endSession } from 'actions/session';
import './listitem.scss';

function truncate(text, n) {
	if (text === undefined) return '';
	if (text.length > n) {
		return `${text.substring(0, n - 3)}...`;
	}
	return text;
}

const sessionTypes = {
	intent: 'Intent',
	endurance: 'Endurance',
	selectivity: 'Selectivity',
	stubbornness: 'Agility',
	stamina: 'Stamina',
};

const Session = ({ session, endSession, isOnDetail }) => {
	const title = getTitleForSession(session);
	const { correct, incorrect, skipped } = getCorrectIncorrectCount(session);

	const accuracy =
		correct + incorrect
			? Math.round((100.0 * correct) / (correct + incorrect))
			: 0;

	const startTime = dayjs(session.startTime);
	const endTime = dayjs(session.endTime);

	const isLive = !session.endTime ? !session.hasEnded : false;
	const detailLink = `${URLS.activitySessionDetail}?s=${session._id}`;

	const {
		config: { sessionType },
	} = session;

	const additionalInfo =
		sessionType && sessionTypes[sessionType]
			? ' - ' + sessionTypes[sessionType]
			: '';

	console.log('check additional info', additionalInfo);

	return (
		<Card
			title={
				<div style={{ display: 'flex' }}>
					<Link to={detailLink} style={{ flex: 1 }}>
						{truncate(title + additionalInfo, isLive ? 27 : 40)}
					</Link>
					{isLive ? (
						<div style={{ display: 'flex' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{
										backgroundColor: '#249a24',
										width: 13,
										height: 13,
										borderRadius: 100,
									}}
								/>
								<span style={{ marginLeft: 4 }}>Live</span>
							</div>
							<Button
								size="small"
								type="danger"
								ghost
								onClick={endSession}
								className="session-button-custom"
							>
								End Session
							</Button>
							<Link to={`/practice/active?s=${session._id}`}>
								<Button
									size="small"
									type="primary"
									ghost
									className="session-button-custom"
								>
									Continue
								</Button>
							</Link>
						</div>
					) : (
						<Link to={detailLink}>
							<Button size="small" type="primary" ghost>
								View Details
							</Button>
						</Link>
					)}
				</div>
			}
			style={{ marginBottom: 24 }}
			className="session-overview-card"
			bodyStyle={{ padding: '18px 24px' }}
		>
			<div style={{ display: 'flex' }}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>Started at</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>
						{dayjs(session.startTime).format('MMM D, h:mma')}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>Duration</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>
						{session.hasEnded
							? `${endTime.diff(startTime, 'm')} mins`
							: 'In progress'}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>Accuracy</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>{`${accuracy}%`}</div>
				</div>
			</div>
			<div style={{ marginTop: 18, display: 'flex' }}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>Questions Attempted</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>
						{correct + incorrect + skipped}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>Questions Skipped</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>
						{skipped}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<div style={{ textAlign: 'center' }}>XP Earned</div>
					<div
						style={{ fontWeight: 'bold', textAlign: 'center' }}
						className="session-stats-number"
					>
						{Math.floor(session.xpEarned)}
					</div>
				</div>
			</div>
		</Card>
	);
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	let canReattempt = false;
	try {
		canReattempt = !ownProps.session.config.prevent.reattempt;
	} catch (e) {}
	return {
		...ownProps,
		...stateProps,
		endSession: () =>
			dispatchProps.endSession(ownProps.session._id, canReattempt),
	};
};

export default connect(null, { endSession }, mergeProps)(Session);
