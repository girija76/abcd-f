import { toInteger } from 'lodash';

export const findUserAverage = data => {
	const length = data.length;
	let marks = 0;
	let questionsAttempted = 0;
	let correctQuestions = 0;
	let correctTime = 0;
	let incorrectTime = 0;
	let unattemptedTime = 0;
	let precision = 0;
	let marksGained = 0;
	let marksLost = 0;
	let totalQuestions = 0;
	for (var i = 0; i < data.length; i++) {
		let total = 0;
		data[i].assessmentCore.sections
			? data[i].assessmentCore.sections.forEach(section => {
					total += section.questions.length;
			  })
			: data[i].sections.forEach(section => {
					total += section.questions.length;
			  });
		totalQuestions += total;
		correctQuestions += data[i].meta
			? data[i].meta.correctQuestions
			: data[i].correctQuestions;
		correctTime += data[i].meta ? data[i].meta.correctTime : data[i].correctTime;
		incorrectTime += data[i].meta
			? data[i].meta.incorrectTime
			: data[i].incorrectTime;
		questionsAttempted += data[i].meta
			? data[i].meta.questionsAttempted
			: data[i].questionsAttempted;
		unattemptedTime += data[i].meta
			? data[i].meta.unattemptedTime
			: data[i].unattemptedTime;
		precision += data[i].meta ? data[i].meta.precision : data[i].precision;
		marksGained += data[i].meta ? data[i].meta.marksGained : data[i].marksGained;
		marksLost += data[i].meta ? data[i].meta.marksLost : data[i].marksLost;
		marks += data[i].meta ? data[i].meta.marks : data[i].marks;
	}

	return {
		marks: marks / length,
		marksGained: marksGained / length,
		marksLost:
			marksLost / length >= 0 ? marksLost / length : 0 - marksLost / length,
		questionsAttempted: toInteger(questionsAttempted / length),
		correctQuestions: toInteger(correctQuestions / length),
		incorrectQuestions: toInteger(
			(questionsAttempted - correctQuestions) / length
		),
		questionsUnattempted: (totalQuestions - questionsAttempted) / length,
		correctTime: correctTime / length / 1000,
		incorrectTime: incorrectTime / length / 1000,
		unattemptedTime: unattemptedTime / length / 1000,
		precision: precision / length,
		totalQuestions: toInteger(totalQuestions / length),
	};
};

export const getDataPoints = obj => {
	const result = [];
	Object.keys(obj).forEach(value => {
		result.push({
			label: value,
			y: obj[value],
		});
	});
	return result;
};
