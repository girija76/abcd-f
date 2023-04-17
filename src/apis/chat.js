import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createChatApi = () => {
	const chatBaseApi = createBaseApi(URLS.backendMentor);
	return {
		startChat: phaseMentorId =>
			chatBaseApi
				.post('/create-group', {
					reason: phaseMentorId,
					reasonType: 'PhaseMentor',
				})
				.then(res => res.data),
		getGroups: () => chatBaseApi.get('/groups').then(res => res.data),
		getGroup: (groupId, after, before, limit) =>
			chatBaseApi
				.get(`/conversation/${groupId}`, {
					params: {
						after,
						before,
						limit,
					},
				})
				.then(res => res.data),
		postMessage: (groupId, data) =>
			chatBaseApi.post(`/conversation/${groupId}`, { data }),
	};
};

const chatApi = createChatApi();
export default chatApi;
