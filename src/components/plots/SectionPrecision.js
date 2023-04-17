import React from 'react';
import { BarGroup } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { cityTemperature } from '@visx/mock-data';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { extent, max } from 'd3-array';

// const data = cityTemperature.slice(0, 4);
// const keys = Object.keys(data[0]).filter(d => d !== 'date');
// const parseDate = timeParse("%Y%m%d");
// const format = timeFormat("%b %d");
// const formatDate = (date) => format(parseDate(date));

function numTicksForHeight(height) {
	// if (height <= 300) return 3;
	// if (300 < height && height <= 600) return 5;
	return 10;
}

// accessors
const x0 = d => d.name;

export default ({
	width,
	height,
	margin = {
		top: 40,
		left: 70,
	},
	data,
}) => {
	const keys = Object.keys(data[0]).filter(d => d !== 'name');

	// bounds
	const xMin = margin.left;
	const xMax = width;
	const yMax = height - margin.top - 100;
	// // scales
	const x0Scale = scaleBand({
		rangeRound: [xMin, xMax],
		domain: data.map(x0),
		padding: 0.2,
		// tickFormat: () => (val) => formatDate(val)
	});
	const x1Scale = scaleBand({
		rangeRound: [0, x0Scale.bandwidth()],
		domain: keys,
		padding: 0.1,
	});
	const yScale = scaleLinear({
		rangeRound: [yMax, 0],
		domain: [
			0,
			max(data, d => {
				return max(keys, key => d[key]);
			}),
		],
	});

	const zScale = scaleOrdinal({
		domain: keys,
		range: ['#aeeef8', '#e5fd3d', '#9caff6'],
	});

	return (
		<svg width={width} height={height}>
			<rect x={0} y={0} width={width} height={height} fill="#ffffff" rx={14} />
			<BarGroup
				top={margin.top}
				data={data}
				keys={keys}
				height={yMax}
				x0={x0}
				x0Scale={x0Scale}
				x1Scale={x1Scale}
				yScale={yScale}
				zScale={zScale}
				rx={4}
			/>
			<AxisLeft
				top={margin.top}
				left={70}
				scale={yScale}
				hideZero
				numTicks={numTicksForHeight(height)}
				label="Precision (%)"
				labelProps={{
					textAnchor: 'middle',
					fontSize: 18,
					fontWeight: 'bolder',
				}}
				stroke="#1b1a1e"
				tickStroke="#8e205f"
				tickLabelProps={(value, index) => ({
					fill: '#8e205f',
					textAnchor: 'end',
					fontSize: 10,
					fontFamily: 'Arial',
					dx: '-0.25em',
					dy: '0.25em',
				})}
				tickComponent={({ formattedValue, ...tickProps }) => (
					<text {...tickProps}>{formattedValue}</text>
				)}
			/>
			<AxisBottom
				scale={x0Scale}
				top={yMax + margin.top}
				stroke="#000000"
				tickStroke="#ffffff"
				tickLabelProps={(value, index) => ({
					fill: '#000000',
					fontSize: 14,
					textAnchor: 'middle',
				})}
			/>
		</svg>
	);
};
