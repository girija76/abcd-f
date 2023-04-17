import { Card, Divider } from 'antd';
import React from 'react';
import BodyView from './Body';
import CommentList from './CommentList';
import PostHead from './PostHead';
import ViewFiles from './ViewFiles';

function AnswerView({ answer, questionId, onRefresh }) {
	return (
		<Card size="small" key={answer._id}>
			<BodyView body={answer.body} bodyType={answer.bodyType} />
			<ViewFiles files={answer.files} />
			<Divider style={{ marginTop: 0, marginBottom: '.5rem' }} />
			<PostHead createdAt={answer.createdAt} {...answer.createdBy} />
			<Divider style={{ margin: '12px 0' }} />
			<CommentList
				comments={answer.comments}
				item={answer._id}
				itemType="ForumAnswer"
				onRefresh={onRefresh}
			/>
		</Card>
	);
}

export default AnswerView;
