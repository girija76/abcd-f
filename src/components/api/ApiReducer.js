function filterWrappers(AssessmentWrappers, ServicePlans) {
	const { hideLocked } = window.config;
	if (hideLocked && AssessmentWrappers) {
		const serviceSubscribed = {};
		if (ServicePlans) {
			ServicePlans.forEach(plan => {
				if (plan.subscribed) {
					plan.services.forEach(service => {
						serviceSubscribed[service._id] = plan;
					});
				}
			});
		}

		return AssessmentWrappers.filter(aw => {
			let locked = false;
			if (aw.visibleForServices.length) locked = true;
			aw.visibleForServices.forEach(mn => {
				if (serviceSubscribed[mn]) {
					locked = false;
				}
			});
			return !locked;
		});
	} else {
		return AssessmentWrappers;
	}
}

function filterFeeds(Feeds, ServicePlans) {
	const { hideLocked } = window.config;
	if (hideLocked && Feeds) {
		const serviceSubscribed = {};
		if (ServicePlans) {
			ServicePlans.forEach(plan => {
				if (plan.subscribed) {
					plan.services.forEach(service => {
						serviceSubscribed[service._id] = plan;
					});
				}
			});
		}

		const upcomingAssessments = Feeds.upcomingAssessments.filter(aw => {
			let locked = false;
			if (aw.visibleForServices.length) locked = true;
			aw.visibleForServices.forEach(mn => {
				if (serviceSubscribed[mn]) {
					locked = false;
				}
			});
			return !locked;
		});

		const liveAssessments = Feeds.liveAssessments.filter(aw => {
			let locked = false;
			if (aw.visibleForServices.length) locked = true;
			aw.visibleForServices.forEach(mn => {
				if (serviceSubscribed[mn]) {
					locked = false;
				}
			});
			return !locked;
		});

		return {
			liveAssessments,
			upcomingAssessments,
			analysisAssessments: Feeds.analysisAssessments,
		};
	} else {
		return Feeds;
	}
}

