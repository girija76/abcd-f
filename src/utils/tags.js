import { filter, forEach, get, isEmpty, map, split, values } from 'lodash';

const convertSortOrderFromRaw = rawOrder => {
	const orderByPhase = {};
	forEach(
		filter(
			map(split(rawOrder, ','), item => item.trim()),
			item => !isEmpty(item)
		),
		orderItem => {
			const [phase, orderNumberString] = orderItem.split(':');
			const orderNumber = parseInt(orderNumberString, 10);
			orderByPhase[phase] = isNaN(orderNumber) ? 0 : orderNumber;
		}
	);
	return orderByPhase;
};

const spaceReplaceRegex = /\s\s+/g;

export const getTagValueByKey = (tags, tagKey) => {
	let tagValue;
	try {
		tags.some(tag => {
			if (
				tag.key
					.trim()
					.replace(spaceReplaceRegex, ' ')
					.toLowerCase() ===
				tagKey
					.trim()
					.replace(spaceReplaceRegex, ' ')
					.toLowerCase()
			) {
				tagValue = tag.value;
				return true;
			}
			return false;
		});
	} catch (e) {}
	return tagValue;
};

export const getOrderInPhase = (phase, group) => {
	const sortOrderRaw = getTagValueByKey(get(group, ['tags']), 'sortOrder');
	const sortOrderByPhase = convertSortOrderFromRaw(sortOrderRaw);
	const orderNumber =
		sortOrderByPhase[phase] || sortOrderByPhase['default'] || 0;
	return orderNumber;
};

export const createGroupsByTag = (
	items,
	tagKey,
	tagSelector,
	defaultGroup = 'Others'
) => {
	const groupsByTag = {};
	items.forEach(item => {
		const tagValueForTagKey =
			getTagValueByKey(get(item, tagSelector), tagKey) || 'undefined';
		const key = tagValueForTagKey
			.toLowerCase()
			.replace(spaceReplaceRegex, ' ')
			.trim();
		if (!groupsByTag[key]) {
			groupsByTag[key] = {
				label:
					tagValueForTagKey === 'undefined'
						? defaultGroup
						: tagValueForTagKey.replace(spaceReplaceRegex, ' ').trim(),
				items: [],
			};
		}
		groupsByTag[key].items.push(item);
	});
	return values(groupsByTag).sort((g1, g2) =>
		g1.label === defaultGroup ? 1 : g2.label === defaultGroup ? -1 : 0
	);
};
