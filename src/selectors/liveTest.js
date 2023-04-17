import { get } from 'lodash';

const root = state => get(state, ['liveTest']);

const selectKey = (state, key, defaultValue) =>
	get(root(state), key, defaultValue);

export const lastSyncedAt = state => selectKey(state, 'lastSyncedAt');

export const syncFailCount = state => selectKey(state, 'syncFailCount');

export const lastSyncFailedAt = state => selectKey(state, 'lastSyncFailedAt');

export const syncStartedAt = state => selectKey(state, 'syncStartedAt');

export const isSyncing = state => selectKey(state, 'isSyncing');

export const isSyncRequested = state => selectKey(state, 'isSyncRequested');

export const lastSyncRequestedAt = state =>
	selectKey(state, 'lastSyncRequestedAt');

export const syncRequestQueue = state => selectKey(state, 'syncRequestQueue');

export const lasySyncedCriticalInfoString = state =>
	selectKey(state, 'lasySyncedCriticalInfoString');
