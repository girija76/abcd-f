import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createApi = () => {
	const baseURL = URLS.backendUserAccount;
	const apiInstance = createBaseApi(baseURL);
	return {
		switchUser: userId =>
			apiInstance.post('/switch-user', { userId }).then(res => res.data),
	};
};

export default createApi;
