import React from 'react';
import { map } from 'lodash';
import CommentView from './Comment';
import { Space, Typography } from 'antd';
import PostComment from './PostComment';

const { Title } = Typography;

function CommentList({ comments, item, itemType, onRefresh }) {
	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Title level={5}>Comments</Title>
			{map(comments, item => (
				<CommentView comment={item} key={item._id} />
			))}
			<PostComment item={item} itemType={itemType} onComplete={onRefresh} />
		</Space>
	);
}

export default CommentList;
