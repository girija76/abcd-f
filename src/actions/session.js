import { notification } from 'antd';
import { actions } from 'reducers/session';
import { updateUserPracticeData } from '../components/api/ApiAction';
import createAPI from 'apis/session';
import { clearUserApiResponseCache } from 'utils/user';

const api = createAPI();

const getTimeCalibrationDiff = (localTime, serverTime) =>
	localTime - serverTime;

export const setActiveQuestion = (sessionId, questionId) => (
	dispatch,
	getState
) => {
	const state = getState();
	if (!state.session.sessionsById[sessionId].hasEnded) {
		api
			.setActiveQuestion(sessionId, questionId)
			.then(response => {
				const currentLocalTime = Date.now();
				response.json().then(body => {
					if (response.ok) {
						const serverTime = body.currentTime;
						const timeDiff = getTimeCalibrationDiff(currentLocalTime, serverTime);
						dispatch(actions.session.updateAttempts(body.attempts, { timeDiff }));
					} else {
						// TODO: handle
					}
				});
			})
			.catch(error => {
				// TODO: handle error
				console.error(error);
			});
	}
	dispatch(actions.session.setActiveQuestion(sessionId, questionId));
};

export const setAnswer = actions.session.setAnswer;

// this will handle response of type {question:..., session: ...}
const createHandleQuestionSessionResponse = (
	dispatch,
	resolve,
	reject
) => response => {
	const currentLocalTime = Date.now();
	if (response.ok) {
		response.json().then(body => {
			const serverTime = body.currentTime;
			let timeDiff = getTimeCalibrationDiff(currentLocalTime, serverTime);
			dispatch(
				actions.session.start.success(body.session, body.question, { timeDiff })
			);
			resolve(body);
		});
	} else {
		response.json().then(body => {
			reject(body);
		});
	}
};

export const start = data => dispatch =>
	new Promise((resolve, reject) => {
		api
			.start(data)
			.then(createHandleQuestionSessionResponse(dispatch, resolve, reject))
			.catch(reject);
	});

export const getQuestionAtPosition = (
	sessionId,
	position,
	isSessionInfoRequired
) => dispatch =>
	new Promise((resolve, reject) => {
		api
			.getQuestionAtPosition({ sessionId, position, isSessionInfoRequired })
			.then(createHandleQuestionSessionResponse(dispatch, resolve, reject))
			.catch(reject);
	});

export const saveAnswer = (sessionId, questionId, answer) => dispatch =>
	new Promise((resolve, reject) => {
		api
			.saveAnswer(sessionId, questionId, answer)
			.then(response => {
				const currentLocalTime = Date.now();
				response.json().then(body => {
					if (response.ok) {
						// response.ok should be before resonse.json??
						const serverTime = body.currentTime;
						const timeDiff = getTimeCalibrationDiff(currentLocalTime, serverTime);
						const { attempt } = body;
						dispatch(actions.session.updateAttempts([attempt], { timeDiff }));
						resolve(body);
					} else {
						console.error(body);
						reject(body);
					}
				});
			})
			.catch(error => {
				console.error(error);
				reject(error);
			});
	});

export const submitAnswer = (sessionId, questionId, answer) => (
	dispatch,
	getState
) =>
	new Promise((resolve, reject) => {
		api
			.submitAnswer(sessionId, questionId, answer)
			.then(response => {
				const currentLocalTime = Date.now();
				response.json().then(body => {
					if (response.ok) {
						// response.ok should be before resonse.json??
						const serverTime = body.currentTime;
						const timeDiff = getTimeCalibrationDiff(currentLocalTime, serverTime);
						dispatch(
							actions.session.updateQuestionInfo(
								sessionId,
								questionId,
								body.question,
								{ timeDiff }
							)
						);
						const state = getState();
						dispatch(
							actions.session.updateSessionInfo(sessionId, {
								xpEarned:
									state.session.sessionsById[sessionId].xpEarned +
									body.question.sessionSpecific.attempt.xpEarned,
							})
						);
						dispatch(
							updateUserPracticeData({
								xpEarned: body.xpEarned,
								streak: body.streak,
								stats: body.stats,
							})
						);
						resolve(body);
					} else {
						console.error(body);
						reject(body);
					}
				});
			})
			.catch(error => {
				console.error(error);
				reject(error);
			});
	});

