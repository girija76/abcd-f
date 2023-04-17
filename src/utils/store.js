import { forEach, get } from 'lodash';

export function createItemsById(items, idKey = '_id') {
	const itemsById = {};
	forEach(items, item => {
		itemsById[get(item, idKey)] = item;
	});
	return itemsById;
}
