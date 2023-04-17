import React from 'react';

const Play = ({ size = 24, color = '#fff' }) => {
	return (
		<svg version="1.1" viewBox="0 0 36 36" style={{ width: size, height: size }}>
			<path
				fill={color}
				d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"
			></path>
		</svg>
	);
};

export default Play;
