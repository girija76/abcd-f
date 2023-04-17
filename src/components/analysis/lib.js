export function generateSmartInstructions(topics, category, subtopicMap) {
	const instructions = [];
	const alltopics = topics.allTopics.map(a => {
		return subtopicMap[a.subTopic];
	});
	instructions.push({
		icon: 'profile',
		text: `This practice session is for the topics: ${alltopics.join(', ')}`,
	});
	instructions.push({
		icon: 'undo',
		text: 'You can reattempt a question unless you have ended the session.',
	});
	instructions.push({
		icon: 'double-right',
		text: 'You are allowed to skip questions in this practice session.',
	});
	if (category === 3) {
		instructions.push({
			icon: 'clock-circle',
			text:
				'You are allowed to attempt question only when you have given suffient time in the question.',
		});
	}
	if (category === 7) {
		instructions.push({
			icon: 'clock-circle',
			text: 'You cannot take too much time in any single question.',
		});
	}
	instructions.push({
		icon: 'number',
		text: 'You can attempt only 11 questions in this practice session.',
	});
	instructions.push({
		icon: 'bell',
		text: 'Time limit for this practice session is 1200 seconds.',
	});
	instructions.push({
		icon: 'zap',
		text:
			'You will receive atleast 5 XP points for every correct answer. The exact number depends on your current goal and streak.',
	});
	instructions.push({
		icon: 'edit',
		text:
			'You can create note which will be available to you even after you end the session.',
	});
	return instructions;
}

function toMinutes(seconds) {
	return Math.round(seconds / 60.0) + ' mins';
}

