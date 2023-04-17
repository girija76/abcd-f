import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const createSystemReportApi = () => {
	const unauthorizedBaseApi = createBaseApi(`${apiBaseUrl}/unauthorized`);
	return {
		submitReport: ({ message, type, description }) =>
			unauthorizedBaseApi
				.post('/submit-system-report', { message, type, description })
				.then(res => res.data),
	};
};

const systemReportApi = createSystemReportApi();
export default systemReportApi;
