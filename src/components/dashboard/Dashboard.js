import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Button, Layout, Modal, message } from 'antd';

import { URLS } from 'components/urls';
import NOT_FOUND from 'components/404';

/* Home and Practice */
import Topbar from '../topbar/Topbar';
import Home from '../home/Home';
import Reports from 'routes/reports';
import Practice from 'components/practice/Practice';

/* Assessments */
import AllTests from '../mocks/AllTests';
import RegistrationPrompt from 'components/login/Prompt';

/* Analysis and Profile */
import AnalysisActivity from '../AnalysisActivity';
import Profile from '../profile/Profile';

import MissingInfo from './MissingInfo';
import AccessNotGranted from './AccessNotGranted';

import SupportButton from './SupportButton';

import './Dashboard.scss';

import { getPhaseFromSubscription, isAccessGranted } from '../libs/lib';

import { updateUserData } from '../api/ApiAction';

import { logout } from 'utils/user';
import { clientId, hideNavigation, isLite, showReports } from 'utils/config';

import ScheduleRoutes from 'routes/schedule';
import AnnouncementsRoutes from 'routes/announcements';
import asyncComponent from 'components/AsyncComponent';
import { useWindowSize } from 'utils/hooks/window';
import ForumRoute from 'routes/forum/index';
import ChatRoutes from 'routes/chats';
import AdminRoutes from 'routes/admin';
import BusRoutes from 'routes/bus';
import SideNavigation from './SideNavigation';
import BottomNavigation from './BottomNavigation';
import FullMenuRoutes from 'routes/fullMenu';
import Meeting from 'components/meeting';
import { UpdateJeeData } from './JeeData';

const BookmarksRoutes = asyncComponent(() =>
	import(/* webpackChunkName: "bookmark-routes"*/ 'routes/bookmarks')
);

const LearningCenterRoutes = asyncComponent(() =>
	import(/* webpackChunkName "learning-center-route"*/ 'routes/learn_center')
);
const CartRoutes = asyncComponent(() =>
	import(/* webpackChunkName "cart-route"*/ 'routes/cart')
);

const { Header, Content, Footer } = Layout;

const dashboards = {
	default: URLS.dashboard,
	cat: URLS.catDashboard,
	placement: URLS.placementDashboard,
	jee: URLS.jeeDashboard,
};

const homes = {
	default: URLS.home,
	cat: URLS.catHome,
	placement: URLS.placementHome,
	jee: URLS.jeeHome,
};

const practices = {
	default: URLS.practice,
	cat: URLS.catPractice,
	placement: URLS.placementPractice,
	jee: URLS.jeePractice,
};

const topics = {
	default: URLS.topicTests,
	cat: URLS.catTopicTests,
	placement: URLS.placementTopicTests,
	jee: URLS.jeeTopicTests,
};

const sections = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

const seriesUrls = {
	default: URLS.series,
	cat: URLS.catSeries,
	placement: URLS.placementSeries,
	jee: URLS.jeeSeries,
};

