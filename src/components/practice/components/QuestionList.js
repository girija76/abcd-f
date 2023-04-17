import React from 'react';

const getDummyQuestion = count => {
	const questions = [];
	for (let i = 0; i < count; i++) {
		questions.push({});
	}
	return questions;
};

const getNumberOfQuestionsToShow = (questionsAttemptedCount, minQuestions) => {
	const remainingFromMin = minQuestions - questionsAttemptedCount;
	let questionsToShow = Math.max(questionsAttemptedCount, minQuestions);
	if (remainingFromMin <= 0) {
		questionsToShow = Math.floor((questionsToShow + 10) / 10) * 10;
	}
	return questionsToShow;
};

const QuestionList = ({ questions, minQuestions }) => {
	const numberOfQuestionsToShow = getNumberOfQuestionsToShow(
		questions.length,
		minQuestions
	);
	const dummyQuestions = getDummyQuestion(
		numberOfQuestionsToShow - questions.length
	);
	const questionsToShow = [...questions, ...dummyQuestions];
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>
			{questionsToShow.map((question, index) => {
				return (
					<span style={{ width: '20%' }} key={index}>
						{index + 1}
					</span>
				);
			})}
		</div>
	);
};

QuestionList.propTypes = {};

QuestionList.defaultProps = {
	questions: [],
	minQuestions: 20,
};

export default QuestionList;
