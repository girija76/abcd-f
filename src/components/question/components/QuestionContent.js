import React from 'react';
import Editor from '../../Editor';
import Columns from './Columns';
import './style.css';

const QuestionHead = ({ content, _id, newType, columns }) => {
	return (
		<div
			style={{ borderBottom: '1px solid #e0e0e0' }}
			className="question-body-wrapper"
		>
			{content && content.rawContent && (
				<Editor key={_id} rawContent={content.rawContent} />
			)}

			{newType === 'MATCH_THE_COLUMNS' && <Columns columns={columns} />}
		</div>
	);
};

export default QuestionHead;
