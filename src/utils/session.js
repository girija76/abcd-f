const createFilterParameter = filtersArray => {
	const filters = filtersArray.map(filter => {
		const f = {
			i: filter.subTopic,
		};
		if (filter.level === 0 || filter.level) {
			f.l = filter.level;
		}
		if (filter.levels && filter.levels.length) {
			f.ls = filter.levels;
		}
		return f;
	});
	return JSON.stringify(filters);
};

export const createConfigParameter = config => {
	const {
		alertBeforeTooSlow,
		preventTooSlow,
		preventTooFast,
		allowReattempt,
		clockType,
		canSkip,
		disableBack,
		questionSelectionTimeLimit,
		totalQuestions,
		timeLimit,
		selector,
		shouldSelect,
		tooSlowDetector,
		sessionType,
		tooFastMultiplier,
	} = config;
	const params = {};
	if (preventTooFast === '1' || preventTooFast === true) {
		params.ptf = '1';
	}
	if (preventTooSlow === '1' || preventTooSlow === true) {
		params.pts = '1';
	}
	if (clockType === 'timer') {
		params.clt = 't';
	}
	if (allowReattempt === '1' || allowReattempt === true) {
		params.alr = '1';
	}
	if (canSkip === '1' || canSkip === true) {
		params.cs = '1';
	}
	if (disableBack === '1' || disableBack === true) {
		params.db = '1';
	}
	if (
		totalQuestions &&
		typeof totalQuestions === 'number' &&
		!isNaN(totalQuestions)
	) {
		params.tq = parseInt(totalQuestions, 10);
	}
	if (typeof alertBeforeTooSlow === 'number' && !isNaN(alertBeforeTooSlow)) {
		params.abts = alertBeforeTooSlow;
	}
	if (shouldSelect && typeof shouldSelect === 'number' && !isNaN(shouldSelect)) {
		params.ss = parseInt(shouldSelect, 10);
	}
	if (timeLimit && typeof timeLimit === 'number' && !isNaN(timeLimit)) {
		params.til = parseInt(timeLimit, 10);
	}
	if (
		typeof questionSelectionTimeLimit === 'number' &&
		!isNaN(questionSelectionTimeLimit)
	) {
		params.qst = questionSelectionTimeLimit;
	}
	if (typeof tooFastMultiplier === 'number' && !isNaN(tooFastMultiplier)) {
		params.tfm = tooFastMultiplier;
	}
	if (tooSlowDetector) {
		params.tsd = tooSlowDetector;
	}
	if (sessionType) {
		params.st = sessionType;
	}

	if (selector) params.sel = selector;
	return JSON.stringify(params);
};
export const parseConfigParameters = params => {
	const config = {};
	if (params.ptf === '1') {
		config.preventTooFast = '1';
	}
	if (params.pts === '1') {
		config.preventTooSlow = '1';
	}
	if (params.clt === 't') {
		config.clockType = 'timer';
	}
	if (params.alr === '1') {
		config.allowReattempt = '1';
	}
	if (params.cs === '1') {
		config.canSkip = '1';
	}
	if (params.db === '1') {
		config.disableBack = '1';
	}
	if (params.tq) {
		const totalQuestions = parseInt(params.tq, 10);
		if (totalQuestions && !isNaN(totalQuestions)) {
			config.totalQuestions = totalQuestions;
		}
	}
	if (params.qst) {
		const questionSelectionTimeLimit = parseInt(params.qst, 10);
		if (questionSelectionTimeLimit && !isNaN(questionSelectionTimeLimit)) {
			config.questionSelectionTimeLimit = questionSelectionTimeLimit;
		}
	}
	if (params.ss) {
		const shouldSelect = parseInt(params.ss, 10);
		if (shouldSelect && !isNaN(shouldSelect)) {
			config.shouldSelect = shouldSelect;
		}
	}
	if (params.til) {
		const timeLimit = parseInt(params.til, 10);
		if (timeLimit && !isNaN(timeLimit)) {
			config.timeLimit = timeLimit;
		}
	}
	if (params.tfm) {
		const tooFastMultiplier = parseInt(params.tfm, 10);
		if (tooFastMultiplier && !isNaN(tooFastMultiplier)) {
			config.tooFastMultiplier = tooFastMultiplier;
		}
	}
	if (params.abts) {
		const alertBeforeTooSlow = parseInt(params.abts, 10);
		if (alertBeforeTooSlow && !isNaN(alertBeforeTooSlow)) {
			config.alertBeforeTooSlow = alertBeforeTooSlow;
		}
	}
	if (params.tsd) {
		config.tooSlowDetector = params.tsd;
	}
	if (params.st) {
		config.sessionType = params.st;
	}
	if (params.sel) config.selector = params.sel;
	if (params.st) config.sessionType = params.st;
	return config;
};
export const createLinkForSession = ({
	filters,
	title,
	config,
	assessment,
}) => {
	if (assessment) {
		return `/practice/new?con=${encodeURIComponent(
			JSON.stringify(createConfigParameter(config || {}))
		)}&title=${encodeURIComponent(title)}&f=${createFilterParameter(
			filters
		)}&a=${assessment}`;
	}
	return `/practice/new?con=${encodeURIComponent(
		JSON.stringify(createConfigParameter(config || {}))
	)}&title=${encodeURIComponent(title)}&f=${createFilterParameter(filters)}`;
};

