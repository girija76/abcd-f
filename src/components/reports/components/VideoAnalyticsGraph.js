import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear } from '@visx/scale';
import { defaultStyles, useTooltip, Tooltip } from '@visx/tooltip';
import { Group } from '@visx/group';
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape';
import { max, min } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { withParentSize } from '@visx/responsive';

const getWatchDuration = d => get(d, ['stat', 'watchDuration']);
const getTopics = d => get(d, ['stat', 'topics']);

const tickLength = 4;
const axisStroke = '#999';
const tickStroke = '#9a9b9c';
const accentColorDark = '#3589a7';

const lineBaseConfig = {
	label: 'Watched (minutes)',
	key: 'duration',
	getValue: getWatchDuration,
	stroke: 'rgba(230, 30, 30, 0.5)',
	fill: 'rgba(230, 30, 30, 0.05)',
};

const lineConfigs = [
	{ ...lineBaseConfig, strokeWidth: 0, component: AreaClosed },
	{
		...lineBaseConfig,
		fill: 'transparent',
		strokeWidth: 4,
		component: LinePath,
	},
];

const VideoAnalyticsGraph = ({ data, durationUnit, parentWidth }) => {
	const width = Math.min(parentWidth, 800);
	const height = (300 / 800) * width;
	const compactMode = width <= 500;
	const marginTopMultiplier = compactMode ? 0.05 : 0.03;
	const marginLeft = compactMode ? 0 : 50;
	const marginRight = compactMode ? 3 : 5;
	const marginTop = marginTopMultiplier * height;
	const marginBottom = compactMode ? 3 : 5;
	const yMax = height * (1 - marginTopMultiplier) - marginBottom;
	const xMax = width - marginLeft - marginRight;

	const { tooltipData, tooltipLeft, hideTooltip, showTooltip } = useTooltip({
		tooltipOpen: false,
	});

	const dataByPosition = useMemo(() => {
		const dataByPosition = {};
		data.forEach(item => {
			dataByPosition[item.position] = item;
		});
		return dataByPosition;
	}, [data]);

	const yAxisScale = useMemo(() => {
		const minDuration = Math.min(min(data, getWatchDuration));
		const maxDuration = Math.max(max(data, getWatchDuration));
		return scaleLinear({
			domain: [minDuration * 0.9, maxDuration],
			range: [yMax, 0],
		});
	}, [data, yMax]);
	const xAxisScale = useMemo(() => {
		const linearScale = scaleLinear({
			domain: [data[0].position, data[data.length - 1].position],
			range: [0, xMax],
		});
		return linearScale;
	}, [data, xMax]);

	const handleTooltip = useCallback(
		e => {
			const { x } = localPoint(e);
			const position = parseInt(xAxisScale.invert(x));
			const itemData = dataByPosition[position];
			const tooltipLeft = xAxisScale(position);
			console.log(yAxisScale(getWatchDuration(itemData)));
			showTooltip({
				tooltipData: itemData,
				tooltipLeft,
				tooltipTop: yAxisScale(getWatchDuration(itemData)),
			});
		},
		[dataByPosition, showTooltip, xAxisScale, yAxisScale]
	);
	const { tooltipTop, topics: tooltipTopics } = useMemo(
		() =>
			tooltipData
				? {
						tooltipTop: yAxisScale(getWatchDuration(tooltipData)),
						topics: getTopics(tooltipData),
				  }
				: {},
		[tooltipData, yAxisScale]
	);
	return (
		<div style={{ position: 'relative', width, height: height + 40 }}>
			<svg width={width} height={height}>
				{compactMode ? null : (
					<AxisLeft
						label={`Watch time (${durationUnit})`}
						scale={yAxisScale}
						top={marginTop}
						left={marginLeft}
						tickLength={tickLength}
						stroke={axisStroke}
						tickStroke={tickStroke}
						numTicks={4}
					/>
				)}

				<AxisBottom
					numTicks={data.length}
					top={yMax + marginTop}
					left={marginLeft}
					scale={xAxisScale}
					tickLength={tickLength}
					stroke={axisStroke}
					tickStroke={tickStroke}
					tickFormat={() => null}
					hideTicks
					hideZero
				/>

				<Group top={marginTop} left={marginLeft}>
					{lineConfigs.map((config, index) => {
						const PathComponent = config.component;
						return (
							<PathComponent
								key={index}
								data={data}
								yScale={yAxisScale}
								x={(d, index) => xAxisScale(d.position)}
								y={d => yAxisScale(config.getValue(d))}
								strokeWidth={config.strokeWidth}
								stroke={config.stroke}
								fill={config.fill}
								curve={curveMonotoneX}
							/>
						);
					})}
					<Bar
						width={width}
						height={height}
						fill="transparent"
						onMouseMove={handleTooltip}
						onMouseLeave={() => hideTooltip()}
					/>
					{tooltipData && (
						<g>
							<Line
								from={{ x: tooltipLeft, y: 0 }}
								to={{ x: tooltipLeft, y: yMax }}
								stroke={accentColorDark}
								strokeWidth={2}
								pointerEvents="none"
								strokeDasharray="5,2"
							/>
							<circle
								cx={tooltipLeft}
								cy={tooltipTop + 1}
								r={4}
								fill="black"
								fillOpacity={0.1}
								stroke="black"
								strokeOpacity={0.1}
								strokeWidth={2}
								pointerEvents="none"
							/>
							<circle
								cx={tooltipLeft}
								cy={tooltipTop}
								r={4}
								fill="rgba(200, 40, 30, 1)"
								stroke="white"
								strokeWidth={2}
								pointerEvents="none"
							/>
						</g>
					)}
				</Group>
			</svg>
			{tooltipData && (
				<div>
					<Tooltip
						key={Math.random()}
						top={30}
						left={tooltipLeft + marginLeft}
						style={{ ...defaultStyles, height: 80, width: 150 }}
					>
						<div style={{ lineHeight: 1.6 }}>
							<div>
								<strong>Watched: </strong>
								{getWatchDuration(tooltipData)}{' '}
								{durationUnit === 'minutes' ? 'mins' : durationUnit}
								{Array.isArray(tooltipTopics) && tooltipTopics.length ? (
									<div>
										<strong>Topics:</strong> {tooltipTopics.join(', ')}
									</div>
								) : null}
							</div>
						</div>
					</Tooltip>
					<Tooltip
						top={yMax + marginTop}
						left={tooltipLeft}
						style={{
							...defaultStyles,
							minWidth: 100,
							textAlign: 'center',
							transform: 'translateX(-50%)',
						}}
					>
						<div style={{ textAlign: 'left' }}>
							<b>{dayjs(tooltipData.date).format('D MMM, YY')}</b>
							<div>{tooltipData.name}</div>
						</div>
					</Tooltip>
				</div>
			)}
		</div>
	);
};

export default withParentSize(VideoAnalyticsGraph);
