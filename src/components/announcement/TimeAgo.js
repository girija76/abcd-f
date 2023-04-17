import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import { Tooltip } from 'antd';

dayjs.extend(relativeTimePlugin);
dayjs.extend(advancedFormatPlugin);

function TimeAgo({ date }) {
	const dayJSDate = useMemo(() => dayjs(date), [date]);
	const fullFormattedDate = useMemo(
		() => dayJSDate.format('h:mm A · MMM D, YYYY'),
		[dayJSDate]
	);
	const formattedTime = useMemo(() => {
		const now = dayjs();
		if (now.diff(dayJSDate, 'd') < 1) {
			const hourDiff = now.diff(dayJSDate, 'h');
			if (hourDiff < 1) {
				const minuteDiff = now.diff(dayJSDate, 'm');
				if (minuteDiff < 1) {
					const secondsDiff = now.diff(dayJSDate, 's');
					return `${secondsDiff}s ago`;
				} else {
					return `${minuteDiff}m ago`;
				}
			} else {
				return `${hourDiff}h ago`;
			}
		} else {
			const isSameYear = now.isSame(dayJSDate);
			if (isSameYear) {
				return `${dayJSDate.format('MMM D')}`;
			} else {
				return `${dayJSDate.format('MMM D, YYYY')}`;
			}
		}
	}, [dayJSDate]);
	return (
		<Tooltip placement="right" title={fullFormattedDate}>
			{formattedTime}
		</Tooltip>
	);
}

export default TimeAgo;
