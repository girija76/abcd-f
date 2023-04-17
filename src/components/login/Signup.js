import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { withRouter } from 'react-router-dom';
import { URLS } from '../urls.js';
import './styles.scss';
import notification from 'antd/es/notification';
import { updateUserData3 } from '../api/ApiAction.js';
import WithGoogleButton from './WithGoogle';
import OrDivider from './Or';
import 'antd/lib/notification/style/index.css';
import { updateGroups } from 'components/api/ApiAction';
import { isLite, signInText } from 'utils/config';

import { Loading3QuartersOutlined } from '@ant-design/icons';

import { getError, resendEmail, isSignupParamsValid } from './lib';

import { isAccessGranted, shouldSendEmail } from '../libs/lib';
import { generateUsername } from 'utils/user';
import userApi from 'apis/user';
import { forEach } from 'lodash';

const fetchSuperGroups = (resolve, reject) => {
	fetch(`${URLS.backendUnauthorized}/super-groups`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})
		.then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					resolve(responseJson.groups);
				});
			} else {
				reject(new Error('Unable to fetch courses'));
			}
		})
		.catch(e => {
			reject(e);
		});
};

export class Signup extends React.Component {
	constructor(props) {
		super(props);
		const { supergroups } = window.config;
		let supergroup = '';
		let group = '';
		if (supergroups && supergroups.length === 1) {
			supergroup = supergroups[0]._id;
			group = { supergroup };
		}

		if (props.superGroup) {
			supergroup = props.superGroup;
			group = { supergroup };
			if (props.subGroup) {
				group.subgroup = props.subGroup;
				if (props.phase) {
					group.phase = props.phase;
				}
			}
		}

		this.state = {
			password: '',
			supergroup,
			group,
			emailError: '',
			passwordError: '',
			isWaiting: false,
		};
	}
	componentDidMount() {
		fetchSuperGroups(
			this.handleFetchSuperGroupsSuccess,
			this.handleFetchSuperGroupsFailure
		);
	}
	handleFetchSuperGroupsSuccess = superGroups => {
		this.props.updateGroups(superGroups);
	};
	handleFetchSuperGroupsFailure = e => {};

