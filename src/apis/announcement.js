import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createAnnouncementApi = () => {
	const announcementBaseApi = createBaseApi(URLS.backendAnnouncements);
	const adminAnnouncementBaseApi = createBaseApi(URLS.backendAnnouncementsAdmin);
	return {
		getAnnouncements: (phase, skip, limit) =>
			announcementBaseApi
				.get(`/of-phase/${phase}/${skip}/${limit}`)
				.then(res => res.data),
		getAnnouncement: announcementId =>
			announcementBaseApi.get(`/item/${announcementId}`).then(res => res.data),
		postAnnouncement: data =>
			adminAnnouncementBaseApi.post('/create', data).then(res => res.data),
		getUploadPolicy: (mime, fileName) =>
			adminAnnouncementBaseApi
				.post('/file-upload-policy', { mime, fileName })
				.then(res => res.data),
	};
};

export default createAnnouncementApi;
