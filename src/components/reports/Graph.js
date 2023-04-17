import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { defaultStyles, useTooltip, Tooltip } from '@visx/tooltip';
import { Group } from '@visx/group';
import { AreaClosed, Bar, Line, LinePath } from '@visx/shape';
import { max, min } from 'd3-array';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { withParentSize } from '@visx/responsive';

const getMyPercentage = d => get(d, 'percentage');
const getTopperPercentage = d => get(d, 'topperPercentage');
const getAveragePercentage = d => get(d, 'averagePercentage');

const tickLength = 4;
const axisStroke = '#999';
const tickStroke = '#9a9b9c';
const accentColorDark = '#3589a7';

const myPercentageBaseConfig = {
	label: 'My Percentage',
	key: 'percentage',
	getValue: getMyPercentage,
	stroke: 'rgba(230, 30, 30, 0.5)',
	fill: 'rgba(230, 30, 30, 0.05)',
};

const averageBaseConfig = {
	label: 'Average Percentage',
	key: 'averagePercentage',
	getValue: getAveragePercentage,
	stroke: 'rgba(30, 30, 30, 0.8)',
	fill: 'rgba(30, 30, 30, 0.06)',
};

const topperBaseConfig = {
	label: 'Topper Percentage',
	key: 'topperPercentage',
	getValue: getTopperPercentage,
	stroke: '#3570a7',
	fill: 'rgba(50, 132, 203, 0.03)',
};

const lineConfigs = [
	{ ...myPercentageBaseConfig, strokeWidth: 0, component: AreaClosed },
	{
		...myPercentageBaseConfig,
		fill: 'transparent',
		strokeWidth: 4,
		component: LinePath,
	},
	{ ...averageBaseConfig, component: AreaClosed, strokeWidth: 0 },
	{
		...averageBaseConfig,
		component: LinePath,
		strokeWidth: 2,
		fill: 'transparent',
	},
	{ ...topperBaseConfig, component: AreaClosed, strokeWidth: 0 },
	{
		...topperBaseConfig,
		component: LinePath,
		strokeWidth: 2,
		fill: 'transparent',
	},
];

const ordinalScale = scaleOrdinal({
	domain: ['Yours', 'Toppers', 'Average'],
	range: ['rgba(230, 30, 30, 0.5)', '#3570a7', 'rgba(30, 30, 30, 0.8)'],
});

const Graph = withParentSize(({ data, parentWidth, type, sectionConfigs }) => {
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
		const minPercentage = Math.min(
			min(data, getAveragePercentage),
			min(data, getMyPercentage),
			min(data, getTopperPercentage)
		);
		const maxPercentage = Math.max(
			max(data, getAveragePercentage),
			max(data, getMyPercentage),
			max(data, getTopperPercentage)
		);
		return scaleLinear({
			domain: [minPercentage * 0.9, maxPercentage],
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
			console.log(yAxisScale(getMyPercentage(itemData)));
			showTooltip({
				tooltipData: itemData,
				tooltipLeft,
				tooltipTop: yAxisScale(getMyPercentage(itemData)),
			});
		},
		[dataByPosition, showTooltip, xAxisScale, yAxisScale]
	);
	const {
		topper: topperTooltipTop,
		my: myTooltipTop,
		average: averageTooltipTop,
	} = useMemo(
		() =>
			tooltipData
				? {
						topper: yAxisScale(getTopperPercentage(tooltipData)),
						my: yAxisScale(getMyPercentage(tooltipData)),
						average: yAxisScale(getAveragePercentage(tooltipData)),
				  }
				: {},
		[tooltipData, yAxisScale]
	);
	return (
		<div style={{ position: 'relative', width, height: height + 40 }}>
			<LegendOrdinal scale={ordinalScale} shape="circle">
				{labels => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginTop: 12,
							marginLeft,
						}}
					>
						{labels.map((label, i) => {
							return (
								<LegendItem
									key={`legend-quantile-${i}`}
									margin="0 8px 0 0"
									flexDirection="row"
								>
									<svg width={15} height={15} style={{ margin: '5px 0' }}>
										<circle fill={label.value} r={15 / 2} cx={15 / 2} cy={15 / 2} />
									</svg>
									<LegendLabel align="left" margin="0 4px">
										{label.text}
									</LegendLabel>
								</LegendItem>
							);
						})}
					</div>
				)}
			</LegendOrdinal>
			<svg width={width} height={height}>
				{compactMode ? null : (
					<AxisLeft
						label="% Marks"
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
								cy={topperTooltipTop + 1}
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
								cy={topperTooltipTop}
								r={4}
								fill={accentColorDark}
								stroke="white"
								strokeWidth={2}
								pointerEvents="none"
							/>
							<circle
								cx={tooltipLeft}
								cy={myTooltipTop + 1}
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
								cy={myTooltipTop}
								r={4}
								fill="rgba(200, 40, 30, 1)"
								stroke="white"
								strokeWidth={2}
								pointerEvents="none"
							/>
							<circle
								cx={tooltipLeft}
								cy={averageTooltipTop + 1}
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
								cy={averageTooltipTop}
								r={4}
								fill="rgba(30, 30, 30, 1)"
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
							<div>{getMyPercentage(tooltipData)}% - Your</div>
							<div>{getTopperPercentage(tooltipData)}% - Topper</div>
							<div>{getAveragePercentage(tooltipData)}% - Average</div>
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
});

export default Graph;
