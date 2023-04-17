import { get } from 'lodash';

export function isNetworkError(err) {
	return !!err.isAxiosError && !err.response;
}

export function getErrorResponse(error, defaultResponse) {
	try {
		return error.response.data || defaultResponse;
	} catch (e) {
		return null || defaultResponse;
	}
}

export function getErrorMessage(
	error,
	defaultResponse = { message: 'Some error occurred' }
) {
	return get(getErrorResponse(error, defaultResponse), 'message');
}
