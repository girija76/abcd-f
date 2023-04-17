import { useRef, useEffect } from 'react';
import message from 'antd/es/message';

const NetworkStatus = () => {
	const removeErrorMessage = useRef(null);
	const removeSuccessMessage = useRef(null);
	const onOffline = () => {
		if (typeof removeSuccessMessage.current === 'function') {
			removeSuccessMessage.current();
			removeSuccessMessage.current = null;
		}
		if (!removeErrorMessage.current) {
			removeErrorMessage.current = message.error({
				content:
					'You are offline. Some functionalities might not work as expected.',
				duration: 0,
			});
		}
	};
	const onOnline = () => {
		if (typeof removeErrorMessage.current === 'function') {
			removeErrorMessage.current();
			removeErrorMessage.current = null;
		}
		if (!removeSuccessMessage.current) {
			removeSuccessMessage.current = message.success('You are online now.', 3);
		}
	};
	useEffect(() => {
		window.addEventListener('offline', onOffline);
		window.addEventListener('online', onOnline);
		if (!window.navigator.onLine) {
			onOffline();
		}
		return () => {
			window.removeEventListener('offline', onOffline);
			window.removeEventListener('online', onOnline);
			try {
				removeErrorMessage.current();
			} catch (e) {}
			try {
				removeSuccessMessage.current();
			} catch (e) {}
		};
	}, []);
	return null;
};

export default NetworkStatus;
