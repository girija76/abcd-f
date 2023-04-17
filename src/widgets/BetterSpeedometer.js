import React from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

function getPoints(angle, radius) {
	const angle1 = 0.25;
	const angle2 = 0.006;

	const r1 = radius > 100 ? 70 : radius > 70 ? 50 : 30;
	const r2 = radius > 100 ? 12 : radius > 70 ? 9 : 6;

	const x0 = 0;
	const y0 = 0;

	const x1 = r2 * Math.cos(angle - angle1);
	const y1 = -r2 * Math.sin(angle - angle1);

	const x2 = r1 * Math.cos(angle - angle2);
	const y2 = -r1 * Math.sin(angle - angle2);

	const x3 = r1 * Math.cos(angle + angle2);
	const y3 = -r1 * Math.sin(angle + angle2);

	const x4 = r2 * Math.cos(angle + angle1);
	const y4 = -r2 * Math.sin(angle + angle1);

	const x5 = 0;
	const y5 = 0;

	return [
		`${x0},${y0}`,
		`${x1},${y1}`,
		`${x2},${y2}`,
		`${x3},${y3}`,
		`${x4},${y4}`,
		`${x5},${y5}`,
	];
}

function getScaledData(value) {
	if (value < 15 / 180) return 2 * value;
	if (value < 165 / 180) return 40 / 240.0 + ((value - 15 / 180) * 4) / 5;
	return 200 / 240 + (value - 165 / 180) * 2;
}

