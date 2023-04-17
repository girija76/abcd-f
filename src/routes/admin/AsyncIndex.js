import { URLS } from 'components/urls';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';
import AnalysisRoutes from './analysis/AsyncIndex';
import AssessmentRoutes from './assessments';
import AttendanceRoutes from './attendance';
import LeaveRoutes from './leaves';
import ParentListRoutes from './parent';
import TeacherListRoutes from './teachers';
import UserListRoute from './users';
import UserProfileRoute from './users/Profile';

function AdminRoutes() {
	const role = useSelector(roleSelector);
	if (!isAtLeastMentor(role)) {
		return null;
	}
	return (
		<Switch>
			<Route path={URLS.adminTeacherList} component={TeacherListRoutes} />
			<Route path={URLS.adminUserProfile} component={UserProfileRoute} />
			<Route path={URLS.adminUserList} component={UserListRoute} />
			<Route path={URLS.adminParentList} component={ParentListRoutes} />
			<Route path={URLS.adminAttendance} component={AttendanceRoutes} />
			<Route path={URLS.adminAssessments} component={AssessmentRoutes} />
			<Route path={URLS.adminAnalysis} component={AnalysisRoutes} />
			<Route path={URLS.adminLeave} component={LeaveRoutes} />
		</Switch>
	);
}

export default AdminRoutes;
