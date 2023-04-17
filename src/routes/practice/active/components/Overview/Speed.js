import React from 'react';

import SpeedometerComponent from 'widgets/Speedometer';
import BetterSpeedometer from 'widgets/BetterSpeedometer';

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

export class Speedometer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.screen.width,
		};
	}

	componentWillMount() {
		window.addEventListener('resize', this.setWidth, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setWidth, false);
	}

	setWidth = () => {
		this.setState({ width: window.screen.width });
	};

	render() {
		const { speed, min, max, height, size } = this.props;
		const { width } = this.state;
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
			height,
			width,
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
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<BetterSpeedometer
					config={speedometerConfig}
					value={meterReading / 180.0}
					type={2}
					width={size === 'small' ? 120 : width >= 1024 ? 240 : 192}
				/>
			</div>
		);
	}
}

export default Speedometer;
