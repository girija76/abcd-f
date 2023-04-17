import {
	// generateSmartInstructions,
	// categoryProbabilities,
	// behaviourMapNew,
	// behaviourMap,
	// bluffs,
	// getStdSq,
	getNormalizedPickingAbility,
} from '../components/analysis/lib';

// import { calculateSelectivityForSubmission } from './indexes/selectivity;';

const defaultEndurance = 0;
const defaultStubbornness = 0;
const defaultStamina = 0;

export const defaultEndurance2 = 70;
export const defaultStubbornness2 = 70;
export const defaultStamina2 = 70;
export const defaultSelectivity2 = 70;

export function getIntent(
	correctBluffs,
	corrects,
	totalAttempts,
	totalQuestions,
	maxIdleTime,
	earlyExitTime,
	duration
) {
	let dFactor = 0;
	let intent = 0;
	if (corrects) {
		intent += (100.0 * correctBluffs) / corrects;
		dFactor += 1;
	}

	if (totalQuestions) {
		intent += 100 - (100.0 * totalAttempts) / totalQuestions;
		dFactor += 1;
	}

	if (duration) {
		intent += (100.0 * maxIdleTime) / duration;
		dFactor += 1;
	}

	if (duration) {
		intent += (100.0 * earlyExitTime) / duration;
		dFactor += 1;
	}

	if (dFactor) {
		intent = intent / dFactor;
	}

	return Math.round(100 - intent);
}

export function getEndurance(correctsInTime, allNotInTime) {
	return correctsInTime + allNotInTime
		? Math.round((100.0 * correctsInTime) / (correctsInTime + allNotInTime))
		: defaultEndurance;
}

// export function getSelectivity(
// 	// pickingAbility,
// 	// sumPickingAbility,
// 	// sumSqPickingAbility,
// 	// nAttempts,
// 	submission,
// 	assessmentCore
// ) {
// 	return calculateSelectivityForSubmission(submission, assessmentCore);
// 	// return getNormalizedPickingAbility(
// 	// 	pickingAbility,
// 	// 	sumPickingAbility,
// 	// 	sumSqPickingAbility,
// 	// 	nAttempts
// 	// );
// }

export function getStubbornness(questionsStuckOn, totalAttempts) {
	return totalAttempts
		? Math.round(100 - (100.0 * questionsStuckOn) / totalAttempts)
		: defaultStubbornness;
}

export function getStamina(totalAttempts, totalQuestions, patches) {
	if (patches) {
		let emptyPatches = 0;
		patches.forEach(p => {
			if (p.activity === 0) emptyPatches += 1;
		});
		return patches.length
			? Math.round(100 - (100.0 * emptyPatches) / patches.length)
			: defaultStamina;
	} else {
		return totalQuestions
			? Math.round((100.0 * totalAttempts) / totalQuestions)
			: defaultStamina;
	}
}
