import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

function CommentView({ comment }) {
	return (
		<div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
			<div>{comment.text}</div>
			<span style={{ margin: '0 4px' }}>-</span>{' '}
			<Title level={5}>{comment.createdBy.name}</Title>
		</div>
	);
}

export default CommentView;
