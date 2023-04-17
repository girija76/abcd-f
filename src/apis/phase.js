import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createPhaseApi = () => {
	const phaseApi = createBaseApi(URLS.backendPhases);
	return {
		getMentorsOfPhase: phase =>
			phaseApi.get(`/mentor/public/get/${phase}`).then(res => res.data),
		assignMentorToPhase: (phase, user, subject) =>
			phaseApi
				.post(`/mentor/admin/add/${phase}`, { user, subject })
				.then(res => res.data),
	};
};

const phaseApi = createPhaseApi();
export default phaseApi;
