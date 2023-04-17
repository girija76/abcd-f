import React, { Component } from 'react';
import Editor from '../../Editor';
import Columns from './Columns';
import './style.css';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

class QuestionHead extends Component {
	render() {
		const {
			linked,
			currQuestionNumber,
			link,
			content,
			_id,
			newType,
			columns,
		} = this.props;

		return (
			<div className="question-body-wrapper">
				{linked ? (
					<div style={{ marginBottom: 12 }}>
						<span style={{ fontWeight: 'bold' }}>
							[Direction for questions: {currQuestionNumber - link.sequence_no} -{' '}
							{currQuestionNumber - link.sequence_no + link.total_questions - 1}]
						</span>
						<Editor
							key={link.id}
							rawContent={link.content.rawContent}
							customStyleMap={customStyleMap}
						/>
					</div>
				) : null}

				{content && content.rawContent && (
					<Editor
						key={_id}
						rawContent={content.rawContent}
						customStyleMap={customStyleMap}
					/>
				)}

				{newType === 'MATCH_THE_COLUMNS' && <Columns columns={columns} />}
			</div>
		);
	}
}

export default QuestionHead;
