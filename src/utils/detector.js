function detectDownloader() {
	const html = document.documentElement.innerHTML;
	try {
		// eslint-disable-next-line no-useless-concat
		const isInsiderIDM = html.indexOf('injec' + 't_' + 'idm') > -1;
		if (isInsiderIDM) {
			return 'idm';
		}
	} catch (e) {
		console.error(e);
	}
}

const downloaderDetectListeners = [];
let isDownloaderDetected = false;
let detectedDownloader = null;
let timesTried = 0;
const maxTryLimit = 20;

function notifyDownloaderListenersIfDetected() {
	if (isDownloaderDetected) {
		downloaderDetectListeners.forEach(fn => {
			if (fn) {
				fn(detectedDownloader);
			}
		});
	}
}

function detectAndNotify() {
	const downloaderId = detectDownloader();
	timesTried += 1;
	if (downloaderId) {
		isDownloaderDetected = true;
		detectedDownloader = downloaderId;
		notifyDownloaderListenersIfDetected();
	}
}
detectAndNotify();

setTimeout(() => {
	detectAndNotify();
}, 500);
const intervalId = setInterval(() => {
	if (timesTried < maxTryLimit && !isDownloaderDetected) {
		detectAndNotify();
	} else {
		clearChecked();
	}
}, 3000);

function clearChecked() {
	clearInterval(intervalId);
}

export function addDownloaderDetectListener(fn) {
	downloaderDetectListeners.push(fn);
	notifyDownloaderListenersIfDetected();
}
