import { URLS } from '../components/urls';
export const getImagePolicy = file => {
	const token = localStorage.getItem('token');
	return fetch(
		URLS.backendQuestions + '/get-question-image-upload-policy?name=' + file.name,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Token ' + token,
			},
			credentials: 'include',
		}
	).then(res => {
		if (res.ok) {
			return res.json();
		} else {
			throw Error('Error occurred');
		}
	});
};
