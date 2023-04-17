import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import playlistApi from 'apis/playlist';
import './comment.scss';

const displayPictureSelector = state => {
	try {
		return state.api.UserData.dp;
	} catch (e) {
		return null;
	}
};

const Comments = ({ videoId, playlistId, playlistItemId }) => {
	const [text, setText] = useState('');
	const [isCommenting, setIsCommenting] = useState(false);
	const myDisplayPicture = useSelector(displayPictureSelector);
	/**
	 * fetchInterval in milliseconds
	 */
	const [refetchInterval, setRefetchInterval] = useState(0.5 * 60 * 1000);

	const { data: commentsData, refetch } = useQuery(
		[videoId, { playlistId, playlistItemId }],
		playlistApi.getComments,
		{
			refetchInterval,
			staleTime: 0.5 * 60 * 1000,
		}
	);

	const {
		items: comments,
		refreshInterval: refetchIntervalFromServer,
	} = commentsData ? commentsData : {};

	const submitComment = () => {
		setIsCommenting(true);
		playlistApi
			.comment({ videoId, playlistId, playlistItemId, text })
			.then(() => {
				setIsCommenting(false);
				setText('');
				refetch({ force: true });
			})
			.catch(() => {
				setIsCommenting(false);
			});
	};
	const handleCommentSubmit = e => {
		e.preventDefault();
		submitComment();
	};
	useEffect(() => {
		if (!isNaN(parseInt(refetchIntervalFromServer, 10))) {
			setRefetchInterval(parseInt(refetchIntervalFromServer, 10));
		}
	}, [refetchIntervalFromServer]);
	return (
		<div className="video-comment-component-root">
			<div className="video-comment-form-container">
				<span className="video-comment-form-dp-container">
					<img className="video-comment-form-dp" src={myDisplayPicture} alt="" />
				</span>
				<form className="video-comment-form" onSubmit={handleCommentSubmit}>
					<textarea
						placeholder="Add a public comment..."
						className="video-comment-input"
						value={text}
						onChange={e => setText(e.target.value)}
						type="text"
					/>
					<button
						className="video-comment-submit"
						disabled={isCommenting || !text || !text.trim()}
					>
						Comment
					</button>
				</form>
			</div>
			<div className="video-comment-list">
				{comments &&
					comments.map(comment => {
						return (
							<div className="video-comment-list-item" key={comment._id}>
								<div className="dp-container">
									<img className="dp" alt="" src={comment.user.dp} />
								</div>
								<div className="username-text-wrapper">
									<span className="username">{comment.user.username}</span>
									<div className="text">{comment.text}</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Comments;
