import { createActions, handleActions } from 'redux-actions';

const initialState = {};

export const actions = createActions({
	QUESTION: {},
});

const actionHandlers = new Map([[]]);

const reducer = handleActions(actionHandlers, initialState);

export default reducer;