export const parseParamsFromURL = params => {
	const filters = JSON.parse(params.get('f')).map(filter => ({
		subTopic: filter.i,
		level: isNaN(parseInt(filter.l, 10)) ? -1 : filter.l,
		levels: filter.ls ? filter.ls : [],
	}));
	const title = params.get('title');
	const config = {};
	const configParam = params.get('con');
	const assessment = params.get('a');
	if (configParam) {
		try {
			const parsedConfigParam = JSON.parse(
				JSON.parse(decodeURIComponent(configParam))
			);
			const parsedConfig = parseConfigParameters(parsedConfigParam);
			Object.keys(parsedConfig).forEach(key => {
				config[key] = parsedConfig[key];
			});
		} catch (e) {
			console.error(e);
		}
	}
	if (assessment) return { filters, title, config, assessment };
	return { filters, title, config };
};

export const getSpeedsOfSession = session => {
	const aggregates = {
		min: 0,
		max: 0,
		actual: 0,
		count: 0,
	};
	session.questions.forEach(question => {
		let questionStatistics = question;
		if (question.attempt) {
			questionStatistics = question.attempt;
		}
		if (questionStatistics.isAnswered) {
			aggregates.min += questionStatistics.perfectTimeLimits.min;
			aggregates.max += questionStatistics.perfectTimeLimits.max;
			aggregates.actual += questionStatistics.time;
			aggregates.count += 1;
		}
	});
	const times = { min: 10, max: 180, average: 90 };
	if (aggregates.count > 0) {
		times.min = aggregates.min / aggregates.count;
		times.max = aggregates.max / aggregates.count;
		times.average = aggregates.actual / aggregates.count;
	}

	const speeds = {
		min: 1,
		max: times.max / times.min,
		average: times.max / times.average,
	};
	return speeds;
};

export const getCorrectIncorrectCount = session => {
	let correctCount = 0,
		incorrectCount = 0,
		skipped = 0;
	session.questions.forEach(questionItem => {
		if (questionItem.attempt) {
			if (questionItem.attempt.isCorrect === true) {
				correctCount += 1;
			} else if (questionItem.attempt.isCorrect === false) {
				incorrectCount += 1;
			} else if (questionItem.attempt.isSkipped === true) {
				skipped += 1;
			}
		} else {
			if (questionItem.isCorrect === true) {
				correctCount += 1;
			} else if (questionItem.isCorrect === false) {
				incorrectCount += 1;
			} else if (questionItem.isSkipped === true) {
				skipped += 1;
			}
		}
	});
	return { correct: correctCount, incorrect: incorrectCount, skipped };
};