export const getNewQuestion = (
	sessionId,
	doNotSetActiveQuestion = false
) => dispatch =>
	new Promise((resolve, reject) => {
		const currentLocalTime = Date.now();

		api
			.getNewQuestion(sessionId)
			.then(response => {
				response.json().then(body => {
					if (response.ok) {
						const timeCalibrationDiff = getTimeCalibrationDiff(
							currentLocalTime,
							body.currentTime
						);
						dispatch(
							actions.session.addNewQuestion.success(sessionId, body.question, {
								timeDiff: timeCalibrationDiff,
								doNotSetActiveQuestion,
							})
						);
						dispatch(
							actions.session.updateAttempts(body.attempts, {
								timeDiff: timeCalibrationDiff,
							})
						);
						resolve(body);
					} else {
						notification.info({ message: body.message });
						dispatch(actions.session.forceEnd(sessionId, body.message));
						reject(body);
					}
				});
			})
			.catch(reject);
	});

export const end = (sessionId, canReattempt) => dispatch =>
	new Promise((resolve, reject) => {
		clearUserApiResponseCache();
		api[canReattempt ? 'endSessionWithReattempt' : 'end'](sessionId)
			.then(response => {
				response.json().then(body => {
					if (response.ok) {
						const event = new Event('fetchTopics');
						window.dispatchEvent(event);
						dispatch(actions.session.end.success(sessionId, body.session));
						resolve(body);
					} else {
						reject(body);
					}
				});
			})
			.catch(error => {
				reject(error);
			});
	});

export const endAllActive = () => dispatch =>
	new Promise((resolve, reject) => {
		api
			.endAllActive()
			.then(response => {
				if (response.ok) {
					resolve();
				} else {
					reject();
				}
			})
			.catch(error => {
				reject(error);
			});
	});

export const updateNote = (sessionId, data) => dispatch =>
	new Promise((resolve, reject) => {
		api
			.updateNote(sessionId, data)
			.then(response => {
				response.json().then(body => {
					if (response.ok) {
						dispatch(
							actions.session.note.update.success(sessionId, body.session.note)
						);
						resolve(body);
					} else {
						reject(body);
					}
				});
			})
			.catch(reject);
	});

export const addBookmark = (sessionId, questionId) => dispatch =>
	new Promise((resolve, reject) => {
		api.addBookmark(sessionId, questionId).then(response => {
			response.json().then(body => {
				if (body.success) {
					dispatch(
						actions.session.question.statisticsPropertiesChange(
							sessionId,
							questionId,
							{ isBookmarked: true }
						)
					);
				}
				resolve(body);
			});
		});
	});
export const removeBookmark = (sessionId, questionId) => dispatch =>
	new Promise((resolve, reject) => {
		api.removeBookmark(sessionId, questionId).then(response => {
			response.json().then(body => {
				if (body.success) {
					dispatch(
						actions.session.question.statisticsPropertiesChange(
							sessionId,
							questionId,
							{ isBookmarked: false }
						)
					);
				}
				resolve(body);
			});
		});
	});

export const getList = (listName = 'defaultList') => (dispatch, getState) => {
	const fetchPromise = getState().session.metaByKey[listName];
	const lastFetchedAt = getState().session.metaByKey[listName + 'fetchTime'];
	if (lastFetchedAt && lastFetchedAt < Date.now() + 5 * 60 * 1000) {
		// is less than 5 minutes since data last refreshed
		return new Promise(resolve => {
			resolve();
		});
	}
	if (fetchPromise) {
		return fetchPromise;
	}
	const promise = new Promise((resolve, reject) => {
		api.list().then(response => {
			response
				.json()
				.then(body => {
					if (response.ok) {
						dispatch(actions.sessions.fetch.success(body.items));
						dispatch(actions.sessions.setMetaForKey(listName, null));
						dispatch(
							actions.sessions.setMetaForKey(listName + 'fetchTime', Date.now())
						);
						resolve(body);
					} else {
						dispatch(actions.sessions.setMetaForKey(listName, null));
						reject(body);
					}
				})
				.catch(e => {
					dispatch(actions.sessions.setMetaForKey(listName, null));
					reject(e);
				});
		});
	});
	dispatch(actions.sessions.setMetaForKey(listName, promise));
	return promise;
};

