import React from 'react';

export default ({ direction, color }) => {
	const space = 6;
	const color_ = color ? color : '#777';
	const fontSize = 14;
	const borderBottom = color ? `solid 1px ${color}` : 'solid 1px #e0e0e0';
	const style = {
		borderBottom,
		flexGrow: 1,
		display: 'flex',
	};
	if (direction === 'vertical') {
		style.borderLeft = style.borderBottom;
		style.borderBottom = undefined;
	}
	const border = <span style={style} />;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: direction === 'vertical' ? 'column' : 'row',
			}}
		>
			{border}
			<span
				style={{ margin: `${2 * space}px ${space}px`, color: color_, fontSize }}
			>
				OR
			</span>
			{border}
		</div>
	);
};
