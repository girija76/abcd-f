import { createActions, handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { filter } from 'lodash';

const initialState = {
	lastSyncedAt: null,
	syncFailCount: null,
	lastSyncFailedAt: null,
	syncStartedAt: null,
	isSyncing: false,
	isSyncRequested: false,
	lastSyncRequestedAt: null,
	syncRequestQueue: [],
	lasySyncedCriticalInfoString: '',
};

export const actions = createActions({
	SET_TIME_SPENT_IN_QUESTIONS_BY_KEY: (data, key = 0) => ({
		data,
		key,
	}),
	SYNC_STARTED: () => ({ at: Date.now() }),
	SYNC_SUCCEDED: (queueItemsCleared, criticalInfoString) => ({
		at: Date.now(),
		queueItemsCleared,
		criticalInfoString,
	}),
	SYNC_FAILED: () => ({ at: Date.now() }),
	REQUEST_FLOW_SYNC: () => ({ at: Date.now() }),
});

const actionHandlers = new Map([
	[
		actions.setTimeSpentInQuestionsByKey,
		(state, { payload: { data, key } }) =>
			update(state, { [key]: { $set: data } }),
	],
	[
		actions.syncStarted,
		(state, { payload: { at } }) =>
			update(state, {
				syncStartedAt: { $set: at },
				isSyncing: { $set: true },
			}),
	],
	[
		actions.syncSucceded,
		(state, { payload: { at, queueItemsCleared, criticalInfoString } }) =>
			update(state, {
				lastSyncedAt: { $set: at },
				syncFailCount: { $set: 0 },
				lastSyncFailedAt: { $set: null },
				syncStartedAt: { $set: null },
				isSyncing: { $set: false },
				syncRequestQueue: {
					$set: filter(
						state.syncRequestQueue,
						i =>
							!Array.isArray(queueItemsCleared) || queueItemsCleared.indexOf(i) === -1
					),
				},
				isSyncRequested: { $set: false },
				lastSyncRequestedAt: { $set: null },
				lasySyncedCriticalInfoString: { $set: criticalInfoString },
			}),
	],
	[
		actions.syncFailed,
		(state, { payload: { at } }) =>
			update(state, {
				syncFailCount: {
					$set:
						(typeof state.syncFailCount === 'number' && !isNaN(state.syncFailCount)
							? state.syncFailCount
							: 0) + 1,
				},
				lastSyncFailedAt: { $set: at },
				syncStartedAt: { $set: null },
				isSyncing: { $set: false },
			}),
	],
	[
		actions.requestFlowSync,
		(state, { payload: { at } }) =>
			update(state, {
				lastSyncRequestedAt: { $set: at },
				isSyncRequested: { $set: true },
				syncRequestQueue: { $push: [at] },
			}),
	],
]);

const reducer = handleActions(actionHandlers, initialState);

export default reducer;
