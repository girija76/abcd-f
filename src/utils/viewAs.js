export const getViewAsPhases = () => {
	try {
		return JSON.parse(window.localStorage.getItem('phases'));
	} catch (e) {
		return null;
	}
};

export const getViewAsPhase = (defaultPhase, role) => {
	if (role === 'user') {
		return defaultPhase;
	}
	const phases = getViewAsPhases();
	if (Array.isArray(phases) && phases.length) {
		return phases[0];
	}
	return defaultPhase;
};
