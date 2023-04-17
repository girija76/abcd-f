import { isAtLeastMentor } from './auth';
import { getViewAsPhase } from './viewAs';

/**
 * Check if redirect to switcher is required
 * @param {*} user current user
 */
export function shouldShowSwitcher(role) {
	if (isAtLeastMentor(role)) {
		const viewingAsUserOfPhase = getViewAsPhase(null, role);
		if (!viewingAsUserOfPhase) {
			return true;
		}
	}
	return false;
}
