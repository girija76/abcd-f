/* eslint-disable no-nested-ternary */
import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';

function getActivePhase(subscriptions, currentSupergroup) {
	let activePhase = {};
	subscriptions.forEach(subscription => {
		if (subscription.group === currentSupergroup) {
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(phase => {
					if (phase.active) activePhase = phase;
				});
			});
		}
	});
	return activePhase;
}

const CheckOutdatedPhase = () => {
	const role = useSelector(roleSelector);
	const areAllPhaseOutdated = useSelector(state => {
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		const UserData = state.api.UserData;
		if (currentSupergroup && UserData && UserData.subscriptions) {
			const activePhase = getActivePhase(
				UserData.subscriptions,
				currentSupergroup
			);

			if (activePhase.phase) {
				const dateNow = new Date().getTime();
				const endDate = new Date(activePhase.phase.endDate).getTime();

				if (dateNow > endDate) return true;
			}
		}
		return false;
	});

	if (
		role === 'user' &&
		window.location.pathname !== '/handle-outdated-phase' &&
		areAllPhaseOutdated
	) {
		return <Redirect to="/handle-outdated-phase" />;
	}

	return null;
};

export default withRouter(CheckOutdatedPhase);
