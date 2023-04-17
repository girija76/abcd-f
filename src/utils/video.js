import dayjs from 'dayjs';
import { filter, get, some, sortBy, values } from 'lodash';
import { createGroupsByTag, getOrderInPhase, getTagValueByKey } from './tags';

const arraySupport = require('dayjs/plugin/arraySupport');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');

dayjs.extend(arraySupport);
dayjs.extend(isSameOrAfter);

export const filterItems = (items, after, before, log) => {
	const isSameOrAfter = (m, l) => {
		return m.isSameOrAfter(after);
	};
	const isBefore = (m, l) => {
		return !before || m.isBefore(before);
	};
	return items.filter(item => {
		const availableFromMoment = dayjs(item.availableFrom);
		return isSameOrAfter(availableFromMoment) && isBefore(availableFromMoment);
	});
};

const getOrderNumber = item => {
	let orderNumber;
	const isOrderNumberTag = tag =>
		(tag.key === 'Lect No.' || tag.key === 'LectureNo') &&
		tag.value &&
		!isNaN(parseInt(tag.value, 10));
	try {
		item.resource.tags.forEach(tag => {
			if (isOrderNumberTag(tag)) {
				orderNumber = parseInt(tag.value, 10);
			}
		});
	} catch (e) {}
	item.tags.forEach(tag => {
		if (isOrderNumberTag(tag)) {
			orderNumber = parseInt(tag.value, 10);
		}
	});
	return orderNumber;
};

const spaceReplaceRegex = /\s\s+/g;

const getTagValueFromResourceByKey = (resource, tagKey) =>
	getTagValueByKey(get(resource, ['tags'], []), tagKey);

const sortGroup = ({ items, ...otherProperties }) => {
	const sortFn = (item1, item2) => {
		// const video1Title = item1.video.title.toLowerCase();
		// const video2Title = item2.video.title.toLowerCase();
		const item1OrderNumber = getOrderNumber(item1);
		const item2OrderNumber = getOrderNumber(item2);
		if (item1OrderNumber && item2OrderNumber) {
			return item2OrderNumber - item1OrderNumber;
		}
		if (dayjs(item1.availableFrom).isSame(item2.availableFrom)) {
			return 0;
		}
		return dayjs(item1.availableFrom).isAfter(dayjs(item2.availableFrom))
			? -1
			: 1;
	};
	items.sort(sortFn);
	return {
		items,
		...otherProperties,
	};
};

const createGroupsByDate = items => {
	const now = dayjs();
	const todayStart = dayjs([now.year(), now.month(), now.date()]);
	const yesterdayStart = dayjs(todayStart).subtract(1, 'd');
	const earlierThisWeekStart = dayjs(todayStart).subtract(6, 'd');
	const lastWeekStart = dayjs(todayStart).subtract(13, 'd');
	const thisMonthStart = dayjs(todayStart).subtract(1, 'M');
	const lastThreeMonthStart = dayjs(todayStart).subtract(3, 'M');
	const lastYearStart = dayjs(todayStart).subtract(1, 'y');
	const allOldStart = dayjs(todayStart).subtract(100, 'y');

	const upcomingItems = filterItems(items, now);
	const todaysItems = filterItems(items, todayStart, now, false);
	const yesterdaysItems = filterItems(items, yesterdayStart, todayStart);
	const earlierThisWeekItems = filterItems(
		items,
		earlierThisWeekStart,
		yesterdayStart
	);
	const lastWeekItems = filterItems(items, lastWeekStart, earlierThisWeekStart);
	const thisMonthItems = filterItems(items, thisMonthStart, lastWeekStart);
	const lastThreeMonthItems = filterItems(
		items,
		lastThreeMonthStart,
		thisMonthStart
	);
	const lastYearItems = filterItems(items, lastYearStart, lastThreeMonthStart);
	const allOlderItems = filterItems(items, allOldStart, lastYearStart);
	return [
		{ label: 'Today', items: todaysItems },
		{ label: 'Upcoming', items: upcomingItems },
		{ label: 'Yesterday', items: yesterdaysItems },
		{ label: 'Earlier this Week', items: earlierThisWeekItems },
		{
			label: 'Last Week',
			items: lastWeekItems,
		},
		{
			label: 'This Month',
			items: thisMonthItems,
		},

		{ label: 'Last 3 Months', items: lastThreeMonthItems },
		{ label: 'Last Year', items: lastYearItems },
		{ label: 'All Older', items: allOlderItems },
	].filter(i => Array.isArray(i.items) && i.items.length > 0);
};

const filterDemoItems = items => {
	const isDemoItem = item => {
		try {
			return some(item.resource.tags, tag => {
				if (tag.key === 'isPublic' && tag.value === 'Yes') {
					return true;
				}
				return false;
			});
		} catch (e) {
			return false;
		}
	};
	const demoItems = filter(items, item => isDemoItem(item));
	const nonDemoItems = filter(items, item => !isDemoItem(item));
	console.log(demoItems, nonDemoItems);
	return [demoItems, nonDemoItems];
};

export const createGroups = (items, groupBy = 'date', sortBy, options = {}) => {
	const showDemoVideosSeparately = options && options.showDemoVideosSeparately;
	switch (groupBy) {
		case 'Topic':
			return createGroupsByTag(items, groupBy, ['resource', 'tags']).map(
				sortGroup
			);
		case 'Newer-by-Date__Older-by-Topic':
			const now = dayjs();
			const [demoItems, nonDemoItems] = showDemoVideosSeparately
				? filterDemoItems(items)
				: [[], items];
			const todayStart = dayjs([now.year(), now.month(), now.date()]);
			const yesterdayStart = dayjs(todayStart).subtract(1, 'd');
			return [
				...createGroupsByTag(demoItems, 'Topic', ['resource', 'tags']),
				...createGroupsByDate(filterItems(nonDemoItems, yesterdayStart)),
				...createGroupsByTag(
					filterItems(nonDemoItems, dayjs(new Date(0)), yesterdayStart),
					'Topic',
					['resource', 'tags']
				),
			].map(sortGroup);
		case 'Date':
			return createGroupsByDate(items).map(sortGroup);
		default:
			return createGroupsByDate(items).map(sortGroup);
	}
};

const createPlaylistGroupsByTag = (items, tagKey) => {
	const groupsByTag = {};
	items.forEach(item => {
		const tagValueForTagKey =
			getTagValueFromResourceByKey(item, tagKey) || 'undefined';
		const key = tagValueForTagKey
			.toLowerCase()
			.replace(spaceReplaceRegex, ' ')
			.trim();
		if (!groupsByTag[key]) {
			groupsByTag[key] = {
				label:
					tagValueForTagKey === 'undefined'
						? 'Others'
						: tagValueForTagKey.replace(spaceReplaceRegex, ' ').trim(),
				items: [],
			};
		}
		groupsByTag[key].items.push(item);
	});
	return values(groupsByTag);
};

const createGroupSorter = phase => {
	return (...args) => getOrderInPhase(phase, ...args);
};

export const createPlaylistGroups = (activePhase, playlists) => {
	return createPlaylistGroupsByTag(
		sortBy(playlists, createGroupSorter(activePhase)),
		'Subject'
	).map(sortGroup);
};
