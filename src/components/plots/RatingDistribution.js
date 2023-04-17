import React, { Component } from 'react';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { GlyphDot } from '@visx/glyph';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { AreaClosed, LinePath, Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { extent, max } from 'd3-array';
import { Bar } from '@visx/shape';
import { Text } from '@visx/text';
import sizeMe from 'react-sizeme';

// accessors
const x = d => d.rating;
const y = d => d.students;

class RatingDistribution extends Component {
	// eslint-disable-next-line class-methods-use-this
	componentDidMount() {
		// this.props.isGraphReady()
	}

	render() {
		const { width, size_ } = this.props;
		const height =
			size_ === 'small' ? Math.round(0.75 * width) : Math.round(0.618 * width);
		const { hist, rating } = this.props;
		const margin = { top: 20, left: 70, right: 20, bottom: 70 };

		// bounds
		const xMax = width - margin.left - margin.right;
		const yMax = height - margin.top - margin.bottom;

		let totalStudents = 0;
		hist.forEach(h => (totalStudents += h));
		let data = hist.map((h, index) => {
			return { students: (100.0 * h) / totalStudents, rating: 1250 + 25 * index };
		});

		let i, j;
		for (i = 0; i < data.length - 1; i += 1) {
			if (data[i].students || data[i + 1].students) break;
		}
		for (j = data.length - 1; j > 0; j -= 1) {
			if (data[j].students || data[j - 1].students) break;
		}
		data = data.slice(Math.max(0, i - 1), Math.min(data.length, j + 2));
		// scales
		const xScale = scaleLinear({
			range: [0, xMax],
			domain: extent(data, x),
		});
		const yScale = scaleLinear({
			range: [yMax, 0],
			domain: [0, max(data, y)],
			nice: true,
		});

		// const tvs = [];
		// const interval = size === 'small' ? 100 : 50;

		return (
			<svg width={width} height={height}>
				<LinearGradient
					id="linear"
					fromOpacity={0.3}
					toOpacity={0.1}
					from="#039be5"
					to="#039be5"
				/>
				<rect x={0} y={0} width={width} height={height} fill="#ffffff" rx={5} />
				<Grid
					top={margin.top}
					left={margin.left}
					xScale={xScale}
					yScale={yScale}
					stroke="#e0e3e3"
					width={xMax}
					height={yMax}
					numTicks={size_ === 'small' ? 4 : 7}
					numTicksColumns={10}
				/>
				<Group top={margin.top} left={margin.left}>
					<AreaClosed
						data={data}
						x={d => xScale(x(d))}
						y={d => yScale(y(d))}
						yScale={yScale}
						strokeWidth={1}
						fill={'url(#linear)'}
						curve={curveMonotoneX}
					/>
					<LinePath
						data={data}
						xScale={xScale}
						yScale={yScale}
						x={d => xScale(x(d))}
						y={d => yScale(y(d))}
						stroke="#001529"
						strokeWidth={1}
						curve={curveMonotoneX}
						glyph={(d, i) => {
							return (
								<g key={`line-point-${i}`}>
									<GlyphDot
										cx={xScale(x(d))}
										cy={yScale(y(d))}
										r={5}
										fill="white"
										stroke="#212529"
										strokeWidth={3}
									/>
								</g>
							);
						}}
					/>
					<Bar
						width={2}
						height={height - 90}
						x={xScale(Math.max(0, rating))}
						y={yMax - height + 90}
						fill="#039be5"
						data={{ x: rating, y: y(0) }}
					/>
					<rect
						x={xScale(rating) + 5}
						y={0}
						width={40}
						height={18}
						fill="#ffffff"
						rx={3}
					/>
					<Text
						verticalAnchor="start"
						x={xScale(rating) + 9}
						y={5}
						style={
							size_ === 'small'
								? { fontWeight: 'bold', fontSize: 13 }
								: { fontWeight: 'bold' }
						}
					>
						You
					</Text>
				</Group>
				<Group left={margin.left}>
					<AxisLeft
						top={margin.top}
						left={0}
						scale={yScale}
						hideZero
						numTicks={size_ === 'small' ? 4 : 7}
						label="Percentage Students"
						labelProps={
							size_ === 'small'
								? {
										textAnchor: 'middle',
										fontSize: 13,
								  }
								: {
										textAnchor: 'middle',
										fontSize: 16,
								  }
						}
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
							<text {...tickProps}>{formattedValue + '%'}</text>
						)}
					/>
					<AxisBottom
						top={height - margin.bottom}
						left={0}
						scale={xScale}
						numTicks={size_ === 'small' ? 5 : 10}
						label="Rating"
						labelProps={
							size_ === 'small'
								? {
										textAnchor: 'middle',
										fontSize: 13,
								  }
								: {
										textAnchor: 'middle',
										fontSize: 16,
								  }
						}
						stroke="#001529"
						tickStroke="#001529"
						tickLabelProps={(value, index) => ({
							fill: '#001529',
							textAnchor: 'middle',
							fontSize: 10,
							fontFamily: 'Arial',
							dy: '0.25em',
						})}
						tickComponent={({ formattedValue, ...tickProps }) => (
							<text {...tickProps}>{formattedValue}</text>
						)}
					/>
				</Group>
			</svg>
		);
	}
}

export default sizeMe()(RatingDistribution);
