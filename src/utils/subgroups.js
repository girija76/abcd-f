import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export const Subgroup = ({ Array, selected, onChange, placeholder }) => (
	<Select placeholder={placeholder} value={selected} onChange={onChange}>
		{Array.map(subgroup => {
			return (
				<Option value={subgroup.subgroup.id} key={subgroup.subgroup._id}>
					{subgroup.subgroup.name}
				</Option>
			);
		})}
	</Select>
);
