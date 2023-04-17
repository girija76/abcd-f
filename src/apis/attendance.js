import { URLS } from 'components/urls';
import { createBaseApi } from './base';

const createApi = () => {
	const baseURL = URLS.backendAttendance;
	const apiInstance = createBaseApi(baseURL);
	const scheduledApiInstance = createBaseApi(
		`${URLS.backendAttendance}/scheduled-lecture`
	);
	return {
		createLecture: ({ subject, phase, label, date }) =>
			apiInstance
				.post('/lecture', { subject, phase, label, date })
				.then(res => res.data),
		getAllStatusList: () => apiInstance.get('/status/list').then(res => res.data),
		getLectureAttendanceSheet: ({ lecture }) =>
			apiInstance.get('/sheet', { params: { lecture } }).then(res => res.data),
		getLectureStats: ({ phase, subject, limit, skip }) =>
			apiInstance
				.get('/lecture-stats', {
					params: {
						phase,
						subject,
						limit,
						skip,
					},
				})
				.then(res => res.data),
		markAttendance: ({ lecture, status, user }) =>
			apiInstance.post('/mark', { lecture, status, user }).then(res => res.data),
		createScheduledLecture: async ({
			phases,
			subject,
			label,
			lecturer,
			startTime,
			endTime,
		}) =>
			(
				await scheduledApiInstance.post(`/create`, {
					phases,
					subject,
					label,
					lecturer,
					startTime,
					endTime,
				})
			).data,
		getScheduledLecture: async _id =>
			(await scheduledApiInstance.get(`/get/${_id}`)).data,
		updateScheduledLecture: async (
			_id,
			{ phases, subject, label, lecturer, startTime, endTime }
		) =>
			(
				await scheduledApiInstance.patch(`/update/${_id}`, {
					phases,
					subject,
					label,
					lecturer,
					startTime,
					endTime,
				})
			).data,
		copyScheduledLectures: async ({
			fromTime,
			tillTime,
			fromPhases,
			forSubjects,
			usePreviousPhases,
			phasesToSet,
			addDuration,
			durationUnit,
		}) =>
			(
				await scheduledApiInstance.post(`/copy`, {
					fromTime,
					tillTime,
					fromPhases,
					forSubjects,
					usePreviousPhases,
					phasesToSet,
					addDuration,
					durationUnit,
				})
			).data,
		listScheduledLectures: async ({ phases, subjects }) =>
			(await scheduledApiInstance.get('/list', { params: { phases, subjects } }))
				.data,
		listScheduledLecturesByLecturer: async lecturer =>
			(
				await scheduledApiInstance.get('/list-by-lecturer', {
					params: { lecturer },
				})
			).data,
		getUserAttendance: userId =>
			apiInstance.get(`/for-user/${userId}`).then(res => res.data),

		getAttendanceGraphData: ({ phase, user, subject, from, sort }) =>
			apiInstance.get('/graph', {
				params: { phase, user, subject, from, sort },
			}),
	};
};

const attendanceApi = createApi();
export default attendanceApi;
