import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export const Phase = ({ Array, selected, onChange, placeholder }) => (
	<Select placeholder={placeholder} value={selected} onChange={onChange}>
		{Array.map(phase => {
			return (
				<Option value={phase._id} key={phase._id}>
					{phase.name}
				</Option>
			);
		})}
	</Select>
);
