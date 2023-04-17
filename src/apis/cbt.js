import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createCbtApi = () => {
	const cbtBaseApi = createBaseApi(URLS.backendAssessment);
	return {
		getAssessmentWrappers: async () =>
			(await cbtBaseApi.get('/public/list')).data,
	};
};

const cbtApi = createCbtApi();
export default cbtApi;
