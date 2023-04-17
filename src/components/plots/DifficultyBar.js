import React from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Legend } from '@visx/legend';

const ordinalShape = scaleOrdinal({
	domain: ['You', 'Average'],
	range: [
		props => <rect width={12} height={12} fill="#039be5" />,
		props => <rect width={12} height={12} fill="#ffab40" />,
	],
});

// accessors
const x0 = d => d.difficulty;

export default ({ margin = { top: 40 }, data, type, width }) => {
	let maxTime = 0;
	for (let i = 0; i < data.length; i += 1) {
		if (type === 'accuracy') {
			if (data[i].you === 0) data[i].you = 1;
			if (data[i].average === 0) data[i].average = 1;
		} else {
			maxTime = Math.max(maxTime, data[i].you);
			maxTime = Math.max(maxTime, data[i].average);
		}
	}
	if (type !== 'accuracy') {
		for (let i = 0; i < data.length; i += 1) {
			if (data[i].you === 0) data[i].you = 0.01 * maxTime;
			if (data[i].average === 0) data[i].average = 0.01 * maxTime;
		}
	}

	const keys = Object.keys(data[0]).filter(d => d !== 'difficulty');

	const x0Scale = scaleBand({
		domain: data.map(x0),
		padding: 0.2,
	});

	const x1Scale = scaleBand({
		domain: keys,
		padding: 0.1,
	});

	const yScale = scaleLinear({
		domain: [
			0,
			type === 'accuracy'
				? 100
				: Math.max(...data.map(d => Math.max(...keys.map(key => d[key])))),
		],
	});

	const color = scaleOrdinal({
		domain: keys,
		range: ['#039be5', '#ffab40'],
	});

	const height = 240;

	const xMax = width - 80;
	const yMax = height - margin.top - 10;

	x0Scale.rangeRound([0, xMax]);
	x1Scale.rangeRound([0, x0Scale.bandwidth()]);
	yScale.range([yMax, 0]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '50% + 50px',
			}}
		>
			<svg width={width} height={height + 15}>
				<rect x={0} y={0} width={width} height={height + 15} fill="#ffffff" />
				<Group top={margin.top} left={80}>
					<BarGroup
						data={data}
						keys={keys}
						height={yMax}
						x0={x0}
						x0Scale={x0Scale}
						x1Scale={x1Scale}
						yScale={yScale}
						color={color}
					>
						{barGroups => {
							return barGroups.map(barGroup => {
								return (
									<Group
										key={`bar-group-${barGroup.index}-${barGroup.x0}`}
										left={barGroup.x0}
									>
										{barGroup.bars.map(bar => {
											return (
												<rect
													key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
													x={bar.x}
													y={bar.y}
													width={bar.width}
													height={bar.height}
													fill={bar.color}
													opacity={0.6}
													rx={5}
												/>
											);
										})}
									</Group>
								);
							});
						}}
					</BarGroup>
				</Group>
				{
					<AxisLeft
						top={margin.top}
						left={80}
						scale={yScale}
						hideZero
						label={type === 'accuracy' ? 'Accuracy' : 'Average Time'}
						labelProps={{
							textAnchor: 'middle',
							fontSize: 16,
						}}
						stroke="#001529"
						tickStroke="#001529"
						tickLabelProps={(value, index) => ({
							fill: '#001529',
							textAnchor: 'end',
							fontSize: 10,
							fontFamily: 'Arial',
							dx: '-0.25em',
							dy: '0.25em',
						})}
						tickComponent={({ formattedValue, ...tickProps }) => (
							<text {...tickProps}>
								{formattedValue + (type === 'accuracy' ? '%' : 's')}
							</text>
						)}
					/>
				}
				<AxisBottom
					top={yMax + margin.top}
					left={80}
					scale={x0Scale}
					stroke="#001529"
					tickStroke="#ffffff"
					tickLabelProps={(value, index) => ({
						fill: '#001529',
						fontSize: 13,
						textAnchor: 'middle',
					})}
					tickComponent={({ formattedValue, ...tickProps }) => (
						<text {...tickProps}>{formattedValue}</text>
					)}
				/>
			</svg>
			<div style={{ width: width - 80 }}>
				<Legend
					direction="row"
					itemDirection="row"
					labelMargin="0"
					shapeMargin="0 0 0px 0"
					itemMargin="0 10px"
					shapeWidth={20}
					shapeHeight={12}
					scale={ordinalShape}
					shape={props => {
						return (
							<svg width={props.width} height={props.height}>
								{!React.isValidElement(ordinalShape(props.label.datum)) &&
									React.createElement(ordinalShape(props.label.datum), {
										...props,
									})}
								{React.isValidElement(ordinalShape(props.label.datum)) &&
									React.cloneElement(ordinalShape(props.label.datum))}
							</svg>
						);
					}}
					style={{ display: 'flex', justifyContent: 'center' }}
				/>
			</div>
		</div>
	);
};
