import { clone, forEach, last, some } from 'lodash';
import playlistApi from 'apis/playlist';
import { isDev } from 'utils/config';

const defaultSyncInterval = isDev ? (1 / 2) * 60 * 1000 : 5 * 60 * 1000;
const baseDebugURI = 'utils:learning_center:VideoTracker';

const ActionTypes = {
	BUFFERING: 'BUFFERING',
	PLAY: 'PLAY',
	PAUSE: 'PAUSE',
	STOP: 'STOP',
	SENDING_DATA: 'SENDING_DATA',
	JOIN_LIVE: 'JOIN_LIVE',
};

class Action {
	constructor(at, type) {
		this.at = at;
		this.type = type;
	}
}

class VideoTracker {
	getDebug = key => {
		this.debuggersByKey = {};
		if (!this.debuggersByKey[key]) {
			this.debuggersByKey[key] = (...args) => {
				if (process.env.NODE_ENV === 'development' && false) {
					console.log(`${baseDebugURI}:${key} ${this.id}`, ...args);
				}
			};
		}
		const deb = this.debuggersByKey[key];
		return deb;
	};
	constructor(videoId, playlistItemId, playlistId, syncInterval) {
		const debug = this.getDebug('constructor');
		debug('constructor called');
		this.id = Math.round(Math.random() * 1000);
		this.videoId = videoId;
		this.playlistItemId = playlistItemId;
		this.playlistId = playlistId;
		this.syncInterval = syncInterval ? syncInterval : defaultSyncInterval;
		this.actions = [];
		this.sendFailCount = 0;
		this.sendFailedAt = -1;
		this.isSending = false;
		this.setHandler();
		this.api = playlistApi;
	}
	handler = () => {
		this.sendIfHasEnoughData();
	};
	setHandler = () => {
		this.removeHandler();
		this.timeoutId = setTimeout(this.handler, 1000);
	};
	removeHandler = () => {
		clearTimeout(this.timeoutId);
	};
	/**
	 * @param {number} [syncInterval] - use it instead of `this.syncInterval` for this call only
	 * @returns
	 */
	sendIfHasEnoughData = syncInterval => {
		const preferredSyncInterval =
			typeof syncInterval === 'number' && !Number.isNaN(syncInterval)
				? syncInterval
				: this.syncInterval;
		const debug = this.getDebug('sendIfHasEnoughData');
		debug('called');
		this.setHandler();
		const duration = calculatePlayDuration(this.actions);
		debug('play duration', duration);
		const didJoinLive = findDidJoinLive(this.actions);
		if (didJoinLive) {
			debug('did join live', didJoinLive);
		}
		const timeSpentAfterLastFail = Date.now() - this.sendFailedAt;
		if (this.sendFailCount >= 0 && this.sendFailCount <= 6) {
			if (timeSpentAfterLastFail < 10000 * this.sendFailCount) {
				/**
				 * after 10, 20, 30, 40, 50 and then 60 seconds respectively. So a total spread across three and a minute
				 */
				return;
			}
		} else {
			if (timeSpentAfterLastFail < 60000) {
				return;
			}
		}
		if (duration > preferredSyncInterval || didJoinLive) {
			debug('duration is greater than syncInterval, calling send');
			this.send();
		}
	};

