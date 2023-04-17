import { URLS } from 'components/urls';

const customFetch = (url, options) => {
	const query = options.query;
	let finalUrl = url;
	if (query && Object.keys(query).length > 0) {
		if (finalUrl.indexOf('?') === -1) {
			finalUrl += '?';
		}
		Object.keys(query).forEach(key => {
			if (
				!(
					finalUrl[finalUrl.length - 1] === '&' ||
					finalUrl[finalUrl.length - 1] === '?'
				)
			) {
				finalUrl += '&';
			}
			finalUrl += `${key}=`;
			finalUrl += encodeURIComponent(query[key]);
		});
	}
	return fetch(finalUrl, {
		credentials: 'include',
		...options,
	});
};

const createAPI = () => {
	const baseURL = `${URLS.backendUsers}`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		getBuckets: () =>
			new Promise((resolve, _reject) => {
				const reject = error => {
					_reject(error || new Error('Unable to fetch bookmarks'));
				};
				customFetch(`${baseURL}/buckets`, {
					method: 'POST',
					headers,
				})
					.then(res => {
						if (res.ok) {
							res.json().then(body => {
								if (body.success) {
									resolve(body);
								} else {
									reject();
								}
							});
						} else {
							reject();
						}
					})
					.catch(() => {
						reject(new Error('Network Error'));
					});
			}),
		createBucket: data =>
			new Promise((resolve, _reject) => {
				const reject = error => {
					_reject(error || new Error('Unable to create bookmark'));
				};
				customFetch(`${URLS.backendBucket}/add`, {
					method: 'POST',
					headers,
					credentials: 'include',
					body: JSON.stringify(data),
				})
					.then(res => {
						if (res.ok) {
							res
								.json()
								.then(body => {
									if (body.success) {
										resolve(body);
									} else {
										reject(new Error(body.message));
									}
								})
								.catch(() => reject());
						} else {
							res
								.json()
								.then(body => {
									reject(new Error(body.message));
								})
								.catch(() => reject());
						}
					})
					.catch(() => {
						reject(new Error('Network Error'));
					});
			}),
	};
};

export default createAPI;