export const getSession = sessionId => dispatch =>
	new Promise((resolve, reject) => {
		api
			.get(sessionId)
			.then(response => {
				response
					.json()
					.then(body => {
						if (response.ok) {
							dispatch(actions.sessions.fetch.success([body.session]));
							resolve(body.item);
						} else {
							reject(body);
						}
					})
					.catch(reject);
			})
			.catch(reject);
	});

export const addQuestionToToAttemptList =
	actions.session.addQuestionToToAttemptList;

export const removeQuestionFromToAttemptList =
	actions.session.removeQuestionFromToAttemptList;

export const addQuestionToNotToAttemptList =
	actions.session.addQuestionToNotToAttemptList;
export const removeQuestionFromNotToAttemptList =
	actions.session.removeQuestionFromNotToAttemptList;

const addAllQuestionsToSessionToMatchTotal = sessionId => (
	dispatch,
	getState
) => {
	return new Promise((resolve, reject) => {
		const state = getState();
		const session = state.session.sessionsById[sessionId];
		const { total } = session.config.questions;
		const numberOfQuestionsInSession = session.questions.length;
		if (numberOfQuestionsInSession < total) {
			dispatch(getNewQuestion(sessionId, true))
				.then(() => {
					return dispatch(addAllQuestionsToSessionToMatchTotal(sessionId))
						.then(resolve)
						.catch(reject);
				})
				.catch(e => {
					// TODO: improve
					reject(e);
				});
		} else {
			resolve();
		}
	});
};

const createToAttemptListFromUserSelection = (
	toAttemptList,
	notToAttemptList,
	questionIds,
	shouldSelect
) => {
	const finalList = [...toAttemptList];
	const canAddToList = (qId, list, notFrom, maxSize) => {
		if (list.length >= maxSize) {
			return false;
		}
		if (list.indexOf(qId) > -1) {
			return false;
		}
		if (notFrom && notFrom.indexOf(qId) > -1) {
			return false;
		}
		return true;
	};
	questionIds.forEach(questionId => {
		if (canAddToList(questionId, finalList, notToAttemptList, shouldSelect)) {
			finalList.push(questionId);
		}
	});
	return finalList;
};

export const setQuestionSelectionForSession = sessionId => (
	dispatch,
	getState
) =>
	new Promise((resolve, reject) => {
		dispatch(addAllQuestionsToSessionToMatchTotal(sessionId))
			.then(() => {
				const state = getState();
				const session = state.session.sessionsById[sessionId];
				const { shouldSelect } = session.config.questions;
				const toAttemptList = session.toAttemptList || [];
				const notToAttemptList = session.notToAttemptList;
				const questionIds = session.questions.map(q => q.question);
				const finalToAttemptList = createToAttemptListFromUserSelection(
					toAttemptList,
					notToAttemptList,
					questionIds,
					shouldSelect
				);
				api
					.setQuestionSelectionForSession(
						sessionId,
						finalToAttemptList,
						notToAttemptList
					)
					.then(response => {
						response
							.json()
							.then(body => {
								const {
									selectedQuestionsToAttempt,
									selectedQuestionsNotToAttempt,
								} = body;
								dispatch(setActiveQuestion(sessionId, selectedQuestionsToAttempt[0]));
								dispatch(
									actions.session.freezeToAttemptList(
										sessionId,
										selectedQuestionsToAttempt,
										selectedQuestionsNotToAttempt
									)
								);
								resolve(selectedQuestionsToAttempt);
							})
							.catch(reject);
					})
					.catch(reject);
			})
			.catch(reject);
	});
