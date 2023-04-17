import { useEffect, useState } from 'react';
import { URLS } from 'components/urls';

const getReports = userId => {
	return fetch(
		userId
			? `${URLS.backendUsers}/get-reports?newReport=1&user=${userId}`
			: `${URLS.backendUsers}/get-reports?newReport=1`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}
	).then(response => {
		if (response.ok) {
			return response
				.json()
				.then(responseJson => {
					return Promise.resolve(responseJson);
				})
				.catch(() => {
					return Promise.reject();
				});
		}
	});
};

const getReports2 = userId => {
	return fetch(
		userId
			? `${URLS.backendUsers}/get-reports2?newReport=1&user=${userId}`
			: `${URLS.backendUsers}/get-reports2?newReport=1`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}
	).then(response => {
		if (response.ok) {
			return response
				.json()
				.then(responseJson => {
					console.log('getReports2');
					console.log(responseJson);
					return Promise.resolve(responseJson);
				})
				.catch(() => {
					return Promise.reject();
				});
		}
	});
};

export const useLoadReport = (refreshKey, userId) => {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [sectionConfigs, setSectionConfigs] = useState([]);

	useEffect(() => {
		setIsLoading(true);
		setItems([]);
		getReports(userId)
			.then(report => {
				setIsLoading(false);
				// setReport(report);
				setItems(Array.isArray(report.items) ? report.items.reverse() : []);
				setSectionConfigs(report.sectionConfigs);
			})
			.catch(error => {
				setIsLoading(false);
			});
	}, [refreshKey]);
	return [items, isLoading, sectionConfigs];
};
