import React from 'react';
import { isEmpty } from 'lodash';
import { Space, Spin } from 'antd';
import ReactDOM from 'react-dom';
import { URLS } from 'components/urls';
import { Button, Modal } from 'antd';
import { getRandomString } from './string';

const isUsernameFilled = username => {
	return !isEmpty(username);
};

const isNameFilled = name => {
	return !isEmpty(name);
};

const isMobileNumberFilled = mobileNumber => {
	return !isEmpty(mobileNumber);
};

const isSubscribedToSubgroup = (
	subscriptions,
	currentSupergroupId,
	allSuperGroups
) => {
	const currentSubscription = subscriptions
		? subscriptions.filter(
				subscription => subscription.group === currentSupergroupId
		  )[0]
		: undefined;

	if (!currentSubscription) {
		return false;
	}
	const currentSuperGroup = allSuperGroups.filter(
		sup => sup._id === currentSupergroupId
	)[0];

	if (!currentSuperGroup) {
		return true;
	}
	const userSubgroup = currentSuperGroup.subgroups.filter(
		sub => sub.subgroup._id === currentSubscription.subgroups[0].group
	)[0];

	// if (!currentSuperGroup) {
	// 	return true;
	// }

	if (userSubgroup.subgroup.name === 'NOT_SET') {
		return false;
	}
	return true;
};

export const getIncompleteFields = (
	userData,
	currentSupergroupId,
	allSuperGroups
) => {
	const { username, name, mobileNumber, isVerified, subscriptions } = userData;

	const incompleteFields = [];
	if (!isUsernameFilled(username)) {
		incompleteFields.push('username');
	}
	if (!isNameFilled(name)) {
		incompleteFields.push('name');
	}
	if (!isVerified) {
		incompleteFields.push('email_verification');
	}
	if (!isMobileNumberFilled(mobileNumber)) {
		incompleteFields.push('mobileNumber');
	}

	if (
		!isSubscribedToSubgroup(subscriptions, currentSupergroupId, allSuperGroups)
	) {
		incompleteFields.push('subscriptions');
	}
	return incompleteFields;
};

export const isAccountCreationCompleted = (...args) =>
	getIncompleteFields(...args).length === 0;

export const validateEmail = email => {
	// eslint-disable-next-line
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

let isLoggingOut = false;
const removeLogoutAlert = () => {
	const elem = document.getElementById('logout-modal-tree');
	ReactDOM.unmountComponentAtNode(elem);
	isLoggingOut = false;
};

const showLogginOutAlert = () => {
	if (isLoggingOut) {
		return;
	}
	removeLogoutAlert();
	const elem = document.getElementById('logout-modal-tree');
	const modal = (
		<Modal centered visible footer={null} closable={false}>
			<div
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<Spin size="large" />
				<div style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Logging out...</div>
			</div>
		</Modal>
	);
	isLoggingOut = true;
	ReactDOM.render(modal, elem);
};

const handleLogoutFailure = () => {
	removeLogoutAlert();
	const elem = document.getElementById('logout-modal-tree');
	const modal = (
		<Modal centered visible footer={null} closable={false}>
			<div
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<div>Failed to log you out. Please retry.</div>
				<Space style={{ marginTop: '1rem' }}>
					<Button type="primary" onClick={logout}>
						Retry
					</Button>
					<Button onClick={removeLogoutAlert}>Cancel</Button>
				</Space>
			</div>
		</Modal>
	);
	ReactDOM.render(modal, elem);
};

// showLogginOutAlert();

export const clearUserData = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('answerSheet');
	localStorage.removeItem('flow');
	localStorage.removeItem('currSection');
	localStorage.removeItem('currQuestion');
	localStorage.removeItem('startTime');
	localStorage.removeItem('liveTestId');
	localStorage.removeItem('questionStartTime');
	localStorage.removeItem('currentSupergroup');
	sessionStorage.removeItem('NFat');

	clearUserApiResponseCache();
};

export const logout = url => {
	localStorage.removeItem('phases');
	localStorage.removeItem('viewAs');
	showLogginOutAlert();
	return fetch(`${URLS.backendUsers}/signout`, {
		method: 'GET',
		credentials: 'include',
	})
		.then(() => {
			try {
				const authEvent = new CustomEvent('authChange', {
					detail: { type: 'fail', label: 'Sign Out' },
				});
				window.dispatchEvent(authEvent);
			} catch (e) {}

			clearUserData();

			if (url && typeof url === 'string') {
				window.location = url;
			} else {
				window.location = URLS.landingPage;
			}
			setTimeout(() => {
				removeLogoutAlert();
			}, 300);
		})
		.catch(() => {
			handleLogoutFailure();
		});
};

export const clearUserApiResponseCache = () => {
	sessionStorage.removeItem('userApiResponse');
};

export function generateUsername(expectedLength = 14, email, name) {
	let username = '';
	if (typeof name === 'string') {
		username += name.split(' ')[0] || '';
	}
	if (typeof email === 'string') {
		const firstDelimiter = Math.min(email.indexOf('.'), email.indexOf('@'));
		username += email.slice(0, firstDelimiter);
	}
	let finalUsername = '';
	for (let i = 0; i < username.length; i++) {
		let char = username[i];
		if (
			(char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9')
		) {
			finalUsername += char;
			console.log('username');
		} else {
			console.log({ char }, 'not matched', finalUsername);
		}
	}
	if (finalUsername.length < expectedLength) {
		finalUsername += getRandomString(expectedLength - finalUsername.length);
	}
	return finalUsername;
}
