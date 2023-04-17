import { Modal, Select, Input, Typography } from 'antd';
import { map } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { activePhaseSelector, roleSelector } from 'selectors/user';
import { useGetAdminPhases } from 'utils/hooks/phase';
import { getViewAsPhase } from 'utils/viewAs';

const { Search } = Input;

function DefaultSelect({ options, value, onChange, style, ...props }) {
	return (
		<Select
			options={options}
			onChange={onChange}
			allowClear
			showSearch
			optionFilterProp="search"
			placeholder="Switch phase"
			dropdownMatchSelectWidth={false}
			value={value}
			style={{
				width: 200,
				...style,
			}}
			{...props}
		/>
	);
}

function SwitchPhaseForAdmin({ component, style }) {
	const Component = component || DefaultSelect;
	const [value, setValue] = useState(null);
	const role = useSelector(roleSelector);
	const activePhase = useSelector(activePhaseSelector);
	const activePhaseId = activePhase ? activePhase._id : null;
	const { phases } = useGetAdminPhases();

	const [filteredOptions, setFilteredOptions] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	const syncStorage = useCallback(() => {
		const selectedPhase = getViewAsPhase(activePhaseId, role);
		setValue(selectedPhase);
	}, [activePhaseId, role]);
	useEffect(() => {
		syncStorage();
	}, [syncStorage]);
	const handleSelectPhase = phaseId => {
		if (phaseId) {
			localStorage.setItem('viewAs', 'userOf');
			localStorage.setItem('phases', JSON.stringify([phaseId]));
			Modal.success({
				title: 'Phase selected successfully.',
				content: 'Please refresh the page to see the changes. Reloading page.',
				onOk: () => window.location.reload(),
				cancelText: 'Close',
				okText: 'Reload',
			});
		} else {
			localStorage.removeItem('viewAs');
			localStorage.removeItem('phases');
			Modal.success({
				title: 'You are not viewing as an Admin anymore',
				content: 'Please reload the page to see the changes. Reloading page.',
				onOk: () => window.location.reload(),
				okText: 'Reload',
				cancelText: 'Close',
			});
		}
		window.location.reload();
	};

	const options = useMemo(
		() =>
			map(
				[...phases, { ...activePhase, name: `${activePhase.name} - Your` }],
				phase => ({
					label: phase.name,
					value: phase._id,
					search: `${phase.name} ${phase._id}`,
					group: phase.group,
				})
			),

		[activePhase, phases]
	);

	useEffect(() => {
		setFilteredOptions(options);
	}, [options]);

	const handleSearch = value => {
		const fo = options.filter(i =>
			i.search.toUpperCase().includes(value.toUpperCase())
		);
		setFilteredOptions(fo);
		if (fo.length === 0) {
			setErrorMessage('No phase found');
		} else if (fo.length === 1) {
			handleSelectPhase(fo[0].value);
		} else {
			setErrorMessage('Please select one');
		}
	};

	const handleChange = e => {
		const fo = options.filter(i =>
			i.search.toUpperCase().includes(e.target.value.toUpperCase())
		);
		setFilteredOptions(fo);
		if (fo.length === 0) {
			setErrorMessage('No phase found');
		} else {
			setErrorMessage('');
		}
	};

	if (role === 'user') {
		return null;
	}
	return (
		<div>
			{component ? (
				<>
					<Search
						autoFocus
						style={{
							width: '400px',
						}}
						placeholder="Class Name"
						allowClear
						enterButton="Search"
						size="large"
						onSearch={handleSearch}
						onChange={handleChange}
					/>

					<Typography
						style={{
							color: '#f00',
						}}
					>
						{errorMessage}
					</Typography>
				</>
			) : null}

			<Component
				options={filteredOptions}
				onChange={handleSelectPhase}
				value={value}
				style={style}
			/>
		</div>
	);
}

SwitchPhaseForAdmin.defaultProps = {};

export default SwitchPhaseForAdmin;
