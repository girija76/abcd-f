import videoApi from 'apis/video';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { getViewAsPhase } from 'utils/viewAs';

function AssignmentReport() {
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);
	const { data } = useQuery(
		['assignment-report', phaseId],
		() => videoApi.getAssignmentSubmissionStats(phaseId),
		{
			staleTime: 6e5,
		}
	);
	return <div></div>;
}

export default AssignmentReport;
