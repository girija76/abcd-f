import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Playlists from './playlists';
import Video from './video';
import Playlist from './playlist';
import SelectPhases from './SelectPhases';
import AssignmentPage from './assignment';
import { URLS } from 'components/urls';
import Submissions from './submissions';

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

const VideosRoutes = ({ match: { path }, mode, activePhase }) => {
	return (
		<>
			<Switch>
				<PropsRoute
					mode={mode}
					path={`${URLS.learningCenterAssignmentPlaylists}/playlist/submission/:id`}
					component={Submissions}
					exact={true}
				/>
				<PropsRoute
					mode={mode}
					path={URLS.learningCenterVideoPlayerUrl}
					component={Video}
				/>
				<PropsRoute
					mode={mode}
					path={URLS.learningCenterAssignmentViewUrl}
					component={AssignmentPage}
				/>
				<PropsRoute
					mode={mode}
					path={`${path}/playlists/:resourceType/playlist`}
					component={Playlist}
				/>
				<PropsRoute
					activePhase={activePhase ? activePhase._id : null}
					mode={mode}
					path={`${path}/playlists`}
					component={Playlists}
				/>
				<PropsRoute
					mode={mode}
					path={`${path}/select_phases`}
					component={SelectPhases}
				/>

				<Redirect path={path} to={`${path}/playlists`} />
			</Switch>
		</>
	);
};

export default VideosRoutes;
