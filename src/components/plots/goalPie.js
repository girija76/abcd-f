import React, { Component } from 'react';
import Divider from 'antd/lib/divider';
import { COLORS } from '../colors';

export default class goalPie extends Component {
	render = () => {
		const { todays_correct, target, color } = this.props;
		const outerDiameter = 100;
		const arcWidthThin = 20;
		const arcWidthThick = 30;
		const innerDiameter1 = outerDiameter - (arcWidthThick - arcWidthThin) / 2;
		const innerDiameter2 = innerDiameter1 - arcWidthThin;
		const innerDiameter3 = innerDiameter1 - (arcWidthThick + arcWidthThin) / 2;

		const percent = Math.min(Math.floor((100 * todays_correct) / target), 100);

		let transform1 = '';
		let transform2 = '';
		let transform3 = '';
		let transform4 = '';
		if (percent < 25) {
			transform1 = `rotateZ(0deg) skewY(${-90 * (1 - percent / 25)}deg)`;
		} else {
			transform1 = `rotateZ(0deg) skewY(0deg)`;
		}

		if (percent < 50) {
			transform2 = `rotateZ(90deg) skewY(${-90 * (2 - percent / 25)}deg)`;
		} else {
			transform2 = `rotateZ(90deg) skewY(0deg)`;
		}

		if (percent < 75) {
			transform3 = `rotateZ(180deg) skewY(${-90 * (3 - percent / 25)}deg)`;
		} else {
			transform3 = `rotateZ(180deg) skewY(0deg)`;
		}

		if (percent < 100) {
			transform4 = `rotateZ(270deg) skewY(${-90 * (4 - percent / 25)}deg)`;
		} else {
			transform4 = `rotateZ(270deg) skewY(0deg)`;
		}

		// rotate = 0
		// 0 degree = 25%
		// -90 degree = 0%

		// rotate = x
		// 0 degree = 25%
		// x degree = 25 + x%

		return (
			<div
				style={{
					position: 'relative',
					width: outerDiameter,
					height: outerDiameter,
					borderRadius: 1000,
					overflow: 'hidden',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: innerDiameter1,
						height: innerDiameter1,
						backgroundColor: color === 'light' ? 'white' : COLORS.background,
						borderRadius: 1000,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							width: innerDiameter2,
							height: innerDiameter2,
							borderRadius: 1000,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							backgroundColor: color === 'light' ? COLORS.background : 'white',
						}}
					>
						<div
							style={{
								width: innerDiameter3,
								height: innerDiameter3,
								backgroundColor: color === 'light' ? COLORS.background : 'white',
								borderRadius: 1000,
								zIndex: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								color: COLORS.primaryDark,
							}}
						>
							<div
								style={{
									color: COLORS.primaryDark,
									fontSize: 36,
									lineHeight: '42px',
									fontWeight: 'bold',
								}}
								className="number"
							>
								{todays_correct}
							</div>
							<Divider
								style={{ width: 40, backgroundColor: COLORS.primaryDark, margin: 0 }}
							/>
							<div
								style={{ color: COLORS.primaryDark, fontSize: 18, lineHeight: '20px' }}
								className="number"
							>
								{target}
							</div>
						</div>
					</div>
					{percent > 0 ? (
						<div
							style={{
								position: 'absolute',
								backgroundColor: COLORS.primaryDark,
								transform: transform1 /* less than 180 degrees */,
								width: outerDiameter,
								height: outerDiameter,
								transformOrigin: 'bottom left',
								left: outerDiameter / 2 /* outer radius width /2 */,
								top: -outerDiameter / 2 /* width/2 - height*/,
							}}
						/>
					) : null}
					{percent > 25 ? (
						<div
							style={{
								position: 'absolute',
								backgroundColor: COLORS.primaryDark,
								transform: transform2 /* less than 180 degrees */,
								width: outerDiameter,
								height: outerDiameter,
								transformOrigin: 'bottom left',
								left: outerDiameter / 2 /* outer radius width /2 */,
								top: -outerDiameter / 2 /* width/2 - height*/,
							}}
						/>
					) : null}
					{percent > 50 ? (
						<div
							style={{
								position: 'absolute',
								backgroundColor: COLORS.primaryDark,
								transform: transform3 /* less than 180 degrees */,
								width: outerDiameter,
								height: outerDiameter,
								transformOrigin: 'bottom left',
								left: outerDiameter / 2 /* outer radius width /2 */,
								top: -outerDiameter / 2 /* width/2 - height*/,
							}}
						/>
					) : null}
					{percent > 75 ? (
						<div
							style={{
								position: 'absolute',
								backgroundColor: COLORS.primaryDark,
								transform: transform4 /* less than 180 degrees */,
								width: outerDiameter,
								height: outerDiameter,
								transformOrigin: 'bottom left',
								left: outerDiameter / 2 /* outer radius width /2 */,
								top: -outerDiameter / 2 /* width/2 - height*/,
							}}
						/>
					) : null}
				</div>
			</div>
		);
	};
}
