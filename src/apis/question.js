import { apiBaseUrl } from 'utils/config';

const createAPI = () => {
	const baseURL = `${apiBaseUrl}/questions`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		report: (questionId, report) =>
			fetch(`${baseURL}/report`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					qid: questionId,
					r: report.type,
					detail: report.detail,
				}),
				credentials: 'include',
			}),
	};
};

export default createAPI;
