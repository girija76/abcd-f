import { Component } from 'react';
import { connect } from 'react-redux';

import { URLS } from 'components/urls';
import {
	updateUserData,
	updateUserData2,
	updateUnverifiedUserData,
	updateTopics,
	updateGroups,
} from './api/ApiAction';
import { update as updateUserAccount } from 'actions/userAccount';

function getActiveSupergroup(subscriptions) {
	const currentSupergroup = localStorage.getItem('currentSupergroup');
	let activeSupergroup = '';
	let localSupergroup = '';
	subscriptions.forEach(subscription => {
		subscription.subgroups.forEach(subgroup => {
			subgroup.phases.forEach(phase => {
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

class CheckAPI extends Component {
	componentDidMount() {
		this.fetch();
		window.addEventListener('fetchTopics', this.fetchTopics);

		let referralCode = '';
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get('code')) {
			referralCode = searchParams.get('code');
			localStorage.setItem('referralCode', referralCode);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('fetchTopics', this.fetchTopics);
	}

	updateUserNew = data => {
		const response = data.detail;
		const params = new URLSearchParams(window.location.search);
		const isSignInWithGoogle = params.get('signInWith') === 'google';
		const isTokenFromURL = !!params.get('token');
		if (!response) {
			this.props.updateUserData({});
			return;
		}
		const { json: responseJson, status, ok } = response;
		if (ok) {
			try {
				const authEvent = new CustomEvent('authChange', {
					detail: {
						email: responseJson.user.email,
						phone: responseJson.user.mobileNumber,
						name: responseJson.user.name,
						userId: responseJson.user._id,
						type: 'success',
						label: isSignInWithGoogle
							? 'Auth via google'
							: isTokenFromURL
							? 'Through Token'
							: 'Verify Auth',
					},
				});
				window.dispatchEvent(authEvent);
			} catch (e) {}
			this.props.updateUserAccount(responseJson.userAccount);
			this.props.updateUserData(responseJson.user);
			this.props.updateUserData2({
				topics: responseJson.topics,
				difficulty: responseJson.difficulty,
				leaderboard: responseJson.leaderboard,
				recommendations: responseJson.recommendations,
				puzzle: responseJson.puzzle,
				supergroupNames: responseJson.supergroupNames,
				percentComplete: responseJson.percentComplete,
				category: responseJson.category,
			});

			const activeSupergroup = getActiveSupergroup(
				responseJson.user.subscriptions
			);
			if (activeSupergroup) {
				this.fetchGroup(activeSupergroup);
			} else {
				this.fetchGroups();
			}

			this.setCurrentSupergroup([], responseJson.user.subscriptions); // redundant!?
		} else if (status === 401) {
			this.props.updateUserData({});
			if (responseJson.message === 'Unauthorized') {
				localStorage.removeItem('token');
			}
		} else if (status === 422) {
			if (
				responseJson.error &&
				responseJson.error.code === 'auth/email-not-verified'
			) {
				this.props.updateUnverifiedUserData({
					userData: responseJson.user,
					superGroups: responseJson.groups,
				});
			} else if (
				responseJson.error &&
				responseJson.error.code === 'auth/invalid-token'
			) {
				localStorage.removeItem('token');
				this.props.history.push(URLS.landingPage);
			} else if (
				responseJson.error &&
				responseJson.error.code === 'auth/no-subscription'
			) {
				this.props.updateUnverifiedUserData({
					userData: responseJson.user,
					superGroups: responseJson.groups,
				});
				this.props.history.push(`${URLS.completeProfile}`);
			}

			const activeSupergroup = getActiveSupergroup(
				responseJson.user.subscriptions
			);
			if (activeSupergroup) {
				this.fetchGroup(activeSupergroup);
			} else {
				this.fetchGroups();
			}
		}
	};

	fetch = () => {
		if (window.isFetchingUser === true) {
			window.addEventListener('updateUser', this.updateUserNew);
		} else if (window.userApiResponse) {
			this.updateUserNew(window.userApiResponse);
		} else {
			// for non-logged-in users
			window.addEventListener('updateUser', this.updateUserNew);
		}
	};

	fetchTopics = () => {
		fetch(`${URLS.backendTopics}/`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateTopics({
						topics: responseJson.topics,
					});
				});
			}
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
			}
		});
	};

	fetchGroup = supergroup => {
		fetch(`${URLS.backendCFGroups}/getOne/${supergroup}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateGroups(responseJson.groups);
					this.setCurrentSupergroup(responseJson.groups, []);
					window.onSupergroupChange();
				});
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

	render() {
		return null;
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateUserData: userData => dispatch(updateUserData(userData)),
		updateUserData2: userData => dispatch(updateUserData2(userData)),
		updateUnverifiedUserData: userData =>
			dispatch(updateUnverifiedUserData(userData)),
		updateTopics: topics => dispatch(updateTopics(topics)),
		updateGroups: superGroups => dispatch(updateGroups(superGroups)),
		updateUserAccount: (...args) => dispatch(updateUserAccount(...args)),
	};
};

export default connect(null, mapDispatchToProps)(CheckAPI);
