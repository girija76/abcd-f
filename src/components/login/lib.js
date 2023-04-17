import { validateEmail } from 'utils/user';

import { URLS } from '../urls.js';

export function getError(error) {
	if (!error) {
		//
	} else if (error.code === 'auth/email-already-in-use') {
		return { emailError: 'Email address is already in use' };
	} else if (error.code === 'auth/invalid-email') {
		return { emailError: 'Email address is badly formated' };
	} else if (error.code === 'auth/weak-password') {
		return {
			passwordError: 'Password must be atleast 6 characters long',
		};
	}
}

export function resendEmail() {
	fetch(`${URLS.backendUsers}/resend`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		credentials: 'include',
	}).then(response => {});
}

export function isSignupParamsValid(email, password, group) {
	if (!email || !validateEmail(email)) {
		return {
			success: false,
			error: { emailError: 'Email address is badly formatted' },
		};
	}
	if (!password || password.length < 6) {
		return {
			success: false,
			error: { passwordError: 'Password must be atleast 6 characters long' },
		};
	}
	if (!group || !group.supergroup) {
		return {
			success: false,
			error: { groupError: 'Please select a course' },
		};
	}
	return { success: true };
}
