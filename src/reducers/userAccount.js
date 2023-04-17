import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const actions = createActions({
	UPDATE_USER_ACCOUNT: userAccount => ({
		...userAccount,
		fetchedAt: Date.now(),
	}),
});

const actionHandlers = new Map([
	[
		actions.updateUserAccount,
		(state, { payload }) => {
			return { ...state, ...payload };
		},
	],
]);

const reducer = handleActions(actionHandlers, initialState);

export default reducer;
