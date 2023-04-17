import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { parseTime } from 'components/libs/lib';
import { TiStopwatch as StopwatchIcon } from 'react-icons/ti';

const Clock = ({
	previouslyElapsedTime = 0,
	isRunning,
	startTime,
	endTime,
	type,
	timerLimit,
	onEnd,
	style = {},
	noHoursDisplay,
	noMinutesDisplay,
	showIcon,
	disableViewTypeChange,
}) => {
	const startTimeRef = useRef(
		startTime instanceof Date
			? new Date(startTime.getTime() - previouslyElapsedTime)
			: new Date(new Date(startTime).getTime() - previouslyElapsedTime)
	);
	const endTimeRef = useRef(
		endTime instanceof Date ? endTime : endTime ? new Date(endTime) : null
	);
	const intervalRef = useRef();
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [viewType, setViewType] = useState(type);

	const updateTimeElapsed = () => {
		let end = Date.now();
		if (endTimeRef.current) {
			end = endTimeRef.current.getTime();
		}
		setTimeElapsed(Math.floor((end - startTimeRef.current.getTime()) / 1000));
	};

	useEffect(() => {
		if (isRunning && !endTime) {
			updateTimeElapsed();
			const id = setInterval(updateTimeElapsed, 1000);
			intervalRef.current = id;
			return () => clearInterval(intervalRef.current);
		} else {
			clearInterval(intervalRef.current);
			if (endTime) {
				updateTimeElapsed();
			}
		}
	}, [isRunning, endTime]);

	useEffect(() => {
		startTimeRef.current =
			startTime instanceof Date
				? new Date(startTime.getTime() - previouslyElapsedTime)
				: new Date(new Date(startTime).getTime() - previouslyElapsedTime);
	}, [startTime, previouslyElapsedTime]);

	useEffect(() => {
		if (type === 'timer') {
			if (timeElapsed - timerLimit >= 0) {
				onEnd();
				clearInterval(intervalRef.current);
			}
		} else if (timeElapsed < 0) {
			// handleEnd()
			console.error('Time does not match');
		}
	}, [timeElapsed, timerLimit, onEnd, type]);

	useEffect(() => {
		setViewType(type);
	}, [type]);

	let timeToShow = timeElapsed;
	if (viewType === 'timer') {
		timeToShow = timerLimit - timeElapsed;
	}
	return (
		<Tooltip title={viewType === 'timer' ? 'Time remaining' : 'Time spent'}>
			<div
				onClick={() =>
					!disableViewTypeChange &&
					type === 'timer' &&
					setViewType(viewType === 'timer' ? 'stopwatch' : 'timer')
				}
				style={{ display: 'flex', alignItems: 'center', ...style }}
			>
				{viewType === 'timer' && showIcon ? (
					<span
						style={{
							marginRight: 5,
							display: 'flex',
							alignItems: 'center',
							fontSize: 22,
						}}
					>
						<StopwatchIcon />
					</span>
				) : null}{' '}
				{parseTime(timeToShow, {
					noHours: noHoursDisplay,
					noMinutes: noMinutesDisplay,
				})}
			</div>
		</Tooltip>
	);
};

Clock.propTypes = {
	isRunning: PropTypes.bool,
	initialTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	endTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	type: PropTypes.oneOf(['stopwatch', 'timer']),
	timerLimit: PropTypes.number,
	onEnd: PropTypes.func,
	noMinutesDisplay: PropTypes.bool,
};

Clock.defaultProps = {
	isRunning: true,
	initialTime: 0,
	type: 'stopwatch',
};

export default Clock;
