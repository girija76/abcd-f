import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Button from 'antd/lib/button';
import Editor from 'components/Editor';
import { isRawContentEmpty } from 'utils/editor';
import { URLS } from 'components/urls';

const Solution = ({ baseClass, content, questionId, solutionRequested_ }) => {
	const [isEmpty, setIsEmpty] = useState(false);
	const [solutionRequested, setSolutionRequested] = useState(solutionRequested_);
	useEffect(() => {
		setIsEmpty(isRawContentEmpty(content.rawContent));
	}, [content.rawContent]);

	const requestSolution = () => {
		fetch(`${URLS.backendDiscussion}/requestSolution`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				question: questionId,
			}),
		})
			.then(res => res.json())
			.then(result => {
				setSolutionRequested(true);
			});
	};

	return (
		<div className={`${baseClass}-solution`}>
			{isEmpty ? (
				<div className="empty" style={{ display: 'flex', alignItems: 'center' }}>
					<div>Solution not available yet.</div>
					<div style={{ flex: 1 }}></div>
					<Button
						type="primary"
						disabled={solutionRequested_ || solutionRequested}
						onClick={requestSolution}
					>
						{solutionRequested_ || solutionRequested
							? 'Solution Requested'
							: 'Request Solution'}
					</Button>
				</div>
			) : (
				<React.Fragment>
					<div className="title">Solution</div>
					<div className="content">
						<Editor rawContent={content.rawContent} />
					</div>
				</React.Fragment>
			)}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { questionId } = ownProps;
	const solutionRequested_ = state.discussion.requestsByQuestionId[questionId];
	return { solutionRequested_ };
};

export default connect(
	mapStateToProps,
	{}
)(Solution);
