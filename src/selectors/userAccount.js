import { forEach, get, map } from 'lodash';

export const userAccountSelector = state => state.userAccount;

export const getPhasesFromSubscriptions = subscriptions => {
	const phases = [];
	forEach(subscriptions, subscription => {
		forEach(get(subscription, ['subgroups']), subGroup => {
			forEach(get(subGroup, ['phases']), phaseItem => {
				const phase = phaseItem.phase;
				phases.push(phase);
			});
		});
	});
	return phases;
};

export const accountUserListSelector = state => {
	const account = userAccountSelector(state);
	const users = get(account, ['users'], []);
	const usersWithSimplifiedSubscriptions = map(users, user => {
		return {
			...user,
			phases: getPhasesFromSubscriptions(get(user, ['subscriptions'])),
		};
	});
	return usersWithSimplifiedSubscriptions;
};
