import React, { useMemo } from 'react';
import {
	isArray,
	filter,
	forEach,
	get,
	keys,
	last,
	includes,
	isEmpty,
	isNumber,
	map,
	reduce,
	some,
	sortBy,
} from 'lodash';
import { Col, Grid, Row } from 'antd';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import createApi from 'apis/others';

const { useBreakpoint } = Grid;

const api = createApi();

const parse = (value, parser) => {
	if (typeof parser === 'function') {
		return parser(value);
	}
	return value;
};

const jsonParser = value => {
	try {
		return JSON.parse(value);
	} catch (e) {
		return {};
	}
};

const getValuesByKey = (tags, parserByKey) => {
	const byKeys = {};
	forEach(
		tags,
		({ key, value }) => (byKeys[key] = parse(value, get(parserByKey, key)))
	);
	return byKeys;
};

const parseBorderWidth = (value, defaultValue) => {
	const v = parseInt(value, 10);
	if (isNaN(v)) {
		return defaultValue;
	}
	return v;
};

const TextCard = ({ tags }) => {
	const {
		actionButtonText,
		actionButtonTextColor,
		actionButtonBackgroundColor,
		actionButtonBorderColor,
		actionButtonBorderWidth,
		secondaryButton,
		actionUrl,
		backgroundColor,
		content,
		heading,
		subHeading,
		borderColor,
	} = getValuesByKey(tags, {
		actionButtonBorderWidth: parseBorderWidth,
		secondaryButton: jsonParser,
	});
	return (
		<div
			style={{
				borderColor,
				backgroundColor,
				borderWidth: 1,
				borderStyle: 'solid',
				borderRadius: 8,
			}}
		>
			<div
				style={{
					fontSize: 20,
					marginBottom: 0,
					lineHeight: '32px',
					color: '#000',
					padding: 16,
					paddingBottom: 0,
				}}
			>
				{heading}
			</div>
			{subHeading ? (
				<div
					style={{ fontSize: 14, color: '#000', opacity: 0.6, padding: '0 16px' }}
				>
					{subHeading}
				</div>
			) : null}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					color: '#000',
					opacity: 0.6,
					padding: 16,
					paddingBottom: 0,
					fontSize: 14,
				}}
			>
				<span>{content}</span>
			</div>
			<div style={{ padding: 16, paddingTop: 8, paddingBottom: 16 }}>
				<a
					data-ga-on="click"
					data-ga-action="click"
					data-ga-category="dynamic-cards"
					data-ga-label={actionButtonText}
					href={actionUrl}
					style={{
						color: actionButtonTextColor,
						backgroundColor: actionButtonBackgroundColor,
						borderColor: actionButtonBorderColor,
						borderWidth: actionButtonBorderWidth,
						borderStyle: 'solid',
						borderRadius: 8,
						padding: '8px 16px',
						display: 'inline-block',
					}}
				>
					{actionButtonText}
				</a>
				{!isEmpty(secondaryButton) ? (
					<a
						data-ga-on="click"
						data-ga-action="click"
						data-ga-category="dynamic-cards"
						data-ga-label={get(secondaryButton, 'text')}
						href={get(secondaryButton, 'actionUrl')}
						style={{
							color: get(secondaryButton, 'style.color'),
							backgroundColor: get(secondaryButton, 'style.backgroundColor'),
							borderColor: get(secondaryButton, 'style.borderColor'),
							borderWidth: get(secondaryButton, 'style.borderWidth'),
							borderStyle: get(secondaryButton, 'style.borderStyle'),
							borderRadius: 8,
							padding: '8px 16px',
							display: 'inline-block',
						}}
					>
						{get(secondaryButton, 'text')}
					</a>
				) : null}
			</div>
		</div>
	);
};

const Image = ({ url, image, label }) => {
	return (
		<a
			data-ga-on="click"
			data-ga-action="click"
			data-ga-category="dynamic-cards"
			data-ga-label={label || url || image}
			style={{
				display: 'block',
				// borderRadius: 10,
			}}
			href={url}
		>
			<img src={image} alt="" style={{ width: '100%' }} />
		</a>
	);
};

const componentsByKey = { image: Image, 'text-card': TextCard };

const Item = ({ type, ...otherProps }) => {
	const Component = componentsByKey[type] || 'div';
	return <Component {...otherProps} />;
};

const selectActivePhase = state => {
	const activeSuperGroupId = localStorage.currentSupergroup;
	const activeSuperGroup = filter(
		state.api.UserData.subscriptions,
		({ group }) => group === activeSuperGroupId
	)[0];
	let activePhaseId = '';
	try {
		some(activeSuperGroup.subgroups, subgroup => {
			return some(subgroup.phases, phase => {
				if (phase.active) {
					activePhaseId = phase.phase._id;
					return true;
				}
			});
		});
	} catch (e) {}
	return activePhaseId;
};

