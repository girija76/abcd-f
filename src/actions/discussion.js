import { actions } from 'reducers/discussion';
import createAPI from 'apis/discussion';

const api = createAPI();

export const setThreads = actions.discussion.fetch.success;

export const get = questionId => dispatch =>
	new Promise((resolve, reject) => {
		api.get(questionId).then(response => {
			response
				.json()
				.then(body => {
					if (response.ok) {
						resolve(body);
						dispatch(setThreads(questionId, body.threads, body.solutionRequested));
					} else {
						reject(body);
					}
				})
				.catch(reject);
		});
	});
