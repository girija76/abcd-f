import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Helmet from 'react-helmet';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { Button, Space, Spin, Typography } from 'antd';
import RegistrationForm from 'components/login';
import { useSelector } from 'react-redux';
import { name as clientName } from 'utils/config';
import './style.scss';
import userApi from 'apis/user';
import { get } from 'lodash';
import { getErrorResponse } from 'utils/axios';

const { Text } = Typography;

const MainComponent = ({
	defaultView,
	showCompleteSignUpFlow,
	phase,
	subGroup,
	superGroup,
}) => {
	const { logoDark, logoDarkHeight } = window.config;
	return (
		<div className="registration-page-container">
			<div className="brand-view">
				<Link to="/">
					<img src={logoDark} alt={clientName} style={{ height: logoDarkHeight }} />
				</Link>
			</div>
			<div className="registration-page-form-container">
				<RegistrationForm
					gaCategory="registration-page"
					isFormWide
					defaultView={defaultView}
					showCompleteSignUpFlow={showCompleteSignUpFlow}
					phase={phase}
					subGroup={subGroup}
					superGroup={superGroup}
				/>
			</div>
		</div>
	);
};

const SignIn = () => {
	return (
		<>
			<Helmet>
				<title>Sign in to {clientName}</title>
			</Helmet>
			<MainComponent />
		</>
	);
};

const SignUp = () => {
	const { search } = useLocation();
	const searchParams = useMemo(() => new URLSearchParams(search), [search]);
	const showCompleteSignUpFlow = useMemo(
		() => searchParams.get('flow') === 'buy',
		[searchParams]
	);
	const phase = searchParams.get('phase');
	const subGroup = searchParams.get('subGroup');
	const superGroup = searchParams.get('superGroup');
	return (
		<>
			<Helmet>
				<title>Create your {clientName} account</title>
			</Helmet>
			<MainComponent
				defaultView="signup"
				showCompleteSignUpFlow={showCompleteSignUpFlow}
				phase={phase}
				subGroup={subGroup}
				superGroup={superGroup}
			/>
		</>
	);
};

const PasswordReset = () => (
	<React.Fragment>
		<Helmet>
			<title>Reset your password</title>
		</Helmet>
		<MainComponent defaultView="password_reset" />
	</React.Fragment>
);

const Router = ({ match: { path }, location: { search } }) => {
	const isAuthenticated = useSelector(state => {
		try {
			return !!state.api.UserData._id;
		} catch (e) {
			return false;
		}
	});
	const searchParams = useMemo(() => new URLSearchParams(search), [search]);
	const shouldSignInViaClientJwt = searchParams.get('sivcj');
	const clientGeneratedToken = searchParams.get('cjw');
	const redirectUrl = useMemo(
		() => searchParams.get('redirect_url') || '/dashboard',
		[searchParams]
	);
	const [signInViaClientFailed, setSignInViaClientFailed] = useState(false);
	const [isJwtSignInCancelled, setIsJwtSignInCancelled] = useState(false);
	const [jwtSignInError, setJwtSignInError] = useState(null);

	useEffect(() => {
		if (isAuthenticated) {
			window.location = redirectUrl;
		}
	}, [isAuthenticated, redirectUrl]);
	const tryJwtSignIn = useCallback(async () => {
		setSignInViaClientFailed(false);
		if (shouldSignInViaClientJwt) {
			try {
				await userApi.signInViaClientJwt(clientGeneratedToken);
				window.location = redirectUrl;
			} catch (e) {
				const errorMessage = get(
					getErrorResponse(e, { message: 'Unknown error occurred' }),
					'message'
				);
				setJwtSignInError(errorMessage);
				setSignInViaClientFailed(true);
			}
		}
	}, [clientGeneratedToken, redirectUrl, shouldSignInViaClientJwt]);
	const cancelJwtSignIn = () => {
		setIsJwtSignInCancelled(true);
	};
	useEffect(() => {
		tryJwtSignIn();
	}, [tryJwtSignIn]);
	if (!isJwtSignInCancelled && shouldSignInViaClientJwt) {
		if (signInViaClientFailed) {
			return (
				<Space
					direction="vertical"
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 12,
					}}
				>
					<Text type="danger">
						{jwtSignInError}. Click try again or enter credentials manually.
					</Text>
					<Space>
						<Button onClick={tryJwtSignIn}>Try Again</Button>
						<Button onClick={cancelJwtSignIn}>Continue for Manual</Button>
					</Space>
				</Space>
			);
		} else {
			return (
				<div style={{ textAlign: 'center' }}>
					<Spin />
					<div>Signing in...</div>
				</div>
			);
		}
	}
	return (
		<div className="registration-page">
			<Switch>
				<Route
					path={`${path}/sign_in`}
					signInViaClientJwt={shouldSignInViaClientJwt}
					clientGeneratedToken={clientGeneratedToken}
					component={SignIn}
				/>
				<Route path={`${path}/create_account`} component={SignUp} />
				<Route path={`${path}/reset_password`} component={PasswordReset} />
				<Route component={SignUp} />
			</Switch>
		</div>
	);
};

export default Router;
