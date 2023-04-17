import React from 'react';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import { map } from 'lodash';

const superGroupSelector = state => state.api.SuperGroups;
const Supergroups = ({ onChange, supergroup, style }) => {
	const items = useSelector(superGroupSelector);
	const loading = !Array.isArray(items) || !items.length;

	return (
		<Select
			value={supergroup ? supergroup : 'Select Supergroup'}
			onChange={onChange}
			loading={loading}
			style={{ width: '100%', minWidth: 150, ...style }}
			showSearch
			optionFilterProp="children"
		>
			<Select.Option value="">Unselect</Select.Option>
			{map(items, sg => {
				return (
					<Select.Option key={sg._id} value={sg._id}>
						{sg.name}
					</Select.Option>
				);
			})}
		</Select>
	);
};

export default Supergroups;
