import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { filter, forEach, get, includes, map } from 'lodash';
import createGroupApi from 'apis/group';
import createPaymentsApi from 'apis/payments';
import { clientId, superGroups } from 'utils/config';
import { categorizeServicePlans } from './utils';
import { createGroupsByTag } from 'utils/tags';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector } from 'selectors/user';
import { getOrderInPhase } from 'utils/tags';
import { useQuery } from 'react-query';
import { createItemsById } from 'utils/store';
import { hasServicesEnabled } from 'utils/config';

const groupApi = createGroupApi();
const paymentsApi = createPaymentsApi();

const createSortFn = activePhase => (sp1, sp2) =>
	getOrderInPhase(activePhase, sp1) - getOrderInPhase(activePhase, sp2);

export function useLoadServicePlans(subscribedServicePlanIds) {
	const [allPhaseIds, setAllPhaseIds] = useState();
	const [phasesById, setPhasesById] = useState({});
	const [superGroupsWithSubGroups, setSuperGroupsWithSubGroups] = useState();
	const [items, setItems] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState(null);
	const failureCount = useRef(0);

	const activePhase = useSelector(activePhaseIdSelector);

	const servicePlansForCurrentPhase = useMemo(
		() =>
			(!activePhase
				? items
				: filter(
						items,
						item =>
							!Array.isArray(item.visibleIn) ||
							!item.visibleIn.length ||
							item.visibleIn.some(
								it => it.type === 'Phase' && it.value === activePhase
							)
				  )
			).sort(createSortFn(activePhase || 'default')),
		[activePhase, items]
	);
	const filteredServicePlans = useMemo(
		() =>
			filter(
				servicePlansForCurrentPhase,
				item => !includes(subscribedServicePlanIds, item._id)
			),
		[servicePlansForCurrentPhase, subscribedServicePlanIds]
	);
	const servicePlanGroups = useMemo(
		() =>
			filteredServicePlans &&
			superGroupsWithSubGroups &&
			createGroupsByTag(filteredServicePlans, 'Group', ['tags'], 'Other Plans'),
		[filteredServicePlans, superGroupsWithSubGroups]
	);
	const fetchServicePlans = useCallback(
		phases => {
			if (hasServicesEnabled) {
				paymentsApi
					.getServicePlansForPhases(phases)
					.then(({ items: servicePlans }) => {
						setItems(
							map(servicePlans, servicePlan => ({
								...servicePlan,
								services: map(servicePlan.services, service => ({
									...service,
									superGroupId: get(phasesById, [service.phase, 'superGroup', '_id']),
									subGroupId: get(phasesById, [service.phase, 'subGroup', '_id']),
								})),
							}))
						);
						setIsLoaded(true);
						setIsLoading(false);
						setHasError(false);
					})
					.catch(() => {
						failureCount.current += 1;
					});
			}
		},
		[phasesById]
	);
	const fetchPhases = useCallback(() => {
		if (hasServicesEnabled) {
			groupApi
				.getAllSuperGroupsWithAllSubgroupsOfClient(
					clientId,
					superGroups && superGroups.map(s => s._id)
				)
				.then(({ items: superGroups }) => {
					const phaseIds = [];
					const phasesById = {};
					setSuperGroupsWithSubGroups(superGroups);
					superGroups &&
						superGroups.forEach(superGroup => {
							if (superGroup.subgroups) {
								superGroup.subgroups.forEach(({ subgroup: subGroup }) => {
									if (subGroup && subGroup.phases) {
										subGroup.phases.forEach(({ phase }) => {
											phaseIds.push(phase._id);
											phasesById[phase._id] = {
												...phase,
												superGroup,
												subGroup,
											};
										});
									}
								});
							}
						});
					setPhasesById(phasesById);
					setAllPhaseIds(phaseIds);
				})
				.catch(() => {
					failureCount.current += 1;
				});
		}
	}, []);
	useEffect(() => {
		if (allPhaseIds) {
			fetchServicePlans(allPhaseIds);
		}
	}, [allPhaseIds, fetchServicePlans]);
	useEffect(() => {
		setIsLoading(true);
		setHasError(false);
		fetchPhases();
	}, [fetchPhases, subscribedServicePlanIds]);
	return {
		items: servicePlansForCurrentPhase,
		isLoaded,
		isLoading,
		hasError,
		error,
		failureCount: failureCount.current,
		refetch: fetchPhases,
		servicePlanGroups,
	};
}

export function useLoadMyServicePlans() {
	const currentPhase = useSelector(activePhaseIdSelector);
	const { data, ...otherResult } = useQuery(
		['get-my-plans-for-phase', currentPhase],
		() =>
			hasServicesEnabled && currentPhase
				? paymentsApi.getPlansOfPhase(currentPhase)
				: () => null,
		{
			staleTime: 3.6e6,
			retry: 2,
		}
	);
	const {
		subscribedServiceIds,
		serviceIds,
		services,
		servcesById,
		servicePlans,
		subscribedServicePlanIds,
	} = useMemo(() => {
		if (!data) {
			return { serviceIds: [], services: [], servicePlans: [] };
		}
		const serviceIds = [],
			services = [],
			subscribedServicePlanIds = [],
			subscribedServiceIds = get(data, ['subscribedServiceIds']);
		const servicePlans = get(data, ['servicePlans']);
		forEach(servicePlans, servicePlan => {
			if (servicePlan.subscribed) {
				subscribedServicePlanIds.push(servicePlan._id);
			}
			forEach(get(servicePlan, ['services']), service => {
				const serviceId = get(service, ['_id']);
				if (!includes(serviceIds, serviceId)) {
					serviceIds.push(serviceId);
					services.push(service);
				}
			});
		});
		const servicesById = createItemsById(services);
		return {
			serviceIds,
			subscribedServiceIds,
			services,
			servicePlans,
			servcesById: servicesById,
			subscribedServicePlanIds,
		};
	}, [data]);
	return {
		serviceIds,
		subscribedServiceIds,
		services,
		servicePlans,
		subscribedServicePlanIds,
		servcesById,
		...otherResult,
	};
}
