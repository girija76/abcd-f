/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Topbar from './Topbar';
import AllResources from './AllResources';
import Resource from './Resource';
import AboutCat from './AboutCat';
import CatPricing from './CatPricing';
// import Courses from './Courses';
import IIFT from '../score-calculator/iift';
// import Course from './Course';
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

class Resourses extends Component {
	render = () => {
		return (
			<div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
				<Topbar />
				<Switch>
					<PropsRoute
						exact
						path={`${URLS.resources}/cat-answers-and-repoonse-sheet-2019`}
						url="https://cat.prepleaf.com"
						component={Resource}
					/>
					<PropsRoute
						exact
						path={`${URLS.resources}/iift-score-calculator`}
						url="https://cat.prepleaf.com"
						component={IIFT}
					/>
					<PropsRoute
						exact
						path={`${URLS.resources}/cat`}
						url="https://cat.prepleaf.com"
						component={AboutCat}
					/>
					<PropsRoute
						exact
						path={`${URLS.resources}/cat/pricing`}
						url="https://cat.prepleaf.com"
						component={CatPricing}
					/>
					<PropsRoute path={URLS.resources} component={AllResources} />
				</Switch>
			</div>
		);
	};
}

//<div>FAQ- related to courses</div>

export default Resourses;
