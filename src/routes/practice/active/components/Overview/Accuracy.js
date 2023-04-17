import React from 'react';
import BetterSpeedometer from 'widgets/BetterSpeedometer';

export class Accuracy extends React.Component {
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
		const { className, correct, incorrect, height, size, width: w } = this.props;
		const { width } = this.state;
		const accuracy = correct / Math.max(correct + incorrect, 1);
		const speedometerConfig = {
			ranges: [
				{ min: 0, max: 0.333, color: '#bd413a' },
				{ min: 0.333, max: 0.666, color: '#f6cda0' },
				{ min: 0.666, max: 1, color: '#539750' },
			],
			height,
			width,
			arcWidth: 3,
			arrowWidth: 10,
		};

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
					value={accuracy}
					type={1}
					width={size === 'small' ? 120 : width >= 1024 ? 240 : 192}
				/>
			</div>
		);
	}
}

export default Accuracy;
