import React from 'react';
import Speed from './components/Speed';
import Accuracy from './components/Accuracy';
import QuestionList from './components/QuestionList';
import { getSpeedsOfSession } from 'utils/session';
import Clock from 'widgets/Clock';
import './SessionStats.css';

class SessionStats extends React.Component {
	render = () => {
		const { session } = this.props;
		const { xpEarned, questions, startTime } = session;
		const questionCategoriesCount = {};
		let correct = 0;
		let incorrect = 0;
		if (questions) {
			let speedMap = {};
			questions.forEach(question => {
				if (!question.isAnswered) {
					return;
				}
				let category = '';
				if (question.correct) {
					category = 'correct';
					correct += 1;
				} else {
					category = 'incorrect';
					incorrect += 1;
				}
				category += { 0: '-too-slow', 5: '-optimum', 10: '-too-fast' }[
					question.speed
				];

				if (!speedMap[question.speed]) {
					speedMap[question.speed] = 0;
				}
				speedMap[question.speed] += 1;
				if (typeof questionCategoriesCount[category] !== 'number') {
					questionCategoriesCount[category] = 0;
				}
				questionCategoriesCount[category] += 1;
			});
		}

		const {
			average: averageSpeed,
			min: minSpeed,
			max: maxSpeed,
		} = getSpeedsOfSession(session);

		return (
			<div className="session-stats">
				<div className="session-stats-overview">
					<h6 className="session-stats-section-title">Session Overview</h6>
					<div className="session-stats-section-content">
						<QuestionList questions={questions} />
					</div>
					<div className="session-stats-section-content session-stats-section-overview-item-list">
						<div className="session-stats-section-overview-item">
							<span className="session-stats-section-overview-item-title">
								Total Time
							</span>
							<span className="session-stats-section-overview-item-content">
								<Clock startTime={startTime} isRunning />
							</span>
						</div>
						<div className="session-stats-section-overview-item">
							<span className="session-stats-section-overview-item-title">
								XP Earned
							</span>
							<span className="session-stats-section-overview-item-content">
								{Math.floor(xpEarned).toString()}
							</span>
						</div>
						<div className="session-stats-section-overview-item">
							<span className="session-stats-section-overview-item-title">
								Correct
							</span>
							<span className="session-stats-section-overview-item-content">
								{correct}
							</span>
						</div>
						<div className="session-stats-section-overview-item">
							<span className="session-stats-section-overview-item-title">
								Incorrect
							</span>
							<span className="session-stats-section-overview-item-content">
								{incorrect}
							</span>
						</div>
					</div>
				</div>
				{false ? (
					<div className="session-question-categorization">
						<table className="session-question-categorization-table">
							<tbody>
								<tr>
									<th>Speed</th>
									<th>Too fast</th>
									<th>Perfect</th>
									<th>Very slow</th>
								</tr>
								<tr>
									<td>Correct</td>
									<td>{questionCategoriesCount['correct-too-fast']}</td>
									<td>{questionCategoriesCount['correct-optimum']}</td>
									<td>{questionCategoriesCount['correct-too-slow']}</td>
								</tr>
								<tr>
									<td>Incorrect</td>
									<td>{questionCategoriesCount['incorrect-too-fast']}</td>
									<td>{questionCategoriesCount['incorrect-optimum']}</td>
									<td>{questionCategoriesCount['incorrect-too-slow']}</td>
								</tr>
							</tbody>
						</table>
					</div>
				) : null}
				{questions && questions.length ? (
					<div
						style={{
							padding: '10px 0',
							borderTop: 'solid 1px #f0f0f0',
							display: 'flex',
							justifyContent: 'space-around',
							flexDirection: 'column',
						}}
					>
						<div style={{ borderBottom: 'solid 1px #dcdae0' }}>
							<Accuracy correct={correct} incorrect={incorrect} />
						</div>
						<div>
							<Speed min={minSpeed} max={maxSpeed} speed={averageSpeed} />
						</div>
					</div>
				) : null}
			</div>
		);
	};
}

export default SessionStats;
