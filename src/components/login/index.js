import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import Login from '../login/Login';
import asyncComponent from '../AsyncComponent';
import { isRegistrationDisabled } from 'utils/config';

const AsyncSignup = asyncComponent(
	() => import(/* webpackChunkName: "signup" */ './Signup.js'),
	'inline',
	20
);
const AsyncResetPass = asyncComponent(
	() => import(/* webpackChunkName: "reset-pass"*/ './ResetPass.js'),
	'inline',
	20
);

const Registration = ({
	defaultView,
	isFormWide: isFormWideDefault,
	gaCategory,
	noShadow,
	autoMargin,
	showCompleteSignUpFlow,
	phase,
	subGroup,
	superGroup,
}) => {
	const [modal, setModal] = useState();
	const [isFormWide, setIsFormWide] = useState(isFormWideDefault);
	const handleWindowResize = useCallback(() => {
		if (isFormWideDefault) {
			if (window.innerWidth < 800) {
				setIsFormWide(false);
			} else {
				setIsFormWide(true);
			}
		}
	}, [isFormWideDefault]);
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		let m = 1;
		if (!isRegistrationDisabled && searchParams.get('code')) {
			m = 2;
		}
		// eslint-disable-next-line default-case
		switch (!isRegistrationDisabled && defaultView) {
			case 'signup':
				m = 2;
				break;
			case 'password_reset':
				m = 3;
				break;
		}
		setModal(m);
	}, [defaultView]);
	useEffect(() => {
		if (isFormWideDefault) {
			handleWindowResize();
			window.addEventListener('resize', handleWindowResize);
		}
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	}, [isFormWideDefault, handleWindowResize]);
	let currModal = null;
	if (modal === 1) {
		currModal = (
			<Login
				gaCategory={gaCategory}
				isFormWide={isFormWide}
				changeModal={setModal}
			/>
		);
	} else if (modal === 2) {
		currModal = (
			<AsyncSignup
				gaCategory={gaCategory}
				isFormWide={isFormWide}
				changeModal={setModal}
				showCompleteSignUpFlow={showCompleteSignUpFlow}
				phase={phase}
				subGroup={subGroup}
				superGroup={superGroup}
			/>
		);
	} else if (modal === 3) {
		currModal = (
			<AsyncResetPass
				gaCategory={gaCategory}
				isFormWide={isFormWide}
				changeModal={setModal}
			/>
		);
	}
	return modal ? (
		<div className="login-signup-content">
			<div
				id="login-modal"
				className={classnames('form-wrapper', {
					'no-shadow-registration-form': noShadow,
					'auto-margin-registration-form': autoMargin,
				})}
			>
				{currModal}
			</div>
		</div>
	) : null;
};

export default Registration;
