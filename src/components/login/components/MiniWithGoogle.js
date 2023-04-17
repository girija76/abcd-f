import React, { useState } from 'react';
import { Radio } from 'antd';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import GoogleIcon from '../../images/google.svg';
import '../WithGoogle.css';

import { apiBaseUrl } from 'utils/config';

const signInWithGoogleUrl = `${apiBaseUrl}/users/auth/login?return=${window.location.origin}`;

const SignInWithGoogle = ({ isSignUp, gaCategory, color }) => {
	const [showModal, setShowModal] = useState(false);
	const [group, setGroup] = useState('');

	const { supergroups, landingPageCfg, clientId } = window.config;
	const searchParams = new URLSearchParams(window.location.search);

	const code = localStorage.getItem('referralCode');

	let url = '';
	if (supergroups && supergroups.length === 1) {
		url = `${signInWithGoogleUrl}${
			code
				? `?state=${code}&supergroup=${supergroups[0]._id}`
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
		? `${signInWithGoogleUrl}?state=${code}`
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
					onClick={() => setShowModal(true)}
				>
					<div
						style={{
							border: `1px solid ${color}`,
							borderRadius: 4,
							width: '70vw',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 500,
							background: 'transparent',
							color,
							height: 42,
							lineHeight: '40px',
						}}
					>
						<img
							alt="Google Logo"
							src={GoogleIcon}
							style={{ width: 24, marginRight: 16 }}
						/>
						Sign {isSignUp ? 'up' : 'in'} with Google
					</div>
				</div>
			) : (
				<a
					data-ga-on="click,auxclick"
					data-ga-event-action="Try Sign In"
					data-ga-event-category={gaCategory || 'Google'}
					data-ga-event-label="Sign In with Google"
					href={url}
				>
					<div
						style={{
							border: `1px solid ${color}`,
							borderRadius: 4,
							width: '70vw',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 500,
							background: 'transparent',
							color,
							height: 42,
							lineHeight: '40px',
						}}
					>
						<img
							alt="Google Logo"
							src={GoogleIcon}
							style={{ width: 24, marginRight: 16 }}
						/>
						Sign {isSignUp ? 'up' : 'in'} with Google
					</div>
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

export default SignInWithGoogle;
