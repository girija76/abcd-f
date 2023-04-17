import React, { useState } from 'react';

import Editor from 'components/Editor';
import { fixQuestionRawContent } from 'utils/editor';

const Question = ({ question }) => {
	const [rawContent] = useState(
		fixQuestionRawContent(question.content.rawContent)
	);
	const [linkedQuestionCommonData] = useState(
		question.link && question.link.content && question.link.content.rawContent
			? fixQuestionRawContent(question.link.content.rawContent)
			: null
	);
	return (
		<>
			{linkedQuestionCommonData && (
				<Editor key={`${question._id}-cc`} rawContent={linkedQuestionCommonData} />
			)}
			<Editor key={`${question._id}`} rawContent={rawContent} />
		</>
	);
};

export default Question;
