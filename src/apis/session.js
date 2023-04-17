import { apiBaseUrl } from 'utils/config';

const customFetch = (url, options) =>
	fetch(url, { credentials: 'include', ...options });

const createAPI = () => {
	const baseURL = `${apiBaseUrl}/session`;
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return {
		get: sessionId => customFetch(`${baseURL}?si=${sessionId}`, { headers }),
		// start a new session
		start: data =>
			customFetch(`${baseURL}/new?si=1`, {
				method: 'POST',
				headers,
				body: JSON.stringify(data),
			}),
		getQuestionAtPosition: ({ sessionId, position, isSessionInfoRequired }) =>
			customFetch(
				`${baseURL}/getQuestionAtPosition?position=${position}&id=${sessionId}&si=${
					isSessionInfoRequired ? '1' : '0'
				}`,
				{ headers }
			),
		setQuestionSelectionForSession: (
			sessionId,
			selectedQuestionsToAttempt,
			selectedQuestionsNotToAttempt
		) =>
			customFetch(`${baseURL}/setQuestionSelectionForSession?id=${sessionId}`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					selectedQuestionsToAttempt,
					selectedQuestionsNotToAttempt,
				}),
			}),
		saveAnswer: (sessionId, questionId, answer) =>
			customFetch(`${baseURL}/save_answer?id=${sessionId}`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ questionId, answer }),
			}),
		submitAnswer: (sessionId, questionId, answer) =>
			customFetch(`${baseURL}/answer?id=${sessionId}`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ questionId, answer }),
			}),
		getNewQuestion: sessionId =>
			customFetch(`${baseURL}/newQuestion?id=${sessionId}`, { headers }),
		setActiveQuestion: (sessionId, questionId) =>
			customFetch(`${baseURL}/set_active_question?id=${sessionId}`, {
				headers,
				method: 'PATCH',
				body: JSON.stringify({ questionId }),
			}),
		end: sessionId =>
			customFetch(`${baseURL}/end?id=${sessionId}`, { method: 'POST', headers }),
		endSessionWithReattempt: sessionId =>
			customFetch(`${baseURL}/endSessionWithReattempt?id=${sessionId}`, {
				method: 'POST',
				headers,
			}),
		endAllActive: () =>
			customFetch(`${baseURL}/endAllActive`, { method: 'POST', headers }),
		updateNote: (sessionId, data) =>
			customFetch(`${baseURL}/note?id=${sessionId}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ data }),
			}),
		addBookmark: (sessionId, questionId) =>
			customFetch(`${baseURL}/bookmark?id=${sessionId}`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ questionId }),
			}),
		removeBookmark: (sessionId, questionId) =>
			customFetch(`${baseURL}/bookmark?id=${sessionId}`, {
				method: 'DELETE',
				headers,
				body: JSON.stringify({ questionId }),
			}),
		list: () => customFetch(`${baseURL}/list`, { headers }),
	};
};

export default createAPI;
