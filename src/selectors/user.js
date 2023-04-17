import { forEach, get } from 'lodash';

export const userSelector = state => state.api.UserData;

export const userIdSelector = state => get(userSelector(state), ['_id']);

const getCurrentSupergroup = () => localStorage.getItem('currentSupergroup');

export const activePhaseSelector = state => {
	const subscriptions = get(userSelector(state), ['subscriptions']);
	let activePhase = '';
	const currentSupergroup = getCurrentSupergroup();

	forEach(subscriptions, subscription => {
		if (!currentSupergroup || subscription.group === currentSupergroup) {
			forEach(get(subscription, ['subgroups']), sg => {
				forEach(get(sg, ['phases']), ph => {
					if (ph.active) activePhase = ph.phase;
				});
			});
		} else {
		}
	});
	return activePhase;
};

export const activePhaseIdSelector = state => {
	const activePhase = activePhaseSelector(state);
	if (!activePhase) {
		return '';
	}
	return activePhase._id;
};

export const roleSelector = state => get(userSelector(state), 'role');

export const userSubjectsSelector = state =>
	get(userSelector(state), ['subjects'], []);
