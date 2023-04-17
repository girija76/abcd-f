import React from 'react';
import Speedometer from '../../../widgets/Speedometer';

const Accuracy = ({ correct, incorrect }) => {
	const accuracy = correct / Math.max(correct + incorrect, 1);
	const speedometerConfig = {
		ranges: [
			{ min: 0, max: 0.333, color: '#bd413a' },
			{ min: 0.333, max: 0.666, color: '#f6cda0' },
			{ min: 0.666, max: 1, color: '#539750' },
		],
		height: 100,
		width: 220,
		arcWidth: 3,
		arrowWidth: 10,
	};
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				paddingBottom: 10,
			}}
		>
			<h3 style={{ padding: '10px 20px', margin: 0 }}>Accuracy</h3>
			<Speedometer config={speedometerConfig} value={accuracy} />
		</div>
	);
};

export default Accuracy;
