import createAPI from 'apis/question';

const api = createAPI();

export const report = (questionId, report) => dispatch =>
	new Promise((resolve, reject) => {
		api.report(questionId, report).then(response => {
			response
				.json()
				.then(body => {
					if (response.ok) {
						resolve(body);
					} else {
						reject(body);
					}
				})
				.catch(reject);
		});
	});
