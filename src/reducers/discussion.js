import { createActions, handleActions } from 'redux-actions';

const initialState = {
	threadsByQuestionId: {},
	requestsByQuestionId: {},
};

export const actions = createActions({
	DISCUSSION: {
		FETCH: {
			SUCCESS: (questionId, threads, solutionRequested) => ({
				questionId,
				threads,
				solutionRequested,
			}),
		},
	},
});

const actionHandlers = new Map([
	[
		actions.discussion.fetch.success,
		(state, { payload }) => {
			const { questionId, threads, solutionRequested } = payload;
			return {
				...state,
				threadsByQuestionId: {
					...state.threadsByQuestionId,
					[questionId]: threads,
				},
				requestsByQuestionId: {
					...state.requestsByQuestionId,
					[questionId]: solutionRequested,
				},
			};
		},
	],
]);

const reducer = handleActions(actionHandlers, initialState);

export default reducer;
