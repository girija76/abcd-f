import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import Card from 'antd/es/card';
import TopicTestLinksUpperLevel from '../TopicTestLinksUpperLevel.js';
import TestLinks from '../TestLinks.js';

import '../Mocks.css';

import { getTopicGroups } from '../../libs/lib';

import { updateAssessmentWrappersAndFeeds } from '../../api/ApiAction';
import getwrappers from '../../api/getwrappers';
import { URLS } from '../../urls';

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

const poweredBy = {
	'Hustle 30': ' - Powered by PrepZone',
	Hustle: ' - Powered by PrepZone',
};

class Mocks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { mode } = props;
		let key = 'tab0';
		this.state = {
			key,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	componentWillMount() {
		const {
			AssessmentWrappers,
			activePhase: { _id },
		} = this.props;
		if (AssessmentWrappers === null || AssessmentWrappers === undefined) {
			const {
				UserData: { subscriptions },
			} = this.props;
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
		// if (key === 'tab1') {
		// 	this.props.history.push(mocks[key_]);
		// } else if (key === 'tab2') {
		// 	this.props.history.push(`${mocks[key_]}/sectional`);
		// } else if (key === 'tab3') {
		// 	this.props.history.push(`${mocks[key_]}/sectional2`);
		// }
	};

	renderTabContent = () => {
		const { AssessmentWrappers, Topics, series, mode } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.series === series;
			  })
			: [];

		const { topicGroupsReverse } = getTopicGroups(Topics);

		const tabListDetected = {};
		validAssessments.forEach(assessment => {
			if (topicGroupsReverse[assessment.topic]) {
				tabListDetected[topicGroupsReverse[assessment.topic]] = true;
			}
		});

		if (Object.keys(tabListDetected).length) {
			const contentList = {};
			Object.keys(tabListDetected).forEach((k, i) => {
				contentList[`tab${i}`] = (
					<TopicTestLinksUpperLevel
						tab={1}
						allTests={validAssessments.filter(vA => {
							return vA.label === k;
						})}
						Topics={Topics}
						mode={mode}
						loading={!AssessmentWrappers}
					/>
				);
			});
			return contentList;
		} else {
			return {
				tab0: (
					<TestLinks
						tab={1}
						allTests={validAssessments}
						Topics={Topics}
						mode={mode}
						loading={!AssessmentWrappers}
					/>
				),
			};
		}
	};

	getTabList = () => {
		const { AssessmentWrappers, series, Topics } = this.props;

		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === series;
			  })
			: [];

		const { topicGroupsReverse } = getTopicGroups(Topics);

		const tabListDetected = {};
		validAssessments.forEach(assessment => {
			if (topicGroupsReverse[assessment.topic]) {
				tabListDetected[topicGroupsReverse[assessment.topic]] = true;
			}
		});

		if (Object.keys(tabListDetected).length) {
			return Object.keys(tabListDetected).map((k, i) => {
				return { key: `tab${i}`, tab: k };
			});
		} else {
			return null;
		}
	};

	render() {
		const { mode, UserData, series } = this.props;
		let { key } = this.state;
		const tabList = this.getTabList();

		const contentList = this.renderTabContent();

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		return (
			<div
				className="content-and-rsb-container"
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				<Helmet>
					{mode === 'demo' ? (
						<link
							rel="canonical"
							href={`https://${subDomain}.prepleaf.com/demo/${key_}/topic-tests`}
						/>
					) : null}
					<title>{window.config.metaData.demoTopicTests.title}</title>
					<meta
						name="description"
						content={window.config.metaData.demoTopicTests.description}
					/>
				</Helmet>
				<Card
					// className="compete-card lsb"
					style={{ width: '100%' }}
					bodyStyle={{ padding: '24px 32px' }}
					headStyle={{ fontSize: 18, fontWeight: 'bold' }}
					title={series + poweredBy[series]}
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
							You need to choose username and {collegeText} before we fetch assessments
							for you.{' '}
							<Link to={URLS.profile} style={{ color: 'blue' }}>
								Click here to update your profile.
							</Link>
						</span>
					)}
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Difficulty: state.api.Difficulty,
	Topics: state.api.Topics,
	AssessmentWrappers: state.api.AssessmentWrappers,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mocks));
