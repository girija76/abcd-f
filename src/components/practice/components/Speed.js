import React from 'react';

import SpeedometerComponent from '../../../widgets/Speedometer';

const colors = {
	slow: '#fdbf00',
	optimum: '#7fc32a',
	fast: '#fd5722',
};
const categoryTexts = {
	slow: 'Too Slow',
	optimum: 'Optimum',
	fast: 'Too Fast',
};

const Speedometer = ({ speed, min, max }) => {
	const perfectLimitAngles = {
		min: 15,
		max: 165,
	};
	const speedometerConfig = {
		ranges: [
			{ min: 0, max: perfectLimitAngles.min, color: '#bd413a' },
			{
				min: perfectLimitAngles.min,
				max: perfectLimitAngles.max,
				color: '#539750',
			},
			{ min: perfectLimitAngles.max, max: 180, color: '#bd413a' },
		],
		height: 100,
		width: 200,
		arcWidth: 3,
		arrowWidth: 10,
	};
	let meterReading = Math.min(
		((perfectLimitAngles.max - perfectLimitAngles.min) / (max - min)) * speed,
		180
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				paddingBottom: 10,
			}}
		>
			<h3 style={{ padding: '10px 20px', margin: 0 }}>Speed</h3>
			<SpeedometerComponent config={speedometerConfig} value={meterReading} />
		</div>
	);
};

export default Speedometer;
