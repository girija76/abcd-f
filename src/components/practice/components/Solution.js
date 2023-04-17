import React from 'react';
import Editor from '../../Editor';
import './Solution.css';

const Solution = ({ qid, solution }) => {
	return (
		<div className="practice-question-solution">
			<h6 className="practice-question-solution-title">Solution</h6>
			<div className="practice-question-solution-content">
				{solution && solution.rawContent && (
					<Editor key={qid} rawContent={solution.rawContent} />
				)}
			</div>
		</div>
	);
};

export default Solution;
