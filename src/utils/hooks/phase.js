import adminApi from 'apis/admin';
import phaseApi from 'apis/phase';
import { useGetAllPhaseSubjects } from 'components/subject/hook';
import { filter, get, map } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import {
	activePhaseIdSelector,
	roleSelector,
	userIdSelector,
} from 'selectors/user';
import { isAtLeastModerator } from 'utils/auth';
import { createItemsById } from 'utils/store';
import { getViewAsPhase } from 'utils/viewAs';
/**
 * Get all the phases to which an admin(non-user) has access to
 */
export function useGetAdminPhases() {
	const getDefaultAdminPhaseResult = useCallback(() => {
		return {
			phasesById: {},
			phaseIds: [],
			phases: [],
		};
	}, []);
	const role = useSelector(roleSelector);
	const { data, isFetching, isSuccess, isError, refetch } = useQuery(
		['get-admin-all-phases'],
		() =>
			role === 'user'
				? Promise.resolve(getDefaultAdminPhaseResult())
				: adminApi.getPhases().then(({ phases }) => {
						const phasesById = createItemsById(phases);
						const phaseIds = phases.map(phase => phase._id);
						return {
							phasesById,
							phaseIds,
							phases,
						};
				  }),
		{
			staleTime: 36e5,
		}
	);
	const { phases, phaseIds, phasesById } = useMemo(
		() => (data ? data : getDefaultAdminPhaseResult()),
		[data, getDefaultAdminPhaseResult]
	);
	return {
		phases,
		phaseIds,
		phasesById,
		isFetching,
		isSuccess,
		isError,
		refetch,
	};
}

export function useAdminCurrentPhase() {
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);
	return phaseId;
}

export function useGetAdminSubjects() {
	const phaseId = useAdminCurrentPhase();
	const userId = useSelector(userIdSelector);
	const role = useSelector(roleSelector);
	const {
		subjectsById: allSubjectsById,
		subjectIds: allSubjectIds,
	} = useGetAllPhaseSubjects([phaseId]);
	const { data, isFetched } = useQuery(
		['get-mentors-of-phase', phaseId],
		() => phaseApi.getMentorsOfPhase(phaseId),
		{
			staleTime: 6e5,
		}
	);
	const { items } = useMemo(() => (data ? data : {}), [data]);
	const { subjectIds, subjects, subjectsById } = useMemo(() => {
		const subjectIds = isAtLeastModerator(role)
			? allSubjectIds
			: map(
					filter(items, item => get(item, ['user', '_id']) === userId),
					item => item.subject
			  );
		const subjects = filter(
			map(subjectIds, subjectId => get(allSubjectsById, [subjectId], null)),
			subject => !!subject
		);
		const subjectsById = createItemsById(subjects);
		const filtersSubjectIds = map(subjects, subject => subject._id);
		return {
			subjectsById,
			subjectIds: filtersSubjectIds,
			subjects,
		};
	}, [role, allSubjectIds, items, userId, allSubjectsById]);
	return { subjects, subjectsById, subjectIds, isFetched };
}