const getAttemptPerformanceCategory = attempt => {
	const speed = { 0: 'too-slow', 5: 'optimum', 10: 'too-fast' }[attempt.speed];
	return `${attempt.isCorrect ? 'correct' : 'incorrect'}-${speed}`;
};

export const getPerformanceTableData = session => {
	let table = {
		'incorrect-too-fast': 0,
		'incorrect-optimum': 0,
		'incorrect-too-slow': 0,
		'correct-too-fast': 0,
		'correct-optimum': 0,
		'correct-too-slow': 0,
	};
	session.questions.forEach(questionItem => {
		const attempt = questionItem.attempt || questionItem;
		if (attempt.isAnswered) {
			table[getAttemptPerformanceCategory(attempt)] += 1;
		}
	});
	return table;
};

export const isNoteEmpty = note => {
	if (!note) {
		return true;
	} else {
		if (note.type === 'text') {
			return note.data.trim().length === 0;
		}
	}

	return true;
};

export const getTitle = session => {
	if (session.title) {
		return session.title;
	}
	return `Practice Session`;
};

export const isQuestionDisabled = ({
	attemptsByQuestionId,
	session,
	questionId,
}) => {
	if (session.hasEnded) {
		return false;
	}
	const sessionConfig = session.config;
	const attempt = attemptsByQuestionId[questionId];
	const { selectedQuestionsToAttempt } = session;
	try {
		if (
			session.config.questions.shouldSelect &&
			(Array.isArray(selectedQuestionsToAttempt) &&
				selectedQuestionsToAttempt.length > 0)
		) {
			if (selectedQuestionsToAttempt.indexOf(questionId) === -1) {
				return true;
			}
		}
	} catch (e) {
		// if selectedQuestionsToAttempt is not present, it means user doesn't have to select
		// return true;
	}
	if (sessionConfig.prevent.tooSlow) {
		if (
			getTimeSpentInAttempt(attempt) >=
			getTimeLimitForSessionQuestion(attempt, sessionConfig, session)
		) {
			return true;
		} else {
			return false;
		}
	}
	return false;
};

const getQuestionRelativeToQuestion = (session, questionId, plusX) => {
	let currentActiveIndex = -1;
	session.questions.some((q, index) => {
		if (q.question === questionId) {
			currentActiveIndex = index;
			return true;
		}
		return false;
	});

	if (
		currentActiveIndex === -1 ||
		!session.questions[currentActiveIndex + plusX]
	) {
		return null;
	}
	return session.questions[currentActiveIndex + plusX].question;
};

const getActiveQuestionRelativeToQuestion = ({
	session,
	questionId,
	plusX,
	attemptsByQuestionId,
}) => {
	let relativeQuestion = questionId;
	do {
		relativeQuestion = getQuestionRelativeToQuestion(
			session,
			relativeQuestion,
			plusX
		);
	} while (
		relativeQuestion &&
		isQuestionDisabled({
			session,
			questionId: relativeQuestion,
			attemptsByQuestionId,
		})
	);
	return relativeQuestion;
};

export const getPreviousQuestionId = ({
	session,
	questionId,
	attemptsByQuestionId,
	plusX = -1,
}) => {
	return getActiveQuestionRelativeToQuestion({
		session,
		questionId,
		plusX,
		attemptsByQuestionId,
	});
};

export const getNextQuestionId = arg => {
	return getPreviousQuestionId({ ...arg, plusX: 1 });
};

export const getActiveQuestionIndex = (session, questionId) => {
	let currentActiveIndex = -1;
	session.questions.some((q, index) => {
		if (q.question === questionId) {
			currentActiveIndex = index;
			return true;
		}
		return false;
	});
	return currentActiveIndex;
};

const getTimeLimitForSessionQuestionBasedOnTooSlow = attempt => {
	return Math.ceil(attempt.perfectTimeLimits.max);
};

