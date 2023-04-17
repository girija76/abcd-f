import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ActiveSession from './active';
import StartSession from './start';

const PracticeRoutes = ({ match: { path } }) => {
	return (
		<div>
			<Switch>
				<Route exact path={`${path}/active`} component={ActiveSession} />
				<Route path={`${path}/new`} component={StartSession} />
			</Switch>
		</div>
	);
};

export default PracticeRoutes;
