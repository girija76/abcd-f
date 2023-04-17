/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Topbar from './Topbar';
import AllCourses from './AllCourses';
import Course from './Course';
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

class Courses extends Component {
	render = () => {
		return (
			<div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
				<Topbar />
				<Switch>
					<PropsRoute
						exact
						path={`${URLS.courses}/cat`}
						component={Course}
						url="https://cat.prepleaf.com"
						name="CAT 2020"
						description="Trusted by thousands of students"
					/>
					<PropsRoute
						exact
						path={`${URLS.courses}/placement`}
						component={Course}
						url="https://jobs.prepleaf.com"
						name="Placement 2020"
						description="Trusted by thousands of students"
					/>
					<PropsRoute
						exact
						path={`${URLS.courses}/jee`}
						component={Course}
						url="https://jee.prepleaf.com"
						name="JEE 2020"
						description="Trusted by thousands of students"
					/>
					<PropsRoute path={URLS.courses} component={AllCourses} />
				</Switch>
			</div>
		);
	};
}

//<div>FAQ- related to courses</div>

export default Courses;
