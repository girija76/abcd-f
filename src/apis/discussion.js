import { apiBaseUrl } from 'utils/config';
const createAPI = () => {
	const baseURL = `${apiBaseUrl}/discussion`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		get: questionId =>
			fetch(`${baseURL}/${questionId}`, {
				headers,
				credentials: 'include',
			}),
	};
};

export default createAPI;
