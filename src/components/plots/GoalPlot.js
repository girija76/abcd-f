import React from 'react';
import { Group } from '@visx/group';
import { GlyphDot } from '@visx/glyph';
import { curveLinear } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { AreaClosed, LinePath, Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';

//make common file for goalplot.js, goalplotweek.js
// accessors
const x = d => d.id;
const y = d => d.percent;
const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

// responsive utils for axis ticks
function numTicksForHeight(height) {
	if (height <= 150) return 3;
	if (150 < height && height <= 200) return 5;
	return 10;
}

function numTicksForWidth(width, limit) {
	return Math.min(7, limit);
}

export default ({ width, data }) => {
	const height = Math.min(240, 0.618 * width);
	const margin = { top: 10, left: 50, right: 30, bottom: 50 };

	if (width < 298) {
		margin.left = 40;
		margin.right = 20;
	}

	const rotate = width === 298 ? 0 : 12;
	const fontSize = width === 298 ? 10 : 9;

	if (width < 10) return null;

	if (data.length) data = data.slice(Math.max(0, data.length - 7));
	const id_offset = data.length ? data[0].id : 0;
	data.forEach(d => {
		d.id -= id_offset;
	});

	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;

	// scales
	const xScale = scaleLinear({
		range: [0, xMax],
		domain: extent(data, x),
	});
	const yScale = scaleLinear({
		range: [yMax, 0],
		domain: [0, 100],
		nice: true,
	});

	return (
		<svg width={width} height={height}>
			<LinearGradient
				id="linear"
				fromOpacity={0.3}
				toOpacity={0.3}
				from="#039be5"
				to="#039be5"
			/>
			<rect x={0} y={0} width={width - 10} height={height} fill="#ffffff" rx={3} />
			<Group top={margin.top} left={margin.left}>
				<AreaClosed
					data={data}
					x={d => xScale(x(d))}
					y={d => yScale(y(d))}
					yScale={yScale}
					strokeWidth={1}
					fill={'url(#linear)'}
					curve={curveLinear}
				/>
				<LinePath
					data={data}
					x={d => xScale(x(d))}
					y={d => yScale(y(d))}
					stroke="#001529"
					strokeWidth={2}
					curve={curveLinear}
				/>
			</Group>
			<Group left={margin.left}>
				<AxisLeft
					top={margin.top}
					left={0}
					scale={yScale}
					hideZero
					numTicks={numTicksForHeight(height)}
					stroke="#001529"
					tickStroke="#001529"
					tickLabelProps={(value, index) => ({
						fill: '#001529',
						textAnchor: 'end',
						fontSize,
						fontFamily: 'Arial',
						dx: '-0.25em',
						dy: '0.25em',
					})}
					tickComponent={({ formattedValue, ...tickProps }) => (
						<text {...tickProps}>{formattedValue + '%'}</text>
					)}
				/>
				<AxisBottom
					top={height - margin.bottom}
					left={0}
					scale={xScale}
					numTicks={numTicksForWidth(width, data.length - 1)}
					labelProps={{
						textAnchor: 'middle',
						fontSize: 16,
						fontWeight: 'bold',
					}}
					stroke="#001529"
					tickStroke="#001529"
					tickLabelProps={(value, index) => ({
						fill: '#001529',
						textAnchor: 'middle',
						fontSize,
						fontFamily: 'Arial',
						dy: '0.25em',
					})}
					tickComponent={({ x, y, formattedValue, ...tickProps }) => (
						<text
							{...tickProps}
							transform={`translate(${x}, ${y}) rotate(${rotate})`}
						>
							{`${data[parseInt(formattedValue)].date.split('-')[0]} ${
								months[parseInt(data[parseInt(formattedValue)].date.split('-')[1]) - 1]
							}`}
						</text>
					)}
				/>
			</Group>
		</svg>
	);
};

/*


glyph={(d,i) => {
            return (
              <g key={`line-point-${i}`}>
                <GlyphDot
                  cx={xScale(x(d))}
                  cy={yScale(y(d))}
                  r={3}
                  fill='white'
                  stroke="#212529"
                  strokeWidth={2}
                />
              </g>
            );
          }}


*/
