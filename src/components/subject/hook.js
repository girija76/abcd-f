import { useQuery } from 'react-query';
import createOthersApi from 'apis/others';
import { useMemo } from 'react';
import { createItemsById } from 'utils/store';
import { useSelector } from 'react-redux';
import { selectActivePhaseSubjectIds } from 'selectors/subject';
import { useGetAdminPhases } from 'utils/hooks/phase';
import { get } from 'lodash';

const othersApi = createOthersApi();

function useGetAllSubjects() {
	const {
		data,
		isFetched,
		isFetching,
		error,
		isError,
		isSuccess,
		refetch,
	} = useQuery(['get-all-subjects'], () => othersApi.getAllSubjects(), {
		staleTime: 36e5,
	});
	const { items, total } = useMemo(
		() => (data ? data : { items: [], total: 0 }),
		[data]
	);
	const subjectIds = useMemo(() => items.map(i => i._id), [items]);
	const subjectsById = useMemo(() => createItemsById(items), [items]);
	return {
		subjects: items,
		subjectIds,
		subjectsById,
		isFetched,
		isFetching,
		total,
		isError,
		error,
		refetch,
		isSuccess,
	};
}

export function useGetAllPhaseSubjects([adminPhaseId]) {
	const {
		subjectsById,
		isFetched,
		isFetching,
		isError,
		refetch,
		error,
		isSuccess,
	} = useGetAllSubjects();
	const activePhaseSubjectIds = useSelector(selectActivePhaseSubjectIds);
	const { phasesById } = useGetAdminPhases();
	const adminPhaseSubjectIds = useMemo(() => {
		if (adminPhaseId) {
			return get(phasesById, [adminPhaseId, 'subjects']);
		}
		return null;
	}, [adminPhaseId, phasesById]);
	const subjects = useMemo(() => {
		let finalSubjectIds = [];
		if (isSuccess) {
			finalSubjectIds = activePhaseSubjectIds;
		}
		if (adminPhaseId && adminPhaseSubjectIds) {
			finalSubjectIds = adminPhaseSubjectIds;
		}
		if (finalSubjectIds) {
			return finalSubjectIds
				.map(subjectId => {
					const subject = subjectsById[subjectId];
					return subject;
				})
				.filter(subject => !!subject);
		}
		return [];
	}, [
		isSuccess,
		adminPhaseId,
		adminPhaseSubjectIds,
		activePhaseSubjectIds,
		subjectsById,
	]);
	const phaseSubjectsById = useMemo(() => createItemsById(subjects), [subjects]);
	const subjectIds = useMemo(() => subjects.map(subject => subject._id), [
		subjects,
	]);

	return {
		subjects,
		subjectIds,
		subjectsById: phaseSubjectsById,
		total: subjectIds.length,
		isFetched,
		isSuccess,
		isFetching,
		isError,
		error,
		refetch,
	};
}
