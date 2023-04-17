import { isEmpty } from 'lodash';
import { forEach, some } from 'lodash';
import pRetry from 'p-retry';
import { getViewAsPhases } from 'utils/viewAs';
import { isUserGroupsEnabled } from 'utils/config';
import { URLS } from '../urls';

function getwrapper(phaseId) {
	const viewAsPhases = getViewAsPhases();
	const phaseFromAdmin =
		isEmpty(viewAsPhases) || !viewAsPhases[0] ? phaseId : viewAsPhases[0];

	return new Promise((_resolve, _reject) => {
		Promise.all([
			new Promise((resolve, reject) =>
				fetch(`${URLS.backendCFAssessment}/getwrappers/${phaseFromAdmin}`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				})
					.then(response1 => {
						if (response1.ok) {
							response1.json().then(responseJson1 => {
								resolve(responseJson1);
							});
						} else {
							reject({});
						}
					})
					.catch(() => {
						reject(new Error('Network Error'));
					})
			),
			new Promise((resolve, reject) => {
				if (!isUserGroupsEnabled) {
					resolve({ assessmentWrappers: [] });
					return;
				}
				fetch(`${URLS.backendAssessment}/my/wrappers`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				})
					.then(response => {
						if (response.ok) {
							response
								.json()
								.then(body => {
									resolve(body);
								})
								.catch(error => {
									reject(error);
								});
						} else {
							reject(new Error('Unable to fetch assessments'));
						}
					})
					.catch(error => {
						reject(new Error('Unable to fetch assessments'));
					});
			}),
		])
			.then(([phaseWrappersResponse, personalWrappersResponse]) => {
				if (phaseWrappersResponse.success) {
					const mergedWrappers = [...phaseWrappersResponse.assessmentWrappers];
					forEach(personalWrappersResponse.assessmentWrappers, wrapper => {
						if (some(mergedWrappers, w => w._id === wrapper._id)) {
							return;
						}
						mergedWrappers.push(wrapper);
					});
					_resolve({
						success: phaseWrappersResponse.success,
						assessmentWrappers: mergedWrappers,
					});
				} else {
					_resolve(phaseWrappersResponse);
				}
			})
			.catch(error => {
				console.error(error);
				// _reject(error);
			});
	});
}

function getsubmissions(wrapperIds) {
	return new Promise((resolve, reject) =>
		fetch(`${URLS.backendAssessment}/getsubmissions`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				wrapperIds,
			}),
		})
			.then(response2 => {
				if (response2.ok) {
					response2.json().then(responseJson2 => {
						resolve(responseJson2);
					});
				} else {
					reject({});
				}
			})
			.catch(() => {
				reject(new Error('Network Error'));
			})
	);
}

const getwrappers = () => {
	let promise = null;
	return function api(phaseId) {
		if (!promise) {
			if (!phaseId) {
				return Promise.reject(new Error('Phase not set'));
			}
			promise = pRetry(() => getwrapper(phaseId), { retries: 3 });
			return new Promise((resolve, reject) => {
				promise
					.then(responseJson1 => {
						if (responseJson1.success) {
							const wrapperIds = responseJson1.assessmentWrappers.map(aw => {
								return aw._id;
							});
							pRetry(() => getsubmissions(wrapperIds), { retries: 3 })
								.then(responseJson2 => {
									if (responseJson2.success) {
										const assessmentWrappers = responseJson1.assessmentWrappers;
										const submissionMap = responseJson2.submissionMap;
										const analysisAssessments = [];
										const liveAssessments = [];
										const upcomingAssessments = [];
										const today = new Date().getTime();
										assessmentWrappers.forEach(aw => {
											aw.submission = null;
											if (submissionMap[aw._id]) {
												aw.submission = submissionMap[aw._id];
												if (
													aw.type === 'TOPIC-MOCK' ||
													aw.type === 'SECTIONAL-MOCK' ||
													aw.type === 'FULL-MOCK' ||
													submissionMap[aw._id].graded
												) {
													const submissionDate = new Date(
														submissionMap[aw._id].createdAt
													).getTime();
													const assessmentEndDate = new Date(aw.availableTill).getTime();
													if (
														today <
														Math.max(submissionDate, assessmentEndDate) + 7 * 24 * 3600 * 1000
													) {
														analysisAssessments.push({
															_id: aw._id,
															name: aw.name,
														});
													}
												}
											} else if (aw.type === 'LIVE-TEST') {
												if (new Date(aw.availableFrom).getTime() > today) {
													upcomingAssessments.push({
														name: aw.name,
														id: aw._id,
														duration: aw.core.duration,
														instructions: aw.core.instructions,
														sectionInstructions: aw.core.sectionInstructions,
														availableFrom: aw.availableFrom,
														syllabus: aw.core.syllabus,
														customSyllabus: aw.core.customSyllabus,
														visibleForServices: aw.visibleForServices,
													});
												} else if (new Date(aw.availableTill).getTime() > today) {
													liveAssessments.push({
														name: aw.name,
														id: aw._id,
														duration: aw.core.duration,
														availableFrom: aw.availableFrom,
														instructions: aw.core.instructions,
														sectionInstructions: aw.core.sectionInstructions,
														syllabus: aw.core.syllabus,
														customSyllabus: aw.core.customSyllabus,
														visibleForServices: aw.visibleForServices,
													});
												}
											}
										});
										const feeds = {
											liveAssessments,
											analysisAssessments,
											upcomingAssessments,
										};
										promise = null;
										resolve({ assessmentWrappers, feeds });
									} else {
										promise = null;
										reject('responseJson2 not successful');
									}
								})
								.catch(e2 => {
									promise = null;
									reject(e2);
								});
						} else {
							promise = null;
							if (!phaseId) {
								resolve({ assessmentWrappers: [], feeds: [] });
							} else {
								reject('Failed to fetch wrappers for phase');
							}
						}
					})
					.catch(e1 => {
						promise = null;
						reject(e1);
					});
			});
		} else {
			return new Promise((resolve, reject) => {
				reject('already-fetched');
			});
		}
	};
};

export default getwrappers();
