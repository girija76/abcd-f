import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import DiscussionInput from 'components/discussion/DiscussionInput';
import DiscussionThread from 'components/discussion/DiscussionThread';
import { get as getThreads, setThreads } from 'actions/discussion';

const Discussion = ({
	baseClass,
	questionId,
	threads,
	getThreads,
	setThreads,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		getThreads(questionId)
			.then(({ threads }) => {
				setIsLoading(false);
			})
			.catch(error => {
				setError(error.message || 'Some error occurred');
				setIsLoading(false);
			});
	}, [questionId]);
	const updateThreads = threads => {
		setThreads(questionId, threads);
	};
	return (
		<div className={baseClass}>
			<DiscussionInput aid={questionId} updateThreads={updateThreads} />
			{isLoading ? <div>Loading comments</div> : null}
			{threads ? (
				<DiscussionThread
					aid={questionId}
					threads={threads}
					updateThreads={updateThreads}
				/>
			) : null}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { questionId } = ownProps;
	const threads = state.discussion.threadsByQuestionId[questionId];
	return { threads };
};

export default connect(
	mapStateToProps,
	{ getThreads, setThreads }
)(Discussion);
