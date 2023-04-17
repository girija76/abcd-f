import { filterItems } from './video';
import dayjs from 'dayjs';
const arraySupport = require('dayjs/plugin/arraySupport');

dayjs.extend(arraySupport);

const now = dayjs([2020, 8, 6, 12, 12, 21, 0]);
const todayStart = dayjs([now.year(), now.month(), now.date()]);
const todayReleasedItem = {
	availableFrom: dayjs(todayStart)
		.add(1, 'day')
		.subtract(1, 'ms'),
	_id: 'today',
};

const items = [todayReleasedItem];

it('filterItems from playlist for grouping', () => {
	expect(
		filterItems(items, todayStart, dayjs(todayStart).add(1, 'day'))
	).toEqual(expect.arrayContaining(items));
});
