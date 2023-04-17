import { useEffect, useState } from 'react';
function getSize() {
	const isClient = typeof window === 'object';

	return {
		width: isClient ? window.innerWidth : undefined,
		height: isClient ? window.innerHeight : undefined,
	};
}
export function useWindowSize() {
	const isClient = typeof window === 'object';

	const [windowSize, setWindowSize] = useState(getSize);

	useEffect(() => {
		if (!isClient) {
			return false;
		}

		function handleResize() {
			setWindowSize(getSize());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isClient]);

	return windowSize;
}
