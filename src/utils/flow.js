import * as Sentry from '@sentry/browser';
import get from 'lodash/get';
import forEach from 'lodash/forEach';

import { URLS } from '../components/urls';
import { lambdaApiEndpoint } from 'utils/config';
import { clearUserApiResponseCache } from 'utils/user';
import { removeRedundantFlow } from 'components/libs/lib';
import { cloneDeep } from 'lodash';

function getTokenFromCookie() {
	const cookie = document.cookie;
	const tokens = cookie.split('auth=');
	if (tokens.length === 2) {
		return tokens[1].split(';')[0];
	} else {
		return '';
	}
}

const getTimeSpentMillisBySectionQuestionNumber = flow => {
	const sections = {};
	forEach(flow, item => {
		const sectionNumber = get(item, 'section');
		const questionNumber = get(item, 'question');
		const time = get(item, 'time');
		if (!sections[sectionNumber]) {
			sections[sectionNumber] = {};
		}
		if (!sections[sectionNumber][questionNumber]) {
			sections[sectionNumber][questionNumber] = 0;
		}
		sections[sectionNumber][questionNumber] += time;
	});
	return sections;
};

let promise = null;
export function syncFlow(verifiedFlow, options) {
	const useBaseApi = get(options, ['useBaseApi'], false);
	return new Promise((resolve, reject) => {
		if (!promise) {
			const token = getTokenFromCookie();

			if (token && lambdaApiEndpoint && !useBaseApi) {
				const url = `${lambdaApiEndpoint}/sync-flow`;
				promise = fetch(url, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
					body: JSON.stringify({
						flow: verifiedFlow,
					}),
				});
			} else {
				const url = `${URLS.backendAssessment}/syncFlow`;
				promise = fetch(url, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						flow: verifiedFlow,
					}),
					credentials: 'include',
				});
			}

			promise
				.then(res => res.json())
				.then(result => {
					if (result.success) {
						promise = null;
						resolve({
							newFlow: result.newFlow,
							timeSpentMillisBySectionQuestionNumber: getTimeSpentMillisBySectionQuestionNumber(
								result.newFlow
							),
						});
					} else {
						let errorCode = null;
						try {
							errorCode = result.error.code;
							if (errorCode === 'live-assessment-not-found') {
								// user has submitted the assessment
								clearUserApiResponseCache();
								setTimeout(() => {
									window.location = '';
								}, 300);
							}
						} catch (e) {}
						Sentry.captureException(new Error('syncFlow-fail'));
						promise = null;
						reject({ code: errorCode });
					}
				})
				.catch(err => {
					Sentry.captureException(new Error('syncFlow-network-error'));
					promise = null;
					console.log('failed to fetch');
					reject({ code: 'possibly-network-error' });
				});
		} else {
			reject({ code: 'syncing-already-in-progress' });
		}
	});
}

export const getTotalTimeSpentInQuestion = (
	state,
	{ sectionIndex, questionIndex }
) => {
	const { Flow: draftFlow } = state.api;
	const timeSpentByQuestionsInDraftFlow = getTimeSpentMillisBySectionQuestionNumber(
		draftFlow
	);
	const timeSpentInSavedFlow = get(
		state,
		['liveTest', 0, sectionIndex, questionIndex],
		0
	);
	const timeSpentInDraftFlow = get(
		timeSpentByQuestionsInDraftFlow,
		[sectionIndex, questionIndex],
		0
	);

	return timeSpentInSavedFlow + timeSpentInDraftFlow;
};

export function getVerifiedFlowState(state, updatedMyQuestions) {
	const questionEndTime = new Date().getTime();
	const { MyQuestions, Flow, CurrSection, CurrQuestion, QuestionStartTime } = {
		MyQuestions: updatedMyQuestions ? updatedMyQuestions : state.api.MyQuestions,
		Flow: state.api.Flow,
		CurrSection: state.api.CurrSection,
		CurrQuestion: state.api.CurrQuestion,
		QuestionStartTime: state.api.QuestionStartTime || questionEndTime,
	};
	const FlowCopy = cloneDeep(Flow);

	const lastFlowMap = {};
	FlowCopy.forEach(f => {
		if (lastFlowMap[`${f.section}-${f.question}`] === undefined) {
			lastFlowMap[`${f.section}-${f.question}`] = true;
			if (
				f.state !== MyQuestions.sections[f.section].questions[f.question].state
			) {
				f.state = MyQuestions.sections[f.section].questions[f.question].state;
			}
			if (
				f.response !== MyQuestions.sections[f.section].questions[f.question].answer
			) {
				f.response = MyQuestions.sections[f.section].questions[f.question].answer;
			}
		}
	});

	const currentState = {
		id: new Date().getTime(),
		section: CurrSection,
		question: CurrQuestion,
		time: questionEndTime - QuestionStartTime,
		action: 0,
		state: MyQuestions.sections[CurrSection].questions[CurrQuestion].state,
		response: MyQuestions.sections[CurrSection].questions[CurrQuestion].answer,
	};
	FlowCopy.push(currentState);
	const flow_ = removeRedundantFlow(FlowCopy);
	return flow_;
}
