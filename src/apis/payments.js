import { URLS } from 'components/urls';
import { createBaseApi } from './base';

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

const createFetchWithBaseUrl = baseURL => (url, ...otherArgs) =>
	customFetch(`${baseURL}${url}`, ...otherArgs);

const createAPI = () => {
	const baseURL = `${URLS.backendPayments}`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	const paymentsApi = createBaseApi(baseURL);
	const fetchInstanceWithBaseAPI = createFetchWithBaseUrl(baseURL);
	return {
		getPlansOfPhase: phaseId =>
			paymentsApi.get(`/service/plan/list/${phaseId}`).then(res => res.data),
		getPlansOfUser: userId =>
			paymentsApi.get(`/service/plan/list/user/${userId}`).then(res => res.data),
		getServicePlansForPhases: phases =>
			paymentsApi
				.post('/service/plan/list/for-phases', { phases })
				.then(res => res.data),
		createOrderForCart: ({ servicePlans, couponCode, offersByServicePlanId }) =>
			new Promise((resolve, reject) => {
				fetchInstanceWithBaseAPI('/service/order/cart/create', {
					method: 'POST',
					headers,
					body: JSON.stringify({ servicePlans, couponCode, offersByServicePlanId }),
				})
					.then(res => {
						if (res.ok) {
							console.log('created cart');
							res
								.json()
								.then(body => {
									resolve(body.order);
								})
								.catch(reject);
						} else {
							console.log('failed to create cart');
							res
								.json()
								.then(body => {
									console.log('rejecting with', body);
									reject(body);
								})
								.catch(error => {
									console.log('rejecting with');
									console.error(error);
									reject(error);
								});
						}
					})
					.catch(reject);
			}),
		getDiscountedPrice: ({ couponCode, servicePlan, offer }) =>
			new Promise((resolve, reject) => {
				fetchInstanceWithBaseAPI('/service/request/coupon/check', {
					method: 'GET',
					query: { couponCode, offer, servicePlan },
					headers,
				})
					.then(res => {
						if (res.ok) {
							res
								.json()
								.then(body => {
									resolve(body);
								})
								.catch(() => reject(new Error('Unknown error occurred')));
						} else {
							res
								.json()
								.then(body => {
									reject(body);
								})
								.catch(() => reject(new Error('Unknown error occurred')));
						}
					})
					.catch(error => reject(new Error('Network error occurred')));
			}),
	};
};

export default createAPI;
