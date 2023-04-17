import React, { useCallback, useEffect, useRef, useState } from 'react';

const LazyLoadImage = ({
	src,
	visibleByDefault,
	placeholderSrc,
	threshold,
	onVisibilityChange,
	...otherProps
}) => {
	const rootRef = useRef();
	const [isVisible, setIsVisible] = useState(visibleByDefault);
	const checkIntersections = useCallback(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				setIsVisible(true);
			}
		});
	}, []);

	useEffect(() => {
		if (!isVisible) {
			setIsVisible(visibleByDefault);
		}
	}, [visibleByDefault, isVisible]);

	useEffect(() => {
		if (!isVisible) {
			const newIntersectionObserver = new IntersectionObserver(
				checkIntersections,
				{
					rootMargin: threshold + 'px',
				}
			);
			newIntersectionObserver.observe(rootRef.current);
			return () => newIntersectionObserver.disconnect();
		}
	}, [isVisible, checkIntersections, threshold]);
	useEffect(() => {
		if (isVisible) {
			onVisibilityChange && onVisibilityChange();
		}
	}, [isVisible, onVisibilityChange]);
	if (Array.isArray(src)) {
		// multiple sources
		return (
			<picture ref={rootRef}>
				{src.map(src => (
					<source
						key={`${src.url}-${isVisible ? 1 : 0}`}
						srcSet={isVisible ? src.url : placeholderSrc}
						type={src.type}
					></source>
				))}
				<img
					alt=""
					src={isVisible ? src[src.length - 1].url : placeholderSrc}
					{...otherProps}
				/>
			</picture>
		);
	}
	return (
		<img
			alt=""
			ref={rootRef}
			src={isVisible ? src : placeholderSrc}
			{...otherProps}
		/>
	);
};

LazyLoadImage.defaultProps = {
	visibleByDefault: false,
	placeholderSrc: undefined,
	threshold: 100,
};

const LazyLoadImageNativeDetector = props => {
	const visibleByDefault = props.visibleByDefault;
	const [extraProps, setExtraProps] = useState({});
	useEffect(() => {
		const _extraProps = {};
		if (
			typeof window !== 'undefined' &&
			'loading' in window.HTMLImageElement.prototype
		) {
			if (!visibleByDefault) {
				_extraProps.loading = 'lazy';
			}
			_extraProps.visibleByDefault = true;
			setExtraProps(_extraProps);
		}
	}, [visibleByDefault]);

	return <LazyLoadImage {...props} {...extraProps} />;
};

export default LazyLoadImageNativeDetector;