	signup = () => {
		const { email, password, group } = this.state;

		const result = isSignupParamsValid(email, password, group);
		if (!result.success) {
			this.setState(result.error);
			return;
		}

		const referralCode = localStorage.getItem('referralCode');
		const body = { email, password, supergroup: group.supergroup };
		body.superGroup = body.supergroup;

		if (referralCode) body.referralCode = referralCode;
		if (group.subgroup) body.subgroup = group.subgroup;

		console.log(group);

		const { clientId } = window.config;
		if (clientId) body.clientId = clientId;

		this.setState({ isWaiting: true });
		fetch(`${URLS.backendUsers}/signup`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			credentials: 'include',
		})
			.then(response => {
				if (response.ok) {
					response.json().then(async responseJson => {
						if (
							this.props.showCompleteSignUpFlow &&
							this.props.subGroup &&
							this.props.superGroup &&
							this.props.phase
						) {
							let superGroup, subGroup, phase;
							forEach(
								responseJson.subscriptions,
								({ group: supergroup, subgroups }) => {
									superGroup = supergroup;
									forEach(subgroups, ({ group: subgroup, phases }) => {
										subGroup = subgroup;
										forEach(phases, ({ phase: p }) => {
											phase = p;
										});
									});
								}
							);
							const { name, mobileNumber } = this.state;
							const generatedUsername = generateUsername(
								14,
								this.state.email,
								this.state.name
							);
							await userApi.completeProfile({
								name,
								username: generatedUsername,
								mobileNumber,
								subGroup,
								superGroup,
								phase,
							});
						}
						// await updateMissingInformation('/updateAccount', {
						// 	phase: this.props.phase,
						// 	name: this.state.name,
						// 	username: generateUsername(this.email, this.name),
						// });
						try {
							const authEvent = new CustomEvent('authChange', {
								detail: {
									userId: responseJson.user._id,
									email: responseJson.user.email,
									phone: responseJson.user.mobileNumber,
									name: responseJson.user.name,
									type: 'success',
								},
							});
							window.dispatchEvent(authEvent);
						} catch (e) {}

						localStorage.setItem('token', responseJson.token);
						if (
							shouldSendEmail(responseJson.user.subscriptions) &&
							process.env.NODE_ENV !== 'development'
						) {
							resendEmail();
						}
						if (isAccessGranted(responseJson.user.subscriptions)) {
							notification.open({
								placement: 'topRight',
								message: 'Sign up successful!',
								description:
									'A confirmation email has been sent to your email. Please verify your email address.',
								duration: 10,
								className: 'signup-successful',
							});
						}

						/* if (!responseJson.user.username) {
							if (window.location.pathname !== '/') this.props.history.push('/');
						} else {
							if (window.location.pathname === '/')
						} */
						this.props.updateUserData3({
							userData: responseJson.user,
							topics: responseJson.topics,
							difficulty: responseJson.difficulty,
							leaderboard: responseJson.leaderboard,
							recommendations: responseJson.recommendations,
							supergroupNames: responseJson.supergroupNames,
							percentComplete: responseJson.percentComplete,
							category: responseJson.category,
						});
						this.fetchGroups();
						if (responseJson.user.subscriptions.length) {
							localStorage.setItem(
								'currentSupergroup',
								responseJson.user.subscriptions[0].group
							);
						} else {
							localStorage.removeItem('currentSupergroup');
						}
						this.setState({ isWaiting: false });
						// this.props.history.replace(URLS.dashboard);
					});
				} else {
					response.json().then(responseJson => {
						const error = getError(responseJson.error);
						// this.setState(error);
						this.setState({ isWaiting: false, ...error });
					});
				}
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
					const currentSupergroup = localStorage.getItem('currentSupergroup');
					if (!currentSupergroup && responseJson.groups.length) {
						localStorage.setItem('currentSupergroup', responseJson.groups[0]._id);
					} else {
						let found = false;
						responseJson.groups.forEach(g => {
							if (g._id === currentSupergroup) found = true;
						});
						if (!found) {
							if (responseJson.groups.length) {
								localStorage.setItem('currentSupergroup', responseJson.groups[0]._id);
							} else {
								localStorage.removeItem('currentSupergroup');
							}
						}
					}
					window.onSupergroupChange();
				});
			} else {
			}
		});
	};

	handleEmailChange = e =>
		this.setState({ emailError: '', email: e.target.value });

	handleMobileNumberChange = e => {
		this.setState({ mobileNumberError: '', mobileNumber: e.target.value });
	};
	handleNameChange = e => {
		this.setState({ nameError: '', name: e.target.value });
	};

	handlePasswordChange = text =>
		this.setState({ passwordError: '', password: text.target.value });

	render() {
		let {
			email,
			emailError,
			mobileNumber,
			mobileNumberError,
			name,
			nameError,
			password,
			passwordError,
			superGroupError,
			group,
			groupError,
			isWaiting,
		} = this.state;
		const { isFormWide, gaCategory, showCompleteSignUpFlow } = this.props;

		const { landingPageCfg } = window.config;
		const swg = landingPageCfg.swg ? landingPageCfg.swg : false;
		const groups = landingPageCfg.groups ? landingPageCfg.groups : [];

		const groupStyles = { display: 'flex', marginBottom: 0 };

		if (groups.length > 3) {
			groupStyles['flexWrap'] = 'wrap';
			groupStyles['justifyContent'] = 'space-around';
		}

		return (
			<div
				className={classnames('registration-form login-form', {
					'registration-form-wide': isFormWide,
					lite: isLite,
				})}
			>
				<div className="main-content-wrapper">
					<div style={{ fontSize: 20, fontWeight: 'bold', margin: '10px 0px' }}>
						Create your account
					</div>
					<form
						onSubmit={e => {
							e.preventDefault();
							this.signup();
						}}
					>
						<label
							htmlFor="email"
							style={{
								margin: '5px 0px',
								fontSize: 13,
								fontWeight: 'bold',
								display: 'block',
							}}
						>
							Email
						</label>
						<input
							id="email"
							className="custom-input"
							placeholder="julie@example.com"
							ref="email"
							name="email"
							value={email}
							onChange={this.handleEmailChange}
						/>
						{emailError ? (
							<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
								{emailError}
							</div>
						) : null}

						{showCompleteSignUpFlow ? (
							<>
								<>
									<label
										htmlFor="mobileNumber"
										style={{
											margin: '5px 0px',
											fontSize: 13,
											marginTop: 13,
											fontWeight: 'bold',
											display: 'block',
										}}
									>
										Mobile Number
									</label>
									<input
										id="mobileNumber"
										className="custom-input"
										placeholder="10 digit number"
										ref="email"
										name="mobileNumber"
										value={mobileNumber}
										onChange={this.handleMobileNumberChange}
									/>
									{mobileNumberError ? (
										<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
											{mobileNumberError}
										</div>
									) : null}
								</>
								<>
									<label
										htmlFor="name"
										style={{
											margin: '5px 0px',
											fontSize: 13,
											marginTop: 13,
											fontWeight: 'bold',
											display: 'block',
										}}
									>
										Name
									</label>
									<input
										id="name"
										className="custom-input"
										placeholder="Your full name"
										ref="email"
										name="name"
										value={name}
										onChange={this.handleNameChange}
									/>
									{nameError ? (
										<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
											{nameError}
										</div>
									) : null}
								</>
							</>
						) : null}

						<label
							style={{
								fontSize: 13,
								fontWeight: 'bold',
								marginTop: 13,
								marginBottom: 5,
								display: 'block',
							}}
							htmlFor="password"
						>
							Password
						</label>
						<input
							id="password"
							className="custom-input"
							placeholder="Enter your password"
							ref="pass"
							onChange={this.handlePasswordChange}
							value={password}
							type="password"
						/>
						{passwordError ? (
							<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
								{passwordError}
							</div>
						) : null}

						{groups.length > 1 ? (
							<label
								style={{
									fontSize: 13,
									fontWeight: 'bold',
									marginTop: 13,
									marginBottom: 5,
									display: 'block',
								}}
							>
								What do you want to prepare for?
							</label>
						) : null}

						{groups.length > 1 ? (
							<Select
								value={group ? group._id : ''}
								onChange={value => {
									this.setState({ group: groups[value], groupError: null });
								}}
								style={{ width: '100%' }}
								placeholder="Select Course"
							>
								{groups.map(group => (
									<Select.Option key={group._id} value={group._id}>
										{group.name}
									</Select.Option>
								))}
							</Select>
						) : null}

						{0 && superGroupError ? (
							<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
								{superGroupError}
							</div>
						) : null}

						{groupError ? (
							<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
								{groupError}
							</div>
						) : null}

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
								data-ga-event-label={`Sign Up`}
								className="large-round-button"
								type="submit"
								disabled={isWaiting}
							>
								<span>SIGN UP</span>
								{isWaiting ? (
									<span style={{ marginLeft: 12, fontSize: 20 }}>
										<Loading3QuartersOutlined spin />
									</span>
								) : null}
							</button>
						</div>
					</form>
				</div>
				<OrDivider direction={isFormWide ? 'vertical' : 'horizontal'} />
				<div className="secondary-content-wrapper">
					{swg ? <WithGoogleButton gaCategory={gaCategory} isSignUp /> : null}

					<button
						className="with-google-button"
						type="button"
						data-ga-on="click"
						data-ga-event-category={gaCategory || 'Switch SignIn Option'}
						data-ga-event-label="To: Sign In"
						data-ga-event-action="Switch SignIn Option"
						onClick={this.props.changeModal.bind(this, 1)}
						style={{ textTransform: 'uppercase' }}
					>
						{signInText || 'SIGN IN'}
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { superGroups: state.api.SuperGroups };
};

const mapDispatchToProps = { updateUserData3, updateGroups };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup));
