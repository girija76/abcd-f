import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const getCircleProps = ({ width, height, arcWidth }) => {
	const radius = Math.min((width - 2 * arcWidth) / 2, height - 2 * arcWidth);
	const x = width / 2;
	const y = height;
	return { center: { X: x, Y: y }, radius };
};

const getRangeAnglesConfig = ({ ranges }) => {
	// spectrum of [1,2,5] is 5-1 = 4
	// it will used to distribute the angles
	const spectrum = ranges[ranges.length - 1].max - ranges[0].min;
	let startAngle = Math.PI;
	const angleConfig = ranges.map(range => {
		const angle = ((range.max - range.min) / spectrum) * Math.PI;
		const rangeConfig = {
			angle: { start: startAngle, end: startAngle + angle },
			color: range.color,
		};
		startAngle += angle;
		return rangeConfig;
	});
	return angleConfig;
};

const drawArrow = (ctx, { circle, width, length }, angle) => {
	const halfWidth = width / 2;
	const arrowLength = length - width / 2;
	ctx.strokeStyle = 'transparent';
	ctx.fillStyle = 'blac';
	ctx.lineWidth = 1;
	const arrowTip = {};
	arrowTip.X = circle.center.X - arrowLength * Math.cos(angle);
	arrowTip.Y = circle.center.Y - halfWidth - arrowLength * Math.sin(angle);
	ctx.beginPath();
	ctx.moveTo(arrowTip.X, arrowTip.Y);
	ctx.arc(
		circle.center.X,
		circle.center.Y - halfWidth,
		width / 2,
		angle - Math.PI / 2,
		angle + Math.PI / 2
	);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};
const renderCanvas = (canvas, config, angle) => {
	const circle = getCircleProps(config);
	const angleConfig = getRangeAnglesConfig(config);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, config.width, config.height);
	angleConfig.forEach(arcConfig => {
		ctx.lineWidth = config.arcWidth;
		ctx.beginPath();
		ctx.strokeStyle = arcConfig.color;
		ctx.arc(
			circle.center.X,
			circle.center.Y,
			circle.radius,
			arcConfig.angle.start,
			arcConfig.angle.end,
			false
		);
		ctx.stroke();
	});
	drawArrow(
		ctx,
		{
			circle,
			width: config.arrowWidth,
			length: circle.radius * 0.9,
		},
		angle
	);
};
const Speedometer = ({ config, value }) => {
	const ref = useRef();
	const canvasHeight = 1000;
	const canvasWidth = (config.width * canvasHeight) / config.height;
	const zoomFactor = canvasHeight / config.height;
	useEffect(() => {
		const spectrum =
			config.ranges[config.ranges.length - 1].max - config.ranges[0].min;
		const angle = (Math.PI * value) / spectrum;
		renderCanvas(
			ref.current,
			{
				...config,
				width: canvasWidth,
				height: canvasHeight,
				arcWidth: config.arcWidth * zoomFactor,
				arrowWidth: config.arrowWidth * zoomFactor,
			},
			angle
		);
	}, [value]);
	return (
		<div
			style={{ width: config.width, height: config.height, overflow: 'hidden' }}
		>
			<canvas
				width={canvasWidth}
				height={canvasHeight}
				ref={ref}
				style={{
					transform: `scale(${config.height / canvasHeight})`,
					transformOrigin: '0 0',
				}}
			/>
		</div>
	);
};

Speedometer.propTypes = {
	config: PropTypes.shape({
		ranges: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
				value: PropTypes.number,
			})
		),
		arcWidth: PropTypes.number,
		arrowWidth: PropTypes.number,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	}),
	value: PropTypes.number.isRequired,
};

Speedometer.defaultProps = {
	config: {
		ranges: [
			{ min: 0, max: 3.33, color: '#bd413a' },
			{ min: 3.33, max: 6.66, color: '#539750' },
			{ min: 6.66, max: 10, color: '#f6cda0' },
		],
		height: 200,
		width: 300,
		arcWidth: 5,
		arrowWidth: 10,
	},
	value: 5,
};

export default Speedometer;
