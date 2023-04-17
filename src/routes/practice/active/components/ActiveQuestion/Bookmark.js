import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { Tooltip } from 'antd';

import { addBookmark, removeBookmark } from 'actions/session';

import { BookOutlined, BookFilled } from '@ant-design/icons';

const Bookmark = ({ isBookmarked, addBookmark, removeBookmark }) => {
	const [isDisabled, setIsDisabled] = useState(false);
	const handleClick = () => {
		if (isDisabled) return;
		setIsDisabled(true);
		const fn = isBookmarked ? removeBookmark : addBookmark;
		fn()
			.then(() => {
				setIsDisabled(false);
			})
			.catch(() => setIsDisabled(false));
	};
	return (
		<Tooltip
			title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
			placement="bottom"
		>
			<button
				className={classnames('bookmark-button', {
					'is-disabled': isDisabled,
					'is-bookmarked': isBookmarked,
				})}
				onClick={handleClick}
			>
				{isBookmarked ? <BookFilled /> : <BookOutlined />}
			</button>
		</Tooltip>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { questionId } = ownProps;
	const isBookmarked =
		state.session.attemptsByQuestionId[questionId].isBookmarked;
	return { isBookmarked };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { sessionId, questionId } = ownProps;
	return {
		isBookmarked: stateProps.isBookmarked,
		addBookmark: () => dispatchProps.addBookmark(sessionId, questionId),
		removeBookmark: () => dispatchProps.removeBookmark(sessionId, questionId),
	};
};

export default connect(
	mapStateToProps,
	{ addBookmark, removeBookmark },
	mergeProps
)(Bookmark);
