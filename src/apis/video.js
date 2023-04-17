import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const createVideoApi = () => {
	const videoApi = createBaseApi(`${apiBaseUrl}/video`);
	return {
		createEmbed: data => videoApi.post('/embed', data).then(res => res.data),
		updateEmbed: (videoId, data) => videoApi.patch(`/video/${videoId}`, data),
		createResourceDocument: data =>
			videoApi.post('/resources/document', data).then(res => res.data),
		addItemToPlaylist: data => videoApi.post('/playlist/items/add', data),
		removePlaylistItem: (playlistId, playlistItemId) =>
			videoApi
				.delete('/playlist/items/remove', {
					data: {
						playlistId,
						playlistItemIds: [playlistItemId],
					},
				})
				.then(res => res.data),
		getVideoStats: () =>
			videoApi
				.get('/activity/myStats', { params: { includeTags: '1', format: 'json' } })
				.then(res => res.data),
		getAssignmentSubmissionStats: phaseId =>
			videoApi.get(`/activity/assignment-submission-graph/${phaseId}`),
		getCompletedVideos: () =>
			videoApi.get('/activity/completed-videos').then(res => res.data),
		getMyScorecard: userId =>
			videoApi
				.get('/scorecard/my', { params: { user: userId } })
				.then(res => res.data),
		/**
		 * Get policy using which file can be uploaded to s3
		 */
		getResourceUploadPolicy: (mime, fileName) =>
			videoApi
				.post('/resources/document/policy', {
					fileName,
					mime,
				})
				.then(res => res.data),
		/**
		 * Load uploads for admin
		 */
		getMyUploads: ({ skip, limit, q, resourceType }) =>
			videoApi
				.get('/my/uploads', { params: { skip, limit, q, resourceType } })
				.then(res => res.data),
		getViewersOfVideo: videoId =>
			videoApi
				.get('/activity/admin/getViewersOfVideo', { params: { video: videoId } })
				.then(res => res.data),
		updatePlaylistItem: (
			playlistId,
			playlistItemId,
			{ availableFrom, availableTill }
		) =>
			videoApi
				.patch('/playlist/items/update', {
					playlistId,
					playlistItemId,
					availableFrom,
					availableTill,
				})
				.then(res => res.data),
		updateResourceDocument: data =>
			videoApi.patch('/resources/document', data).then(res => res.data),
	};
};

const videoApi = createVideoApi();

export default videoApi;
