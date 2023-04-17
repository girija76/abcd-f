/* eslint-disable no-nested-ternary */
import React from 'react';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Space } from 'antd';
import Goal from './goal';
import UpcomingAssessment from './upcomingAssessment';
import LiveAssessment from './liveAssessment';
import AssessmentAnalysis from './assessmentAnalysis';
import Leaderboard from '../leaderboard/Leaderboard';
import Refer from './Refer';
import Dummy from './Dummy';
import PortalStats from './PortalStats';
import CoursePlanMini from './CoursePlanMini';
import TestRecommendations from './TestRecommendations';
import DynamicCards from './DynamicCards';
import { FormOutlined } from '@ant-design/icons';
import ServicePlansPage from 'components/servicePlans';
import { getStreakData, getTarget, todaysDateFunc } from '../libs/lib';
import { URLS } from '../urls';

import './Home.css';

import { updateServicePlans } from '../api/ApiAction';
import asyncComponent from '../AsyncComponent';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';

import getwrappers from '../api/getwrappers';
import {
	isLite,
	hideTestRecommendations,
	hasDashboardCardsEnabled,
	showReports,
	hidePractice,
	showELearning,
} from 'utils/config';
import CompactReport from 'components/reports/CompactReport';
import VideoAnalytics from 'components/reports/components/VideoAnalytics';
import InferredCoursePlanOfPhase from 'components/coursePlan/InferredCoursePlanOfPhase';
import ensureServicePlansLoad, {
	selectSubscribedServiceIds,
} from 'components/servicePlans/EnsureServicePlans';
import { includes } from 'lodash';
import { isAtLeastMentor } from 'utils/auth';
import AssignmentReport from 'components/admin/reports/Assignment';
import AttendanceGraph from 'components/userAttendance/components/AttendanceGraph';

const AsyncPuzzle = asyncComponent(() =>
	import(/* webpackChunkName: "puzzle"*/ './puzzle')
);

