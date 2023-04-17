import React from 'react';
import { Group } from '@visx/group';
import { letterFrequency } from '@visx/mock-data';
import { scaleLinear } from '@visx/scale';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';
import { Text } from '@visx/text';

const orange = '#039be5';
const pumpkin = '#039be5';
const silver = '#d9d9d9';
const bg = '#ffffff';

const ANG = 360;
// const data = letterFrequency.slice(2, 12);

const y = d => d.value;

export default ({
	width,
	height,
	levels = 4,
	data,
	margin = {
		top: 20,
		left: 40,
		right: 60,
		bottom: 20,
	},
}) => {
	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;
	const radius = Math.min(xMax, yMax) / 2;

	const radiusScale = scaleLinear({
		range: [0, Math.PI * 2],
		domain: [ANG, 0],
	});

	const yScale = scaleLinear({
		range: [0, radius],
		domain: [0, 100],
	});

	const webs = genAngles(data.length);
	const points = genPoints(data.length, radius);
	const pointLabels = genPointLabels(data, radius + 15);
	const polygonPoints = genPolygonPoints(data, yScale, y);
	const zeroPoint = new Point({ x: 0, y: 0 });

	// const points = [{ x: 0, y: 120 }];

	// ml + (w - ml - mr) / 2
	// w - (mr - ml) / 2

	return (
		<svg width={width} height={height}>
			<rect fill={bg} width={width} height={height} rx={14} />
			<Group top={height / 2} left={(width - margin.right + margin.left) / 2}>
				{[...Array(levels)].map((_, i) => {
					const r = ((i + 1) * radius) / levels;
					return (
						<LineRadial
							key={`web-${i}`}
							data={webs}
							angle={d => radiusScale(d.angle)}
							radius={r}
							fill="none"
							stroke={silver}
							strokeWidth={2}
							strokeOpacity={0.8}
							strokeLinecap="round"
						/>
					);
				})}
				{[...Array(points.length)].map((_, i) => {
					return (
						<Line
							key={`radar-line-${i}`}
							from={zeroPoint}
							to={points[i]}
							stroke={silver}
						/>
					);
				})}
				<polygon
					points={polygonPoints.polygon}
					fill={orange}
					fillOpacity={0.3}
					stroke={orange}
					strokeWidth={1}
				/>
				{polygonPoints.map((point, i) => {
					return (
						<circle
							key={`radar-point-${i}`}
							cx={point.x}
							cy={point.y}
							r={2}
							fill={pumpkin}
						/>
					);
				})}
				{pointLabels.map((point, idx) => {
					let xOffset = 0;
					let yOffset = 0;
					if (idx === 0) {
						xOffset = 0;
					} else if (idx === 1) {
						xOffset = -10;
					} else if (idx === 2) {
						xOffset = -7;
					} else if (idx === 3) {
						xOffset = -20;
					} else if (idx === 4) {
						xOffset = -25;
						yOffset -= 10;
					}

					return (
						<Text
							key={idx}
							verticalAnchor="start"
							x={point.x + xOffset}
							y={point.y + yOffset}
							style={{ fontSize: 11 }}
						>
							{point.label}
						</Text>
					);
				})}
			</Group>
		</svg>
	);
};

function genAngles(length) {
	return [...Array(length + 1)].map((_, i) => {
		return {
			angle: i * (ANG / length),
		};
	});
}

function genPoints(length, radius) {
	const step = (Math.PI * 2) / length;
	return [...Array(length)].map((_, i) => {
		return {
			x: radius * Math.sin(i * step),
			y: -radius * Math.cos(i * step),
		};
	});
}

function genPointLabels(data, radius) {
	const length = data.length;
	const step = (Math.PI * 2) / length;
	return data.map((d, i) => {
		return {
			x: radius * Math.sin(i * step),
			y: -radius * Math.cos(i * step),
			label: d.name,
		};
	});
}

function genPolygonPoints(data, scale, access) {
	const step = (Math.PI * 2) / data.length;
	const points = new Array(data.length).fill({});
	const pointString = new Array(data.length + 1).fill('').reduce((res, _, i) => {
		if (i > data.length) return res;
		const x = scale(access(data[i - 1])) * Math.sin((i - 1) * step);
		const y = -scale(access(data[i - 1])) * Math.cos((i - 1) * step);
		points[i - 1] = { x, y };
		return (res += `${x},${y} `);
	});
	points.polygon = pointString;
	return points;
}
