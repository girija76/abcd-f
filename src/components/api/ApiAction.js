import { getVerifiedFlowState } from 'utils/flow';

export function initializeAssessment(data) {
	return {
		type: 'INITIALIZE_ASSESSMENT',
		flow: data.flow,
		myQuestions: data.myQuestions,
		currSection: data.currSection,
		currQuestion: data.currQuestion,
		questionStartTime: data.questionStartTime,
	};
}

export function updateMyQuestions(myQuestions, doNotUpdateFlow) {
	return (dispatch, getState) => {
		const action = {
			type: 'UPDATE_MYQUESTIONS',
			myQuestions,
			doNotUpdateFlow,
		};
		if (!doNotUpdateFlow) {
			try {
				const verifiedFlow = getVerifiedFlowState(getState(), myQuestions);
				action.flow = verifiedFlow;
			} catch (e) {
				console.error(e);
			}
		}
		return dispatch(action);
	};
}

export function updateBuckets(buckets) {
	return {
		type: 'UPDATE_BUCKETS',
		buckets,
	};
}

export function updateFlow(flow) {
	return {
		type: 'UPDATE_FLOW',
		flow,
	};
}

export function moveToQuestion(data) {
	return {
		type: 'MOVE_TO_QUESTION',
		section: data.section,
		question: data.question,
	};
}

export function updateFlowQuestionStartTime(data) {
	return {
		type: 'UPDATE_FLOW_QUESTIONSTARTTIME',
		flow: data.flow,
		questionStartTime: data.questionStartTime,
	};
}

export function updateCurrQuestion(currQuestion) {
	return {
		type: 'UPDATE_CURRQUESTION',
		currQuestion: currQuestion,
	};
}

export function updateSubtopic(topic) {
	return {
		type: 'UPDATE_SUBTOPIC',
		topic,
	};
}

export function updateTopics(topics) {
	return {
		type: 'UPDATE_TOPICS',
		topics: topics.topics,
	};
}

export function updateTopicsAssessments(data) {
	return {
		type: 'UPDATE_TOPICS_ASSESSMENTS',
		topics: data.topics,
		assessmentWrappers: data.assessmentWrappers,
		feeds: data.feeds,
		phase: data.phase,
		supergroupNames: data.supergroupNames,
		percentComplete: data.percentComplete,
		category: data.category,
		leaderboard: data.leaderboard,
	};
}

export function updateGroups(superGroups) {
	return {
		type: 'UPDATE_GROUPS',
		superGroups: superGroups,
	};
}

export function updateCategories(categories) {
	return {
		type: 'UPDATE_CATEGORIES',
		categories,
	};
}

export function updateUserData(userData) {
	return {
		type: 'UPDATE_USER_DATA',
		userData,
	};
}

export function updateUserPracticeData(practiceData) {
	return {
		type: 'UPDATE_USER_PRACTICE_DATA',
		xpEarned: practiceData.xpEarned,
		streak: practiceData.streak,
		stats: practiceData.stats,
	};
}

export function updateUnverifiedUserData(userData) {
	return {
		type: 'UPDATE_UNVERIFIED_USER_DATA',
		userData: userData.userData,
		superGroups: userData.superGroups,
	};
}

export function updateUserData2(userData) {
	return {
		type: 'UPDATE_USER_DATA2',
		topics: userData.topics,
		// leaderboard: userData.leaderboard ? userData.leaderboard : [], // change api
		// feeds: userData.feeds,
		difficulty: userData.difficulty,
		// completedAssessments: userData.completedAssessments,
		// assessments: userData.assessments,
		recommendations: userData.recommendations,
		puzzle: userData.puzzle,
		supergroupNames: userData.supergroupNames,
		percentComplete: userData.percentComplete,
		category: userData.category,
	};
}

export function updateUserData3(userData) {
	return {
		type: 'UPDATE_USER_DATA3',
		userData: userData.userData,
		topics: userData.topics,
		// leaderboard: userData.leaderboard ? userData.leaderboard : [], // change api
		difficulty: userData.difficulty,
		recommendations: userData.recommendations,
		puzzle: userData.puzzle,
		supergroupNames: userData.supergroupNames,
		percentComplete: userData.percentComplete,
		category: userData.category,
	};
}

export function updateUserPractice(userData) {
	return {
		type: 'UPDATE_USER_PRACTICE',
		user: userData.user,
		topics: userData.topics,
		feeds: userData.feeds,
		difficulty: userData.difficulty,
	};
}

export function updateUserGroups(userData) {
	return {
		type: 'UPDATE_USER_GROUPS',
		user: userData.user,
		superGroups: userData.superGroups,
	};
}

export function updatePuzzle(puzzle) {
	return {
		type: 'UPDATE_PUZZLE',
		puzzle,
	};
}

export function updateAssessmentWrappersAndFeeds(data) {
	return {
		type: 'UPDATE_ASSESSMENT_WRAPPERS_FEEDS',
		assessmentWrappers: data.assessmentWrappers,
		feeds: data.feeds,
		category: data.category,
	};
}

export function updateServicePlans(data) {
	return {
		type: 'UPDATE_SERVICE_PLANS',
		servicePlans: data.servicePlans,
	};
}

export function updateAssessmentWrappers(data) {
	return {
		type: 'UPDATE_ASSESSMENT_WRAPPERS',
		assessmentWrappers: data.assessmentWrappers,
	};
}

export function updateLeaderboard(data) {
	return {
		type: 'UPDATE_LEADERBOARD',
		leaderboard: data.leaderboard,
		// rank: data.rank,
		// percentile: data.percentile,
		// rating: data.rating,
	};
}

export function updateRanks(data) {
	return {
		type: 'UPDATE_RANKS',
		rank: data.rank,
		percentile: data.percentile,
		rating: data.rating,
	};
}

export function setUserAssessmentAnalytics(data) {
	return {
		type: 'SET_USER_ASSESSMENT_ANALYTICS',
		data,
	};
}

export function setOverallAssessmentAnalysis(data) {
	return {
		type: 'SET_OVERALL_ASSESSMENT_ANALYTICS',
		data,
	};
}
