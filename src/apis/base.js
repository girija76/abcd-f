import axios from 'axios';
import Qs from 'qs';

const defaultOptions = {
	withCredentials: true,
	useQs: false,
};

export const createBaseApi = (baseURL, options = defaultOptions) => {
	const mergedOptions = { ...defaultOptions, ...options };
	const { withCredentials, useQs } = mergedOptions;
	const headers = {};
	const otherConfigs = {};
	if (useQs) {
		otherConfigs.paramsSerializer = function(params) {
			return Qs.stringify(params, {
				arrayFormat: 'brackets',
			});
		};
	}
	const instance = axios.create({
		baseURL,
		headers,
		withCredentials,
		...otherConfigs,
	});
	return instance;
};