export function generateSmartInstructionsNew(category, config) {
	const instructions = [];
	instructions.push({
		icon: 'profile',
		iconStyle: {},
		text: 'This practice session is mainly focussed on your weak topics.',
	});
	instructions.push({
		icon: 'undo',
		iconStyle: {},
		text: 'You can reattempt a question during the session.',
	});
	if (category === 1) {
		instructions.push({
			icon: 'clock-circle',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'You cannot submit an answer before minimum time required to solve the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	}
	if (category === 5) {
	} else if (config.shouldSelect) {
		instructions.push({
			icon: 'number',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'You are given ' +
				toMinutes(config.questionSelectionTimeLimit) +
				' to select ' +
				config.shouldSelect +
				' questions out of ' +
				config.totalQuestions +
				' questions and then attempt them.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else {
		instructions.push({
			icon: 'number',
			iconStyle: {},
			text: 'This session has ' + config.totalQuestions + ' questions.',
		});
	}

	if (category === 2) {
		instructions.push({
			icon: 'clock-circle',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Each question has a different timelimit which depends on the optimum time required to solve the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 4) {
		instructions.push({
			icon: 'alert',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text: 'You will get an alert when you are too slow.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
		instructions.push({
			icon: 'bell',
			iconStyle: {},
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
		});
	} else if (category === 5) {
		instructions.push({
			icon: 'bell',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else {
		instructions.push({
			icon: 'bell',
			iconStyle: {},
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
		});
	}
	if (category === 1) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Based on your previous performance, you are advised to spend maximum alloted time in the session.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 2) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Try to solve questions in the given time limit to increase your speed.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 3) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Select easy questions and leave hard questions in order to improve your selectivity and score more marks.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 4) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Alert message is the hard deadline when you should leave the question as you have already spent more than the optimum time required in the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 5) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Try maintaining the same concentration level throughout the alloted time to increase your stamina.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	}

	instructions.push({
		icon: 'zap',
		iconStyle: {},
		text:
			'You will receive atleast 5 XP points for every correct answer. The exact number depends on your current goal and streak.',
	});
	instructions.push({
		icon: 'edit',
		iconStyle: {},
		text:
			'You can create note which will be available to you even after you end the session.',
	});
	return instructions;
}

export function generateSmartInstructionsNew2(category, config) {
	const instructions = [];

	if (config.sessionType) {
		instructions.push({
			icon: 'profile',
			iconStyle: {},
			text: 'This practice session is mainly focussed on your weak topics.',
		});

		instructions.push({
			icon: 'undo',
			iconStyle: {},
			text: 'You can reattempt a question during the session.',
		});
	}

	if (category === 1) {
		instructions.push({
			icon: 'clock-circle',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'You cannot submit an answer before minimum time required to solve the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	}

	if (category === 5) {
	} else if (config.questions.shouldSelect) {
		// instructions.push({
		// 	icon: 'number',
		// 	iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
		// 	text:
		// 		'You have to select ' +
		// 		(config.totalQuestions - config.canIgnoreQuestions) +
		// 		' questions out of ' +
		// 		config.totalQuestions +
		// 		' questions and then attempt them.',
		// 	style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		// });

		instructions.push({
			icon: 'number',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'You are given ' +
				toMinutes(config.questionSelectionTimeLimit) +
				' to select ' +
				config.questions.shouldSelect +
				' questions out of ' +
				config.questions.total +
				' questions and then attempt them.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (config.questions.total) {
		instructions.push({
			icon: 'number',
			iconStyle: {},
			text: 'This session has ' + config.questions.total + ' questions.',
		});
	}

	if (category === 2) {
		instructions.push({
			icon: 'clock-circle',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Each question has a different timelimit which depends on the optimum time required to solve the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 4) {
		instructions.push({
			icon: 'alert',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text: 'You will get an alert when you are too slow.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
		instructions.push({
			icon: 'bell',
			iconStyle: {},
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
		});
	} else if (category === 5) {
		instructions.push({
			icon: 'bell',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (config.timeLimit) {
		instructions.push({
			icon: 'bell',
			iconStyle: {},
			text:
				'Time limit for this practice session is ' + config.timeLimit + ' seconds.',
		});
	}

	if (category === 1) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Based on your previous performance, you are advised to spend maximum alloted time in the session.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 2) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Try to solve questions in the given time limit to increase your speed.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 3) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Select easy questions and leave hard questions in order to improve your selectivity and score more marks.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 4) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Alert message is the hard deadline when you should leave the question as you have already spent more than the optimum time required in the question.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	} else if (category === 5) {
		instructions.push({
			icon: 'bulb',
			iconStyle: { color: 'rgba(0, 0, 0, 0.8)' },
			text:
				'Try maintaining the same concentration level throughout the alloted time to increase your stamina.',
			style: { fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.8)' },
		});
	}

	instructions.push({
		icon: 'zap',
		iconStyle: {},
		text:
			'You will receive atleast 5 XP points for every correct answer. The exact number depends on your current goal and streak.',
	});
	instructions.push({
		icon: 'edit',
		iconStyle: {},
		text:
			'You can create note which will be available to you even after you end the session.',
	});
	return instructions;
}

export function categoryProbabilities(category) {
	let tooFastProb = 1;
	let optimumProb = 1;
	let tooSlowProb = 1;
	let correctProb = 1;
	let incorrectProb = 1;

	Object.keys(category).forEach(c => {
		const n = category[c];
		if (c === 'correct-too-fast') {
			tooFastProb *= Math.pow(timePrior.fast.fastCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.fastCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.fastCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.fastCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.fastCorrect, n);
		} else if (c === 'correct-optimum') {
			tooFastProb *= Math.pow(timePrior.fast.perfectCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.perfectCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.perfectCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.perfectCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.perfectCorrect, n);
		} else if (c === 'correct-too-slow') {
			tooFastProb *= Math.pow(timePrior.fast.slowCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.slowCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.slowCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.slowCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.slowCorrect, n);
		}
		if (c === 'incorrect-too-fast') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.fastIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.fastIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.fastIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.fastIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.fastIncorrect, n);
		} else if (c === 'incorrect-optimum') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.perfectIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.perfectIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.perfectIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.perfectIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.perfectIncorrect, n);
		} else if (c === 'incorrect-too-slow') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.slowIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.slowIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.slowIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.slowIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.slowIncorrect, n);
		}
	});

	const sumSpeedProb = tooFastProb + optimumProb + tooSlowProb;
	if (sumSpeedProb > 0) {
		tooFastProb = tooFastProb / sumSpeedProb;
		optimumProb = optimumProb / sumSpeedProb;
		tooSlowProb = tooSlowProb / sumSpeedProb;
	} else {
		tooFastProb = 0.33;
		optimumProb = 0.34;
		tooSlowProb = 0.33;
	}

	const sumAccuracyProb = correctProb + incorrectProb;
	if (sumAccuracyProb > 0) {
		correctProb = correctProb / sumAccuracyProb;
		incorrectProb = incorrectProb / sumAccuracyProb;
	} else {
		correctProb = 0.5;
		incorrectProb = 0.5;
	}

	return { tooFastProb, optimumProb, tooSlowProb, correctProb, incorrectProb };
}

export const behaviourMapNew = [
	{
		name: 'Not assigned yet',
		description: 'Your category will be assigned soon.',
	},
	{
		name: 'Intent',
		description:
			'You need to attempt questions properly and spend more time in each question to improve your performance.',
	},
	{
		name: 'Endurance',
		description:
			'You take too much time to solve questions and need to improve your speed.',
	},
	{
		name: 'Selectivity',
		description:
			'You need to develop sense of judging difficulty of questions. Skipping hard questions and choosing easy questions is a simple strategy to improve your marks.',
	},
	{
		name: 'Agility',
		description:
			'You got stuck in few questions. Learn to judge a question properly and skip it before wasting much time.',
	},
	{
		name: 'Stamina',
		description:
			'Your capability to attempt a long hour test is low, that means the rate at which you attempt questions decreases drastically after spending some time.',
	},
	{
		name: 'Excellence',
		description:
			'You are not making any mistakes, try working towards achieving excellence.',
	},
];

export const bluffs = [
	{
		// only 1 or 2
		description: 'You have made too many bluffs in the assessment.',
	},
	{
		// only 3
		description: "You haven't attempted many questions in the assessment.",
	},
	{
		// only 4
		description:
			'You have been sitting idle for too much time in the assessment.',
	},
	{
		// only 5
		description: 'You have finished the assessment too early.',
	},
];

export const bluffs2 = [
	{
		// only 1 or 2
		description: 'You have not made many bluffs in the assessment.',
	},
	{
		// only 3
		description:
			'You have attempted significant number of questions in the assessment.',
	},
	{
		// only 4
		description:
			'You have not been sitting idle for too much time in the assessment.',
	},
	{
		// only 5
		description: 'You have spend adequate amount of time in the assessment.',
	},
];

export const timePrior = {
	fast: {
		fastCorrect: 0.57,
		perfectCorrect: 0.29,
		slowCorrect: 0.14,
		fastIncorrect: 0.62,
		perfectIncorrect: 0.25,
		slowIncorrect: 0.13,
	},
	perfect: {
		fastCorrect: 0.2,
		perfectCorrect: 0.4,
		slowCorrect: 0.2,
		fastIncorrect: 0.33,
		perfectIncorrect: 0.5,
		slowIncorrect: 0.17,
	},
	slow: {
		fastCorrect: 0.14,
		perfectCorrect: 0.29,
		slowCorrect: 0.57,
		fastIncorrect: 0.28,
		perfectIncorrect: 0.28,
		slowIncorrect: 0.44,
	},
};

export const accuracyPrior = {
	good: {
		fastCorrect: 0.5,
		perfectCorrect: 0.67,
		slowCorrect: 0.83,
		fastIncorrect: 0.5,
		perfectIncorrect: 0.33,
		slowIncorrect: 0.17,
	},
	bad: {
		fastCorrect: 0.33,
		perfectCorrect: 0.5,
		slowCorrect: 0.67,
		fastIncorrect: 0.33,
		perfectIncorrect: 0.5,
		slowIncorrect: 0.33,
	},
};

export function getStdSq(sum, sumSq, n) {
	if (!n) return 0;
	return (1.0 * sumSq) / n - (1.0 * sum * sum) / (n * n);
}

export function getNormalizedPickingAbility(
	pickingAbility,
	sumPickingAbility,
	sumSqPickingAbility,
	n
) {
	const meanPickingAbility = n ? sumPickingAbility / n : 0;
	const stdPickingAbility = getStdSq(sumPickingAbility, sumSqPickingAbility, n);
	if (n > 30 && stdPickingAbility) {
		const sigmaDist = (pickingAbility - meanPickingAbility) / stdPickingAbility;
		return Math.max(0, Math.min(100, (100 * (2 + sigmaDist)) / 2));
	}
	return 75;
}

export const behaviourMap = [
	{
		name: 'Not assigned yet',
		description: 'Your category will be assigned soon.',
	},
	{
		name: 'Learner',
		description:
			'Your overall accuracy is very low which reflects your weak academic knowledge. Be like a learner and clear your concepts by practising basic questions.',
	},
	{
		name: 'Balancer',
		description:
			'You are weak in particular topics due to which you messed up your complete paper. Be like a balancer and balance your concepts by practising your weak areas enough.',
	},
	{
		name: 'Night-Watcher',
		description:
			'You are making too many careless mistakes which reflects your lack of seriousness and concentration. Be like a night-watcher and read the question well before marking.',
	},
	{
		name: 'Detective',
		description:
			'You are attempting questions that are not easy for you and making mistakes there. This means you are not selective so be like a detective and attempt easy questions first.',
	},
	{
		name: 'Treasurer',
		description:
			'You are not able to see the whole paper in optimum time, so the questions in the last are not being attempted by you with good accuracy. So be like a treasurer and see all the questions first so you don’t miss easy questions at the end of the paper.',
	},
	{
		name: 'Mountaineer',
		description:
			'You are going back and forth too many times in a paper which shows your low confidence in your previous attempt. So be like a mountaineer who focuses at the peak, without looking back. Also, re-check the questions in which you aren’t confident enough once you have looked at all the questions.',
	},
	{
		name: 'Goal Keeper',
		description:
			'You are attempting those questions in which you are not confident enough, losing a lot of time which is causing negative marks . Be like a goalkeeper for whom every single mark is important. If you are not confident of your answer irrespective of you having given time to the question, don’t answer it.',
	},
	{
		name: 'Athelete',
		description:
			'Your speed is slow due to which you are not attempting all questions so buck up, be like an athlete and increase your speed.',
	},
	{
		name: 'Soldier',
		description:
			'You are attempting very few questions. Be like a soldier and keep fighting otherwise you will not achieve what you want to achieve.',
	},
	{
		name: 'Excellence',
		description:
			'You are a good student, try working towards achieving excellence.',
	},
];
