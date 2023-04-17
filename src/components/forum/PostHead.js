import React from 'react';
import { Avatar, Typography } from 'antd';
import TimeAgo from 'components/announcement/TimeAgo';
const { Text, Title } = Typography;

function PostHead({ name, dp, createdAt, size }) {
	return (
		<div style={{ display: 'flex', flexWrap: 'nowrap' }}>
			<div style={{ marginRight: '.75rem' }}>
				<Avatar src={dp} alt={name} size={size} />
			</div>
			<div>
				<Title level={5} style={{ marginBottom: '0' }}>
					{name}
				</Title>
				<Text type="secondary">
					<TimeAgo date={createdAt} />
				</Text>
			</div>
		</div>
	);
}

export default PostHead;
