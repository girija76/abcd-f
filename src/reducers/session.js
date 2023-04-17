import { combineActions, createActions, handleActions } from 'redux-actions';
import { mapValues, map } from 'lodash';
import { getTimeSpentInAttempt, sortQuestionAsBricks } from 'utils/session';

const initialState = {
	questionsById: {},
	sessionsById: {},
	userDataBySessionId: {},
	sessions: [],
	attemptsByQuestionId: {},
	answersByAttemptId: {},
	activeQuestionsBySessionId: {},
	metaByKey: {}, // ie. [list]: 'fetching'
};

const getCalibratedTime = (time, diff) => {
	const serverTime = new Date(time);
	return serverTime.getTime() + diff;
};

const fixAttempt = (attempt, timeDiff = 0) => {
	const attemptBeforeFixingTimeSpent = {
		...attempt,
		flow: map(attempt.flow, a => ({
			startTime: getCalibratedTime(a.startTime, timeDiff),
			endTime: getCalibratedTime(a.endTime, timeDiff),
		})),
		startTime: getCalibratedTime(attempt.startTime, timeDiff),
		endTime: attempt.endTime
			? getCalibratedTime(attempt.endTime, timeDiff)
			: attempt.endTime,
	};
	return {
		...attemptBeforeFixingTimeSpent,
		time: getTimeSpentInAttempt(attemptBeforeFixingTimeSpent),
	};
};

const fixQuestion = (question, timeDiff = 0) => {
	return {
		...question,
		// attempt: undefined,
		// ...question.attempt,
		attempt: question.attempt._id,
		question:
			typeof question.question === 'string'
				? question.question
				: question.question._id,
		concepts: question.question.concepts,
		// startTime: getCalibratedTime(question.attempt.startTime, timeDiff),
		// endTime: question.attempt.endTime
		// 	? getCalibratedTime(question.attempt.endTime, timeDiff)
		// 	: question.attempt.endTime,
	};
};
const fixSession = (session, timeDiff = 0) => {
	if (!session) {
		return session;
	}
	const fixedStartTime = getCalibratedTime(session.startTime, timeDiff);
	const fixedSession = { ...session };
	// fixedSession.config = session.config;
	// fixedSession.createdAt = session.createdAt;
	// fixedSession.filters = session.filters;
	// fixedSession.hasEnded = session.hasEnded;
	// fixedSession.note = session.note;
	fixedSession.startTime = fixedStartTime;
	// fixedSession.subtopics = session.subtopics;
	// fixedSession.updatedAt = session.updatedAt;
	// fixedSession.xpEarned = session.xpEarned;
	// fixedSession._id = session._id;
	fixedSession.questions = session.questions.map(question => {
		return fixQuestion(question, timeDiff);
	});
	return fixedSession;
};