export default ({
	config,
	value,
	type,
	width,
	margin = {
		top: -5,
		left: 5,
		right: 5,
		bottom: 5,
	},
}) => {
	const data =
		type === 1
			? [
					{ count: 48, color: '#faad14' },
					{ count: 1, color: 'white' },
					{ count: 72, color: '#30bf78' },
					{ count: 120, color: 'white' },
					{ count: 72, color: '#f4664a' },
					{ count: 1, color: 'white' },
					{ count: 48, color: '#faad14' },
			  ]
			: [
					{ count: 80, color: '#30bf78' },
					{ count: 1, color: 'white' },
					{ count: 40, color: '#f4664a' },
					{ count: 120, color: 'white' },
					{ count: 40, color: '#f4664a' },
					{ count: 1, color: 'white' },
					{ count: 80, color: '#30bf78' },
			  ];

	const scaledValue = type === 1 ? value : getScaledData(value);

	const height = width;
	const radius = Math.min(width, height) / 2;
	const r2 = radius > 100 ? 12 : radius > 70 ? 9 : 6;
	const r3 = radius > 100 ? 8 : radius > 70 ? 6 : 3;

	const hideNumbers = radius < 100 ? true : false;

	const textSize = radius > 70 ? 20 : 14;
	const textSize2 = radius > 70 ? 16 : 13;
	const xOffset1 = radius > 70 ? -42 : -30;
	const xOffset2 = radius > 70 ? -28 : -20;
	const yOffset = radius > 70 ? -38 : -28;
	const rOffset = radius > 70 ? -20 : -16;

	const xf1 = radius > 70 ? 8 : 6;
	const xf2 = radius > 70 ? 12 : 8;
	const xf3 = radius > 70 ? 12 : 8;
	const xf4 = radius > 70 ? 20 : 14;
	const yf1 = radius > 70 ? 4 : 4;
	const yf2 = radius > 70 ? 6 : 6;
	const yf3 = radius > 70 ? 6 : 6;
	const yf4 = radius > 70 ? 4 : 4;
	const texts = [
		{ angle: (7 * Math.PI) / 6, text: '0', offsetX: xf1, offsetY: yf1 },
		{
			angle: (7 * Math.PI) / 6 - (4 * Math.PI * 0.3) / 3,
			text: '30',
			offsetX: xf2,
			offsetY: yf2,
		},
		{
			angle: (7 * Math.PI) / 6 - (4 * Math.PI * 0.7) / 3,
			text: '70',
			offsetX: xf3,
			offsetY: yf3,
		},
		{
			angle: (7 * Math.PI) / 6 - (4 * Math.PI) / 3,
			text: '100',
			offsetX: xf4,
			offsetY: yf4,
		},
	];
	return (
		<svg width={width} height={height}>
			<Group top={height / 2 - margin.top} left={width / 2}>
				<Pie
					data={data}
					pieValue={d => {
						return d.count;
					}}
					outerRadius={radius}
					innerRadius={radius - r2}
					cornerRadius={0}
					padAngle={0}
					pieSort={(a, b) => {}}
				>
					{pie => {
						return pie.arcs.map((arc, i) => {
							const [centroidX, centroidY] = pie.path.centroid(arc);
							return (
								<g key={`letters-${arc.data.label}-${i}`}>
									<path d={pie.path(arc)} fill={arc.data.color} />
									<Text
										fill="white"
										textAnchor="middle"
										x={centroidX}
										y={centroidY}
										dy=".33em"
										fontSize={11}
										width={52}
									>
										{arc.data.value}
									</Text>
								</g>
							);
						});
					}}
				</Pie>

				{!hideNumbers && type === 1
					? texts.map(point => {
							const r = radius - r2 + rOffset;
							const x = r * Math.cos(point.angle);
							const y = -r * Math.sin(point.angle);

							return (
								<Text
									verticalAnchor="start"
									x={x - point.offsetX}
									y={y - point.offsetY}
									style={{ fill: '#8c8c8c', fontSize: textSize2 }}
								>
									{point.text}
								</Text>
							);
					  })
					: null}
				{type === 1 ? (
					<Text
						verticalAnchor="start"
						x={xOffset1}
						y={radius - r2 + yOffset}
						style={{ fill: '#8c8c8c', fontSize: textSize, fontWeight: 500 }}
					>
						Accuracy
					</Text>
				) : (
					<Text
						verticalAnchor="start"
						x={xOffset2}
						y={radius - r2 + yOffset}
						style={{ fill: '#8c8c8c', fontSize: textSize, fontWeight: 500 }}
					>
						Speed
					</Text>
				)}
				<polygon
					points={getPoints(
						(7 * Math.PI) / 6 - (4 * Math.PI * scaledValue) / 3,
						radius
					)}
					fill="#8c8c8c"
					fillOpacity={1}
					stroke="#8c8c8c"
					strokeWidth={1}
				/>
				<Pie
					data={[{ count: 360, color: '#8c8c8c' }]}
					pieValue={d => {
						return d.count;
					}}
					outerRadius={r2}
					innerRadius={0}
					cornerRadius={0}
					padAngle={0}
					pieSort={(a, b) => {}}
				>
					{pie => {
						return pie.arcs.map((arc, i) => {
							const [centroidX, centroidY] = pie.path.centroid(arc);
							return (
								<g key={`letters-${arc.data.label}-${i}`}>
									<path d={pie.path(arc)} fill={arc.data.color} />
									<Text
										fill="white"
										textAnchor="middle"
										x={centroidX}
										y={centroidY}
										dy=".33em"
										fontSize={11}
										width={52}
									>
										{arc.data.value}
									</Text>
								</g>
							);
						});
					}}
				</Pie>
				<Pie
					data={[{ count: 360, color: 'white' }]}
					pieValue={d => {
						return d.count;
					}}
					outerRadius={r3}
					innerRadius={0}
					cornerRadius={0}
					padAngle={0}
					pieSort={(a, b) => {}}
				>
					{pie => {
						return pie.arcs.map((arc, i) => {
							const [centroidX, centroidY] = pie.path.centroid(arc);
							return (
								<g key={`letters-${arc.data.label}-${i}`}>
									<path d={pie.path(arc)} fill={arc.data.color} />
									<Text
										fill="white"
										textAnchor="middle"
										x={centroidX}
										y={centroidY}
										dy=".33em"
										fontSize={11}
										width={52}
									>
										{arc.data.value}
									</Text>
								</g>
							);
						});
					}}
				</Pie>
			</Group>
		</svg>
	);
};
