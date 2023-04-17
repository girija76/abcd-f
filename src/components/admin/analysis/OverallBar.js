import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import React from 'react';

export default function OverallBar({ data }) {
	const margin = 25;
	const size = 100;
	const innerWidth = size - margin * 2;
	const innerHeight = size - margin * 2;

	const getXValue = d => d.label;
	const getYValue = d => d.y;

	const xScale = scaleBand({
		range: [margin, innerWidth],
		domain: data.map(getXValue),
		padding: 0.3,
	});

	const yScale = scaleLinear({
		range: [innerHeight, margin],
		domain: [
			Math.min(...data.map(getYValue)) - 1,
			Math.max(...data.map(getYValue)) + 1,
		],
	});

	return (
		<svg width="100%" viewBox={`0 0 ${200} ${200}`}>
			<Group>
				{data.map((d, key) => {
					const xvalue = getXValue(d);
					const barWidth = xScale.bandwidth();
					const barHeight = innerHeight - (yScale(getYValue(d)) ?? 0);
					const barX = xScale(xvalue);
					const barY = innerHeight - barHeight;
					return (
						<Bar
							key={key}
							x={barX}
							y={barY}
							width={barWidth}
							height={barHeight}
							fill="orange"
						/>
					);
				})}
			</Group>
			<Group>
				<AxisLeft left={margin} scale={yScale} />
			</Group>
			<Group>
				<AxisBottom top={innerHeight} scale={xScale} />
			</Group>
		</svg>
	);
}