export const actions = createActions({
	SESSION: {
		START: {
			SUCCESS: (session, question, { timeDiff }) => {
				const attempts =
					session && session.questions
						? session.questions
								.map(q => (q.attempt ? fixAttempt(q.attempt, timeDiff) : null))
								.filter(a => a !== null)
						: [];
				const questionSelectionOrder = sortQuestionAsBricks(attempts);
				return {
					session: session
						? { ...fixSession(session, timeDiff), questionSelectionOrder }
						: undefined,
					question: {
						...question,
						sessionSpecific: fixQuestion(question.sessionSpecific),
					},
					attempt: fixAttempt(question.sessionSpecific.attempt, timeDiff),
					attempts,
				};
			},
		},
		FORCE_END: (sessionId, message) => ({
			sessionId,
			message,
		}),
		SET_ACTIVE_QUESTION: (sessionId, questionId) => ({
			sessionId,
			questionId,
		}),
		UPDATE_ATTEMPTS: (attempts, { timeDiff }) => ({
			attempts: Array.isArray(attempts)
				? attempts.map(attempt => fixAttempt(attempt, timeDiff))
				: [],
		}),
		SET_ANSWER: (sessionId, questionId, answer) => ({
			sessionId,
			questionId,
			answer,
		}),
		ADD_NEW_QUESTION: {
			SUCCESS: (sessionId, question, { timeDiff, doNotSetActiveQuestion }) => ({
				sessionId,
				question: {
					core: question.core,
					sessionSpecific: fixQuestion(question.sessionSpecific, timeDiff),
				},
				attempt: fixAttempt(question.sessionSpecific.attempt, timeDiff),
				doNotSetActiveQuestion,
			}),
		},
		UPDATE_QUESTION_INFO: (sessionId, questionId, question, { timeDiff }) => ({
			sessionId,
			questionId,
			question: {
				...question,
				sessionSpecific: fixQuestion(question.sessionSpecific),
			},
			attempt: fixAttempt(question.sessionSpecific.attempt, timeDiff),
		}),
		UPDATE_SESSION_INFO: (sessionId, session) => ({ sessionId, session }),
		END: {
			SUCCESS: (sessionId, session) => ({ sessionId, session }),
		},
		NOTE: {
			UPDATE: {
				SUCCESS: (sessionId, note) => ({ sessionId, note }),
			},
		},
		QUESTION: {
			STATISTICS_PROPERTIES_CHANGE: (sessionId, questionId, properties) => ({
				sessionId,
				questionId,
				properties,
			}),
		},
		ADD_QUESTION_TO_TO_ATTEMPT_LIST: (questionId, sessionId) => ({
			sessionId,
			questionId,
			primaryListKey: 'toAttemptList',
			secondaryListKey: 'notToAttemptList',
		}),
		REMOVE_QUESTION_FROM_TO_ATTEMPT_LIST: (questionId, sessionId) => ({
			sessionId,
			questionId,
			listKey: 'toAttemptList',
		}),
		ADD_QUESTION_TO_NOT_TO_ATTEMPT_LIST: (questionId, sessionId) => ({
			sessionId,
			questionId,
			primaryListKey: 'notToAttemptList',
			secondaryListKey: 'toAttemptList',
		}),
		REMOVE_QUESTION_FROM_NOT_TO_ATTEMPT_LIST: (questionId, sessionId) => ({
			sessionId,
			questionId,
			listKey: 'notToAttemptList',
		}),
		FREEZE_TO_ATTEMPT_LIST: (
			sessionId,
			selectedQuestionsToAttempt,
			selectedQuestionsNotToAttempt
		) => ({
			sessionId,
			selectedQuestionsToAttempt,
			selectedQuestionsNotToAttempt,
		}),
	},
	SESSIONS: {
		SET_META_FOR_KEY: (key, value) => ({ key, value }),
		FETCH: {
			SUCCESS: items => ({ items }),
		},
	},
});