const getValueForKey = (tags, key, defaultValue) => {
	return (
		get(
			filter(tags, tag => tag.key === key),
			[0, 'value']
		) || defaultValue
	);
};

const selectBreakpointEqualOrLowerThan = (breakpoints, breakpoint) => {
	switch (breakpoint) {
		case 'xxl':
			if (includes(keys(breakpoints), 'xxl')) {
				return get(breakpoints, ['xxl']);
			}
		// eslint-disable-next-line no-fallthrough
		case 'xl':
			if (includes(keys(breakpoints), 'xl')) {
				return get(breakpoints, ['xl']);
			}
		// eslint-disable-next-line no-fallthrough
		case 'lg':
			if (includes(keys(breakpoints), 'lg')) {
				return get(breakpoints, ['lg']);
			}
		// eslint-disable-next-line no-fallthrough
		case 'md':
			if (includes(keys(breakpoints), 'md')) {
				return get(breakpoints, ['md']);
			}
		// eslint-disable-next-line no-fallthrough
		case 'sm':
			if (includes(keys(breakpoints), 'sm')) {
				return get(breakpoints, ['sm']);
			}
		// eslint-disable-next-line no-fallthrough
		case 'xs':
			if (includes(keys(breakpoints), 'xs')) {
				return get(breakpoints, 'xs');
			}
		// eslint-disable-next-line no-fallthrough
		default:
			if (includes(keys(breakpoints), 'default')) {
				return get(breakpoints, ['default']);
			}
			return 24;
	}
};

const getCardSize = (card, breakpoint) => {
	const rawValue = getValueForKey(card.tags, 'size', 24);
	if (isNumber(rawValue) && !isNaN(rawValue)) {
		return rawValue;
	}
	try {
		const parsedValues = JSON.parse(rawValue);

		return selectBreakpointEqualOrLowerThan(parsedValues, breakpoint);
	} catch (e) {
		return 24;
	}
};
const canAccomodate = (row, card, breakpoint) => {
	const filledInLastRow = reduce(
		row,
		(sum, c) => getCardSize(get(c, 'card'), breakpoint) + sum,
		0
	);
	const cardSize = getCardSize(card, breakpoint);
	if (cardSize + filledInLastRow <= 24) {
		return true;
	}
	return false;
};

const createCardRows = (cards, breakpoint) => {
	const rows = [];
	forEach(cards, card => {
		if (!isArray(last(rows)) || !canAccomodate(last(rows), card, breakpoint)) {
			rows.push([]);
		}
		last(rows).push({ size: getCardSize(card, breakpoint), card });
	});
	const flexedRows = [];
	forEach(rows, row => {
		const filledSize = reduce(row, (sum, { size }) => sum + size, 0);
		flexedRows.push([]);
		forEach(row, ({ card, size }) => {
			const flexedSize = (size / filledSize) * 24;
			last(flexedRows).push({ card, size: flexedSize });
		});
	});
	return flexedRows;
};

const getCurrentScreenBreakpoint = screens => {
	if (screens.xxl) {
		return 'xxl';
	}
	if (screens.xl) {
		return 'xl';
	}
	if (screens.lg) {
		return 'lg';
	}
	if (screens.md) {
		return 'md';
	}
	if (screens.sm) {
		return 'sm';
	}
	return 'xs';
};

const DynamicCards = () => {
	const activePhaseId = useSelector(selectActivePhase);
	const { data: cards } = useQuery(
		['dashboardData', activePhaseId],
		api.getCards,
		{
			staleTime: 5 * 60 * 1000,
		}
	);
	const sortedCards = useMemo(() => sortBy(cards, [card => card.order]), [
		cards,
	]);
	const screens = useBreakpoint();
	const currentScreen = getCurrentScreenBreakpoint(screens);
	const rows = useMemo(() => createCardRows(sortedCards, currentScreen), [
		sortedCards,
		currentScreen,
	]);
	return isEmpty(cards) ? null : (
		<div className="dynamic-cards">
			{map(rows, (row, rowIndex) => (
				<Row key={rowIndex} gutter={[8, 8]} style={{ marginBottom: 8 }}>
					{map(row, ({ card, size }, index) => {
						const columnProps = {};
						columnProps[currentScreen] = size;
						return (
							<Col flex={size} {...columnProps} key={index}>
								<Item {...card} />
							</Col>
						);
					})}
				</Row>
			))}
		</div>
	);
};

export default DynamicCards;
