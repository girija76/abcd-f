import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card, Spin } from 'antd';
import dayjs from 'dayjs';
import ListItem from './ListItem';

import { getSession as fetchSessionDetail } from 'actions/session';
import {
	getCorrectIncorrectCount,
	getPerformanceTableData,
	getTitle as getTitleForSession,
} from 'utils/session';
import Performance from 'routes/practice/active/components/Overview/Performance';
import Feedback from './Feedback.js';
import PiChart from 'components/charts/Pi';
import Note from 'components/note/Note';

import { LoadingOutlined } from '@ant-design/icons';

import './styles.scss';

function findAssessment(assessments, assessment) {
	let foundAssessment = null;
	assessments.forEach(a => {
		if (a.assessment === assessment) foundAssessment = a;
	});
	return foundAssessment;
}

function assessmentNames(assessments) {
	const aNames = {};
	assessments.forEach(a => {
		aNames[a._id] = a.name;
	});
	return aNames;
}

function getAssessmentStats(assessment, aNames, accuracy) {
	const { category } = assessment;
	if (category === 1) {
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 2) {
		//topic imbalance
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 3) {
		let totalFast = 0;
		let total = 0;
		assessment.topics.forEach(t => {
			totalFast += t['correct-too-fast'];
			totalFast += t['incorrect-too-fast'];
			total += t['correct-too-fast'];
			total += t['incorrect-too-fast'];
			total += t['correct-optimum'];
			total += t['correct-too-slow'];
			total += t['incorrect-optimum'];
			total += t['incorrect-too-slow'];
		});
		const percent = total ? Math.round((100 * totalFast) / total) : 0;

		return (
			<div>
				You had attempted <span style={{ fontWeight: 'bold' }}>{percent}%</span>{' '}
				questions in hurry in a very similar assessment (
				{aNames[assessment.assessment]}).
			</div>
		);
	}
	if (category === 4) {
		//first time accuracy
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 5) {
		//laggin score
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 6) {
		//times hopped
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 7) {
		let totalSlow = 0;
		let total = 0;
		assessment.topics.forEach(t => {
			totalSlow += t['correct-too-slow'];
			totalSlow += t['incorrect-too-slow'];
			total += t['correct-too-fast'];
			total += t['incorrect-too-fast'];
			total += t['correct-optimum'];
			total += t['correct-too-slow'];
			total += t['incorrect-optimum'];
			total += t['incorrect-too-slow'];
		});
		const percent = total ? Math.round((100 * totalSlow) / total) : 0;

		return (
			<div>
				You took too much time in{' '}
				<span style={{ fontWeight: 'bold' }}>{percent}%</span> questions in a very
				similar assessment ({aNames[assessment.assessment]}).
			</div>
		);
	}
	if (category === 8) {
		let totalSlow = 0;
		let total = 0;
		assessment.topics.forEach(t => {
			totalSlow += t['correct-too-slow'];
			totalSlow += t['incorrect-too-slow'];
			total += t['correct-too-fast'];
			total += t['incorrect-too-fast'];
			total += t['correct-optimum'];
			total += t['correct-too-slow'];
			total += t['incorrect-optimum'];
			total += t['incorrect-too-slow'];
		});
		const percent = total ? Math.round((100 * totalSlow) / total) : 0;

		return (
			<div>
				You took too much time in{' '}
				<span style={{ fontWeight: 'bold' }}>{percent}%</span> questions in a very
				similar assessment ({aNames[assessment.assessment]}).
			</div>
		);
	}
	if (category === 9) {
		// percent unattempted
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	if (category === 10) {
		return (
			<div>
				<div>
					Your accuracy in this practice session is{' '}
					<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
				</div>
				<div>
					Your accuracy in a very similar assessment ({aNames[assessment.assessment]}
					) was{' '}
					<span style={{ fontWeight: 'bold' }}>
						{Math.round(100 * assessment.accuracy)}%
					</span>
					.
				</div>
			</div>
		);
	}
	return (
		<div>
			<div>
				Your accuracy in this practice session is{' '}
				<span style={{ fontWeight: 'bold' }}>{accuracy}%</span>.
			</div>
			<div>
				Your accuracy in a very similar assessment ({aNames[assessment.assessment]})
				was{' '}
				<span style={{ fontWeight: 'bold' }}>
					{Math.round(100 * assessment.accuracy)}%
				</span>
				.
			</div>
		</div>
	);
}

const sessionTypes = {
	intent: 'Intent',
	endurance: 'Endurance',
	selectivity: 'Selectivity',
	stubbornness: 'Agility',
	stamina: 'Stamina',
};

const SessionDetailMobile = ({
	sessionId,
	session,
	fetchSessionDetail,
	UserData,
	Assessments,
	activePhase,
}) => {
	const [fetchState, setFetchState] = useState('');
	const [correctIncorrect, setCorrectIncorrect] = useState({});
	const [accuracy, setAccuracy] = useState(null);
	const [performanceTableData, setPerformanceTableData] = useState({});
	const [timeData, setTimeData] = useState({});
	const [isActive, setIsActive] = useState(false);
	const [note, setNote] = useState('');
	const hasFetchedSession = !!session;
	useEffect(() => {
		if (!hasFetchedSession) {
			fetchSessionDetail(sessionId);
		}
	}, [fetchSessionDetail, hasFetchedSession, sessionId]);
	useEffect(() => {
		if (session) {
			const { correct, incorrect, skipped } = getCorrectIncorrectCount(session);
			setCorrectIncorrect({ correct, incorrect, skipped });
			const accuracy =
				correct + incorrect
					? Math.round((100.0 * correct) / (correct + incorrect))
					: 0;
			setTimeData({
				startTime: dayjs(session.startTime),
				endTime: dayjs(session.endTime),
			});
			setIsActive(!session.endTime ? !session.hasEnded : false);
			setPerformanceTableData(getPerformanceTableData(session));
			setAccuracy(accuracy);
			setNote(session.note);
			setFetchState('loaded');
		}
	}, [session]);

	if (fetchState !== 'loaded') {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
				<Spin indicator={<LoadingOutlined style={{ fontSize: '30px' }} />} />
			</div>
		);
	}

	if (isActive) {
		return <ListItem isOnDetail session={session} />;
	}

	const {
		config: { sessionType },
	} = session;

	const additionalInfo =
		sessionType && sessionTypes[sessionType]
			? ' - ' + sessionTypes[sessionType]
			: '';

	const totalAttempted = correctIncorrect.correct + correctIncorrect.incorrect;

	const assessment = session.reference;
	const assessments =
		UserData && UserData.category && UserData.category.assessments;
	const foundAssessment = assessments && findAssessment(assessments, assessment);
	const aNames = assessmentNames(Assessments);

	return (
		<Card
			title={
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexGrow: 1,
						width: '100%',
					}}
				>
					<div style={{ flex: 1, fontSize: 20 }}>
						{getTitleForSession(session) + additionalInfo}
					</div>
					<a
						style={{
							border: 'solid 1px',
							borderRadius: 5,
							padding: '6px 12px',
						}}
						data-ga-on="click"
						data-ga-event-action="click"
						data-ga-event-category="Practice Session: Ended Session"
						data-ga-event-label="Review Questions"
						href={`/practice/active?s=${sessionId}&review&from=session_detail_page`}
					>
						Review Questions
					</a>
				</div>
			}
			headStyle={{ width: '100%' }}
			bodyStyle={{ padding: '24px 12px', width: '100%' }}
			className="activity-session-detail"
			style={{ backgroundColor: 'white' }}
		>
			<div className="activity-session-detail-wrapper">
				<div>
					<div style={{ display: 'flex' }}>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div className="session-stats-mobile">
								<div>Questions</div>
								<div style={{ marginLeft: 4 }}>Seen</div>
							</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{correctIncorrect.correct +
									correctIncorrect.incorrect +
									correctIncorrect.skipped}
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div className="session-stats-mobile">
								<div>Incorrect</div>
								<div style={{ marginLeft: 4 }}>Questions</div>
							</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{correctIncorrect.incorrect}
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div className="session-stats-mobile">
								<div>Correct</div>
								<div style={{ marginLeft: 4 }}>Questions</div>
							</div>

							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{correctIncorrect.correct}
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div className="session-stats-mobile">
								<div>Skipped</div>
								<div style={{ marginLeft: 4 }}>Questions</div>
							</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{correctIncorrect.skipped}
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', marginTop: 18 }}>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div>Accuracy</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{accuracy}%
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div>XP Earned</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{session.xpEarned}
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div>Duration</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{timeData.endTime.diff(timeData.startTime, 'm')}min
							</div>
						</div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div>Started at</div>
							<div
								className="session-stats-number"
								style={{ fontWeight: 'bold', textAlign: 'center' }}
							>
								{timeData.startTime.format('MMM D h:mma')}
							</div>
						</div>
					</div>
				</div>
				{sessionTypes[sessionType] ? (
					<Card
						title={
							<div style={{ display: 'flex' }}>
								<div style={{ marginRight: 12 }}>Feedback</div>
							</div>
						}
						style={{ border: 0, marginTop: 18 }}
						headStyle={{ border: 0, padding: 0, fontSize: 20 }}
						bodyStyle={{ padding: 0 }}
					>
						<Feedback
							sessionId={sessionId}
							session={session}
							correctCount={correctIncorrect.correct}
							incorrectCount={correctIncorrect.incorrect}
							className="activity-session-detail-performance-speedometers"
							height={160}
							width={300}
							activePhase={activePhase}
						/>
					</Card>
				) : null}
				<Card
					title="Performance"
					style={{ border: 0, marginTop: 12 }}
					headStyle={{ border: 0, padding: '0px 12px', fontSize: 18 }}
					bodyStyle={{ padding: 0 }}
				>
					<Performance
						session={session}
						correctCount={correctIncorrect.correct}
						incorrectCount={correctIncorrect.incorrect}
						height={160}
						width={300}
					/>
				</Card>
				<div style={{ width: '100%', marginTop: 18 }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							border: '1px solid #dcdae0',
							borderRadius: 2,
						}}
					>
						<div
							style={{
								display: 'flex',
								flex: 1,
								width: '100%',
								borderBottom: '1px solid #dcdae0',
							}}
						>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Speed
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Too fast
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Perfect
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Too slow
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flex: 1,
								width: '100%',
								borderBottom: '1px solid #dcdae0',
							}}
						>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Correct
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['correct-too-fast']}
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['correct-optimum']}
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['correct-too-slow']}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flex: 1,
								width: '100%',
							}}
						>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									backgroundColor: '#fafafa',
									color: 'rgba(0, 0, 0, 0.85)',
									fontWeight: 500,
								}}
							>
								Incorrect
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['incorrect-too-fast']}
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									borderRight: '1px solid #dcdae0',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['incorrect-optimum']}
							</div>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									padding: '12px 0px',
									fontWeight: 'bold',
								}}
								className="session-stats-number"
							>
								{performanceTableData['incorrect-too-slow']}
							</div>
						</div>
					</div>

					{totalAttempted ? (
						<div className="activity-session-detail-performance-horizontal-pi">
							<PiChart
								data={[
									{
										color: '#fbefb6',
										value: performanceTableData['correct-too-fast'],
										label: 'Too Fast, Correct',
									},
									{
										color: '#c1f2e7',
										value: performanceTableData['correct-too-slow'],
										label: 'Too Slow, Correct',
									},
									{
										color: '#178567',
										value: performanceTableData['correct-optimum'],
										label: 'Perfect, Correct',
									},
									{
										color: '#fbd7ba',
										value: performanceTableData['incorrect-too-fast'],
										label: 'Too Fast, Incorrect',
									},
									{
										color: '#cd381d',
										value: performanceTableData['incorrect-too-slow'],
										label: 'Too Slow, Incorrect',
									},
									{
										color: 'rgb(227, 122, 102)',
										value: performanceTableData['incorrect-optimum'],
										label: 'Incorrect',
									},
								]}
								height={64}
							/>
						</div>
					) : (
						<div style={{ height: 16 }}></div>
					)}
				</div>
				{foundAssessment ? (
					<div
						className="activity-session-detail-performance"
						style={{ marginTop: 16 }}
					>
						<h2>Comparison</h2>

						<div
							className="activity-session-detail-performance-horizontal-pi"
							style={{ paddingTop: 0 }}
						>
							{getAssessmentStats(foundAssessment, aNames, accuracy)}
						</div>
					</div>
				) : null}
			</div>
			<div className="activity-session-detail-note-container">
				<Note viewOnly note={note} />
			</div>
		</Card>
	);
};

const mapStateToProps = (state, ownProps) => {
	const params = new URLSearchParams(window.location.search);
	const sessionId = params.get('s');
	const session = state.session.sessionsById[sessionId];
	if (!session) {
		return { sessionId };
	}
	return {
		sessionId,
		session,
		UserData: state.api.UserData,
		Assessments: state.api.Assessments,
	};
};

const mergeProps = (stateProps, dispatchProps) => {
	return {
		...stateProps,
		...dispatchProps,
	};
};

export default connect(
	mapStateToProps,
	{ fetchSessionDetail },
	mergeProps
)(SessionDetailMobile);
