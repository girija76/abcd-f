import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createApi = () => {
	const baseURL = URLS.backendAdminPermissions;
	const apiInstance = createBaseApi(baseURL);
	return {
		create: (grantedTo, grantedToModel, grantedOn, grantedOnModel) =>
			apiInstance
				.post('/create', { grantedOn, grantedOnModel, grantedTo, grantedToModel })
				.then(res => res.data),
		listPermissions: (phaseId, { q, skip, limit, phases, select }) =>
			apiInstance
				.get(`/list/${phaseId}`, { params: { skip, limit, q, phases, select } })
				.then(res => res.data),
	};
};

const adminPermissionsApi = createApi();
export default adminPermissionsApi;