const learningCenterUrls = {
	default: URLS.learningCenter,
	placement: URLS.placementLearningCenter,
};

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}}
		/>
	);
};

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			message: '',
			messageError: '',
			supportView: 0,
			showModal: false,
			showMissingInfo: false,
		};
	}

	componentWillMount() {
		//add in compete
		const { UserData } = this.props;
		if (UserData && UserData._id) {
			if (UserData.liveAssessment && UserData.liveAssessment.id)
				this.liveAssessmentWarning();

			if (!UserData.username) {
				const lastSkippedAt = localStorage.getItem('lastSkippedAt');
				if (!lastSkippedAt) {
					this.setState({ showMissingInfo: true });
				} else {
					const timeElapsed = new Date().getTime() - lastSkippedAt;
					if (timeElapsed > 3600 * 1000) {
						this.setState({ showMissingInfo: true });
					}
				}
			}

			// update activePhase in localStorage
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.UserData !== nextProps.UserData) {
			const { UserData } = nextProps;
			if (UserData && UserData._id) {
				if (UserData.liveAssessment && UserData.liveAssessment.id)
					this.liveAssessmentWarning();

				if (!UserData.username) {
					const lastSkippedAt = localStorage.getItem('lastSkippedAt');
					if (!lastSkippedAt) {
						this.setState({ showMissingInfo: true });
					} else {
						const timeElapsed = new Date().getTime() - lastSkippedAt;
						if (timeElapsed > 3600 * 1000) {
							this.setState({ showMissingInfo: true });
						}
					}
				}
			}

			// update activePhase in localStorage
		}
	}

	liveAssessmentWarning = () => {
		const {
			UserData: {
				liveAssessment: { id },
			},
		} = this.props;
		message.warning({
			content: (
				<a href={`${URLS.liveTest}/${id}`}>
					You were attempting live assessment. Click here to go back to your live
					assessment.
				</a>
			),
			duration: 0,
			key: id,
		});
	};

	showModal = () => {
		this.setState({ showModal: true });
	};

	skipfornow = () => {
		localStorage.setItem('lastSkippedAt', new Date().getTime());
		this.setState({ showMissingInfo: false });
	};

	render() {
		const { Phase } = this.props;

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		let { showModal, showMissingInfo } = this.state;

		let {
			UserData: { subscriptions },
			collapsed,
			mode,
		} = this.props;

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		const phaseFromSubscription = subscriptions
			? getPhaseFromSubscription(subscriptions, currentSupergroup)
			: null;
		const activePhase = Phase ? Phase : phaseFromSubscription;

		const { name, faq, disableSkipping } = window.config;

		const accessGranted = mode === 'demo' ? true : isAccessGranted(subscriptions);

		return (
			<Layout style={{ minHeight: '100vh' }}>
				{clientId === '5ee3e7b612e86f77ac72dad3' && <UpdateJeeData />}
				{hideNavigation ? null : (
					<SideNavigation collapsed={collapsed} mode={mode} />
				)}
				<Layout
					className={classnames('dashboard-scroll-root', {
						'when-sider-collapsed': collapsed,
						'always-visible': isLite,
					})}
					style={{
						height: '100%',
						minHeight: '100%',
						overflowY: 'scroll',
					}}
				>
					{hideNavigation ? null : (
						<Header style={{ background: '#fff', padding: 0, zIndex: 1 }}>
							<Topbar mode={mode} />
						</Header>
					)}
					<Content
						className="dashboard-content-padding-bottom-on-mobile"
						style={{ minHeight: 'auto' }}
					>
						{accessGranted ? (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Switch>
									<PropsRoute
										exact
										path={dashboards[key_]}
										component={Home}
										activePhase={activePhase}
										mode={mode}
									/>
									<PropsRoute
										path={learningCenterUrls[key_]}
										mode={mode}
										activePhase={activePhase}
										component={LearningCenterRoutes}
									/>
									<Route path={URLS.cart} component={CartRoutes} />
									<Route path={URLS.schedule} component={ScheduleRoutes} />
									<Route path={URLS.forum} component={ForumRoute} />
									<Route path={URLS.announcements} component={AnnouncementsRoutes} />
									<Route path={URLS.chats} component={ChatRoutes} />
									<PropsRoute
										path={homes[key_]}
										component={Home}
										mode={mode}
										activePhase={activePhase}
									/>
									<PropsRoute path={practices[key_]} component={Practice} mode={mode} />
									<PropsRoute
										path={seriesUrls[key_] + '-hustle'}
										component={AllTests}
										activePhase={activePhase}
										mode={mode}
									/>
									<PropsRoute
										path={topics[key_]}
										component={AllTests}
										activePhase={activePhase}
										mode={mode}
									/>
									<PropsRoute
										path={sections[key_]}
										component={AllTests}
										activePhase={activePhase}
										mode={mode}
									/>
									<PropsRoute
										path={competes[key_]}
										component={AllTests}
										activePhase={activePhase}
										mode={mode}
									/>
									<PropsRoute
										path={URLS.analysis}
										component={AnalysisActivity}
										activePhase={activePhase}
									/>
									<PropsRoute
										path={URLS.profile}
										component={Profile}
										activePhase={activePhase}
									/>
									<PropsRoute
										path={URLS.activity}
										component={AnalysisActivity}
										activePhase={activePhase}
									/>
									{showReports ? (
										<PropsRoute
											path={URLS.reports}
											component={Reports}
											activePhase={activePhase}
											mode={mode}
										/>
									) : null}
									<Route path={URLS.fullMenu} component={FullMenuRoutes} />
									<Route path={URLS.profileBookmarks} component={BookmarksRoutes} />
									<Route path={URLS.adminBase} component={AdminRoutes} />
									<Route path={URLS.busRoutes} component={BusRoutes} />
									<Route path={URLS.meeting} component={Meeting} />
									<Route component={NOT_FOUND} />
								</Switch>
							</div>
						) : (
							<AccessNotGranted />
						)}
					</Content>
					{hideNavigation ? null : <BottomNavigation mode={mode} />}
					<Footer style={{ textAlign: 'center' }} className="desktop-footer">
						{name} © 2022 All Rights Reserved
						{faq ? ' | ' : ''}
						{faq ? (
							<a
								data-ga-on="click,auxclick"
								data-ga-event-action="click"
								data-ga-event-category="Footer"
								data-ga-event-label="FAQ"
								href="https://www.prepseed.com/faq"
								target="_blank"
								rel="noopener noreferrer"
								style={{ textDecoration: 'underline' }}
							>
								FAQ
							</a>
						) : null}
					</Footer>
					<SupportButton />
				</Layout>
				<RegistrationPrompt
					visible={showModal}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
				/>
				<Modal
					title="Complete Your Profile"
					visible={showMissingInfo}
					closable={!disableSkipping}
					onCancel={disableSkipping ? null : this.skipfornow}
					centered
					footer={
						disableSkipping ? (
							<Button type="text" style={{ border: 0 }} onClick={logout}>
								Logout
							</Button>
						) : (
							<div>
								<div></div>
								<Button type="link" style={{ border: 0 }} onClick={this.skipfornow}>
									{'>> Skip for now'}
								</Button>
							</div>
						)
					}
				>
					<MissingInfo
						onUpdate={() => {
							this.setState({ showMissingInfo: false });
						}}
					/>
				</Modal>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		Assessments: state.api.Assessments,
		CompletedAssessments: state.api.CompletedAssessments,
		SuperGroups: state.api.SuperGroups,
		Phase: state.api.Phase,
	};
};

const mapDispatchToProps = dispatch => ({
	updateUserData: userData => dispatch(updateUserData(userData)),
});

const WithWidthSpecificDashboardWraapper = ({ ...props }) => {
	const { width } = useWindowSize();
	return <Dashboard {...props} collapsed={width < 1280} />;
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(WithWidthSpecificDashboardWraapper));
