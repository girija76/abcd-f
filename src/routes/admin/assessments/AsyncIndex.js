import Assessments from 'components/admin/assessments';
import CreateAssessment from 'components/admin/assessments/create';
import EditDraft from 'components/admin/assessments/draft/Edit';
import WrapperStats from 'components/admin/assessments/wrapper';
import { URLS } from 'components/urls';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';

function AssessmentRoutes() {
	const role = useSelector(roleSelector);
	if (!isAtLeastMentor(role)) {
		return null;
	}
	return (
		<Switch>
			<Route exact path={URLS.adminAssessments} component={Assessments} />
			<Route
				exact
				path={URLS.adminAssessmentCreate}
				component={CreateAssessment}
			/>
			<Route exact path={URLS.adminAssessmentDraftEdit} component={EditDraft} />
			<Route exact path={URLS.adminAssessmentStats} component={WrapperStats} />
		</Switch>
	);
}

export default AssessmentRoutes;
