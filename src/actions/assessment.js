import { removeOverlap } from 'components/libs/lib';
import { cloneDeep } from 'lodash';
import { syncFlow, getVerifiedFlowState } from 'utils/flow';
import {
	updateFlow,
	updateFlowQuestionStartTime,
	updateMyQuestions,
} from 'components/api/ApiAction';
import { actions } from 'reducers/liveTest';
import * as liveTestSelectors from 'selectors/liveTest';
import { getCriticalSyncInfo } from 'utils/assessment';

export function autoUpdateFlowAsync(initialize = false) {
	return (dispatch, getState) => {
		const state = getState();
		const verifiedFlow = initialize ? [] : getVerifiedFlowState(state);
		const syncRequestQueue = liveTestSelectors.syncRequestQueue(state);
		const criticalInfoString = getCriticalSyncInfo(state);
		const syncFailCount = liveTestSelectors.syncFailCount(state);
		dispatch(actions.syncStarted());
		dispatch(
			updateFlowQuestionStartTime({
				// dont call api!! and we can skip updating flow...??
				flow: verifiedFlow,
				questionStartTime: new Date().getTime(),
			})
		);

		return syncFlow(verifiedFlow, {
			useBaseApi: syncFailCount > 0 && syncFailCount % 6 === 0,
		})
			.then(({ newFlow: savedFlow, timeSpentMillisBySectionQuestionNumber }) => {
				// TODO: use timeSpentMillisBySectionQuestionNumber in question navigation
				dispatch(
					actions.setTimeSpentInQuestionsByKey(
						timeSpentMillisBySectionQuestionNumber
					)
				);
				const state = getState();
				const Flow = state.api.Flow;
				const newLocalFlow = removeOverlap(savedFlow, Flow);

				dispatch(
					updateMyQuestions(
						getUpdatedMyQuestions(state.api.MyQuestions, savedFlow, newLocalFlow),
						true
					)
				);
				dispatch(updateFlow(newLocalFlow));
				dispatch(actions.syncSucceded(syncRequestQueue, criticalInfoString));
			})
			.catch(err => {
				dispatch(actions.syncFailed());
				console.error(err);
				throw err;
			});
	};
}

/** Updates questions responses using flow */
export function getUpdatedMyQuestions(myQuestions, flow, newFlow) {
	const updatedMyQuestions = cloneDeep(myQuestions);

	flow.forEach(f => {
		if (f.section < updatedMyQuestions.sections.length) {
			if (f.question < updatedMyQuestions.sections[f.section].questions.length) {
				updatedMyQuestions.sections[f.section].questions[f.question].state =
					f.state;
				updatedMyQuestions.sections[f.section].questions[f.question].answer =
					f.response;
			}
		}
	});

	newFlow.forEach(f => {
		if (f.section < updatedMyQuestions.sections.length) {
			if (f.question < updatedMyQuestions.sections[f.section].questions.length) {
				updatedMyQuestions.sections[f.section].questions[f.question].state =
					f.state;
				updatedMyQuestions.sections[f.section].questions[f.question].answer =
					f.response;
			}
		}
	});
	return updatedMyQuestions;
}
