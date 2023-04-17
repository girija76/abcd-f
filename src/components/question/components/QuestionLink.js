import React from 'react';
import Editor from 'components/Editor';

function QuestionLink({ linked, currQuestionNumber, link }) {
	return linked ? (
		<div className="question-link" style={{ marginBottom: 12 }}>
			<span style={{ fontWeight: 'bold' }}>
				[Direction for questions: {currQuestionNumber - link.sequence_no} -{' '}
				{currQuestionNumber - link.sequence_no + link.total_questions - 1}]
			</span>
			<Editor key={link.id} rawContent={link.content.rawContent} />
		</div>
	) : null;
}

export default QuestionLink;
