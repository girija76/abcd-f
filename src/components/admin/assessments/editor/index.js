import React, { useState } from 'react';
import Editor from './AssessmentEditor';
import { QuestionProvider } from './QuestionContext';

const AssessmentEditor = ({ data, kind }) => {
	return (
		<QuestionProvider>
			<Editor data={data} kind={kind} />
		</QuestionProvider>
	);
};

export default AssessmentEditor;
