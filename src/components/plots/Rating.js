import React, { Component } from 'react';
import { Grid } from '@visx/grid';
import { Group } from '@visx/group';
import { GlyphDot } from '@visx/glyph';
import { curveLinear } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { AreaClosed, LinePath, Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { extent, max, min } from 'd3-array';
import sizeMe from 'react-sizeme';
import { Text } from '@visx/text';

// accessors
const x = d => d.assessment_no;
const y = d => d.rating;
const y1 = d => d.avg_rating;

class Rating extends Component {
	render() {
		const { width, size_ } = this.props;
		const height =
			size_ === 'small' ? Math.round(0.75 * width) : Math.round(0.618 * width);
		const { rating } = this.props;
		const margin = {
			top: 20,
			left: 70,
			right: 40,
			bottom: 70,
		};
		if (width < 10) return null;

		const xMax = width - margin.left - margin.right;
		const yMax = height - margin.top - margin.bottom;

		const data = rating.map((r, index) => ({
			assessment_no: index + 1,
			rating: r.rating,
			avg_rating: r.avg_rating,
			assessment_name: r.name,
		}));

		data.unshift({
			assessment_no: 0,
			rating: 1600,
			assessment_name: 'Start',
			avg_rating: 1600,
		});
		// scales
		const xScale = scaleLinear({
			range: [0, xMax],
			domain: extent(data, x),
		});
		const yScale = scaleLinear({
			range: [yMax, 0],
			domain: [
				Math.min(min(data, y1), min(data, y)) - 100,
				Math.max(max(data, y1), max(data, y)) + 100,
			],
			nice: true,
		});

		const lastAssessmentNumber = data[data.length - 1].assessment_no;
		let lastYourRating = data[data.length - 1].rating;
		let lastAvgRating = data[data.length - 1].avg_rating;

		if (lastYourRating >= lastAvgRating && lastYourRating < lastAvgRating + 20) {
			lastYourRating += 10;
			lastAvgRating -= 10;
		} else if (
			lastYourRating <= lastAvgRating &&
			lastYourRating > lastAvgRating - 20
		) {
			lastYourRating -= 10;
			lastAvgRating += 10;
		}

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
					numTicksColumns={data.length - 1}
				/>
				<Group top={margin.top} left={margin.left}>
					<AreaClosed
						data={data}
						yScale={yScale}
						x={d => xScale(x(d))}
						y={d => yScale(y(d))}
						strokeWidth={1}
						fill={'url(#linear)'}
						curve={curveLinear}
					/>
					<LinePath
						data={data}
						yScale={yScale}
						x={d => xScale(x(d))}
						y={d => yScale(y1(d))}
						stroke={"url('#linear')"}
						strokeWidth={1}
						stroke="#808080"
						curve={curveLinear}
						glyph={(d, i) => {
							return (
								<g key={`line-point-${i}`}>
									<GlyphDot
										cx={xScale(x(d))}
										cy={yScale(y1(d))}
										r={5}
										fill="white"
										stroke="#212529"
										strokeWidth={3}
									/>
								</g>
							);
						}}
					/>
					<LinePath
						data={data}
						yScale={yScale}
						x={d => xScale(x(d))}
						y={d => yScale(y(d))}
						stroke={"url('#linear')"}
						strokeWidth={1}
						stroke="#001529"
						curve={curveLinear}
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
					<Text
						verticalAnchor="start"
						x={xScale(lastAssessmentNumber) + 5}
						y={yScale(lastYourRating) - 4}
						style={
							size_ === 'small'
								? { fontWeight: 'bolder', fontSize: 13 }
								: { fontWeight: 'bolder' }
						}
					>
						You
					</Text>
					<Text
						verticalAnchor="start"
						x={xScale(lastAssessmentNumber) + 5}
						y={yScale(lastAvgRating) - 4}
						style={
							size_ === 'small'
								? { fontWeight: 'bolder', fontSize: 13 }
								: { fontWeight: 'bolder' }
						}
					>
						Avg
					</Text>
				</Group>
				<Group left={margin.left}>
					<AxisLeft
						top={margin.top}
						left={0}
						scale={yScale}
						hideZero
						numTicks={size_ === 'small' ? 4 : 7}
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
						top={height - margin.bottom}
						left={0}
						scale={xScale}
						tickValues={[]}
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
						label="Timeline"
					/>
				</Group>
			</svg>
		);
	}
}

export default sizeMe()(Rating);
