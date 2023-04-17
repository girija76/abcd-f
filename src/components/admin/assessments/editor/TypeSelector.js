import { Button, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';

const TypeSelector = ({ types, onClick, selectedKey, color }) => {
	const [selected, setSelected] = useState(
		selectedKey ? selectedKey : types.length ? types[0].key : null
	);
	// const [selected, setSelected] = useState(types.length ? types[0].key : null)

	const handleButtonClick = key => {
		setSelected(key);
		onClick({
			key: key,
		});
	};

	const defaultColor = '#1ed760';

	return (
		<div
			style={{
				display: 'flex',
			}}
		>
			{types.length &&
				types.map((type, index) => {
					return (
						<div key={index}>
							<Tooltip placement="topLeft" title={type.value}>
								<Button
									style={{
										margin: '12px',
										backgroundColor:
											selected === type.key ? (color ? color : defaultColor) : '#fff',
										borderColor:
											selected === type.key ? (color ? color : defaultColor) : '#a1a1a1',
										color: color && '#000',
									}}
									size={'large'}
									type={selected === type.key ? 'primary' : 'default'}
									onClick={() => handleButtonClick(type.key)}
								>
									{type.icon}
								</Button>
							</Tooltip>
						</div>
					);
				})}
		</div>
	);
};

export default TypeSelector;
