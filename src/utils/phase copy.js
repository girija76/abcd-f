import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export const Phase = ({ phases, selected, onChange }) => (
	<Select
		placeholder="Please select Phases"
		value={selected}
		onChange={onChange}
	>
		{phases.map(phase => {
			return (
				<Option value={phase._id} key={phase._id}>
					{phase.name}
				</Option>
			);
		})}
	</Select>
);
