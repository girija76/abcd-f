import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const reportAPI = () => {
	const reportBaseUrl = `${apiBaseUrl}/users`;
	const api = createBaseApi(reportBaseUrl);

	return {
		getCsvReport: userId =>
			api.get('/get-reports', { params: { user: userId } }).then(res => res.data),
	};
};

const reportApi = reportAPI();

export default reportApi;