const ApiReducer = (
	state = {
		Topics: [],
		Difficulty: [],
		Subtopic: '',
		UserData: null,
		Feeds: null,
		// Leaderboard: [],
		CompletedAssessments: [], // change to attemptedAssessments
		Assessments: [],
		Recommendations: [],
		SuperGroups: [],
		Puzzle: null,
		MyQuestions: {},
		Flow: [],
		CurrSection: null,
		CurrQuestion: null,
		QuestionStartTime: null,
		AssessmentWrappers: null,
		ServicePlans: null,
		Phase: null,
		SupergroupNames: {},
		PercentComplete: undefined,
		Category: undefined,
		Leaderboard: null,
		Rank: null,
		Competitors: null,
		Percentile: null,
		Rating: null,
		Course: null,
		Buckets: [],
		UserAssessment: [],
		OverallAssessment: {},
	},
	action
) => {
	switch (action.type) {
		case 'INITIALIZE_ASSESSMENT':
			localStorage.setItem('myQuestions', JSON.stringify(action.myQuestions));
			localStorage.setItem('flow', JSON.stringify(action.flow));
			localStorage.setItem('currSection', action.currSection);
			localStorage.setItem('currQuestion', action.currQuestion);
			localStorage.setItem('questionStartTime', action.questionStartTime);

			return Object.assign({}, state, {
				MyQuestions: action.myQuestions,
				Flow: action.flow,
				CurrSection: action.currSection,
				CurrQuestion: action.currQuestion,
				QuestionStartTime: action.questionStartTime,
			});

		case 'UPDATE_MYQUESTIONS': //call here
			localStorage.setItem('myQuestions', JSON.stringify(action.myQuestions));
			const updatedState = Object.assign({}, state, {
				MyQuestions: action.myQuestions,
			});
			if (!action.doNotUpdateFlow) {
				localStorage.setItem('flow', JSON.stringify(action.flow));
				updatedState.Flow = action.flow;
			}
			return updatedState;

		case 'UPDATE_FLOW':
			localStorage.setItem('flow', JSON.stringify(action.flow));
			return Object.assign({}, state, { Flow: action.flow });

		case 'MOVE_TO_QUESTION': //call here
			const {
				CurrSection,
				CurrQuestion,
				MyQuestions,
				Flow,
				QuestionStartTime,
			} = state;

			const { section, question } = action;
			const MyQuestionsCopy = Object.assign({}, MyQuestions);
			const FlowCopy = [...Flow];

			MyQuestionsCopy.sections[CurrSection].questions[CurrQuestion].time += 0;
			const questionEndTime = new Date().getTime();
			FlowCopy.push({
				id: new Date().getTime(),
				section: CurrSection,
				question: CurrQuestion,
				time: questionEndTime - QuestionStartTime, //what if this is null
				action: 0,
				state: MyQuestions.sections[CurrSection].questions[CurrQuestion].state,
				response: MyQuestions.sections[CurrSection].questions[CurrQuestion].answer,
			});

			if (!MyQuestions.sections[section].questions[question].state)
				MyQuestionsCopy.sections[section].questions[question].state = 1;

			localStorage.setItem('myQuestions', JSON.stringify(MyQuestionsCopy));
			localStorage.setItem('flow', JSON.stringify(FlowCopy));
			localStorage.setItem('currSection', section);
			localStorage.setItem('currQuestion', question);
			localStorage.setItem('questionStartTime', action.questionStartTime);
			return Object.assign({}, state, {
				CurrSection: section,
				CurrQuestion: question,
				MyQuestions: MyQuestionsCopy,
				Flow: FlowCopy,
				QuestionStartTime: questionEndTime,
			});

		case 'UPDATE_FLOW_QUESTIONSTARTTIME':
			localStorage.setItem('flow', JSON.stringify(action.flow));
			localStorage.setItem('questionStartTime', action.questionStartTime);
			return Object.assign({}, state, {
				Flow: action.flow,
				QuestionStartTime: action.questionStartTime,
			});

		case 'UPDATE_USER_DATA':
			return Object.assign({}, state, { UserData: action.userData });

		case 'UPDATE_USER_PRACTICE_DATA':
			const newUser = Object.assign({}, state.UserData);
			newUser.xp.net += action.xpEarned;
			newUser.xp.streak = action.streak;
			newUser.stats = action.stats;
			return Object.assign({}, state, { UserData: newUser });

		case 'UPDATE_UNVERIFIED_USER_DATA':
			return Object.assign({}, state, {
				UserData: action.userData,
				SuperGroups: action.superGroups,
			});

		case 'UPDATE_USER_DATA2':
			return Object.assign({}, state, {
				// add userData here only!!
				Topics: action.topics,
				Difficulty: action.difficulty,
				PercentComplete: action.percentComplete,
				// Feeds: action.feeds,
				// Leaderboard: action.leaderboard,
				// CompletedAssessments: action.completedAssessments,
				// Assessments: action.assessments,
				Recommendations: action.recommendations,
				Puzzle: action.puzzle,
				SupergroupNames: action.supergroupNames,
				Category: action.category,
			});

		case 'UPDATE_USER_DATA3':
			return Object.assign({}, state, {
				// add userData here only!!
				UserData: action.userData,
				Topics: action.topics,
				Difficulty: action.difficulty,
				PercentComplete: action.percentComplete,
				// Leaderboard: action.leaderboard,
				Recommendations: action.recommendations,
				Puzzle: action.puzzle,
				SupergroupNames: action.supergroupNames,
				Category: action.category,
			});

		case 'UPDATE_USER_PRACTICE':
			return Object.assign({}, state, {
				// used in endSession
				UserData: action.user,
				Topics: action.topics,
				Difficulty: action.difficulty,
				Feeds: action.feeds,
			});

		case 'UPDATE_USER_GROUPS':
			return Object.assign({}, state, {
				// used in endSession
				UserData: action.user,
				SuperGroups: action.superGroups,
			});

		case 'UPDATE_SUBTOPIC':
			return Object.assign({}, state, { Subtopic: action.topic });

		case 'UPDATE_TOPICS':
			return Object.assign({}, state, { Topics: action.topics });

		case 'UPDATE_TOPICS_ASSESSMENTS':
			return Object.assign({}, state, {
				Topics: action.topics,
				AssessmentWrappers: filterWrappers(
					action.assessmentWrappers,
					state.ServicePlans
				),
				Feeds: filterFeeds(action.feeds, state.ServicePlans),
				Phase: action.phase,
				SupergroupNames: action.supergroupNames,
				PercentComplete: action.percentComplete,
				Category: action.category,
				Leaderboard: action.leaderboard,
			});

		case 'UPDATE_GROUPS':
			return Object.assign({}, state, { SuperGroups: action.superGroups });

		case 'UPDATE_CATEGORIES':
			return Object.assign({}, state, { Categories: action.categories });

		case 'UPDATE_PUZZLE':
			return Object.assign({}, state, { Puzzle: action.puzzle });

		case 'UPDATE_ASSESSMENT_WRAPPERS_FEEDS':
			return Object.assign({}, state, {
				AssessmentWrappers: filterWrappers(
					action.assessmentWrappers,
					state.ServicePlans
				),
				Feeds: filterFeeds(action.feeds, state.ServicePlans), //filter feed too
				// Category: action.category,
			});

		case 'UPDATE_ASSESSMENT_WRAPPERS':
			return Object.assign({}, state, {
				AssessmentWrappers: filterWrappers(
					action.assessmentWrappers,
					state.ServicePlans
				),
			});

		case 'UPDATE_SERVICE_PLANS':
			return Object.assign({}, state, {
				ServicePlans: action.servicePlans,
				AssessmentWrappers: filterWrappers(
					state.assessmentWrappers,
					action.ServicePlans
				), //update feed too
				Feeds: filterFeeds(state.feeds, action.ServicePlans),
			});

		case 'UPDATE_LEADERBOARD':
			return Object.assign({}, state, {
				Leaderboard: action.leaderboard,
			});

		case 'UPDATE_RANKS':
			return Object.assign({}, state, {
				Rank: action.rank,
				Percentile: action.percentile,
				Rating: action.rating,
			});

		case 'UPDATE_BUCKETS':
			return Object.assign({}, state, {
				Buckets: action.buckets,
			});

		case 'SET_USER_ASSESSMENT_ANALYTICS':
			return Object.assign({}, state, {
				UserAssessment: action.data,
			});

		case 'SET_OVERALL_ASSESSMENT_ANALYTICS':
			return Object.assign({}, state, {
				OverallAssessment: action.data,
			});

		default:
			return state;
	}
};

export default ApiReducer;