export class Home extends React.PureComponent {
	componentWillMount() {
		const {
			activePhase: { _id },
			mode,
		} = this.props;

		const { AssessmentWrappers } = this.props;

		if (
			mode !== 'demo' &&
			(AssessmentWrappers === null || AssessmentWrappers === undefined)
		) {
			getwrappers(_id)
				.then(responseJson => {
					this.props.updateAssessmentWrappersAndFeeds(responseJson);
				})
				.catch(() => {});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.mode !== 'demo' &&
			nextProps.AssessmentWrappers === null &&
			this.props.activePhase !== nextProps.activePhase
		) {
			const {
				activePhase: { _id },
			} = nextProps;

			getwrappers(_id).then(responseJson => {
				this.props.updateAssessmentWrappersAndFeeds(responseJson);
			});
		}
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.UserData !== this.props.UserData) return true;
		if (nextProps.Feeds !== this.props.Feeds) return true;
		if (nextProps.puzzle !== this.props.puzzle) return true;
		if (nextProps.SuperGroups !== this.props.SuperGroups) return true;
		if (nextProps.ServicePlans !== this.props.ServicePlans) return true;
		return false;
	}

	switchToCat = () => {
		localStorage.setItem('currentSupergroup', '5d10e43944c6e111d0a17d0c');
		window.location.pathname = URLS.dashboard;
	};

	render() {
		const {
			UserData: { xp, settings, username, subscriptions, role, milestones, email },
			Feeds,
			puzzle,
			mode,
			subscribedServiceIds,
			AssessmentWrappers,
		} = this.props;

		let createdAt = new Date();
		if (milestones && milestones.length) {
			createdAt = new Date(milestones[0].date);
		}

		const net = mode === 'demo' ? 5735 : xp.net;
		const streak =
			mode === 'demo'
				? {
						date: todaysDateFunc(new Date()),
						day: 2,
						todays_count: 7,
				  }
				: xp.streak;
		const referral = mode === 'demo' ? 0 : xp.referral;
		const goal = mode === 'demo' ? [{ goal: 2 }] : settings.goal;

		//goal, streak

		const { day, score } = getStreakData(
			streak.date,
			streak.day,
			streak.todays_count
		);
		const target = getTarget(goal);

		let catFound = '';
		if (mode !== 'demo') {
			subscriptions.forEach(subscription => {
				if (subscription.group === '5d10e43944c6e111d0a17d0c')
					catFound = '5d10e43944c6e111d0a17d0c';
			});
		}

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const { attemptedTests, activePhase } = this.props;

		let id = '';
		let found = false;
		attemptedTests &&
			attemptedTests.forEach(a => {
				if (!a.assessment.autoGrade && a.graded && !found) {
					id = a._id;
				}
			});

		const feeds = Feeds;

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		const { showProgress, hideFeatures } = window.config;

		const showReferral = !hideFeatures || !hideFeatures.referral;
		const showGoal = !hideFeatures || !hideFeatures.goal;

		const unattemptedAllowedTests = AssessmentWrappers
			? AssessmentWrappers.filter(aw => {
					if (AssessmentWrappers.submission) return false;

					let locked = false;
					if (mode !== 'demo' && aw.visibleForServices) {
						if (aw.visibleForServices.length) locked = true;
						aw.visibleForServices.forEach(mn => {
							if (includes(subscribedServiceIds, mn)) {
								locked = false;
							}
						});
					}

					return !locked;
			  }).splice(0, 3)
			: [];

		const showCoursePlan = activePhase.hasCoursePlan ? true : false;

		return (
			<div className={classnames('content-wrapper', { 'no-margin': isLite })}>
				<Helmet>
					{mode === 'demo' ? (
						<link
							rel="canonical"
							href={`https://${subDomain}.prepseed.com/demo/${key_}`}
						/>
					) : null}
					<title>{window.config.metaData.demo.title}</title>
					<meta
						name="description"
						content={window.config.metaData.demo.description}
					/>
				</Helmet>
				<div
					className="content-and-rsb-container"
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						width: '100%',
					}}
				>
					<div style={{ width: '100%', flex: 1 }} className="lsb">
						{isAtLeastMentor(role) ? <AssignmentReport /> : null}
						{isAtLeastMentor(role) ? (
							<Card
								title="Attendance"
								style={{ paddingBottom: '3rem', marginBottom: 12 }}
							>
								<AttendanceGraph showPie={true} showLine={true} />
							</Card>
						) : null}
						{hasDashboardCardsEnabled ? <DynamicCards /> : null}
						<InferredCoursePlanOfPhase viewType="quickView" />
						{false &&
						feeds &&
						feeds.liveAssessments &&
						feeds.liveAssessments.length ? (
							<LiveAssessment liveAssessments={feeds.liveAssessments} mode={mode} />
						) : null}
						{false &&
						feeds &&
						feeds.upcomingAssessments &&
						feeds.upcomingAssessments.length ? (
							<UpcomingAssessment
								upcomingAssessments={feeds.upcomingAssessments}
								mode={mode}
							/>
						) : null}
						{showProgress && role === 'user' ? (
							<PortalStats activePhase={activePhase} mode={mode} />
						) : null}
						{role === 'user' ? (
							<InferredCoursePlanOfPhase viewType="subject" />
						) : null}
						<ServicePlansPage
							WrapperComponent={({ children }) => (
								<Card
									size="small"
									bordered={!isLite}
									style={{ borderRadius: isLite ? 0 : undefined, marginBottom: 12 }}
								>
									{children}
								</Card>
							)}
							colSizes={{
								xs: 24,
								sm: 24,
								md: 12,
								lg: 12,
								xl: 8,
							}}
						/>
						{currentSupergroup === '5d10e42744c6e111d0a17d0a' && puzzle ? (
							<AsyncPuzzle puzzle={puzzle} />
						) : null}
						{role === 'user' && showGoal ? (
							<Goal xp={net} day={day} todays_correct={score} target={target} />
						) : null}
						{role === 'user' &&
						!hideTestRecommendations &&
						unattemptedAllowedTests ? (
							<TestRecommendations recommendations={unattemptedAllowedTests} />
						) : null}
						{feeds &&
						feeds.analysisAssessments &&
						feeds.analysisAssessments.length ? (
							<AssessmentAnalysis assessmentAnalysis={feeds.analysisAssessments} />
						) : null}
						{currentSupergroup === '5d10e42744c6e111d0a17d0a' ? (
							<Dummy
								title="New Feature"
								detail="AI-powered personalized tests!"
								subdetail="Test will be derived through a machine learning algorithm based on your performance in the particular assessment, giving priority to your weak topics and test giving pattern."
								url={`${URLS.analysisId}?id=${id}`}
								btnTxt="Go to analysis"
								icon="alert"
								mode={mode}
							/>
						) : null}
						{catFound && currentSupergroup === '5d10e42744c6e111d0a17d0a' ? (
							<Dummy
								title="MBA Entrance Preparation"
								detail="CAT / NMAT / XAT / SNAP"
								subdetail="Prepare for MBA Entrance exams through topic and sectional tests, and mini mock tests."
								onClick={this.switchToCat}
								btnTxt="Switch Portal"
								icon="select"
								mode={mode}
							/>
						) : null}
						{showELearning && role === 'user' ? (
							<Card
								title="Video watched"
								bordered={!isLite}
								style={{ borderRadius: isLite ? 0 : undefined, marginBottom: 12 }}
							>
								<VideoAnalytics />
							</Card>
						) : null}
					</div>

					{role === 'user' ? (
						<div className="rightbar-card rsb">
							<Space direction="vertical" style={{ display: 'flex' }}>
								{showCoursePlan ? (
									<CoursePlanMini activePhase={activePhase} createdAt={createdAt} />
								) : null}
								{hidePractice ? null : (
									<Card
										bordered={!isLite}
										style={{ borderRadius: isLite ? 0 : undefined }}
										title="Practice now"
										size="small"
									>
										<Space direction="vertical">
											<div>
												Practice your favourite or weak topics to improve your performance.
											</div>
											<div>
												<Link to="/dashboard/practice" className="ant-btn ant-btn-primary">
													<span
														role="img"
														aria-label="calendar"
														className="anticon anticon-calendar"
													>
														<FormOutlined />
													</span>
													<span>Go to Practice</span>
												</Link>
											</div>
										</Space>
									</Card>
								)}
								{mode !== 'demo' && showReferral ? (
									<Card
										bordered={!isLite}
										style={{ borderRadius: isLite ? 0 : undefined }}
										size="small"
										title="REFER A FRIEND"
									>
										<Refer referralCode={btoa(username)} xp={referral} uEmail={email} />
									</Card>
								) : null}
								<Leaderboard activePhase={activePhase} />
							</Space>
						</div>
					) : null}
				</div>
				<Space direction="vertical" style={{ width: '100%' }}>
					{showReports ? (
						<div className="compact-report" style={{ width: '100%', flex: 1 }}>
							<CompactReport />
						</div>
					) : (
						<div className="compact-report hidden"></div>
					)}
				</Space>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Feeds: state.api.Feeds,
	SuperGroups: state.api.SuperGroups,
	puzzle: state.api.Puzzle,
	ServicePlans: state.api.ServicePlans,
	AssessmentWrappers: state.api.AssessmentWrappers,
});

const mapDispatchToProps = dispatch => {
	return {
		updateServicePlans: data => dispatch(updateServicePlans(data)),
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	ensureServicePlansLoad(Home, {
		lazy: false,
		select: selectSubscribedServiceIds,
	})
);