const actionHandlers = new Map([
	[
		actions.session.end.success,
		(state, { payload }) => {
			const { sessionId, session } = payload;
			return {
				...state,
				sessionsById: {
					...state.sessionsById,
					[sessionId]: session,
				},
			};
		},
	],
	[
		actions.session.start.success,
		(state, { payload }) => {
			const { question, session, attempt, attempts } = payload;
			const sessionsById = { ...state.sessionsById };
			const userDataBySessionId = { ...state.userDataBySessionId };
			const activeQuestionsBySessionId = { ...state.activeQuestionsBySessionId };
			const attemptsByQuestionId = { ...state.attemptsByQuestionId };
			Array.isArray(attempts) &&
				attempts.forEach(a => {
					attemptsByQuestionId[a.question] = {
						...attemptsByQuestionId[a.question],
						...a,
					};
				});
			attemptsByQuestionId[question.core._id] = mapValues(attempt, (v, k) => {
				if (k === 'startTime' && !v) {
					return Date.now();
				}
				return v;
			});
			if (session) {
				sessionsById[session._id] = session;
				const questionStatisticsByQuestionId = {};
				session.questions.forEach(questionItem => {
					questionStatisticsByQuestionId[questionItem.question] = questionItem;
				});
				userDataBySessionId[session._id] = {
					activeQuestionId: question.core._id,
					questionStatisticsByQuestionId,
				};
				activeQuestionsBySessionId[session._id] = question.core._id;
			}
			return {
				...state,
				questionsById: {
					...state.questionsById,
					[question.core._id]: question.core,
				},
				sessionsById,
				userDataBySessionId,
				activeQuestionsBySessionId,
				attemptsByQuestionId,
			};
		},
	],
	[
		actions.session.forceEnd,
		(state, { payload }) => {
			const { sessionId, message } = payload;
			return {
				...state,
				sessionsById: {
					...state.sessionsById,
					[sessionId]: {
						...state.sessionsById[sessionId],
						forceEnd: true,
						forceEndMessage: message,
					},
				},
			};
		},
	],
	[
		actions.session.addNewQuestion.success,
		(state, { payload }) => {
			const { question, sessionId, attempt, doNotSetActiveQuestion } = payload;
			const sessionsById = { ...state.sessionsById };
			sessionsById[sessionId] = {
				...sessionsById[sessionId],
				questions: [...sessionsById[sessionId].questions, question.sessionSpecific],
			};
			const userDataBySessionId = { ...state.userDataBySessionId };
			userDataBySessionId[sessionId].questionStatisticsByQuestionId = {
				...userDataBySessionId[sessionId].questionStatisticsByQuestionId,
				[question.core._id]: question.sessionSpecific,
			};
			userDataBySessionId[sessionId].activeQuestionId = question.core._id;

			return {
				...state,
				userDataBySessionId,
				sessionsById,
				questionsById: {
					...state.questionsById,
					[question.core._id]: question.core,
				},
				activeQuestionsBySessionId: doNotSetActiveQuestion
					? { ...state.activeQuestionsBySessionId }
					: {
							...state.activeQuestionsBySessionId,
							[sessionId]: question.core._id,
					  },
				attemptsByQuestionId: {
					...state.attemptsByQuestionId,
					[question.core._id]: attempt,
				},
			};
		},
	],
	[
		actions.session.setAnswer,
		(state, { payload }) => {
			const { sessionId, questionId, answer } = payload;
			const userDataBySessionId = { ...state.userDataBySessionId };
			userDataBySessionId[sessionId] = {
				...userDataBySessionId[sessionId],
				questionStatisticsByQuestionId: {
					...userDataBySessionId[sessionId].questionStatisticsByQuestionId,
					[questionId]: {
						...userDataBySessionId[sessionId].questionStatisticsByQuestionId[
							questionId
						],
						answer,
					},
				},
			};
			return {
				...state,
				userDataBySessionId,
				attemptsByQuestionId: {
					...state.attemptsByQuestionId,
					[questionId]: {
						...state.attemptsByQuestionId[questionId],
						change: {
							answer,
						},
					},
				},
			};
		},
	],
	[
		actions.session.updateQuestionInfo,
		(state, { payload }) => {
			const { sessionId, question, questionId, attempt } = payload;
			const questionsById = {
				...state.questionsById,
				[questionId]: {
					...state.questionsById[questionId],
					...question.core,
				},
			};
			const userDataBySessionId = mapValues(
				state.userDataBySessionId,
				(sessionData, iterationKey) => {
					if (iterationKey === sessionId) {
						return {
							...sessionData,
							questionStatisticsByQuestionId: {
								...sessionData.questionStatisticsByQuestionId,
								[questionId]: question.sessionSpecific,
							},
						};
					}
					return sessionData;
				}
			);
			const sessionsById = mapValues(
				state.sessionsById,
				(session, iterationKey) => {
					if (sessionId === iterationKey) {
						return {
							...session,
							questions: session.questions.map(iterationItem => {
								if (iterationItem.question === questionId) {
									return question.sessionSpecific;
								}
								return iterationItem;
							}),
						};
					}
					return session;
				}
			);

			return {
				...state,
				questionsById,
				sessionsById,
				userDataBySessionId,
				attemptsByQuestionId: {
					...state.attemptsByQuestionId,
					[questionId]: attempt,
				},
			};
		},
	],
	[
		actions.session.updateSessionInfo,
		(state, { payload }) => {
			const { sessionId, session } = payload;
			return {
				...state,
				sessionsById: {
					...state.sessionsById,
					[sessionId]: {
						...state.sessionsById[sessionId],
						...session,
					},
				},
			};
		},
	],
	[
		actions.session.note.update.success,
		(state, { payload }) => {
			const { note, sessionId } = payload;
			return {
				...state,
				sessionsById: {
					...state.sessionsById,
					[sessionId]: {
						...state.sessionsById[sessionId],
						note,
					},
				},
			};
		},
	],
	[
		actions.session.question.statisticsPropertiesChange,
		(state, { payload }) => {
			const { properties, questionId } = payload;
			return {
				...state,
				attemptsByQuestionId: {
					...state.attemptsByQuestionId,
					[questionId]: {
						...state.attemptsByQuestionId[questionId],
						...properties,
					},
				},
			};
		},
	],
	[
		actions.session.setActiveQuestion,
		(state, { payload }) => {
			const { sessionId, questionId } = payload;
			const attemptsByQuestionId = state.attemptsByQuestionId;
			const session = state.sessionsById[sessionId];
			if (!session.config.prevent.reattempt && !session.hasEnded) {
				try {
					attemptsByQuestionId[questionId].startTime = Date.now();
				} catch (e) {}
			}
			return {
				...state,
				activeQuestionsBySessionId: {
					...state.activeQuestionsBySessionId,
					[sessionId]: questionId,
				},
				attemptsByQuestionId,
				userDataBySessionId: {
					...state.userDataBySessionId,
					[sessionId]: {
						...state.userDataBySessionId[sessionId],
						activeQuestionId: questionId,
					},
				},
			};
		},
	],
	[
		actions.session.updateAttempts,
		(state, { payload }) => {
			const attemptsByQuestionId = state.attemptsByQuestionId;
			try {
				payload.attempts.forEach(attempt => {
					attemptsByQuestionId[attempt.question] = {
						...attemptsByQuestionId[attempt.question],
						...attempt,
						startTime: attemptsByQuestionId[attempt.question].startTime,
					};
				});
			} catch (e) {
				console.error(e);
			}
			return {
				...state,
				attemptsByQuestionId,
			};
		},
	],
	[
		actions.sessions.fetch.success,
		(state, { payload }) => {
			const { items } = payload;
			const sessions = [...state.sessions];
			const newSessionsById = {};
			items.forEach(item => {
				if (sessions.indexOf(item._id) === -1) {
					sessions.push(item._id);
				}
				newSessionsById[item._id] = item;
			});
			const sessionsById = { ...state.sessionsById, ...newSessionsById };
			return {
				...state,
				sessions,
				sessionsById,
			};
		},
	],
	[
		actions.sessions.setMetaForKey,
		(state, { payload: { key, value } }) => ({
			...state,
			metaByKey: { ...state.metaByKey, [key]: value },
		}),
	],
	[
		combineActions(
			actions.session.addQuestionToToAttemptList,
			actions.session.addQuestionToNotToAttemptList
		),
		(
			state,
			{ payload: { sessionId, questionId, primaryListKey, secondaryListKey } }
		) => {
			/**
			 * primary list is the list in which question should be added
			 * secondary list is from which question will be removed if present
			 */
			const sessionsById = { ...state.sessionsById };
			if (!sessionsById[sessionId][primaryListKey]) {
				sessionsById[sessionId][primaryListKey] = [];
			}
			if (!sessionsById[sessionId][secondaryListKey]) {
				sessionsById[sessionId][secondaryListKey] = [];
			}
			if (sessionsById[sessionId][primaryListKey].indexOf(questionId) === -1) {
				sessionsById[sessionId] = {
					...sessionsById[sessionId],
					[primaryListKey]: [...sessionsById[sessionId][primaryListKey], questionId],
				};
			}
			if (sessionsById[sessionId][secondaryListKey].indexOf(questionId) !== -1) {
				sessionsById[sessionId][secondaryListKey] = sessionsById[sessionId][
					secondaryListKey
				].filter(q => q !== questionId);
			}
			return {
				...state,
				sessionsById,
			};
		},
	],
	[
		combineActions(
			actions.session.removeQuestionFromToAttemptList,
			actions.session.removeQuestionFromNotToAttemptList
		),
		(state, { payload: { sessionId, questionId, listKey } }) => {
			const sessionsById = { ...state.sessionsById };
			if (!sessionsById[sessionId][listKey]) {
				sessionsById[sessionId][listKey] = [];
			}
			if (sessionsById[sessionId][listKey].indexOf(questionId) !== -1) {
				sessionsById[sessionId][listKey] = sessionsById[sessionId][listKey].filter(
					q => q !== questionId
				);
			}
			return {
				...state,
				sessionsById,
			};
		},
	],
	[
		actions.session.freezeToAttemptList,
		(
			state,
			{
				payload: {
					sessionId,
					selectedQuestionsToAttempt,
					selectedQuestionsNotToAttempt,
				},
			}
		) => {
			return {
				...state,
				sessionsById: {
					...state.sessionsById,
					[sessionId]: {
						...state.sessionsById[sessionId],
						selectedQuestionsToAttempt,
						selectedQuestionsNotToAttempt,
					},
				},
				isToAttemptListFreezed: true,
			};
		},
	],
]);

const reducer = handleActions(actionHandlers, initialState);

export default reducer;
