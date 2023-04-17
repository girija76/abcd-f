import React, { Component } from 'react';
import { Group } from '@visx/group';
import { scaleLinear, scaleLog } from '@visx/scale';
import { HeatmapRect } from '@visx/heatmap';
import { withTooltip, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { AxisLeft, AxisBottom } from '@visx/axis';

const cool1 = '#dadada'; //'#dde06d';
const cool2 = '#1890ff'; //'#959733';
// utils
const max = (data, value = d => d) => Math.max(...data.map(value));

// accessors
const bins = d => d.bins;
const count = d => d.count + 1;

class ActivityMap extends Component {
	handleMouseOver = (event, count, text) => {
		const coords = localPoint(event.target.ownerSVGElement, event);
		this.props.showTooltip({
			tooltipLeft: coords.x,
			tooltipTop: coords.y,
			tooltipData: { count, date: text },
		});
	};

	getWeek = myDate => {
		let date = new Date(myDate.getTime());
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
		let week1 = new Date(date.getFullYear(), 0, 4);
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 -
					3 +
					((week1.getDay() + 6) % 7)) /
					7
			)
		);
	};

	render() {
		const {
			data,
			separation = 2,
			binWidth = 24,
			binHeight = 24,
			margin = {
				top: 10,
				left: 20,
				right: 20,
				bottom: 10,
			},
		} = this.props;

		const {
			tooltipData,
			tooltipLeft,
			tooltipTop,
			tooltipOpen,
			hideTooltip,
		} = this.props;

		const newData = data.map(b => {
			return {
				bin: b.bin,
				bins: b.bins.map(bb => {
					return { bin: bb.bin, text: bb.text, count: bb.count + 1 };
				}),
			};
		});

		const colorMax = max(newData, d => max(bins(d), count));
		const bucketSizeMax = max(newData, d => bins(d).length);

		const xScale = scaleLinear({
			domain: [0, newData.length],
		});
		const yScale = scaleLinear({
			domain: [0, bucketSizeMax],
		});

		const rectColorScale = scaleLog({
			range: [cool1, cool2],
			domain: [1, colorMax],
		});

		const opacityScale = scaleLinear({
			range: [0.5, 0.6],
			domain: [0, colorMax],
		});

		const xMax =
			binWidth * newData.length +
			(newData.length ? (newData.length - 1) * separation : 0);
		let yMax = 0;
		if (newData.length) {
			yMax =
				binHeight * newData[0].bins.length +
				(newData[0].bins.length ? (newData[0].bins.length - 1) * separation : 0);
		}

		xScale.range([0, xMax]);
		yScale.range([yMax, 0]);

		const monthValues = [
			'',
			'',
			'',
			'Jan',
			'',
			'',
			'',
			'Feb',
			'',
			'',
			'',
			'Mar',
			'',
			'',
			'',
			'Apr',
			'',
			'',
			'',
			'May',
			'',
			'',
			'',
			'Jun',
			'',
			'',
			'',
			'',
			'Jul',
			'',
			'',
			'',
			'Aug',
			'',
			'',
			'',
			'Sep',
			'',
			'',
			'',
			'',
			'Oct',
			'',
			'',
			'',
			'Nov',
			'',
			'',
			'',
			'',
			'Dec',
		];

		let skip = 0;
		if (newData.length) {
			skip = this.getWeek(new Date(newData[0].bins[0].text));
		}

		const tickValues = ['Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'];

		let totalQuestionsSolved = 0;
		newData.forEach(d => {
			d.bins.forEach(bin => {
				totalQuestionsSolved += bin.count - 1;
			});
		});

		return (
			<div style={{ marginTop: 30, padding: '12px 24px' }}>
				<div style={{ fontSize: 18, fontWeight: 'bolder' }}>
					{totalQuestionsSolved} Questions solved so far
				</div>
				<svg
					width={xMax + margin.left + margin.right}
					height={yMax + margin.top + margin.bottom + 20}
				>
					<AxisLeft
						top={margin.top}
						left={margin.left + 12}
						scale={yScale}
						hideZero
						numTicks={7}
						stroke="#ffffff"
						tickStroke="#ffffff"
						tickLabelProps={(value, index) => ({
							fill: '#8e205f',
							textAnchor: 'end',
							fontSize: 10,
							fontFamily: 'Arial',
							dx: '-0.25em',
							dy: '18px',
							index: index,
						})}
						tickComponent={({ formattedValue, ...tickProps }) => {
							return <text {...tickProps}>{tickValues[tickProps.index - 1]}</text>;
						}}
					/>
					<AxisBottom
						top={yMax + margin.top}
						left={margin.left + 12}
						scale={xScale}
						numTicks={newData.length}
						stroke="#ffffff"
						tickStroke="#ffffff"
						tickLabelProps={(value, index) => ({
							fill: '#8e205f',
							textAnchor: 'end',
							fontSize: 10,
							fontFamily: 'Arial',
							dx: '0px',
							dy: '0px',
							index: index,
						})}
						tickComponent={({ formattedValue, ...tickProps }) => {
							return (
								<text {...tickProps}>
									{monthValues[(tickProps.index - 1 + skip) % monthValues.length]}
								</text>
							);
						}}
					/>
					<Group top={-15} left={32}>
						<HeatmapRect
							data={newData}
							xScale={xScale}
							yScale={yScale}
							colorScale={rectColorScale}
							opacityScale={opacityScale}
							binWidth={binWidth}
							binHeight={binHeight}
							gap={2}
						>
							{heatmap =>
								heatmap.map(bins_ =>
									bins_.map(bin => (
										<rect
											key={`heatmap-rect-${bin.row}-${bin.column}`}
											className={`heatmap-rect-${bin.bin.count}`}
											width={bin.width}
											height={bin.height}
											x={bin.x}
											y={bin.y}
											fill={bin.color}
											fillOpacity={bin.opacity}
											onMouseOver={e =>
												this.handleMouseOver(e, bin.bin.count, bin.bin.text)
											}
											onMouseOut={hideTooltip}
										/>
									))
								)
							}
						</HeatmapRect>
					</Group>
				</svg>
				{tooltipOpen && (
					<TooltipWithBounds key={Math.random()} top={tooltipTop} left={tooltipLeft}>
						<strong>
							{tooltipData.count < 2 ? 'No' : tooltipData.count - 1} questions
							attempted
						</strong>{' '}
						on <i>{tooltipData.date}</i>
					</TooltipWithBounds>
				)}
			</div>
		);
	}
}
export default withTooltip(ActivityMap);
