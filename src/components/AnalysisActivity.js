import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Analysis from './analysis/Analysis.js';
import Activity from './activity/Activity.js';
import Sessions from './activity/Sessions';
import { hidePractice } from 'utils/config';
import ActivitySessions from './activity/ActivitySessions';
import { URLS } from './urls';

import { PieChartFilled, ScheduleFilled } from '@ant-design/icons';

class AnalysisActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.location.pathname !== this.props.location.pathname) return true;
		return false;
	}

	gotoAnalysis = () => {
		if (window.location.pathname !== '/dashboard/analysis') {
			this.props.history.push(URLS.analysis);
		}
	};

	gotoActivity = () => {
		if (window.location.pathname !== '/dashboard/activity') {
			this.props.history.push(URLS.activity);
		}
	};

	gotoSession = () => {
		if (window.location.pathname !== '/dashboard/activity/practice_session') {
			this.props.history.push(URLS.activitySession);
		}
	};

	render() {
		const { activePhase } = this.props;
		// const {
		// 	match: { path },
		// } = this.props;
		const path = window.location.pathname;

		let analysisActive = false;
		let activityActive = false;
		let sessionActive = false;
		if (path.indexOf('/dashboard/activity/practice_session') !== -1) {
			sessionActive = true;
		} else if (path.indexOf('/dashboard/analysis') !== -1) {
			analysisActive = true;
		} else if (path.indexOf('/dashboard/activity') !== -1) {
			activityActive = true;
		}

		const { hideFeatures } = window.config;

		const showActivity = !hideFeatures || !hideFeatures.activity;

		const showTestsTab = showActivity || !hidePractice;

		return (
			<div style={{ width: '100%' }}>
				<div
					style={{
						backgroundColor: 'white',
						borderBottom: '2px solid #dadce0',
					}}
					className="analysis-activity-session-navigator"
				>
					{showTestsTab ? (
						<div
							style={
								analysisActive
									? {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderRight: '1px solid #dadce0',
											padding: 16,
											color: '#429add',
									  }
									: {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderRight: '1px solid #dadce0',
											padding: 16,
									  }
							}
							onClick={this.gotoAnalysis}
						>
							<PieChartFilled style={{ fontSize: 24, marginRight: 12 }} />
							<div style={{ fontSize: 16 }}>Tests</div>
						</div>
					) : null}
					{!hidePractice ? (
						<div
							style={
								sessionActive
									? {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderLeft: '1px solid #dadce0',
											borderRight: '1px solid #dadce0',
											padding: 16,
											color: '#429add',
									  }
									: {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderLeft: '1px solid #dadce0',
											borderRight: '1px solid #dadce0',
											padding: 16,
									  }
							}
							onClick={this.gotoSession}
						>
							<ScheduleFilled style={{ fontSize: 24, marginRight: 12 }} />
							<div style={{ fontSize: 16 }}>Sessions</div>
						</div>
					) : null}
					{showActivity ? (
						<div
							style={
								activityActive
									? {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderLeft: '1px solid #dadce0',
											padding: 16,
											color: '#429add',
									  }
									: {
											flex: 1,
											display: 'flex',
											justifyContent: 'center',
											borderLeft: '1px solid #dadce0',
											padding: 16,
									  }
							}
							onClick={this.gotoActivity}
						>
							<ScheduleFilled style={{ fontSize: 24, marginRight: 12 }} />
							<div style={{ fontSize: 16 }}>Activity</div>
						</div>
					) : null}
				</div>
				{analysisActive ? <Analysis activePhase={activePhase} /> : null}
				{activityActive ? <Activity activePhase={activePhase} /> : null}
				{sessionActive ? (
					<Sessions
						match={{ path: `${URLS.activity}/practice_session` }}
						device="mobile"
					/>
				) : null}
				{activityActive ? (
					<ActivitySessions
						match={{ path: `${URLS.activity}/practice_session` }}
						activePhase={activePhase}
					/>
				) : null}
				{sessionActive ? (
					<ActivitySessions
						match={{ path: `${URLS.activity}/practice_session` }}
						activePhase={activePhase}
					/>
				) : null}
			</div>
		);
	}
}

export default withRouter(AnalysisActivity);
