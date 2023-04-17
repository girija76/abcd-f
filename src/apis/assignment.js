import { apiBaseUrl } from 'utils/config';
import { createBaseApi } from './base';

const createAssignmentAPI = () => {
	const assignmentBaseUrl = `${apiBaseUrl}/assignment`;
	const api = createBaseApi(assignmentBaseUrl);
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		createAssignment: body =>
			api.post('/admin/createAssignment', body).then(res => res.data),
		getAdminUploadPolicy: (mime, fileName) =>
			api.post('/admin/uploadPolicy', { mime, fileName }).then(res => res.data),
		getUploadPolicy: (mime, fileName) =>
			new Promise((resolve, reject) => {
				fetch(`${assignmentBaseUrl}/public/uploadPolicy`, {
					method: 'POST',
					headers,
					credentials: 'include',
					body: JSON.stringify({ mime, fileName }),
				})
					.then(res => {
						if (res.ok) {
							res
								.json()
								.then(body => {
									resolve(body);
								})
								.catch(reject);
						} else {
							reject();
						}
					})
					.catch(reject);
			}),
		getMySubmissions: () =>
			api.get('/public/my-submissions').then(res => res.data),
		getSubmissionsOfAssignment: assignmentId =>
			new Promise((resolve, reject) => {
				fetch(`${assignmentBaseUrl}/public/get?assignment=${assignmentId}`, {
					method: 'GET',
					headers,
					credentials: 'include',
				})
					.then(res => {
						if (res.ok) {
							res
								.json()
								.then(body => {
									resolve(body);
								})
								.catch(reject);
						} else {
							reject();
						}
					})
					.catch(reject);
			}),
		listAdminAssignments: ({ skip, limit, q }) =>
			api
				.get('/admin/listAssignments', { params: { skip, limit, q } })
				.then(res => res.data),
		submitAssignment: (assignmentId, files) =>
			new Promise((resolve, reject) => {
				fetch(`${assignmentBaseUrl}/public/submit`, {
					method: 'POST',
					headers,
					credentials: 'include',
					body: JSON.stringify({ assignmentId, files }),
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
		updateAssignment: body =>
			api.patch('/admin/updateAssignment', body).then(res => res.data),

		getAssignmentList: ({ skip, limit, id }) =>
			api
				.get('/admin/listAssignments', {
					params: {
						skip,
						limit,
						_id: id,
					},
				})
				.then(res => res.data),

		getSubmissions: ({ id }) =>
			api
				.get('/admin/submissions', {
					params: {
						id: id,
					},
				})
				.then(res => res.data.items),

		updateGrades: (assignmentId, submissionId, grades) =>
			api
				.post('/admin/submission/setGrades', { assignmentId, submissionId, grades })
				.then(res => res.data),

		getGradesGraphData: ({ phaseId }) =>
			api
				.get('/admin/gradesGraph', {
					params: {
						phase: phaseId,
					},
				})
				.then(res => res.data),

		getUserGrades: ({ userId }) =>
			api
				.get('/admin/userGrades', {
					params: {
						user: userId,
					},
				})
				.then(res => res.data),
	};
};

const assignmentApi = createAssignmentAPI();

export default assignmentApi;
