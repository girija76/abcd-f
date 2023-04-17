import React from 'react';
import { Switch, Route } from 'react-router-dom';

import List from './List';
import Detail from './Detail';
import './styles.scss';

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}}
		/>
	);
};

const Sessions = props => {
	const {
		match: { path },
		device,
		activePhase,
	} = props;

	return (
		<div className={`session-${device}`}>
			<Switch>
				<PropsRoute
					path={`${path}/session`}
					component={Detail}
					activePhase={activePhase}
				/>
				<PropsRoute path={path} component={List} />
			</Switch>
		</div>
	);
};

export default Sessions;
