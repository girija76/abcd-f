import React from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

const colors = {
	correct: '#4caf50',
	incorrect: '#f44336',
	unattempted: '#8e989c',
};

export default ({
	events = false,
	margin = {
		top: 5,
		left: 5,
		right: 5,
		bottom: 5,
	},
	data,
}) => {
	let modifiedData = [];
	data.forEach(d => {
		if (d.count) {
			modifiedData.push(d);
		}
	});
	let width = 240;
	let height = 240;
	const radius = Math.min(width, height) / 2;
	return (
		<svg width={width} height={height}>
			<Group top={height / 2 - margin.top} left={width / 2}>
				<Pie
					data={modifiedData}
					pieValue={d => {
						return d.count;
					}}
					outerRadius={radius - 10}
					innerRadius={radius - 70}
					cornerRadius={3}
					padAngle={0.03}
					pieSort={(a, b) => {}}
				>
					{pie => {
						return pie.arcs.map((arc, i) => {
							const [centroidX, centroidY] = pie.path.centroid(arc);
							return (
								<g key={`letters-${i}`}>
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
										{arc.data.count}
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
