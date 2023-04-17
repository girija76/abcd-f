import React, { useRef, useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Circle, Polygon } from '@visx/shape';
import { max } from 'd3-array';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { Bar } from '@visx/shape';
import sizeMe from 'react-sizeme';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { Legend } from '@visx/legend';
import AntTooltip from 'antd/lib/tooltip';
import { join } from 'lodash';

import { InfoCircleTwoTone } from '@ant-design/icons';

// accessors
const x = d => d.time;
const y = d => d.p;

const y_label = {
	timeToughness: 'Time Difficulty Level',
	questionsSeen: 'Questions',
};

const toughness = ['Normal', 'Easy', 'Medium', 'Hard', 'Normal'];

let tooltipTimeout;

const getPointsForSquare = ({ cx, cy, r }) => {
	const points = [];
	points.push([cx - r, cy - r]);
	points.push([cx - r, cy + r]);
	points.push([cx + r, cy + r]);
	points.push([cx + r, cy - r]);

	return points.map(point => join(join(point, ','), ' '));
};

const getPointsForTriangle = ({ cx, cy, r }) => {
	const point1 = [cx, cy + r];
	const point2 = [
		cx - r * Math.cos((30 * Math.PI) / 180),
		cy - r * Math.sin((30 * Math.PI) / 180),
	];
	const point3 = [
		cx + r * Math.cos((30 * Math.PI) / 180),
		cy - r * Math.sin((30 * Math.PI) / 180),
	];

	return `${join(point1, ',')} ${join(point2, ',')} ${point3}`;
};
class Roadmap extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}
	componentDidMount() {
		this.props.isGraphReady();
	}

	getColor = point => {
		const { filter2 } = this.props;
		let color = 'rgb(3, 155, 229)';

		const filter2Map = {};
		filter2.forEach(f => {
			filter2Map[f.name] = f.color;
		});
		color = filter2Map['Unattempted'];
		if (point.result === 1) color = filter2Map['Correct'];
		if (point.result === -1) color = filter2Map['Incorrect'];

		return color;
	};

	render() {
		const {
			roadmap,
			data_x,
			data_y,
			width,
			filter1,
			filter2,
			duration,
			firstSeenTime,
			topicFilter,
			customRef,
		} = this.props;

		const filteredRoadmap = [];

		const filter1Map = {};
		filter1.forEach(f => {
			if (f.active) filter1Map[f.name] = true;
		});

		const filter2Map = {};
		filter2.forEach(f => {
			if (f.active) filter2Map[f.name] = true;
		});

		roadmap.forEach((r, i) => {
			if (r.questionNo === -1) {
				return;
			}
			let add1 = false;
			let add2 = false;
			let add3 = false;
			if (r.timeCategory === undefined) add1 = true;
			else if (r.timeCategory === 'overtime' && filter1Map['Overtime']) {
				add1 = true;
			} else if (r.timeCategory === 'perfect' && filter1Map['Perfect']) {
				add1 = true;
			} else if (r.timeCategory === 'wasted' && filter1Map['Too Fast']) {
				add1 = true;
			}

			if (r.result === 1 && filter2Map['Correct']) {
				add2 = true;
			} else if (r.result === -1 && filter2Map['Incorrect']) {
				add2 = true;
			} else if (r.result === 0 && filter2Map['Unattempted']) {
				add2 = true;
			}

			if (topicFilter === '' || r.topic === topicFilter) add3 = true;

			if (add1 && add2 && add3) filteredRoadmap.push(r);
		});

		const height = Math.max(Math.round(0.308 * width), 200);
		const margin = { top: 20, left: 70, right: 20, bottom: 70 };
		if (width < 10) return null;

		// bounds
		const xMax = width - margin.left - margin.right;
		const yMax = height - margin.top - margin.bottom;

		filteredRoadmap.sort(function(a, b) {
			if (a.firstVisit < b.firstVisit) {
				return -1;
			}
			if (a.firstVisit > b.firstVisit) {
				return 1;
			}
			return 0;
		});

		const colors = {
			'5c9a660e01d3a533d7c16aaf': 'blue', // quant
			'5d1f1ba3c144745ffcdcbabf': 'blue', // reading comprehension
			'5d5e4c0beaf5f804d9c7d8db': 'blue', // DI
		};

		const data = filteredRoadmap.map((r, index) => {
			const color = colors[r.topic] ? colors[r.topic] : 'black';
			return {
				time: r[data_x] / 60000,
				p: r[data_y] / 60,
				p1: Math.round(r[data_y]),
				color,
				result: r.result,
				totalTime: r.totalTime,
				accuracy: r.accuracy,
				sectionName: r.sectionName,
				questionNo: r.questionNo,
				totalVisits: r.totalVisits,
				difficulty: r.difficulty,
				timeCategory: r.timeCategory,
			};
		});

		const alldata = roadmap.map((r, index) => {
			const color = colors[r.topic] ? colors[r.topic] : 'black';
			return {
				time: r[data_x] / 60000,
				p: r[data_y] / 60,
				p1: Math.round(r[data_y]),
				color,
				result: r.result,
				totalTime: r.totalTime,
				accuracy: r.accuracy,
				sectionName: r.sectionName,
				questionNo: r.questionNo,
				totalVisits: r.totalVisits,
				difficulty: r.difficulty,
				timeCategory: r.timeCategory,
			};
		});

		let maxVal = 0;

		roadmap.forEach((r, index) => {
			maxVal = Math.max(maxVal, r[data_y] / 60);
		});

		for (let i = 0; i < data.length; i++) {
			data[i].p = (5 * data[i].p) / maxVal;
		}

		for (let i = 0; i < alldata.length; i++) {
			alldata[i].p = (5 * alldata[i].p) / maxVal;
		}

		// scales
		const xScale = scaleLinear({
			range: [0, xMax],
			domain: [0, duration / 60],
		});
		const yScale = scaleLinear({
			range: [yMax, 0],
			domain: [0, max(alldata, y)],
			nice: true,
		});

		const tvs = [1, 2, 3, 4, 5];

		let showAttempted = false;
		data.forEach(d => {
			if (d.p1) showAttempted = true;
		});

		const domain_ = ['Questions Seen'];
		if (showAttempted) {
			domain_.push('Questions Attempted');
		}

		const ordinalShapeDot = scaleOrdinal({
			domain: ['Correct', 'Incorrect', 'Unattempted', 'FirstSeenTime'],
			range: [
				props => <rect width={20} height={16} fill="rgb(3, 155, 0)" />,
				props => <rect width={20} height={16} fill="rgb(214, 93, 13)" />,
				props => <rect width={20} height={16} fill="rgb(3, 155, 229)" />,
				props => (
					<rect
						width={20}
						height={3}
						style={{ transform: 'translate(0px, 6px)' }}
						fill="#000000"
					/>
				),
			],
		});

		const mobileMode = window.screen.width < 900 ? true : false;

		return (
			<div ref={customRef} style={{ paddingBottom: 12 }}>
				<svg width={width} height={height}>
					<LinearGradient
						id="linear"
						fromOpacity={0.3}
						toOpacity={0.3}
						from="#039be5"
						to="#039be5"
					/>
					<rect x={0} y={0} width={width} height={height} fill="#ffffff" rx={5} />
					<Group left={margin.left}>
						<AxisLeft
							top={margin.top}
							left={0}
							scale={yScale}
							hideZero
							label={y_label[data_y]}
							labelProps={
								mobileMode
									? {
											textAnchor: 'middle',
											fontSize: 12,
											fontWeight: 'bold',
									  }
									: {
											textAnchor: 'middle',
											fontSize: 16,
											fontWeight: 'bold',
									  }
							}
							tickValues={tvs}
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
								<text {...tickProps}>{parseInt(formattedValue)}</text>
							)}
						/>
						<AxisBottom
							top={height - margin.bottom}
							left={0}
							scale={xScale}
							numTicks={10}
							label={
								data_x === 'firstVisit'
									? 'Timeline (First Visit)'
									: 'Timeline (Last Modification)'
							}
							labelProps={
								mobileMode
									? {
											textAnchor: 'middle',
											fontSize: 12,
											fontWeight: 'bold',
									  }
									: {
											textAnchor: 'middle',
											fontSize: 16,
											fontWeight: 'bold',
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
								<text {...tickProps}>{`${formattedValue}m`}</text>
							)}
						/>
					</Group>

					<Group top={margin.top} left={margin.left}>
						{data.map((point, i) => {
							const { timeCategory } = point;
							const cx = xScale(x(point));
							const cy = yScale(y(point));

							const r = 5;

							const color = this.getColor(point);
							const commonProps = {
								onMouseEnter: event => {
									if (tooltipTimeout) clearTimeout(tooltipTimeout);
									this.props.showTooltip({
										tooltipLeft: cx,
										tooltipTop: cy + 40,
										tooltipData: point,
									});
								},
								onMouseLeave: event => {
									tooltipTimeout = setTimeout(() => {
										this.props.hideTooltip();
									}, 300);
								},
								opacity: 0.8,
								fill: color,
								key: `point-${point.x}-${i}`,
							};
							if (timeCategory === 'overtime') {
								const points = getPointsForTriangle({ r, cx, cy });
								return <Polygon points={points} {...commonProps} />;
							}
							if (timeCategory === 'wasted') {
								const points = getPointsForSquare({ r, cx, cy });
								return <Polygon points={points} {...commonProps} />;
							} else if (timeCategory === 'perfect') {
								return <Circle cx={cx} cy={cy} r={r} {...commonProps} />;
							} else {
								return null;
							}
						})}
					</Group>
					{firstSeenTime >= 0 ? (
						<Group left={margin.left} top={margin.top}>
							<Bar
								width={this.state.isFirstSeenLabelVisible ? 3 : 2}
								height={height - 90}
								x={xScale(firstSeenTime / 60)}
								y={yMax - height + 90}
								fill="#000"
								data={{ x: firstSeenTime / 60, y: y(0) }}
								onMouseEnter={event => {
									this.setState({ isFirstSeenLabelVisible: true });
								}}
								onMouseLeave={event => {
									this.setState({ isFirstSeenLabelVisible: false });
								}}
							/>
							{this.state.isFirstSeenLabelVisible && (
								<svg
									x={xScale(firstSeenTime / 60) + 5}
									y={yMax - height + 90}
									width="165"
									height="45"
								>
									<rect
										x="1"
										y="1"
										width={160}
										height={40}
										ry={8}
										points="0,0 160,0 160,40 0,40"
										stroke="#aaa"
										fill="#fff"
									/>
									<text x="50%" y="25" fill="#000" text-anchor="middle">
										First seen time
									</text>
								</svg>
							)}
						</Group>
					) : null}
				</svg>
				{this.props.tooltipOpen && (
					<Tooltip left={this.props.tooltipLeft} top={this.props.tooltipTop}>
						<div style={{ fontSize: 11 }}>
							<div>
								{'Question No. '}
								<strong>{+this.props.tooltipData.questionNo}</strong>
							</div>
							<div style={{ marginTop: 4 }}>
								{'Section: '}
								<b>{this.props.tooltipData.sectionName}</b>
							</div>
							<div style={{ marginTop: 4 }}>
								{'Total time taken: '}
								<strong>{Math.round(this.props.tooltipData.totalTime) + 's'}</strong>
							</div>
							<div style={{ marginTop: 4 }}>
								{'Total visits: '}
								<strong>{this.props.tooltipData.totalVisits}</strong>
							</div>
							<div style={{ marginTop: 4 }}>
								{'Avg accuracy: '}
								<strong>{this.props.tooltipData.accuracy}</strong>
							</div>
							<div style={{ marginTop: 4 }}>
								{'Avg time: '}
								<strong>{this.props.tooltipData.p1}s</strong>
							</div>
						</div>
					</Tooltip>
				)}
				<div
					style={{
						display: 'none',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Legend
						direction="row"
						itemDirection="row"
						labelMargin="0"
						shapeMargin="0 0 0px 0"
						itemMargin="-20px 20px 0 0"
						shapeWidth={25}
						shapeHeight={16}
						scale={ordinalShapeDot}
						shape={props => {
							return (
								<svg width={props.width} height={props.height}>
									{!React.isValidElement(ordinalShapeDot(props.label.datum)) &&
										React.createElement(ordinalShapeDot(props.label.datum), {
											...props,
										})}
									{React.isValidElement(ordinalShapeDot(props.label.datum)) &&
										React.cloneElement(ordinalShapeDot(props.label.datum))}
								</svg>
							);
						}}
						style={{ display: 'flex', justifyContent: 'center' }}
					/>
					{data_y !== 'questionsSeen' ? (
						<AntTooltip
							placement="topLeft"
							title={'Time at which all questions are seen'}
						>
							<InfoCircleTwoTone style={{ marginTop: -18, marginLeft: -12 }} />
						</AntTooltip>
					) : null}
				</div>
			</div>
		);
	}
}

