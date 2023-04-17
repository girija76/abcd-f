import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import asyncComponent from './AsyncComponent';
import { URLS } from './urls.js';
import AsyncDashboard from 'components/dashboard';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { roleSelector, userSelector } from 'selectors/user';
import { isCBT, isRegistrationDisabled } from 'utils/config';
import { shouldShowSwitcher } from 'utils/switcher';
import Switcher from 'components/switchers';
import CBTDashboard from './cbt';

const AsyncPracticeRoutes = asyncComponent(() =>
	import(/* webpackChunkName: "practiceRoute"*/ '../routes/practice')
);
const AsyncQuestionLevelWrapper = asyncComponent(() =>
	import(
		/* webpackChunkName: "questionLevelWrapper"*/ './analysis/QuestionLevelWrapper.js'
	)
);
const AsyncCompleteProfile = asyncComponent(() =>
	import(/* webpackChunkName: "complete-profile"*/ 'routes/CompleteProfile')
);
const AsyncTestWrapper = asyncComponent(() =>
	import(/* webpackChunkName: "tests-test-wrapper"*/ './tests/TestWrapper.js')
);
const AsyncReviewDash = asyncComponent(() =>
	import(/* webpackChunkName: "review-dash"*/ './review/ReviewDash.js')
);
const AsyncSubmitSolutionDash = asyncComponent(() =>
	import(
		/* webpackChunkName: "submit-solution-dash"*/ './solution/SubmitSolutionDash.js'
	)
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

const Redirector = () => {
	const { search } = useLocation();
	const searchParams = useMemo(() => new URLSearchParams(search), [search]);
	const preferred = searchParams.get('prefer');
	const flow = searchParams.get('flow');
	const signUpPhase = searchParams.get('sign_up_phase');
	const signUpSubGroup = searchParams.get('sign_up_subGroup');
	const signUpSuperGroup = searchParams.get('sign_up_superGroup');
	const query = useMemo(() => {
		const paramsArray = [];
		if (flow) {
			paramsArray.push(`flow=${flow}`);
		}
		if (signUpPhase) {
			paramsArray.push(`phase=${signUpPhase}`);
		}
		if (signUpSubGroup) {
			paramsArray.push(`subGroup=${signUpSubGroup}`);
		}
		if (signUpSuperGroup) {
			paramsArray.push(`superGroup=${signUpSuperGroup}`);
		}
		return paramsArray.join('&');
	}, [flow, signUpPhase, signUpSubGroup, signUpSuperGroup]);
	const registrationUrl = useMemo(
		() =>
			!isRegistrationDisabled && preferred !== 'sign_up'
				? URLS.signIn
				: URLS.signUp,
		[preferred]
	);
	return (
		<Redirect
			to={`${registrationUrl}?redirect_url=${encodeURIComponent(
				window.location.href
			)}${query ? `&${query}` : ''}`}
		/>
	);
};

const Routes = () => {
	const user = useSelector(userSelector);
	const role = useSelector(roleSelector);
	const email = useMemo(() => user && user.email, [user]);
	const isSwitcherVisible = useMemo(() => shouldShowSwitcher(role), [role]);
	return (
		<div>
			{isSwitcherVisible ? (
				<Switcher />
			) : email ? (
				<Switch>
					<Route path={URLS.completeProfile} component={AsyncCompleteProfile} />
					<PropsRoute
						path={URLS.dashboard}
						component={isCBT ? CBTDashboard : AsyncDashboard}
					/>
					<Route path={URLS.practiceSession} component={AsyncPracticeRoutes} />
					<PropsRoute
						exact
						path={URLS.reviewQuestions}
						component={AsyncReviewDash}
					/>
					<PropsRoute
						exact
						path={URLS.submitSolution}
						component={AsyncSubmitSolutionDash}
					/>
					<PropsRoute
						exact
						path={URLS.analysisQuestion}
						component={AsyncQuestionLevelWrapper}
					/>
					<PropsRoute path={`${URLS.liveTest}/:id`} component={AsyncTestWrapper} />
				</Switch>
			) : user ? (
				<Redirector />
			) : null}
			{!email ? (
				<div style={{ padding: '3rem', fontSize: '2rem', textAlign: 'center' }}>
					<Loading3QuartersOutlined
						spin
						style={{ color: 'rgb(26, 115, 232)', fontSize: 32 }}
					/>
					<div style={{ fontStyle: 'italic' }}>
						<span style={{ visibility: 'hidden' }}>...</span>Loading...
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Routes;
