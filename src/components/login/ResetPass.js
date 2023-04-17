import React, { Component } from 'react';
import classnames from 'classnames';
import { URLS } from '../urls.js';
import { emailLogo, isLite } from 'utils/config';
import './styles.scss';

const errors = {
	// define it in some other file
	'invalid-email': 'Email address not found',
};

class ResetPass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			emailError: '',
			linkSent: false,
		};
	}

	componentDidMount() {
		this.refs.email && this.refs.email.focus();
	}

	resendResetEmail = e => {
		const email = this.refs.email.value;
		this.setState({ isSending: true });
		if (this.validateEmail(email)) {
			fetch(`${URLS.backendUsers}/forgotPassword`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, logo: emailLogo }),
			})
				.then(response => {
					if (response.ok) {
						response.json().then(() => {
							this.setState({ linkSent: true, isSending: false });
						});
					} else if (response.status === 422) {
						response.json().then(responseJson =>
							this.setState({
								isSending: false,
								linkSent: false,
								emailError: errors[responseJson.error.code],
							})
						);
					} else {
						this.setState({ isSending: false, linkSent: false });
					}
				})
				.catch(error => {
					this.setState({
						isSending: false,
						linkSent: false,
						emailError:
							"Couldn't connect to server. Please check you internet connection.",
					});
				});
		} else {
			this.setState({
				emailError: 'Please enter your email address',
				isSending: false,
			});
		}
	};

	removeEmailError = () => this.setState({ emailError: '' });

	validateEmail(email) {
		//move this in Utils.js
		let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	onChange = e => {
		e.preventDefault();
		this.setState({ email: this.refs.email.value });
		if (!this.refs.email.value || this.refs.email.value === '') {
			this.setState({ emailError: 'Please enter your email address' });
		} else {
			this.setState({ emailError: '' });
		}
	};

	handleDidNotReceiveEmail = () => {
		this.setState({ showSupportEmail: true });
	};
	handleSubmit = e => {
		e.preventDefault();
		if (this.state.isSending) {
			return;
		}
		this.resendResetEmail();
	};

	render() {
		let { emailError, linkSent, isSending } = this.state;
		return (
			<div className={classnames('registration-form', { lite: isLite })}>
				<div
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						marginBottom: 15,
					}}
				>
					<div style={{ flex: 1 }}>Reset Password</div>
					<button
						data-ga-on="click"
						data-ga-event-category="Switch SignIn Option"
						data-ga-event-label="To: Sign In"
						data-ga-event-action="click"
						className="small-round-button"
						onClick={() => this.props.changeModal(1)}
					>
						Sign In
					</button>
				</div>
				{!linkSent ? (
					<form onSubmit={this.handleSubmit}>
						<div style={{ margin: '5px 0px', fontSize: 13, fontWeight: 'bold' }}>
							Email
						</div>
						<input
							className="custom-input"
							placeholder="julie@example.com"
							ref="email"
							onChange={this.onChange}
							style={{ marginBottom: 10 }}
						/>
						{emailError ? (
							<div
								style={{
									fontSize: 15,
									color: 'red',
									marginBottom: 16,
								}}
							>
								{emailError}
							</div>
						) : null}
						<button
							type="submit"
							className="large-round-button"
							disabled={isSending}
							data-ga-on="click"
							data-ga-event-action="click"
							data-ga-event-category="Forgot Password"
							data-ga-event-label="Send Reset Link"
							style={{ padding: '10px 24px', width: 'unset' }}
						>
							{isSending ? 'Sending Email...' : 'Send Reset Email'}
						</button>
					</form>
				) : (
					<div>
						{this.state.showSupportEmail ? (
							<div>
								<p>Did you check your spam folder?</p>
								<p>
									Still, if you don't find it, please send an email to
									support@prepleaf.com.
								</p>
							</div>
						) : (
							<>
								<div style={{ color: '#333' }}>
									Email sent to your email address containing instructions to reset your
									password.
								</div>
								<div style={{ color: '#777' }}>
									Do check your spam folder if it doesn't arrive in your inbox.
								</div>
								<button
									data-ga-on="click"
									data-ga-event-action="click"
									data-ga-event-category="Forgot Password"
									data-ga-event-label="Didn't receive the email?"
									style={{
										backgroundColor: 'transparent',
										border: 'none',
										color: '#038ed2',
										padding: 0,
										marginTop: 8,
										cursor: 'pointer',
									}}
									onClick={this.handleDidNotReceiveEmail}
								>
									Didn't receive the email?
								</button>
							</>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default ResetPass;
