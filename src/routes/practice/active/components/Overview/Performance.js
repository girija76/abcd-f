import React from 'react';
import Speed from './Speed';
import Accuracy from './Accuracy';
import { getSpeedsOfSession } from 'utils/session';

import './styles.css';

const height = 70;
const width = 120;

const Performance = ({
	session,
	correctCount,
	incorrectCount,
	className,
	width,
	height,
	size,
}) => {
	const {
		average: averageSpeed,
		min: minSpeed,
		max: maxSpeed,
	} = getSpeedsOfSession(session);

	const marginTop = size === 'small' ? -8 : -16;

	return (
		<div className="performance-wrapper">
			<div style={{ display: 'flex' }}>
				<Accuracy
					className="item"
					height={height}
					width={width}
					correct={correctCount}
					incorrect={incorrectCount}
					size={size}
				/>
				<Speed
					className="item"
					height={height}
					width={width}
					min={minSpeed}
					max={maxSpeed}
					speed={averageSpeed}
					size={size}
				/>
			</div>
			{0 ? (
				<div style={{ marginTop, paddingLeft: 12, fontWeight: 500 }}>
					Your accuracy and speed of solving questions is good. Keep working on your
					weak spots to achieve excellence.
				</div>
			) : null}
		</div>
	);
};

Performance.defaultProps = {
	width,
	height,
};

export default Performance;
