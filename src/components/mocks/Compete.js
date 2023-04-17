import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { URLS } from '../urls.js';
import Card from 'antd/es/card';
import TestLinks from './TestLinks.js';
import { competeTitle } from 'utils/config';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import getwrappers from '../api/getwrappers';
import { getAssessmentGroups } from 'utils/assessment';

import './Compete.css';

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

function isProfileComplete(UserData, currentSupergroup, mode) {
	if (mode === 'demo') return true;
	if (!UserData.username) return false;
	let phaseFound = false;
	UserData.subscriptions.forEach(subscription => {
		if (subscription.group === currentSupergroup) {
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(ph => {
					if (ph.active) phaseFound = true;
				});
			});
		}
	});
	return phaseFound;
}

class Compete extends React.Component {
	constructor(props) {
		super(props);
		const {
			mode,
			activePhase: { fullMocks, liveTests },
		} = props;
		let key = 'tab0';
		const path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		if (fullMocks && liveTests) {
			key = 'tab1';
			if (path.indexOf(`${competes[key_]}/mocks`) >= 0) {
				key = 'tab2';
			}
		} else if (fullMocks) {
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
				.then(responseJson => {
					this.props.updateAssessmentWrappersAndFeeds(responseJson);
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

	onTabChange = (key, type) => {
		const { mode } = this.props;
		this.setState({ [type]: key });
		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		if (key === 'tab1') {
			this.props.history.push(competes[key_]);
		} else if (key === 'tab2') {
			this.props.history.push(`${competes[key_]}/mocks`);
		}
	};

	filterAssessmentsbySupergroup(assessments, supergroup) {
		const filteredAssessments = [];
		assessments.forEach(assessment => {
			if (!supergroup || assessment.supergroup === supergroup) {
				filteredAssessments.push(assessment);
			}
		});
		return filteredAssessments;
	}

	renderTabContent = () => {
		let { AssessmentWrappers, Topics, mode } = this.props;

		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'LIVE-TEST' || assessment.type === 'FULL-MOCK';
			  })
			: [];

		const liveAssessments = validAssessments.filter(assessment => {
			if (assessment.series) {
				return false;
			}
			return assessment.type === 'LIVE-TEST';
		});
		const { recent: recentLive, upcoming: upcomingLive } = getAssessmentGroups(
			liveAssessments
		);
		const mockAssessments = validAssessments.filter(assessment => {
			if (assessment.series) {
				return false;
			}
			return assessment.type === 'FULL-MOCK';
		});

		mockAssessments.sort(function(a, b) {
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			return 0;
		});

		return {
			tab0: (
				<TestLinks
					tab={0}
					allTests={validAssessments || []}
					Topics={Topics}
					mode={mode}
					increasedWidth={true}
					loading={!AssessmentWrappers}
				/>
			),
			tab1: (
				<div>
					<TestLinks
						tab={1}
						allTests={recentLive}
						Topics={Topics}
						mode={mode}
						increasedWidth={true}
						loading={!AssessmentWrappers}
						footerText={null}
					/>
					{upcomingLive && upcomingLive.length ? (
						<>
							<h2 style={{ marginLeft: 12 }}>Upcoming</h2>
							<TestLinks
								tab={1}
								allTests={upcomingLive}
								Topics={Topics}
								mode={mode}
								increasedWidth={true}
								loading={!AssessmentWrappers}
								footerText={'LIVE-TEST'}
							/>
						</>
					) : null}
				</div>
			),
			tab2: (
				<TestLinks
					tab={2}
					allTests={mockAssessments}
					Topics={Topics}
					mode={mode}
					increasedWidth={true}
					loading={!AssessmentWrappers}
				/>
			),
		};
	};

	getTabList = () => {
		const {
			activePhase: { fullMocks, liveTests },
		} = this.props;
		if (fullMocks && liveTests) {
			return [
				{
					key: 'tab1',
					tab: 'Live',
				},
				{
					key: 'tab2',
					tab: 'Mocks',
				},
			];
		}
		return null;
	};

	render() {
		const { UserData } = this.props;
		let { mode } = this.props;
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		let { key } = this.state;
		const contentList = this.renderTabContent();

		const tabList = this.getTabList();

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';
		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';

		return (
			<div className="content-wrapper compete-desktop-wrapper">
				<div
					className="content-and-rsb-container"
					style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
				>
					<Helmet>
						{mode === 'demo' ? (
							<link
								rel="canonical"
								href={`https://${subDomain}.prepleaf.com/demo/${key_}/compete`}
							/>
						) : null}
						<title>{window.config.metaData.demoCompete.title}</title>
						<meta
							name="description"
							content={window.config.metaData.demoCompete.description}
						/>
					</Helmet>
					<Card
						className="compete-card"
						headStyle={{ fontSize: 18, fontWeight: 'bold' }}
						title={competeTitle || 'Compete'}
						tabList={tabList}
						activeTabKey={key}
						onTabChange={key => {
							this.onTabChange(key, 'key');
						}}
					>
						{isProfileComplete(UserData, currentSupergroup, mode) ? (
							contentList[key]
						) : (
							<span>
								You need to choose username and {collegeText} before we fetch
								assessments for you.{' '}
								<Link to={URLS.profile} style={{ color: 'blue' }}>
									Click here to update your profile.
								</Link>
							</span>
						)}
					</Card>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		Assessments: state.api.Assessments,
		Topics: state.api.Topics,
		AssessmentWrappers: state.api.AssessmentWrappers,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Compete));