const Component = sizeMe()(withTooltip(Roadmap));

const getViewTime = (numberOfTimesTracked = 0) => {
	if (numberOfTimesTracked < 5) {
		return Math.pow(3, numberOfTimesTracked) * 4000;
	}
	return -1;
};
const Wrapper = props => {
	const viewportAnalyticsCallTimeoutId = useRef(null);
	const graphRef = useRef(null);
	const [numberOfTimesTracked, setNumberOfTimesTracked] = useState(0);
	const [hasGraphRef, setHasGraphRef] = useState(false);
	useEffect(() => {
		let observer;
		if (hasGraphRef && graphRef.current) {
			const handleSroll = entries => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					if (!viewportAnalyticsCallTimeoutId.current) {
						const afterTime = getViewTime(numberOfTimesTracked);
						if (afterTime > -1) {
							viewportAnalyticsCallTimeoutId.current = setTimeout(() => {
								viewportAnalyticsCallTimeoutId.current = null;
								window.ga('send', 'event', {
									...props.googleAnalyticsData,
									eventValue: Math.floor(afterTime / 1000),
									nonInteraction: true,
								});
								setNumberOfTimesTracked(numberOfTimesTracked + 1);
							}, afterTime);
						}
					}
				} else if (viewportAnalyticsCallTimeoutId.current) {
					clearTimeout(viewportAnalyticsCallTimeoutId.current);
					viewportAnalyticsCallTimeoutId.current = null;
				}
			};
			observer = new IntersectionObserver(handleSroll, {
				rootMargin: '0px',
				threshold: 0.87,
			});
			observer.observe(graphRef.current);
		}
		return () => {
			observer && observer.disconnect();
		};
	}, [numberOfTimesTracked, hasGraphRef]);
	const handleGraphRef = ref => {
		graphRef.current = ref;
		setHasGraphRef(!!graphRef.current);
	};
	return <Component {...props} customRef={handleGraphRef} />;
};

export default Wrapper;
