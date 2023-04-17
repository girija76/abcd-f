import React, { useState } from 'react';
import { Radio } from 'antd';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import { apiBaseUrl, isSignUpGoogleDisabled } from 'utils/config';
import GoogleIcon from '../images/google.svg';
import './WithGoogle.css';

const signInWithGoogleUrl = `${apiBaseUrl}/users/auth/login?return=${window.location.origin}`;

const SignInWithGoogle = ({ isSignUp, gaCategory, color }) => {
	const [showModal, setShowModal] = useState(false);
	const [group, setGroup] = useState('');

	const { supergroups, landingPageCfg, clientId } = window.config;

	const code = localStorage.getItem('referralCode');

	let url = '';
	if (supergroups && supergroups.length === 1) {
		url = `${signInWithGoogleUrl}${
			code
				? `?state=${code}&supergroup=${supergroups[0]._id}` //why do we need ? here
				: `&supergroup=${supergroups[0]._id}`
		}`;
	} else {
		url = `${signInWithGoogleUrl}${code ? `?state=${code}` : ''}`;
	}

	const groups =
		landingPageCfg && landingPageCfg.groups ? landingPageCfg.groups : [];

	const groupStyles = { display: 'flex', marginBottom: 0 };

	if (groups.length > 3) {
		groupStyles['flexWrap'] = 'wrap';
		groupStyles['justifyContent'] = 'space-around';
	}

	const useModal = groups.length >= 2 ? true : false;

	let modalUrl = code
		? `${signInWithGoogleUrl}?state=${code}` //why do we need ? here
		: signInWithGoogleUrl;

	if (group.supergroup) {
		modalUrl += `&supergroup=${group.supergroup}`;
	}

	if (group.subgroup) {
		modalUrl += `&subgroup=${group.subgroup}`;
	}

	if (clientId) {
		url += `&client=${clientId}`;
		modalUrl += `&client=${clientId}`;
	}

	return (
		<div>
			{useModal ? (
				<div
					data-ga-on="click,auxclick"
					data-ga-event-action="Try Sign In"
					data-ga-event-category={gaCategory || 'Google'}
					data-ga-event-label="Sign In with Google"
					href={url}
					className="with-google-button"
					onClick={() => setShowModal(true)}
				>
					<img
						alt="Google Logo"
						src={GoogleIcon}
						style={{ width: 24, marginRight: 8 }}
					/>
					Sign {isSignUp ? 'up' : 'in'} with Google
				</div>
			) : (
				<a
					data-ga-on="click,auxclick"
					data-ga-event-action="Try Sign In"
					data-ga-event-category={gaCategory || 'Google'}
					data-ga-event-label="Sign In with Google"
					href={url}
					className="with-google-button"
					style={color ? { color, border: `1px solid ${color}` } : {}}
				>
					<img
						alt="Google Logo"
						src={GoogleIcon}
						style={{ width: 24, marginRight: 8 }}
					/>
					Sign {isSignUp ? 'up' : 'in'} with Google
				</a>
			)}
			<Modal
				title="Choose a Course"
				visible={showModal}
				onCancel={() => setShowModal(false)}
				footer={null}
				className="with-google-modal"
			>
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					<Radio.Group
						onChange={e => {
							setGroup(groups[e.target.value]);
						}}
						style={groupStyles}
						value={group ? group._id : ''}
					>
						{groups.map(group => {
							return (
								<Radio key={group._id} value={group._id}>
									{group.name}
								</Radio>
							);
						})}
					</Radio.Group>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
					<Button type="primary" size="large" disabled={!group}>
						<a
							data-ga-on="click,auxclick"
							data-ga-event-action="Try Sign In"
							data-ga-event-category={gaCategory || 'Google'}
							data-ga-event-label="Sign In with Google"
							href={modalUrl}
						>
							Continue
						</a>
					</Button>
				</div>
			</Modal>
		</div>
	);
};

const Wrapper = props => {
	if (isSignUpGoogleDisabled) {
		return null;
	}
	return <SignInWithGoogle {...props} />;
};

export default Wrapper;
