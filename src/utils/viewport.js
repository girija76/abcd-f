import { forEach, some } from 'lodash';
import { isLite } from 'utils/config';

let viewportElement = document.getElementById('preparation-portal-viewport');

const deviceWidthViewport = {
	width: 'device-width',
	userScalable: false,
	shrinkToFit: 'yes',
};

const minViewport500 = { width: 500, userScalable: false, shrinkToFit: 'yes' };

const maxViewport700 = { width: 899, userScalable: false, shrinkToFit: 'yes' };

const defaultViewport = [
	{
		condition: () => {
			if (isLite && window.screen.availWidth > 899) {
				return true;
			}
			return false;
		},
		value: maxViewport700,
	},
	{
		condition: () => {
			if (window.screen.availWidth > 500) {
				return true;
			}
		},
		value: deviceWidthViewport,
	},
	{
		value: minViewport500,
	},
];

const config = {
	children: {
		'/': {
			exact: true,
			viewport: deviceWidthViewport,
		},
		'/complete-profile': { viewport: deviceWidthViewport },
		'/dashboard/cart': {
			viewport: deviceWidthViewport,
		},
		'/dashboard/schedule': {
			viewport: deviceWidthViewport,
		},
	},
	viewport: defaultViewport,
};

const getStringRepresentationForValue = v => {
	if (v === false) {
		return 0;
	} else if (v === true) {
		return 1;
	} else if (typeof v === 'string') {
		return v;
	} else if (typeof v === 'number') {
		return v;
	} else {
		return v;
	}
};

const getStringRepresentationForKey = k => {
	const map = {
		initialScale: 'initial-scale',
		userScalable: 'user-scalable',
		maximumScale: 'maximum-scale',
		minimumScale: 'minimum-scale',
		shrinkToFit: 'shrink-to-fit',
	};
	return map[k] || k;
};

const getViewportValue = v => {
	let viewportValue = '';
	forEach(v, (value, key) => {
		viewportValue += `${getStringRepresentationForKey(
			key
		)}=${getStringRepresentationForValue(value)}, `;
	});
	return viewportValue.substring(0, viewportValue.length - 2);
};

const selectViewport = viewports => {
	if (Array.isArray(viewports)) {
		let viewport = {};
		viewports.some(item => {
			if (typeof item.condition === 'function') {
				try {
					const doesConditionMatches = item.condition();
					if (doesConditionMatches) {
						viewport = item.value;
						return true;
					} else {
						return false;
					}
				} catch (e) {
					return false;
				}
			} else if (
				typeof item.condition === 'undefined' ||
				item.condition === true
			) {
				viewport = item.value;
				return true;
			}
			return false;
		});
		return viewport;
	} else {
		const viewport = viewports;
		return viewport;
	}
};

/**
 *
 */
const setViewportForItem = (path, match, config, defaultViewport) => {
	const viewport = config.viewport || defaultViewport;
	const childMatched = some(config.children, (childConfig, childMatch) => {
		if (
			path.indexOf(childMatch) === 0 &&
			(childConfig.exact ? path === childMatch : true)
		) {
			setViewportForItem(
				path.replace(childMatch, ''),
				childMatch,
				childConfig,
				viewport
			);
			return true;
		}
		return false;
	});
	if (!childMatched) {
		const selectedViewport = selectViewport(viewport);
		viewportElement.setAttribute('content', getViewportValue(selectedViewport));
	}
};

export const setViewport = path => {
	setViewportForItem(path, '', config, defaultViewport);
};
