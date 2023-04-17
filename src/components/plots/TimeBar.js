import React from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';

// accessors
const x0 = d => d.name;

const TimeBar = ({ margin = { top: 40 }, data, type, width }) => {
	let maxTime = 0;
	for (let i = 0; i < data.length; i += 1) {
		maxTime = Math.max(maxTime, data[i].avgTime);
	}

	const keys = Object.keys(data[0]).filter(d => d !== 'name');

	const x0Scale = scaleBand({
		domain: data.map(x0),
		padding: 0.2,
	});

	const x1Scale = scaleBand({
		domain: keys,
		padding: 0.1,
	});

	const yScale = scaleLinear({
		domain: [0, Math.max(...data.map(d => Math.max(...keys.map(key => d[key]))))],
	});

	const color = scaleOrdinal({
		domain: keys,
		range: ['#039be5', '#039b00'],
	});

	const height = 240;

	const xMax = width;
	const yMax = height - margin.top - 10;

	x0Scale.rangeRound([0, xMax - 80]);
	x1Scale.rangeRound([0, x0Scale.bandwidth()]);
	yScale.range([yMax, 0]);

	return (
		<div style={{ width: 'calc(50% - 50px)' }}>
			<svg width={width} height={height + 15}>
				<rect x={0} y={0} width={width} height={height + 15} fill="#ffffff" />
				<Group top={margin.top} left={20}>
					<BarGroup
						data={data}
						keys={keys}
						height={yMax}
						x0={x0}
						x0Scale={x0Scale}
						x1Scale={x1Scale}
						yScale={yScale}
						color={(key, barIndex) => {
							return '#fff';
						}}
					>
						{barGroups => {
							return barGroups.map((barGroup, index) => {
								return (
									<Group
										key={`bar-group-${barGroup.index}-${barGroup.x0}`}
										left={barGroup.x0}
									>
										{barGroup.bars.map(bar => {
											const duration = `${Math.floor((bar.value * 10) / 60) / 10} min`;
											const height = Math.max(bar.height, 6);
											const extraHeight = height - bar.height;
											return (
												<>
													<text
														y={bar.y - 10}
														x={bar.x + bar.width / 2}
														text-anchor="middle"
													>
														{duration}
													</text>
													<rect
														key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
														x={bar.x}
														y={bar.y - extraHeight}
														width={bar.width}
														height={height}
														fill={
															['rgba(80, 195, 70,.9)', 'rgba(255, 50, 50,.6)', '#546e7a'][
																index
															]
														}
														rx={5}
													/>
												</>
											);
										})}
									</Group>
								);
							});
						}}
					</BarGroup>
				</Group>
				<AxisBottom
					top={yMax + margin.top}
					left={20}
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
		</div>
	);
};

export default TimeBar;
