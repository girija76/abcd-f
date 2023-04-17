import React from 'react';
import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import './index.css';
import Main from './Main';
import store from './store';
import { register, unregister } from './serviceWorker';
import { addDownloaderDetectListener } from 'utils/detector';
import { logout } from 'utils/user';
import { enableDetector } from 'utils/config';
import systemReportApi from 'apis/systemReport';

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn:
			'https://5e4c40ce65554458b87c5d03e1ec2770@o386636.ingest.sentry.io/5221159',
	});
}

const render = Component => {
	const rootElement = document.getElementById('root');
	const renderedComponent = (
		<Provider store={store}>
			<Router>
				<Component />
			</Router>
		</Provider>
	);
	if (rootElement.hasChildNodes()) {
		return ReactDOM.hydrate(renderedComponent, rootElement);
	}
	return ReactDOM.render(renderedComponent, rootElement);
};

render(Main);

if (module.hot) {
	module.hot.accept('./Main', () => {
		const NextMain = require('./Main').default;
		render(NextMain);
	});
}

const { pwa } = window.config;
const workboxConfig = {
	onUpdate: registration => {
		const waitingServiceWorker = registration.waiting;
		console.log('onUpdate called from service worker');

		if (waitingServiceWorker) {
			try {
				if (
					Date.now() - parseInt(window.sessionStorage.swLastUpdatedOn, 10) <
					60000
				) {
					console.log(
						'service worker was update ',
						(Date.now() - parseInt(window.sessionStorage.swLastUpdatedOn, 10)) / 1000,
						'seconds ago, so not calling SKIP_WAITING'
					);
					return;
				}
			} catch (e) {}
			console.log('adding statechange listener');
			waitingServiceWorker.addEventListener('statechange', event => {
				console.log(
					'service worker state changed to: ',
					event && event.target && event.target.state
				);
				if (event.target.state === 'activated') {
					window.sessionStorage.swLastUpdatedOn = Date.now();
					window.location.reload();
				}
			});
			waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
		} else {
			console.log('no waiting service worker');
		}
	},
	onSuccess: (...args) => {
		console.log('onSuccess called by service worker');
	},
};

if (pwa) {
	console.log('registering service worker');
	register(workboxConfig);
} else {
	console.log('removing service worker');
	unregister();
}

function onDownloaderDetection(downloaderId) {
	systemReportApi.submitReport({
		type: 'downloader-detected',
		message: `downloader detected: ${downloaderId}`,
	});
	setTimeout(() => {
		logout('about:blank');
		document.documentElement.innerHTML = '';
		// window.location.replace('about:blank');
	}, 500);
}

if (enableDetector) {
	addDownloaderDetectListener(onDownloaderDetection);
}
