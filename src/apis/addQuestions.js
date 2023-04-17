import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const addQuestionAPI = () => {
	const baseURL = `${apiBaseUrl}/questions`;
	const api = createBaseApi(baseURL);
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		uploadQuestions: (param, body) =>
			api.post(`/${param}`, body).then(res => res.data),
	};
};

const questionApi = addQuestionAPI();

export default questionApi;