const getTimeLimitForSessionQuestionBasedOnDistributeEqualTime = (
	attempt,
	sessionConfig,
	session
) => {
	if (session.questions.length >= sessionConfig.questions.total) {
		return null;
	}
	return Math.floor(sessionConfig.timeLimit / sessionConfig.questions.total);
};

const getMedianTime = (attempt, sessionConfig, session) => {
	let median = attempt.medianTime;
	if (!median) {
		try {
			// fallback to mean of tooSlow and tooFast
			median = attempt.perfectTimeLimits.max + attempt.perfectTimeLimits.min;
		} catch (e) {}
	}
	return Math.floor(median);
};

export const getTimeLimitForSessionQuestion = (
	attempt,
	sessionConfig,
	session
) => {
	if (session.hasEnded) {
		return null;
	}
	let hasLimit = false;
	const fnMap = {
		tooSlow: getTimeLimitForSessionQuestionBasedOnTooSlow,
		preventUnseenQuestions: getTimeLimitForSessionQuestionBasedOnDistributeEqualTime,
		median: getMedianTime,
	};
	let tooSlowDetector;
	try {
		if (sessionConfig.prevent.tooSlow) {
			hasLimit = true;
		}
	} catch (e) {
		console.error(e);
	}
	if (hasLimit) {
		tooSlowDetector = sessionConfig.tooSlowDetector || 'tooSlow';
		const fn = fnMap[tooSlowDetector];
		return fn(attempt, sessionConfig, session);
	}
};

export const getTooSlowTimeLimit = attempt => {
	try {
		return attempt.perfectTimeLimits.max;
	} catch (e) {
		return null;
	}
};

export const getBestPossibleActiveQuestion = (
	attemptsByQuestionId,
	session,
	questionId,
	leaveThisQuestion
) => {
	const questionIds = session.questions
		? session.questions.map(q => q.question)
		: [];
	if (!session || !session.questions) {
		return questionId;
	}
	const questionIndex = questionIds.indexOf(questionId);
	const newQuestionOrder = [
		...questionIds.slice(
			questionIndex + (leaveThisQuestion ? 1 : 0),
			questionIds.length
		),
		...questionIds.slice(0, questionIndex),
	];
	let bestActiveQuestion = questionId;
	newQuestionOrder.some(qId => {
		const isDisabled = isQuestionDisabled({
			attemptsByQuestionId,
			session,
			questionId: qId,
		});
		if (!isDisabled) {
			bestActiveQuestion = qId;
			return true;
		}
		return false;
	});
	return bestActiveQuestion;
};

export const getAttemptListSize = ({ state, listKey, sessionId }) => {
	try {
		return state.session.sessionsById[sessionId][listKey].length;
	} catch (e) {
		return 0;
	}
};

const createTimeReducer = ifEndTimeNotPresentCountTillNow => (
	accumulator,
	item,
	index,
	srcArray
) => {
	let time = 0;
	if (item) {
		const { startTime } = item;
		let { endTime } = item;
		if (!endTime) {
			if (ifEndTimeNotPresentCountTillNow && srcArray.length - 1 === index) {
				endTime = Date.now();
			}
		}
		if (endTime && startTime) {
			time = endTime - startTime;
		}
	}
	return accumulator + time / 1000;
};

export const getTimeSpentInAttempt = (
	attempt,
	ifEndTimeNotPresentCountTillNow
) => {
	const flow = attempt.flow || [];
	const timeSpent = flow.reduce(
		createTimeReducer(ifEndTimeNotPresentCountTillNow),
		0
	);
	return Math.ceil(timeSpent);
};

/**
 *This will return an array of questions
 *best questions as first element and worst question as last element
 */
export const sortQuestionAsBricks = attempts => {
	return attempts
		.sort((attempt1, attempt2) => {
			if (attempt1.demoRank && attempt2.demoRank) {
				return attempt1.demoRank - attempt2.demoRank;
			}
			return attempt1.perfectTimeLimits.max - attempt2.perfectTimeLimits.max;
		})
		.map(attempt => attempt.question);
};
