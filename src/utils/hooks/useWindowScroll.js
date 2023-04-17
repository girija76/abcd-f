import { useState, useEffect } from 'react';
const isClient = typeof document === 'object';
function useWindowScroll() {
	const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!isClient) {
			return false;
		}

		function handleScroll(e) {
			setScrollPosition({ y: e.target.scrollTop, x: e.target.scrollLeft });
		}

		const contentRoot = document.querySelector('.dashboard-scroll-root');
		if (!contentRoot) {
			return false;
		}
		contentRoot.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return scrollPosition;
}

export const useIsWindowScrolled = () => {
	const scroll = useWindowScroll();
	const NO = false;
	const YES = true;
	return scroll.y > 0 ? YES : NO;
};

export default useWindowScroll;