	onBuffering = () => {
		const debug = this.getDebug('onBuffering');
		debug('called');
		const now = Date.now();
		this.actions.push(new Action(now, ActionTypes.BUFFERING));
	};
	onPlaying = () => {
		const debug = this.getDebug('onPlaying');
		debug('called');
		const now = Date.now();
		this.actions.push(new Action(now, ActionTypes.PLAY));
	};
	onStopped = (lastPosition, videoDuration) => {
		const debug = this.getDebug('onStopped');
		debug('called');
		const now = Date.now();
		this.actions.push(new Action(now, ActionTypes.STOP));
		this.send(lastPosition, videoDuration);
	};
	onPaused = () => {
		const debug = this.getDebug('onPaused');
		debug('called');
		const now = Date.now();
		this.actions.push(new Action(now, ActionTypes.PAUSE));
		this.sendIfHasEnoughData(this.syncInterval / 2);
	};
	onExit = (lastPosition, videoDuration) => {
		const debug = this.getDebug('onExit');
		debug('called');
		this.onStopped(lastPosition, videoDuration);
		this.removeHandler();
	};
	onJoinLive = () => {
		const now = Date.now();
		const debug = this.getDebug('onJoinLive');
		debug('called');
		this.actions.push(new Action(now, ActionTypes.JOIN_LIVE));
	};
	send = (lastPosition, videoDuration) => {
		const debug = this.getDebug('send');
		debug('called', this.actions);
		if (this.isSending) {
			debug('is already sending');
			return;
		}
		console.log('sending now');
		const duration = calculatePlayDuration(this.actions);
		const didJoinLive = findDidJoinLive(this.actions);
		const sendingDataAction = new Action(Date.now(), ActionTypes.SENDING_DATA);
		const lastAction = last(this.actions);
		this.actions.push(sendingDataAction);
		if (lastAction.type !== ActionTypes.JOIN_LIVE) {
			const dummyAction = new Action(sendingDataAction.at, lastAction.type);
			this.actions.push(dummyAction);
		}
		this.isSending = true;
		const mergedActions = [];
		if (didJoinLive) {
			mergedActions.push({ action: 'joinLive' });
		}
		if (!(didJoinLive && duration === 0)) {
			mergedActions.push({
				action: 'watch',
				duration,
				lastPosition: Math.round(lastPosition) - 1 || 0,
				progress: Math.round((lastPosition * 100) / videoDuration) || 0,
			});
		}
		this.api
			.trackVideo(this.videoId, mergedActions)
			.then(() => {
				this.afterSend(true);
			})
			.catch(() => {
				this.afterSend(false);
			});
	};
	afterSend = isSuccessful => {
		const debug = this.getDebug('afterSend');
		if (!isSuccessful) {
			debug('calling remove SENDING_DATA');
			this.removeAction(ActionTypes.SENDING_DATA);
			this.sendFailedAt = Date.now();
			this.sendFailCount += 1;
		} else {
			debug('calling remove all before SENDING_DATA');
			this.deleteFromStartTill(ActionTypes.SENDING_DATA);
			this.sendFailCount = 0;
		}
		this.isSending = false;
	};
	removeAction = type => {
		let indexToDelete = -1;
		forEach(this.actions, (action, index) => {
			if (action.type === type) {
				indexToDelete = index;
			}
		});
		if (
			this.actions.length > 0 &&
			indexToDelete > -1 &&
			indexToDelete < this.actions.length
		) {
			this.actions.splice(indexToDelete, 1);
		}
	};
	deleteFromStartTill = type => {
		const debug = this.getDebug('deleteFromStartTill');
		let isDeleted = false;
		debug('before delete');
		debug(clone(this.actions), this.actions.length);
		while (!isDeleted) {
			if (this.actions.length > 0) {
				if (this.actions[0].type === type) {
					isDeleted = true;
				}
				try {
					this.actions.splice(0, 1);
				} catch (e) {
					debug('Failed to remove at index 0');
				}
			} else {
				isDeleted = true;
			}
		}
		debug('after delete');
		debug(clone(this.actions));
	};
}

const calculatePlayDuration = actions => {
	var duration = 0;
	var lastPlayAction = null;
	forEach(actions, it => {
		switch (it.type) {
			case ActionTypes.PLAY:
				if (lastPlayAction == null) {
					lastPlayAction = it;
				}
				break;
			case ActionTypes.PAUSE:
			case ActionTypes.BUFFERING:
			case ActionTypes.STOP:
				const prevPlayAction = lastPlayAction;
				if (prevPlayAction != null) {
					duration += it.at - prevPlayAction.at;
					lastPlayAction = null;
				}
				break;
			default:
				break;
		}
	});
	const prevPlayAction = lastPlayAction;
	if (prevPlayAction != null) {
		duration += Date.now() - prevPlayAction.at;
	}
	return duration;
};

const findDidJoinLive = actions =>
	some(actions, action => action.type === ActionTypes.JOIN_LIVE);

export default VideoTracker;
