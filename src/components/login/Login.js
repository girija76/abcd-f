import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { includes, map, size } from 'lodash';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import {
	apiBaseUrl,
	emailLabel,
	isSignUpGoogleDisabled,
	passwordLabel,
} from 'utils/config';
import { URLS } from '../urls';
import WithGoogleButton from './WithGoogle';
import OrDivider from './Or';
import {
	isLite,
	registrationMoreLinks,
	usernameSuffix,
	signInText,
	isRegistrationDisabled,
} from 'utils/config';

import { update as updateUserAccount } from 'actions/userAccount';
import './styles.scss';

import {
	updateUserData3,
	updateUnverifiedUserData,
	updateGroups,
} from '../api/ApiAction';

function getActiveSupergroup(subscriptions) {
	const currentSupergroup = localStorage.getItem('currentSupergroup');
	let activeSupergroup = '';
	let localSupergroup = '';
	subscriptions.forEach(subscription => {
		subscription.subgroups.forEach(subgroup => {
			subgroup.phases.find(phase => {
				if (!activeSupergroup && phase.active)
					activeSupergroup = subscription.group;
				if (
					!localSupergroup &&
					subscription.group === currentSupergroup &&
					phase.active
				) {
					localSupergroup = subscription.group;
				}
			});
		});
	});
	return localSupergroup ? localSupergroup : activeSupergroup;
}

const fixUserEnteredEmail = userEnteredText => {
	if (!usernameSuffix) {
		return userEnteredText;
	}
	if (includes(userEnteredText, '@')) {
		return userEnteredText;
	} else {
		return `${userEnteredText}${usernameSuffix}`;
	}
};

export class Login extends React.Component {
	state = {
		password: '',
		isWaiting: false,
		emailError: '',
		passError: '',
		showPass: false,
	};

	showErrors = error => {
		// make object, key value pair
		if (error.code === 'auth/invalid-email') {
			this.setState({ emailError: 'Email address is badly formated' });
		} else if (error.code === 'auth/user-not-found') {
			this.setState({ emailError: 'Email address not found' });
		} else if (error.code === 'auth/wrong-password') {
			this.setState({ passError: 'Incorrect password' });
		} else {
		}
	};

