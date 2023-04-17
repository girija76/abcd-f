import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { filter, get } from 'lodash';
import { Button, Input, Alert, Select } from 'antd';

import { getIncompleteFields } from 'utils/user';
import SelectSubgroup from './SelectSubgroup';
import SelectSuperGroup from 'components/login/SelectSuperGroup';
import { URLS } from 'components/urls';
import { logout } from 'utils/user';

import { checkMobileNumber, parseFullDate } from 'components/libs/lib';

import { LoadingOutlined } from '@ant-design/icons';

import './styles.scss';

const { Option } = Select;

const getNextURL = location => {
	const params = new URLSearchParams(location.search);
	return params.get('next') || URLS.dashboard;
};

const submitCompleteProfile = ({ data }, resolve, reject) => {
	return fetch(`${URLS.backendUsers}/completeProfile`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
		credentials: 'include',
	})
		.then(res => {
			res.json().then(resBody => {
				if (res.ok) {
					resolve(resBody);
				} else {
					reject(resBody);
				}
			});
		})
		.catch(e => {
			reject(e);
		});
};

const CompleteProfile = ({
	location,
	incompleteFields,
	currentSupergroup,
	username: initialUsername,
}) => {
	const formFields = ['username', 'name', 'mobileNumber', 'subscriptions'];
	const incompleteFormFields = formFields.filter(
		field => incompleteFields.indexOf(field) > -1
	);

	const [username, setUsername] = useState(initialUsername);
	const [name, setName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [subgroup, setSubgroup] = useState('');
	const [supergroup, setSupergroup] = useState(currentSupergroup);
	const [error, setError] = useState(null);
	const [redirectNow, setRedirectNow] = useState(false);
	const [isSendingEmail, setIsSendingEmail] = useState(false);
	const [canClickSendEmail, setCanSendEmail] = useState(true);
	const [isVerifSucce, setIsVerifSucce] = useState(false);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);
	const [phases, setPhases] = useState([]);
	const [phase, setPhase] = useState({});

	useEffect(() => {
		if (!canClickSendEmail) {
			const timeoutId = setTimeout(() => {
				setCanSendEmail(true);
			}, 5000);
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [canClickSendEmail]);

	useEffect(() => {
		setPhases([]);
		setPhase({});
		setError(null);
	}, [supergroup]);

	useEffect(() => {
		const phases = filter(
			get(subgroup, 'phases', []),
			({ phase }) => !phase.hidden && phase.isOpenForEnrollment
		);
		if (phases.length === 1) {
			setPhase(phases[0].phase);
		}
		setPhases(phases);

		setError(null);
	}, [subgroup]);

	const handleSubmit = e => {
		e.preventDefault();

		if (username.length < 6) {
			setError('Usernames should be of atleast 6 characters');
		} else if (username.indexOf(' ') !== -1) {
			setError("Usernames can't contain spaces");
		} else if (
			incompleteFormFields.indexOf('mobileNumber') !== -1 &&
			!checkMobileNumber(mobileNumber)
		) {
			setError('Phone number is invalid');
		} else if (
			incompleteFormFields.indexOf('subscriptions') !== -1 &&
			(!subgroup || !supergroup || !subgroup._id)
		) {
			setError(
				supergroup === '5dd95e8097bc204881be3f2c'
					? 'Please select a course'
					: 'Please select a college'
			);
		} else if (
			incompleteFormFields.indexOf('subscriptions') !== -1 &&
			(!phase || !phase._id)
		) {
			setError('Please select a phase');
		} else {
			const data = {
				username,
				name,
				mobileNumber,
				group: subgroup._id,
				supergroup,
				phase: phase._id,
			};
			setIsSaveDisabled(true);
			submitCompleteProfile(
				{ data },
				res => {
					setIsSaveDisabled(false);
					if (res.error) {
						setError(res.error);
					} else {
						setRedirectNow(true);
					}
				},
				error => {
					setIsSaveDisabled(false);
					setError(error.message || 'Some error occurred');
				}
			);
		}

		// TODO: submit data
	};
	if (redirectNow || !incompleteFields || incompleteFields.length === 0) {
		window.location = getNextURL(location);
		return null;
	}
	const handleResendEmailClick = () => {
		setIsSendingEmail(true);
		fetch(`${URLS.backendUsers}/resend`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			setCanSendEmail(false);
			setIsSendingEmail(false);
		});
	};
	return (
		<div className="complete-profile">
			<div className="wrapper">
				{incompleteFormFields.length ? (
					<h1 style={{ textAlign: 'center' }}>Complete your profile</h1>
				) : null}
				{incompleteFields.indexOf('email_verification') > -1 ? (
					isVerifSucce ? (
						incompleteFormFields.length ? null : (
							<div style={{ marginTop: 64 }}>
								<Alert
									message="Email verified successfully."
									description="Click button below to continue."
									showIcon
									type="success"
								/>
								<div style={{ marginTop: 8 }} />
								<a
									href={getNextURL(location)}
									block
									className="ant-btn ant-btn-primary ant-btn-block ant-btn-lg"
								>
									Continue
								</a>
							</div>
						)
					) : (
						<>
							<Alert
								type="warning"
								showIcon
								message={
									<div>
										<div>
											You havn't verified your email address. Please verify your email
											address.
										</div>
										<div>
											Do check your spam folder if it doesn't arrive in your inbox.
										</div>
									</div>
								}
								description={
									<div>
										<Button
											disabled={isSendingEmail || !canClickSendEmail}
											type="primary"
											onClick={handleResendEmailClick}
										>
											Resend Email
											{isSendingEmail ? <LoadingOutlined /> : null}
										</Button>
										{!canClickSendEmail ? (
											<div style={{ marginTop: 8 }}>Email has been sent successfully.</div>
										) : null}
									</div>
								}
							/>
						</>
					)
				) : null}
				{incompleteFormFields.length ? (
					<form className="form" onSubmit={handleSubmit}>
						{incompleteFields.indexOf('username') > -1 ? (
							<div className="form-item">
								<label className="form-item-label">Username</label>
								<Input
									autoFocus={incompleteFields[0] === 'username'}
									className="form-item-input"
									type="text"
									name="username"
									onChange={e => {
										setUsername(e.target.value);
										setError(null);
									}}
									value={username}
								/>
							</div>
						) : null}

						{incompleteFields.indexOf('name') > -1 ? (
							<div className="form-item">
								<label className="form-item-label">Name</label>
								<Input
									autoFocus={incompleteFields[0] === 'name'}
									className="form-item-input"
									type="text"
									name="name"
									onChange={e => {
										setName(e.target.value);
										setError(null);
									}}
									value={name}
								/>
							</div>
						) : null}
						{incompleteFields.indexOf('mobileNumber') > -1 ? (
							<div className="form-item">
								<label className="form-item-label">Mobile Number</label>
								<Input
									autoFocus={incompleteFields[0] === 'mobileNumber'}
									className="form-item-input"
									name="name"
									onChange={e => {
										setMobileNumber(e.target.value);
										setError(null);
									}}
									type="number"
									value={mobileNumber}
								/>
							</div>
						) : null}
						{!currentSupergroup ? (
							<div className="form-item" style={{ marginBottom: 24 }}>
								<SelectSuperGroup
									onChange={setSupergroup}
									value={supergroup}
									labelClassName="form-item-label"
									labelStyle={{}}
								/>
							</div>
						) : null}

						{supergroup && incompleteFields.indexOf('subscriptions') > -1 ? (
							<div className="form-item">
								<SelectSubgroup
									labelClassName="form-item-label"
									supergroup={supergroup}
									onChange={setSubgroup}
								/>
							</div>
						) : null}

						{phases.length ? (
							<div className="form-item">
								<label className="form-item-label">Choose Phase</label>
								<Select
									defaultValue="Choose a phase" //redundant?
									value={
										phase && phase.name
											? `${phase.name} (${parseFullDate(
													phase.startDate
											  )} - ${parseFullDate(phase.endDate)})`
											: 'Choose a phase'
									}
									onChange={setPhase}
									style={{ width: '100%' }}
									size="large"
								>
									{phases.map(ph => {
										return (
											<Option
												key={ph.phase._id}
												value={ph.phase._id}
												style={{ fontSize: 12 }}
											>
												{`${ph.phase.name} (${parseFullDate(
													ph.phase.startDate
												)} - ${parseFullDate(ph.phase.endDate)})`}
											</Option>
										);
									})}
								</Select>
							</div>
						) : null}

						{error ? (
							<>
								<Alert showIcon type="error" message={error} />
								<div style={{ marginBottom: 8 }} />
							</>
						) : null}

						<Button
							htmlType="submit"
							size="large"
							type="primary"
							disabled={isSaveDisabled}
							style={{ width: '100%' }}
						>
							<span>Save</span>
							{isSaveDisabled ? <LoadingOutlined /> : null}
						</Button>
						{currentSupergroup ? (
							<Link
								className="ant-btn ant-btn-link ant-btn-block ant-btn-lg"
								style={{ marginTop: 8 }}
								to={URLS.dashboard}
							>
								Cancel
							</Link>
						) : (
							<>
								<div style={{ marginTop: 8 }} />
								<Button type="link" size="large" onClick={logout} block>
									Sign Out
								</Button>
							</>
						)}
					</form>
				) : null}
			</div>
		</div>
	);
};

const mapStateToProps = state => {
	const currentSupergroup = localStorage.getItem('currentSupergroup');
	const allSuperGroups = state.api.SuperGroups;
	return {
		currentSupergroup,
		username: state.api.UserData.username,
		incompleteFields: getIncompleteFields(
			state.api.UserData,
			currentSupergroup,
			allSuperGroups
		),
	};
};

export default connect(mapStateToProps)(CompleteProfile);
