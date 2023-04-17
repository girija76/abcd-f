import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card, Skeleton } from 'antd';
import { URLS } from '../urls';
import Overall from './Overall';
import TestAnalysisLinks from './TestAnalysisLinks';
import TestLevelWrapper from './TestLevelWrapper';
import Leaderboard from '../leaderboard/Leaderboard';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import getwrappers from '../api/getwrappers';

const tabList = [
	{
		key: 'tab1',
		tab: 'Overall',
	},
	{
		key: 'tab2',
		tab: 'Test Level',
	},
];

class Analysis extends Component {
	constructor(props) {
		super(props);
		let key = 'tab1';
		const path = window.location.pathname;
		if (path.indexOf(URLS.analysisTests) >= 0) {
			key = 'tab2';
		}
		this.state = {
			key,
		};
	}

	componentWillMount() {
		const {
			AssessmentWrappers,
			activePhase: { _id },
		} = this.props;
		if (AssessmentWrappers === null || AssessmentWrappers === undefined) {
			getwrappers(_id)
				.then(response => {
					this.props.updateAssessmentWrappersAndFeeds(response);
				})
				.catch(err => {
					if (err === 'already-fetched') {
						//
					} else {
						console.log('check error in fetching topic tests', err);
					}
				});
		}
	}

	componentWillReceiveProps(nextProps) {
		let key = 'tab1';
		const path = window.location.pathname;
		if (path.indexOf(URLS.analysisTests) >= 0) {
			key = 'tab2';
		}
		this.setState({ key });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
		if (key === 'tab1') {
			this.props.history.push(URLS.analysis);
		} else if (key === 'tab2') {
			this.props.history.push(URLS.analysisTests);
		}
	};

	onTabChange2 = key => {
		this.setState({ key });
		if (key === 'tab1') {
			this.props.history.push(URLS.analysis);
		} else if (key === 'tab2') {
			this.props.history.push(URLS.analysisTests);
		}
	};

	renderTabContent = () => {
		let { AssessmentWrappers, activePhase } = this.props;

		const attemptedTests = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.submission;
			  })
			: [];

		let totalLiveAttempts = 0;
		let totalLiveGraded = 0;
		attemptedTests.forEach(at => {
			if (at.submission.live) {
				totalLiveAttempts += 1;
				if (at.submission.graded) totalLiveGraded += 1;
			}
		});

		const { _id } = activePhase;

		return {
			tab1: (
				<div>
					<Overall
						locked={attemptedTests === null || !attemptedTests.length}
						loading={_id && !AssessmentWrappers}
						totalLiveAttempts={totalLiveAttempts}
						totalLiveGraded={totalLiveGraded}
						activePhase={activePhase}
					/>
				</div>
			),
			tab2: (
				<TestAnalysisLinks
					attemptedTests={attemptedTests}
					locked={attemptedTests !== null && !attemptedTests.length}
					loading={_id && !AssessmentWrappers}
				/>
			),
		};
	};

	render() {
		let { key } = this.state;
		const loading = this.props.attemptedTests === null;
		const contentList = this.renderTabContent();

		const { activePhase } = this.props;

		const path = window.location.pathname;
		const showAnalysis = path.indexOf(URLS.analysisId) >= 0;

		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
				}}
				className="content-wrapper analysis-content-wrapper"
			>
				{showAnalysis ? (
					<TestLevelWrapper activePhase={activePhase} />
				) : (
					<div
						className="content-and-rsb-container"
						style={{
							display: 'flex',
							alignItems: 'flex-start',
							width: '100%',
						}}
					>
						<Card
							className="analysis-card lsb desktop-only"
							title="Analysis"
							headStyle={{ fontSize: 18, fontWeight: 'bold' }}
							tabList={tabList}
							activeTabKey={key}
							onTabChange={key => {
								this.onTabChange(key, 'key');
							}}
						>
							<Skeleton loading={loading} paragraph={{ rows: 4 }} title={false} active>
								{contentList[key]}
							</Skeleton>
						</Card>
						<div className="mobile-only" style={{ width: '100%' }}>
							<div>
								<Button
									style={
										key === 'tab1'
											? {
													borderRadius: 100,
													backgroundColor: '#429add',
													color: 'white',
													border: '1px solid #429add',
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
											: {
													borderRadius: 100,
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
									}
									onClick={this.onTabChange2.bind(this, 'tab1')}
								>
									Overall
								</Button>
								<Button
									style={
										key === 'tab2'
											? {
													borderRadius: 100,
													backgroundColor: '#429add',
													color: 'white',
													border: '1px solid #429add',
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
											: {
													borderRadius: 100,
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
									}
									onClick={this.onTabChange2.bind(this, 'tab2')}
								>
									Test Level
								</Button>
							</div>
							{contentList[key]}
						</div>
						<Card className="rightbar-card rsb" bodyStyle={{ padding: 0 }}>
							<Leaderboard activePhase={activePhase} />
						</Card>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	AssessmentWrappers: state.api.AssessmentWrappers,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Analysis)
);
