import phaseApi from 'apis/phase';
import { get, map, size } from 'lodash-es';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useAdminCurrentPhase } from 'utils/hooks/phase';
import { Button, Select } from 'antd';

function SelectTeacher({ onChange, value, suggestionConfig }) {
	const phaseId = useAdminCurrentPhase();
	const suggestedSubject = get(suggestionConfig, ['subject']);
	// const {
	// 	subjectsById,
	// 	isSuccess: arePhaseSubjectsSuccess,
	// } = useGetAllPhaseSubjects([phaseId]);
	const { data } = useQuery(
		['get-mentors-of-phase', phaseId],
		() => phaseApi.getMentorsOfPhase(phaseId),
		{
			staleTime: 6e5,
			retry: 3,
		}
	);
	const { items } = useMemo(() => (data ? data : { items: [] }), [data]);
	const suggestions = useMemo(() => {
		if (!suggestedSubject) {
			return [];
		}
		return items
			.filter(item => get(item, ['subject']) === suggestedSubject)
			.map(item => item.user);
	}, [items, suggestedSubject]);
	const options = useMemo(
		() =>
			items
				.sort((item1, item2) => {
					const subject1 = get(item1, 'subject');
					const subject2 = get(item2, 'subject');
					if (!suggestedSubject) {
						return 0;
					}
					if (subject1 === suggestedSubject || subject2 === suggestedSubject) {
						if (subject1 === subject2) {
							return 0;
						}
						if (subject1 === suggestedSubject) {
							return -1;
						} else {
							return 1;
						}
					}
					return 0;
				})
				.map(item => ({
					value: get(item, ['user', '_id']),
					label: `${get(item, ['user', 'name'])}`,
				})),
		[items, suggestedSubject]
	);
	return (
		<div>
			<Select
				value={value}
				onChange={v => onChange(v)}
				options={options}
				showSearch
				optionFilterProp="label"
			/>
			{size(suggestions) ? (
				<div>
					Suggested Teacher:
					{map(suggestions, suggestion => {
						return (
							<Button onClick={() => onChange(suggestion._id)} type="link">
								{suggestion.name}
							</Button>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

export default SelectTeacher;
