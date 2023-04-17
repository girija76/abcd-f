import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createAdminApi = () => {
	const phaseApi = createBaseApi(URLS.backendPhases);
	return {
		getPhases: () => phaseApi.get(`/get`).then(res => res.data),
	};
};

const adminApi = createAdminApi();

export default adminApi;
