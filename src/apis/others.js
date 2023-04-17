import { URLS } from 'components/urls';
import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const createOthersAPI = () => {
	const dashboardCardBaseURL = `${apiBaseUrl}/dashboardCard`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	const coursePlanBaseApi = createBaseApi(`${apiBaseUrl}/video/course-plan`);
	const unauthorizedSubjectApi = createBaseApi(
		`${URLS.backendUnauthorized}/subject`
	);
	return {
		getCards: (key, phase) =>
			new Promise((resolve, reject) => {
				fetch(`${dashboardCardBaseURL}/${phase}`, {
					method: 'GET',
					headers,
					credentials: 'include',
				})
					.then(res => {
						if (res.ok) {
							res
								.json()
								.then(body => {
									resolve(body.items);
								})
								.catch(reject);
						} else {
							reject();
						}
					})
					.catch(reject);
			}),
		getCoursePlan: phase =>
			coursePlanBaseApi.get(`/of-phase/${phase}`).then(res => res.data),
		getAllSubjects: () =>
			unauthorizedSubjectApi.get('/list').then(res => res.data),
	};
};

export default createOthersAPI;
