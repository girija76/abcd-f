/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import './EventCountdown.css';

export default class EventCountdown extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		setInterval(() => {
			this.setState({ random: Math.random() });
		}, 1000);
	}

	render = () => {
		const targetDate = new Date('11/24/2019');
		const todayDate = new Date();
		if (todayDate.getTime() > targetDate.getTime()) {
			return null;
		}

		const rTime0 = targetDate.getTime() - todayDate.getTime();
		const days = Math.floor(rTime0 / (1000 * 3600 * 24));
		const daysFirstDigit = Math.floor(days / 10);
		const daysSecondDigit = days - 10 * daysFirstDigit;

		const rTime1 = rTime0 - days * 3600 * 24 * 1000;
		const hours = Math.floor(rTime1 / (1000 * 3600));
		const hoursFirstDigit = Math.floor(hours / 10);
		const hoursSecondDigit = hours - 10 * hoursFirstDigit;

		const rTime2 = rTime1 - hours * 3600 * 1000;
		const mins = Math.floor(rTime2 / (1000 * 60));
		const minsFirstDigit = Math.floor(mins / 10);
		const minsSecondDigit = mins - 10 * minsFirstDigit;

		const rTime3 = rTime2 - mins * 60 * 1000;
		const secs = Math.floor(rTime3 / 1000);
		const secsFirstDigit = Math.floor(secs / 10);
		const secsSecondDigit = secs - 10 * secsFirstDigit;

		return (
			<div className="nunito-font">
				<div
					style={{
						backgroundColor: '#FE759C',
						display: 'flex',
						justifyContent: 'center',
						paddingTop: 16,
						paddingBottom: 52,
						alignItems: 'flex-end',
					}}
					className="product-wrapper"
				>
					<div style={{ color: 'white', fontSize: 24 }}>Just</div>
					<div style={{ display: 'flex', margin: '0px 20px' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: '0px 8px',
							}}
						>
							<div style={{ color: 'white' }}>Days</div>
							<div style={{ display: 'flex' }}>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{daysFirstDigit}
								</div>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{daysSecondDigit}
								</div>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: '0px 8px',
							}}
						>
							<div style={{ color: 'white' }}>Hours</div>
							<div style={{ display: 'flex' }}>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{hoursFirstDigit}
								</div>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{hoursSecondDigit}
								</div>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: '0px 8px',
							}}
						>
							<div style={{ color: 'white' }}>Minutes</div>
							<div style={{ display: 'flex' }}>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{minsFirstDigit}
								</div>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{minsSecondDigit}
								</div>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: '0px 8px',
							}}
						>
							<div style={{ color: 'white' }}>Seconds</div>
							<div style={{ display: 'flex' }}>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{secsFirstDigit}
								</div>
								<div
									style={{
										backgroundColor: 'white',
										borderRadius: 3,
										width: 24,
										height: 24,
										margin: 4,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 16,
										fontWeight: 'bold',
									}}
								>
									{secsSecondDigit}
								</div>
							</div>
						</div>
					</div>
					<div style={{ color: 'white', fontSize: 24 }}>left for CAT</div>
				</div>
				<div
					style={{
						height: 180,
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
					className="product-wrapper"
				>
					<div
						style={{
							position: 'absolute',
							top: -27,
							borderRadius: 3,
							boxShadow: '0px 0px 15px #00000029',
							backgroundColor: 'white',
							padding: '12px 16px',
						}}
					>
						<div style={{ textAlign: 'center', fontSize: 20, color: '#707070' }}>
							Subscribe and get access to
						</div>
						<div
							style={{
								display: 'flex',
								margin: '16px 4px',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div style={{ fontSize: 20 }}>
									500<span style={{ color: '#0AABDC' }}>+</span>
								</div>
								<div>Practice</div>
								<div style={{ marginTop: -5 }}>Sessions</div>
							</div>
							<div
								style={{
									width: 1,
									height: 48,
									backgroundColor: '#B9B9B9',
								}}
								className="vLine"
							></div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div style={{ fontSize: 20 }}>
									40<span style={{ color: '#0AABDC' }}>+</span>
								</div>
								<div>Topic Based</div>
								<div style={{ marginTop: -5 }}>Tests</div>
							</div>
							<div
								style={{
									width: 1,
									height: 48,
									backgroundColor: '#B9B9B9',
								}}
								className="vLine"
							></div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div style={{ fontSize: 20 }}>
									10<span style={{ color: '#0AABDC' }}>+</span>
								</div>
								<div>Sectional</div>
								<div style={{ marginTop: -5 }}>Tests</div>
							</div>
							<div
								style={{
									width: 1,
									height: 48,
									backgroundColor: '#B9B9B9',
								}}
								className="vLine"
							></div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div style={{ fontSize: 20 }}>
									5<span style={{ color: '#0AABDC' }}>+</span>
								</div>
								<div>Personalized AI</div>
								<div style={{ marginTop: -5 }}>Based Tests</div>
							</div>
							<div
								style={{
									width: 1,
									height: 48,
									backgroundColor: '#B9B9B9',
								}}
								className="vLine"
							></div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								<div style={{ fontSize: 20 }}>5</div>
								<div>Complete</div>
								<div style={{ marginTop: -5 }}>Mock Tests</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
