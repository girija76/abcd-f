import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const queryFromSessionStorage = () => ({
	viewAs: localStorage.getItem('viewAs'),
	phases: localStorage.getItem('phases'),
});

const createAPI = () => {
	const baseApi = createBaseApi(`${apiBaseUrl}/video`, { useQs: true });
	return {
		createPlaylist: data => baseApi.post('/playlist', data),
		getPlaylists: (_i, mode, phaseId) =>
			baseApi
				.get(`/playlists/${mode === 'demo' ? `/${phaseId}` : ''}`, {
					params: queryFromSessionStorage(),
				})
				.then(res => res.data),
		getPlaylist: playlistId =>
			baseApi
				.get(`/playlist/${playlistId}`, {
					params: queryFromSessionStorage(),
				})
				.then(res => res.data.playlist),
		comment: ({ playlistId, playlistItemId, videoId, text }) =>
			baseApi.post('/comment', {
				playlistId,
				playlistItemId,
				videoId,
				text,
			}),
		getComments: (videoId, { playlistId, playlistItemId }) =>
			baseApi
				.get('/comments', {
					params: { videoId, playlistId, playlistItemId },
				})
				.then(res => res.data),
		getItemCount: (key, resourceType) =>
			baseApi
				.get('/itemCount', { params: { resourceType } })
				.then(res => res.data.count),

		videosWatched: () =>
			baseApi.get('/activity/myProgress').then(res => res.data.count),
		trackVideo: (videoId, activities) =>
			baseApi
				.get('/activity/register', { params: { videoId, activities } })
				.then(res => res.data),
		getVideoStats: ({ videoId }) =>
			baseApi.get('/getStats', { params: { videoId } }).then(res => res.data),
	};
};

const playlistApi = createAPI();

export default playlistApi;
