import React from 'react';

import { Divider } from 'antd';

import './SidebarAnalysis.css';

import './QuestionStats.css';
import { showAccuracy } from 'utils/config';

export class QuestionStats extends React.Component {
	timeElapsed = t => {
		// make it a standard function!!
		const hrs = Math.floor(t / 3600);
		const mins = Math.floor((t - 3600 * hrs) / 60);
		const secs = Math.ceil(t - hrs * 3600 - mins * 60);
		if (hrs) {
			// we don't show secs if time is in hrs
			if (mins) {
				return `${hrs}h ${mins}m`;
			}
			return `${hrs}h`;
		}
		if (mins) {
			if (secs) return `${mins}m ${secs}s`;
			return `${mins}m`;
		}
		return `${secs}s`;
	};

	render() {
		const { response, stats, totalUsers, bonus, autoGrade } = this.props;
		const avgTime = stats.meanTime ? this.timeElapsed(stats.meanTime) : 'N/A';
		return (
			<div style={{ width: '100%' }}>
				<div
					style={{ marginLeft: 20, fontWeight: 'bolder' }}
					className="stats-heading"
				>
					Statistics
				</div>
				{!autoGrade ? (
					<div style={{ padding: 12 }} className="stats-card-wrapper">
						<div style={{ flex: 1 }}>
							<div
								style={{ fontWeight: 'bold', marginBottom: 5 }}
								className="stats-max"
							>
								Time
							</div>
							<div style={{ display: 'flex' }} className="stats-avg-wrapper">
								<div
									style={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
									}}
									className="stats-numbers-wrapper"
								>
									<div className="stats-number1">Your Time</div>
									<div
										style={{ fontWeight: 'bolder', color: '#039be5' }}
										className="stats-number2"
									>
										{this.timeElapsed(response.time / 1000.0)}
									</div>
								</div>
								<div
									style={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
									}}
									className="stats-numbers-wrapper"
								>
									<div className="stats-number1">Average Time</div>
									<div
										style={{ fontWeight: 'bolder', color: '#888888' }}
										className="stats-number2"
									>
										{autoGrade ? 'N/A' : avgTime}
									</div>
								</div>
							</div>
						</div>
						{showAccuracy && (
							<>
								<Divider
									style={{ backgroundColor: '#c0c0c0', margin: '12px 0px' }}
									className="stats-max"
								/>
								<div style={{ flex: 1 }}>
									<div
										style={{ fontWeight: 'bold', marginBottom: 5 }}
										className="stats-max"
									>
										Accuracy
									</div>
									<div style={{ display: 'flex' }} className="stats-avg-wrapper">
										<div
											style={{
												flex: 1,
												display: 'flex',
												alignItems: 'center',
											}}
											className="stats-numbers-wrapper"
										>
											<div className="stats-number1">Attempted by</div>
											<div
												style={{ fontWeight: 'bolder', color: '#888888' }}
												className="stats-number2"
											>
												{bonus || autoGrade
													? 'N/A'
													: `${Math.round((10000 * stats.totalAttempts) / totalUsers) /
															100} %`}
											</div>
										</div>
										<div
											style={{
												flex: 1,
												display: 'flex',
												alignItems: 'center',
											}}
											className="stats-numbers-wrapper"
										>
											<div className="stats-number1">Precision</div>
											<div
												style={{ fontWeight: 'bolder', color: '#888888' }}
												className="stats-number2"
											>
												{bonus || autoGrade
													? 'N/A'
													: `${Math.round(
															(10000 * stats.correctAttempts) / stats.totalAttempts
													  ) / 100} %`}
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="stats-card-wrapper">
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-evenly',
								alignItems: 'center',
							}}
						>
							<div style={{ fontSize: 16 }}>Time Taken</div>
							<div style={{ fontSize: 20, fontWeight: 'bolder', color: '#039be5' }}>
								{this.timeElapsed(response.time / 1000.0)}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default QuestionStats;
