/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Topbar from './Topbar';
import Iift from './iift';
import { URLS } from '../urls.js';

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

class ScoreCalculator extends Component {
	render = () => {
		return (
			<div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
				<Topbar />
				<Iift />
			</div>
		);
	};
}

export default ScoreCalculator;
