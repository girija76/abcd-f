import React, { useMemo } from 'react';
import { Button, Select, Space, Spin, Tag } from 'antd';
import { AiOutlineFrown, AiOutlineReload } from 'react-icons/ai';
import { concat, filter, includes } from 'lodash';
import { useGetAdminSubjects } from 'utils/hooks/phase';

const { CheckableTag } = Tag;

/**
 * Select subject or multiple subjects of current active phase
 * @param {*} props {type: select|tag}
 */
function SelectAdminSubject({
	onChange,
	value,
	type,
	mode,
	phase,
	...otherProps
}) {
	const {
		subjectIds,
		subjectsById,
		isFetched,
		isFetching,
		isError,
		refetch,
	} = useGetAdminSubjects();
	const options = useMemo(() => {
		if (isFetched) {
			return subjectIds.map(subjectId => {
				const subject = subjectsById[subjectId];
				return {
					...subject,
					label: subject.name,
					value: subject._id,
				};
			});
		}
	}, [isFetched, subjectIds, subjectsById]);
	if (isError) {
		return (
			<div style={{ display: 'flex' }}>
				<AiOutlineFrown style={{ fontSize: 32 }} />
				<div>Failed to load subjects.</div>
				<div>
					<Button icon={<AiOutlineReload />} onClick={refetch}>
						Reload
					</Button>
				</div>
			</div>
		);
	}
	if (isFetching) {
		return (
			<div
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<div>
					<Spin />
				</div>
				<div>Loading subjects...</div>
			</div>
		);
	}
	if (type === 'tag') {
		return (
			<Space style={{ display: 'flex', flexWrap: 'wrap' }}>
				{options.map(option => {
					let isSelected = false;
					if (mode === 'multiple') {
						isSelected = includes(value, option.value);
					} else {
						isSelected = value === option.value;
					}
					const handleChange = checked => {
						if (checked) {
							if (mode === 'multiple') {
								onChange(concat(value, option.value));
							} else {
								onChange(option.value);
							}
						} else {
							if (mode === 'multiple') {
								onChange(filter(value, v => v !== option.value));
							} else {
								onChange();
							}
						}
					};
					return (
						<CheckableTag
							key={option._id}
							checked={isSelected}
							onChange={handleChange}
							style={{
								fontSize: '1rem',
								padding: '6px 16px',
								backgroundColor: !isSelected ? '#f0f0f0' : undefined,
							}}
						>
							{option.name}
						</CheckableTag>
					);
				})}
			</Space>
		);
	}
	return (
		<Select
			onChange={onChange}
			value={value}
			options={options}
			showSearch
			optionFilterProp="label"
			mode={mode}
			{...otherProps}
		/>
	);
}

export default SelectAdminSubject;
