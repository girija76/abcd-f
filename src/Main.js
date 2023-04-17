import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import asyncComponent from './components/AsyncComponent';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.less';

import { URLS } from './components/urls.js';
import NetworkStatus from 'components/common/NetworkStatus';
import CheckOutdatedPhase from 'components/common/CheckOutdatedPhase';
import FOUR_O_FOUR from 'components/404';

import './Variables.css'; // added in index.html
import CheckAPI from 'components/CheckAPI';

import { createVisitor } from './utils/visitor';

import Routes from './components/Routes.js';
import { setViewport } from 'utils/viewport';
import { useWindowSize } from 'utils/hooks/window';

Spin.setDefaultIndicator(<LoadingOutlined />);

const AsyncLandingPage = asyncComponent(() =>
	import(
		/* webpackChunkName: "landing_page"*/ './components/landingPage/LandingPage'
	)
);
const AsyncDemoRoutes = asyncComponent(() =>
	import(/* webpackChunkName: "demo_routes"*/ './components/DemoRoutes.js')
);

const AsyncCourses = asyncComponent(() =>
	import(/* webpackChunkName: "courses"*/ './components/courses/Courses')
);

const AsyncResources = asyncComponent(() =>
	import(/* webpackChunkName: "resources"*/ './components/resources/Resources')
);

const AsyncScholarship = asyncComponent(() =>
	import(
		/* webpackChunkName: "registration"*/ './components/registration/Registration'
	)
);

const AsyncUnsubscribe = asyncComponent(() =>
	import(
		/* webpackChunkName: "unsubscribe"*/ './components/unsubscribe/Unsubscribe'
	)
);

const AsyncAssessments = asyncComponent(() =>
	import(
		/* webpackChunkName: "sharedLinksAssessments"*/ './components/shared-links/Assessment'
	)
);

const AsyncIiftCalculator = asyncComponent(() =>
	import(
		/* webpackChunkName: "scoreCalculator"*/ './components/score-calculator/scoreCalculator'
	)
);

const AsyncHandleOutdatedPhase = asyncComponent(() =>
	import(
		/* webpackChunkName: "outdatedPhase"*/ './components/intermediates/HandleOutdatedPhase'
	)
);

const AsyncRegistrationRoute = asyncComponent(() =>
	import(/* webpackChunkName: "registrations_routes"*/ 'routes/registration')
);

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

const Main = props => {
	const pathname = props.history.location.pathname;
	const { width: windowWidth, height: windowHeight } = useWindowSize();
	useEffect(() => {
		createVisitor(window.location.search);
	}, []);

	useEffect(
		p => {
			window.previousPreviousLocation = window.previousLocation;
			window.previousLocation = props.history.location.pathname;
		},
		[props.history.location.pathname]
	);

	useEffect(() => {
		setViewport(pathname);
	}, [pathname, windowWidth, windowHeight]);

	return (
		<>
			<NetworkStatus />
			<CheckOutdatedPhase />
			<div>
				<div>
					<CheckAPI />
					<Switch>
						<Route path={URLS.registration} component={AsyncRegistrationRoute} />
						<Route
							exact
							path={URLS.landingPage}
							render={() => {
								return <AsyncLandingPage />;
							}}
						/>
						<Route
							exact
							path={[`${URLS.landingPage}course/:identifier`]}
							component={AsyncLandingPage}
						/>
						<Route path={`${URLS.landingPage}courses/`} component={AsyncCourses} />
						<Route path={`${URLS.iiftScore}`} component={AsyncIiftCalculator} />
						<Route
							path={`${URLS.landingPage}resources/`}
							component={AsyncResources}
						/>
						<Route path={`${URLS.scholarship}`} component={AsyncScholarship} />
						<PropsRoute path={URLS.dashboard} component={Routes} />
						<PropsRoute path={URLS.demo} component={AsyncDemoRoutes} />
						<PropsRoute exact path={URLS.practiceTest} component={Routes} />
						<PropsRoute exact path={URLS.reviewQuestions} component={Routes} />
						<PropsRoute exact path={URLS.submitSolution} component={Routes} />
						<PropsRoute exact path={URLS.analysisQuestion} component={Routes} />
						<PropsRoute path={URLS.practiceSession} component={Routes} />
						<PropsRoute path={URLS.liveTest} component={Routes} />
						<PropsRoute path={URLS.completeProfile} component={Routes} />
						<Route
							exact
							path="/handle-outdated-phase"
							component={AsyncHandleOutdatedPhase}
						/>
						<PropsRoute path={URLS.unsubscribe} component={AsyncUnsubscribe} />
						<PropsRoute path={URLS.assessments} component={AsyncAssessments} />

						<Route path="/" component={FOUR_O_FOUR} />
					</Switch>
				</div>
			</div>
		</>
	);
};

export default withRouter(Main);
