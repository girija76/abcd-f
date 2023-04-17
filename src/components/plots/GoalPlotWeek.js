import React from 'react';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { GlyphDot } from '@visx/glyph';
import { curveLinear } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft, AxisRight, AxisBottom } from '@visx/axis';
import { AreaClosed, LinePath, Line } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { extent, max } from 'd3-array';
import { Text } from '@visx/text';
import { Legend } from '@visx/legend';

import { scaleOrdinal } from '@visx/scale';

import { GlyphStar, GlyphWye, GlyphTriangle, GlyphDiamond } from '@visx/glyph';

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

function numTicksForHeight(height) {
	if (height <= 150) return 3;
	if (150 < height && height <= 200) return 5;
	return 10;
}

function numTicksForWidth(width, limit) {
	return Math.min(10, limit);
}

const ordinalShape = scaleOrdinal({
	domain: ['Score', 'Target'],
	range: [
		props => (
			<text fontSize="18" dy="1em" dx=".33em" fill="#001529">
				___
			</text>
		),
		props => (
			<text fontSize="18" dy="1em" dx=".33em" fill="#e0a346">
				___
			</text>
		),
	],
});

export default ({ width, data, goals }) => {
	const height = Math.max(0.309 * width, 200);
	let margin = { top: 10, left: 60, right: 40, bottom: 50 };

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

	const mobileMode = true;

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<svg height={height} width={width}>
				<LinearGradient
					id="linear"
					fromOpacity={0.3}
					toOpacity={0.3}
					from="#039be5"
					to="#039be5"
				/>
				<rect x={0} y={0} width={width} height={height} fill="#ffffff" rx={3} />
				<Group top={margin.top} left={margin.left}>
					<AreaClosed
						data={data}
						x={d => xScale(x(d))}
						y={d => yScale(y(d))}
						yScale={yScale}
						strokeWidth={2}
						fill={'rgba(66, 154, 221, 0.3)'}
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
						label="Percentage Goal Completed"
						labelProps={
							mobileMode
								? {
										textAnchor: 'middle',
										fontSize: 12,
										fontWeight: 'bold',
								  }
								: {
										textAnchor: 'middle',
										fontSize: 15,
										fontWeight: 'bold',
								  }
						}
						stroke="#1b1a1e"
						tickStroke="#001529"
						tickLabelProps={(value, index) => ({
							fill: '#001529',
							textAnchor: 'end',
							fontSize: 11,
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
						label="Days"
						labelProps={
							mobileMode
								? {
										textAnchor: 'middle',
										fontSize: 13,
										fontWeight: 'bold',
								  }
								: {
										textAnchor: 'middle',
										fontSize: 15,
										fontWeight: 'bold',
								  }
						}
						stroke="#001529"
						tickStroke="#001529"
						numTicks={mobileMode ? 7 : 12}
						tickLabelProps={(value, index) => ({
							fill: '#001529',
							textAnchor: 'middle',
							fontSize: 11,
							fontFamily: 'Arial',
							dy: '0.25em',
						})}
						tickComponent={({ formattedValue, ...tickProps }) => (
							<text {...tickProps}>{`${
								data[parseInt(formattedValue)].date.split('-')[0]
							} ${
								months[parseInt(data[parseInt(formattedValue)].date.split('-')[1]) - 1]
							}`}</text>
						)}
					/>
				</Group>
			</svg>
		</div>
	);
};

/*

 glyph={(d,i) => {//no longer supported!
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
