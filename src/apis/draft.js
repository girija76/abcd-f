import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const draftAPI = () => {
	const draftBaseUrl = `${apiBaseUrl}/draft`;
	const api = createBaseApi(draftBaseUrl);
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		saveDraft: body => api.post('/save', body).then(res => res.data),

		getDraft: id => api.get(`/${id}`).then(res => res.data),

		updateDraft: body => api.post(`/update`, body).then(res => res.data),

		draftList: body => api.post('/list', body).then(res => res.data),

		publishAssessment: body => api.post('/publish', body).then(res => res.data),
	};
};

const draftApi = draftAPI();

export default draftApi;
