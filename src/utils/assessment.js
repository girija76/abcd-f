import { verifyAnswerSheetIntegrity } from 'components/libs/lib';
import dayjs from 'dayjs';
import { get, includes, isEmpty, join, map, some, sortBy } from 'lodash';

export const createMapSubmissionMetaSection = (
	assessmentCore,
	bestQuestionGroupChoices,
	submission
) => (section, responseSectionIndex) => {
	return {
		...section,
		questions: map(get(section, ['questions']), (question, questionIndex) => {
			let peerQuestionsListString = '';
			let isOptional = false;
			let isBestChoice = false;
			const shouldNotHaveSelected = some(
				get(
					assessmentCore,
					['sections', responseSectionIndex, 'questionGroups'],
					[]
				),
				(questionGroup, questionGroupIndex) => {
					const hasCurrentQuestion = includes(
						get(questionGroup, 'questions'),
						questionIndex
					);
					if (!hasCurrentQuestion) {
						return false;
					}
					isOptional = true;
					let questionOffset = 0;
					assessmentCore.sections.forEach((_section, _index) => {
						if (_index < responseSectionIndex) {
							questionOffset += _section.questions.length;
						}
					});

					peerQuestionsListString = join(
						map(
							sortBy(
								get(bestQuestionGroupChoices, [
									responseSectionIndex,
									questionGroupIndex,
								])
							),
							i => questionOffset + i + 1
						),
						', '
					);
					const isBest = includes(
						get(bestQuestionGroupChoices, [responseSectionIndex, questionGroupIndex]),
						questionIndex
					);
					if (isBest) {
						isBestChoice = true;
					}
					return !isBest;
				}
			);
			const isAnswered = !isEmpty(
				get(submission, [
					'response',
					'sections',
					responseSectionIndex,
					'questions',
					questionIndex,
					'answer',
				])
			);
			const isBadChoice = isOptional && isAnswered && shouldNotHaveSelected;
			return {
				...question,
				isBadChoice,
				isOptional,
				isAnswered,
				isWorstChoice: isOptional && !isBestChoice,
				isBestChoice,
				badChoiceReason: `You should have skipped this question. These questions were the best choices: ${peerQuestionsListString}.`,
			};
		}),
	};
};

export const getAssessmentGroups = assessments => {
	const pivot = dayjs().add(24, 'hours');
	const recent = [];
	const upcoming = [];
	assessments.forEach(assessment => {
		if (
			pivot.isBefore(assessment.availableFrom) ||
			pivot.isSame(assessment.availableFrom)
		) {
			upcoming.push(assessment);
		} else {
			recent.push(assessment);
		}
	});
	const compareFnForAscending = (a1, a2) => {
		const d1 = dayjs(a1.availableFrom);
		const d2 = dayjs(a2.availableFrom);
		if (d1.isBefore(d2)) {
			return -1;
		} else if (d1.isSame(d2)) {
			return 0;
		}
		return 1;
	};
	recent.sort(compareFnForAscending).reverse();
	upcoming.sort(compareFnForAscending);
	return {
		recent,
		upcoming,
	};
};

function isNumeric(value) {
	return /^\d+$/.test(value);
}

export const createAnswerSheetFromStorage = assessmentCore => {
	let currQuestion = localStorage.getItem('currQuestion');
	let currSection = localStorage.getItem('currSection');
	if (!currQuestion || !isNumeric(currQuestion)) currQuestion = 0;
	else currQuestion = parseInt(currQuestion, 10);
	if (!currSection || !isNumeric(currSection)) currSection = 0;
	else currSection = parseInt(currSection, 10);

	const savedAnswerSheet = JSON.parse(localStorage.getItem('myQuestions')); // use try error

	let questionStartTime = new Date().getTime();
	if (localStorage.getItem('questionStartTime')) {
		questionStartTime = localStorage.getItem('questionStartTime');
	}
	const isValid = verifyAnswerSheetIntegrity(assessmentCore, savedAnswerSheet);
	if (!isValid) {
		const answerSheet = {};
		answerSheet._id = assessmentCore._id;
		answerSheet.sections = assessmentCore.sections.map(section => {
			return {
				_id: section._id,
				name: section.name,
				total_questions: section.questions.length,
				questions: section.questions.map(question => {
					let answer = null;
					if (question.question.type === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT')
						answer = [];
					if (question.question.type === 'MATCH_THE_COLUMNS')
						answer = question.question.columns.col1.map(c => {
							return [];
						});

					return {
						_id: question.question._id,
						time: 0,
						answer,
						state: 0,
					};
				}),
			};
		});
		questionStartTime = new Date().getTime();

		if (!answerSheet.sections[currSection].questions[currQuestion].state) {
			answerSheet.sections[currSection].questions[currQuestion].state = 1;
		}

		return {
			flow: [],
			myQuestions: answerSheet,
			currSection,
			currQuestion,
			questionStartTime,
		};
	} else {
		let flow = JSON.parse(localStorage.getItem('flow'));
		if (!flow) {
			flow = [];
			questionStartTime = new Date().getTime();
		}

		if (!savedAnswerSheet.sections[currSection].questions[currQuestion].state) {
			savedAnswerSheet.sections[currSection].questions[currQuestion].state = 1;
		}

		return {
			flow,
			myQuestions: savedAnswerSheet,
			currSection,
			currQuestion,
			questionStartTime,
		};
	}
};

export const getCriticalSyncInfo = state =>
	JSON.stringify(
		map(get(state, ['api', 'MyQuestions', 'sections']), section =>
			map(get(section, ['questions']), question => ({
				answer: get(question, ['answer']),
			}))
		)
	);

export const createHasStartedExtraSections = assessmentConfig => {
	const extraSections = get(assessmentConfig, ['extraSections'], []);
	if (!extraSections.length) {
		return () => false;
	}
	return state => {
		const allSections = get(state, ['api', 'MyQuestions', 'sections']);
		return allSections.some((section, index) => {
			if (!extraSections.includes(index)) {
				return false;
			}
			return section.questions.some(
				questionResponse => questionResponse.state !== 0
			);
		});
	};
};
export const createCanStartExtraSections = assessmentConfig => {
	const extraSections = get(assessmentConfig, ['extraSections'], []);
	if (!extraSections.length) {
		// You can not start extra sections when there are no extra sections.
		return () => false;
	}
	return state => {
		const allSections = get(state, ['api', 'MyQuestions', 'sections']);
		console.log({ allSections });
		const someSectionHasNonAttemptedQuestion = allSections.some(
			(section, index) => {
				if (extraSections.includes(index)) {
					return false;
				}
				return section.questions.some(questionResponse => {
					return questionResponse.state < 3;
				});
			}
		);
		return !someSectionHasNonAttemptedQuestion;
	};
};
