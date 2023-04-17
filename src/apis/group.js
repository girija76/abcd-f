import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createApi = () => {
	const baseURL = URLS.backendGroups;
	const apiInstance = createBaseApi(baseURL);
	return {
		getAllSuperGroupsWithAllSubgroupsOfClient: (client, superGroups) =>
			apiInstance
				.get('/getAllSuperGroupsWithAllSubgroupsOfClient', {
					params: { client, superGroups },
				})
				.then(res => res.data),
	};
};

export default createApi;