	signin = e => {
		e && e.preventDefault && e.preventDefault();
		const email = fixUserEnteredEmail(this.refs.email.value);
		const pass = this.refs.pass.value;
		this.setState({ isWaiting: true });

		fetch(URLS.backendUsers + '/signin', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user: { email, password: pass, supergroup: null },
				portal: 'preparation',
			}),
			credentials: 'include',
		})
			.then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						try {
							const authEvent = new CustomEvent('authChange', {
								detail: {
									userId: responseJson.user._id,
									email: responseJson.user.email,
									phone: responseJson.user.mobileNumber,
									name: responseJson.user.name,
									type: 'success',
									label: 'Sign In',
								},
							});
							window.dispatchEvent(authEvent);
						} catch (e) {}
						localStorage.setItem('token', responseJson.token);
						this.props.updateUserData3({
							userData: responseJson.user,
							topics: responseJson.topics,
							difficulty: responseJson.difficulty,
							leaderboard: responseJson.leaderboard,
							recommendations: responseJson.recommendations,
							percentComplete: responseJson.percentComplete,
							puzzle: responseJson.puzzle,
							supergroupNames: responseJson.supergroupNames,
							category: responseJson.category,
						});
						this.props.updateUserAccount(responseJson.userAccount);

						const activeSupergroup = getActiveSupergroup(
							responseJson.user.subscriptions
						);
						if (activeSupergroup) {
							this.fetchGroup(activeSupergroup);
						} else {
							this.fetchGroups();
						}

						if (responseJson.user.subscriptions.length) {
							// only if already set is not one of ...
							localStorage.setItem(
								'currentSupergroup',
								responseJson.user.subscriptions[0].group
							);
						} else {
							localStorage.removeItem('currentSupergroup');
						}
					});
				} else if (response.status === 422) {
					response.json().then(responseJson => {
						if (
							responseJson.error &&
							responseJson.error.code === 'auth/email-not-verified'
						) {
							localStorage.setItem('token', responseJson.token);
							if (!responseJson.user.username) {
								if (window.location.pathname !== '/') this.props.history.push('/');
							} else {
								if (window.location.pathname === '/')
									this.props.history.replace(URLS.dashboard);
							}
							this.props.updateUnverifiedUserData({
								userData: responseJson.user,
								superGroups: responseJson.groups,
							});

							if (responseJson.groups.length) {
								localStorage.setItem('currentSupergroup', responseJson.groups[0]._id);
							} else {
								localStorage.removeItem('currentSupergroup');
							}
						} else {
							// do we need this?
							this.showErrors(responseJson.error);
						}
					});
				} else if (response.status === 400) {
					response.json().then(responseJson => {
						this.showErrors(responseJson.error);
					});
				}
				this.setState({ isWaiting: false });
			})
			.catch(error => {
				this.setState({ isWaiting: false });
			});
	};

	fetchGroups = () => {
		fetch(`${URLS.backendGroups}/get`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateGroups(responseJson.groups);
					this.setCurrentSupergroup(responseJson.groups, []);
					window.onSupergroupChange();
				});
			} else {
			}
		});
	};

	fetchGroup = supergroup => {
		fetch(`${URLS.backendGroups}/getOne/${supergroup}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateGroups(responseJson.groups);
					this.setCurrentSupergroup(responseJson.groups, []);
					window.onSupergroupChange();
				});
			} else {
			}
		});
	};

	setCurrentSupergroup = (groups, subscriptions) => {
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		if (groups.length) {
			let found = false;
			groups.forEach(g => {
				if (g._id === currentSupergroup) found = true;
			});
			if (!found) {
				localStorage.setItem('currentSupergroup', groups[0]._id);
			}
		} else if (subscriptions.length) {
			// also check if phase is present
			let found = false;
			subscriptions.forEach(s => {
				if (s.group === currentSupergroup) found = true;
			});
			if (!found) {
				localStorage.setItem('currentSupergroup', subscriptions[0].group);
			}
		} else {
			localStorage.removeItem('currentSupergroup');
		}
	};

	removeEmailError = () => this.setState({ emailError: '' });

	removePassError = text =>
		this.setState({ passError: '', password: text.target.value });

	showPass = () => this.setState({ showPass: true });

	hidePass = () => this.setState({ showPass: false });

	_handleKeyPress = e => {
		if (e.key === 'Enter') {
			this.signin();
		}
	};

	signinGoogle = e => {
		e && e.preventDefault && e.preventDefault();
		let returnUrl = window.location.host;
		if (window.location.host.split(':')[0] === 'localhost') {
			// check env
			returnUrl = 'http://' + returnUrl;
		} else {
			returnUrl = 'https://' + returnUrl;
		}
		window.location.href = apiBaseUrl + '/users/auth/login?return=' + returnUrl;
	};

	render() {
		const { isWaiting, emailError, passError, password, showPass } = this.state;
		const { gaCategory, isFormWide } = this.props;

		const { name, landingPageCfg } = window.config;
		const swg = landingPageCfg.swg ? landingPageCfg.swg : false;
		console.log(isSignUpGoogleDisabled);

		return (
			<div
				className={classnames('registration-form login-form', {
					'registration-form-wide': isFormWide,
					lite: isLite,
				})}
			>
				<div className="main-content-wrapper">
					<form
						onSubmit={e => {
							e.preventDefault();
							this.signin();
						}}
						className="login-form"
					>
						<div style={{ fontSize: 20, margin: '10px 0px', fontWeight: 'bold' }}>
							{signInText || 'Sign in'} to {name}
						</div>
						<div>
							<div style={{ margin: '5px 0px', fontSize: 13, fontWeight: 'bold' }}>
								{emailLabel}
							</div>
							<input
								className="custom-input"
								placeholder="julie@example.com"
								ref="email"
								onChange={this.removeEmailError}
							/>
							{emailError ? (
								<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
									{emailError}
								</div>
							) : null}
						</div>
						<div>
							<div style={{ height: 39, position: 'relative' }}>
								<input
									className="custom-input"
									placeholder="Enter your password"
									ref="pass"
									onChange={this.removePassError}
									type={showPass ? 'text' : 'password'}
									style={password ? { letterSpacing: 3 } : {}}
									onKeyPress={this._handleKeyPress}
								/>
								<div
									className="show-pass"
									onMouseEnter={this.showPass}
									onMouseLeave={this.hidePass}
								/>
							</div>
							{passError ? (
								<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
									{passError}
								</div>
							) : null}
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}
						>
							<button
								data-ga-on="click"
								data-ga-event-action="Try Sign In"
								data-ga-event-category={gaCategory || 'Email'}
								data-ga-event-label="Sign In"
								disabled={isWaiting}
								className="large-round-button"
								type="submit"
								style={{
									marginTop: isRegistrationDisabled ? 12 : 0,
									textTransform: 'uppercase',
								}}
							>
								<span>{signInText || 'SIGN IN'}</span>
								{isWaiting ? (
									<span style={{ marginLeft: 12, fontSize: 20 }}>
										<Loading3QuartersOutlined spin />
									</span>
								) : null}
							</button>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: 13,
								marginBottom: 5,
								gridRow: 3,
							}}
						>
							<div style={{ fontSize: 13, fontWeight: 'bold' }}>{passwordLabel}</div>
							<button
								style={{
									fontSize: 10,
									color: '#039be5',
									cursor: 'pointer',
									background: 'transparent',
									border: 'none',
								}}
								type="button"
								onClick={this.props.changeModal.bind(this, 3)}
								data-ga-on="click"
								data-ga-event-category="Forgot Password"
								data-ga-event-action="click"
								data-ga-event-label="Forgot Password"
							>
								Forgot password?
							</button>
						</div>
					</form>
				</div>
				{!isRegistrationDisabled ? (
					<OrDivider direction={isFormWide ? 'vertical' : 'horizontal'} />
				) : (
					<div style={{ height: 16 }}></div>
				)}
				{!isRegistrationDisabled ? (
					<div className="secondary-content-wrapper">
						{swg ? <WithGoogleButton gaCategory={gaCategory} /> : null}
						<button
							data-ga-on="click"
							data-ga-event-category={gaCategory || 'Switch SignIn Option'}
							data-ga-event-label="To: Sign Up"
							data-ga-event-action="Switch SignIn Option"
							className="with-google-button"
							type="button"
							onClick={this.props.changeModal.bind(this, 2)}
						>
							{window.config.signupText ? window.config.signupText : 'SIGN UP'}
						</button>
					</div>
				) : null}
				{!isLite && registrationMoreLinks && size(registrationMoreLinks) ? (
					<OrDivider direction="vertical" />
				) : null}
				<div>
					{!isLite &&
						map(registrationMoreLinks, ({ text, href, target }, index) => (
							<a
								className="ant-btn ant-btn-primary ant-btn-lg"
								key={index}
								href={href}
								target={target}
								style={{ whiteSpace: 'break-spaces', height: 'auto' }}
							>
								{text}
							</a>
						))}
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserData3: userData => {
			dispatch(updateUserData3(userData));
		},
		updateUnverifiedUserData: userData => {
			dispatch(updateUnverifiedUserData(userData));
		},
		updateGroups: superGroups => dispatch(updateGroups(superGroups)),
		updateUserAccount: (...args) => dispatch(updateUserAccount(...args)),
	};
};

export default connect(null, mapDispatchToProps)(withRouter(Login));
