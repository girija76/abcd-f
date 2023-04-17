import React, { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import { Tooltip } from 'antd';

dayjs.extend(relativeTimePlugin);
dayjs.extend(advancedFormatPlugin);
/**
 * Countdown
 */
function InTime({ date, onEnd }) {
	const [renderKey, setRenderKey] = useState(0);
	const targetDate = useMemo(() => dayjs(date), [date]);
	const hasEnded = useRef(false);
	const now = useMemo(() => dayjs(), [renderKey]);
	const fullTargetDate = useMemo(
		() => targetDate.format('h:mm A · MMM D, YYYY'),
		[targetDate]
	);
	const formattedTime = useMemo(() => {
		if (targetDate.diff(now, 'd') < 1) {
			const hourDiff = targetDate.diff(now, 'h');
			if (hourDiff < 1) {
				const minuteDiff = targetDate.diff(now, 'm');
				if (minuteDiff < 1) {
					const secondsDiff = targetDate.diff(now, 's');
					return `in ${secondsDiff}s`;
				} else {
					return `in ${minuteDiff}m`;
				}
			} else {
				return `in ${hourDiff}h`;
			}
		} else {
			const isSameYear = targetDate.isSame(now);
			if (isSameYear) {
				return `${now.format('MMM D')}`;
			} else {
				return `${now.format('MMM D, YYYY')}`;
			}
		}
	}, [now, targetDate]);

	useEffect(() => {
		if (hasEnded.current) {
			return;
		}
		const isOver = targetDate.diff(dayjs()) < 1;
		if (isOver) {
			onEnd && onEnd();
			hasEnded.current = true;
		}
		const timeoutId = setTimeout(() => {
			setRenderKey(renderKey + 1);
		}, 1000);
		return () => {
			clearTimeout(timeoutId);
		};
	}, [onEnd, renderKey, targetDate]);
	return (
		<Tooltip placement="right" title={fullTargetDate}>
			{formattedTime}
		</Tooltip>
	);
}

export default InTime;
