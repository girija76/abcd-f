import Overall from 'components/admin/analysis/Overall';
import { URLS } from 'components/urls';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';
import Analysis from './index';

function Hello() {
	return (
		<h1>
			This Page is in development mode will receive update on it on 8 March 2022
		</h1>
	);
}

function AnalysisRoutes() {
	const role = useSelector(roleSelector);
	if (!isAtLeastMentor(role)) {
		return null;
	}
	return (
		<Switch>
			<Route exact path={URLS.adminAnalysis} component={Analysis} />
			<Route exact path={URLS.adminAnalysisOverall} component={Overall} />
		</Switch>
	);
}

export default AnalysisRoutes;
