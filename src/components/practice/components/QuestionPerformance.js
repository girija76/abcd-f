import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import './QuestionPerformance.css';

const QuestionPerformance = ({ session, question }) => {
	const [isCorrect, setIsCorrect] = useState(false);
	const [speed, setSpeed] = useState(null);
	useEffect(() => {
		if (question && Object.keys(question).length) {
			let minPerfectTime, maxPerfectTime, timeTaken;
			try {
				session.questions.forEach(sessionQuestion => {
					if (sessionQuestion.id === question._id) {
						minPerfectTime = sessionQuestion.perfectTimeLimits.min;
						maxPerfectTime = sessionQuestion.perfectTimeLimits.max;
						timeTaken = sessionQuestion.time;
						setIsCorrect(sessionQuestion.correct);
					}
				});
			} catch (e) {
				console.error(e);
			}

			if (timeTaken < minPerfectTime) {
				setSpeed('too-fast');
			} else if (timeTaken > maxPerfectTime) {
				setSpeed('too-slow');
			} else {
				setSpeed('optimum');
			}
		}
	}, [question]);

	let speedToShow = '';
	if (speed === 'optimum') {
		speedToShow = isCorrect ? 'Perfect' : '';
	} else if (speed === 'too-fast') {
		speedToShow = 'Too Fast';
	} else if (speed === 'too-slow') {
		speedToShow = 'Overtime';
	}
	const category = `${isCorrect ? 'correct' : 'incorrect'}-${speed}`;
	return (
		<div className={classnames('question-performance', category)}>
			<div className="question-performance-inner">
				<div>
					{`${speedToShow}${speedToShow ? ', ' : ''}${
						isCorrect ? 'Correct' : 'Incorrect'
					}`}
				</div>
			</div>
		</div>
	);
};

export default QuestionPerformance;
