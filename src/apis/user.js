import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createApi = () => {
	const baseURL = URLS.backendUsers;
	const apiInstance = createBaseApi(baseURL);
	return {
		signInViaClientJwt: token =>
			apiInstance
				.get('/client-jwt-signin', { params: { token } })
				.then(res => res.data),
		completeProfile: ({
			name,
			username,
			mobileNumber,
			subGroup,
			superGroup,
			phase,
			college,
		}) =>
			apiInstance.post('/completeProfile', {
				name,
				username,
				mobileNumber,
				supergroup: superGroup,
				group: subGroup,
				phase,
				college,
			}),
		listUsers: ({ q, skip, limit, phases, select }, { roles }) =>
			apiInstance
				.post('/search', { roles }, { params: { skip, limit, q, phases, select } })
				.then(res => res.data),
		updateJeeData: (userId, data) =>
			apiInstance.post(`/jeeData`, { id: userId, ...data }).then(res => res.data),
		getJeeData: userId =>
			apiInstance.get(`/jeeData?id=${userId}`).then(res => res.data),
	};
};

const userApi = createApi();
export default userApi;
