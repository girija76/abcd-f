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
const x = d => d.percent;
const y = d => d.students;

const flag = (
	<svg x="0px" y="0px" width="2em" height="2em" viewBox="0 0 60 60">
		<polygon style={{ fill: '#039b00' }} points="52,23.5 10,40 10,22 10,4 " />
		<path
			style={{ fill: '#000000' }}
			d="M9,0C8.448,0,8,0.447,8,1v3v55c0,0.553,0.448,1,1,1s1-0.447,1-1V4V1C10,0.447,9.552,0,9,0z"
		/>
	</svg>
);

class MarksDistribution extends Component {
	componentDidMount() {
		this.props.isGraphReady();
	}

	render() {
		const { width, nintypercentile, maxMarks, autoGrade } = this.props;

		const height = Math.max(Math.round(0.618 * width), 200);
		const { hist, percent, average, percentile } = this.props;
		const margin = { top: 20, left: 70, right: 20, bottom: 70 };

		if (width < 10) return null;

		// bounds
		const xMax = width - margin.left - margin.right;
		const yMax = height - margin.top - margin.bottom;

		let totalStudents = 0;
		hist.forEach(h => (totalStudents += h));
		const data = hist.map((h, index) => {
			return { students: (100.0 * h) / totalStudents, percent: 20 * index };
		});

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

		return (
			<div>
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
						numTicksRows={7}
						numTicksColumns={10}
					/>
					<Group top={margin.top} left={margin.left}>
						<AreaClosed
							data={data}
							x={d => xScale(x(d))}
							y={d => yScale(y(d))}
							yScale={yScale}
							strokeWidth={3}
							fill={'url(#linear)'}
							curve={curveMonotoneX}
						/>
						<LinePath
							data={data}
							yScale={yScale}
							x={d => xScale(x(d))}
							y={d => yScale(y(d))}
							stroke={'#001529'}
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
							width={3}
							height={height - 90}
							x={xScale(Math.max(0, percent))}
							y={yMax - height + 90}
							fill="#039be5"
							data={{ x: percent, y: y(0) }}
						/>
						{percentile < 90 && !autoGrade ? (
							<line
								x1={xScale(Math.max(0, nintypercentile))}
								x2={xScale(Math.max(0, nintypercentile)) + 2}
								y2={yMax - height + 90}
								y1={height - 90}
								fill="transparent"
								stroke="#777"
								strokeWidth={2}
								style={{ strokeDasharray: 6 }}
							/>
						) : null}

						{percentile < 85 && !autoGrade ? (
							<svg
								x={xScale(Math.max(0, nintypercentile)) - 4}
								y="-2px"
								width="30px"
								height="30px"
								viewBox="0 0 60 60"
							>
								<polygon
									style={{ fill: '#43A047' }}
									points="52,23.5 10,40 10,22 10,4 "
								/>
							</svg>
						) : null}

						<rect
							x={xScale(percent) + 5}
							y={0}
							width={40}
							height={18}
							fill="#ffffff"
							rx={3}
						/>
						<Text
							verticalAnchor="start"
							x={xScale(percent) + 9}
							y={5}
							style={{ fontWeight: 'bolder' }}
						>
							YOU
						</Text>
						{percentile < 85 && !autoGrade ? (
							<Text verticalAnchor="start" x={xScale(nintypercentile) + 32} y={7}>
								90 percentile
							</Text>
						) : null}
					</Group>
					<Group left={margin.left}>
						<AxisLeft
							top={margin.top}
							left={0}
							scale={yScale}
							hideZero
							numTicks={7}
							label="Percentage Students"
							labelProps={{
								textAnchor: 'middle',
								fontSize: 14,
								fill: '#666',
								fontFamily: '"Chinese Quote", sans-serif',
								fontWeight: 'normal',
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
								<text {...tickProps}>{formattedValue + '%'}</text>
							)}
						/>
						<AxisBottom
							top={height - margin.bottom}
							left={0}
							scale={xScale}
							numTicks={10}
							label="Percentage Marks"
							labelProps={{
								textAnchor: 'middle',
								fontSize: 14,
								fill: '#666',
								fontFamily: '"Chinese Quote", sans-serif',
								fontWeight: 'normal',
							}}
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
								<text {...tickProps}>{`${formattedValue}%`}</text>
							)}
						/>
					</Group>
				</svg>
				{percentile < 85 && !autoGrade ? (
					<div style={{ width: '100%', marginTop: -24, color: '#333' }}>
						{`You need ${Math.round(
							((nintypercentile - percent) * maxMarks) / 100
						)} more marks to reach 90 percentile benchmark.`}
					</div>
				) : null}
			</div>
		);
	}
}

export default sizeMe()(MarksDistribution);
