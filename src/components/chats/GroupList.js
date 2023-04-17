import { Button, Col, Row, Spin } from 'antd';
import chatApi from 'apis/chat';
import { map } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import GroupPreview from './GroupPreview';

function ChatGroupList({ refreshKey }) {
	const { data, isFetching, isError, refetch } = useQuery(
		['get-all-chat-groups'],
		() => chatApi.getGroups(),
		{
			staleTime: 3e5,
		}
	);
	const groups = useMemo(() => (data ? data.items : []), [data]);
	useEffect(() => {
		refetch();
	}, [refetch, refreshKey]);

	if (isFetching) {
		return (
			<div style={{ textAlign: 'center' }}>
				<Spin />
				<div>Loading chats...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div style={{ textAlign: 'center' }}>
				<div>Failed to load Chats</div>
				<div>
					<Button onClick={refetch}>Reload</Button>
				</div>
			</div>
		);
	}

	return (
		<Row gutter={[8, 8]}>
			{map(groups, group => {
				return (
					<Col xs={24} md={12} lg={12} xl={8} xxl={6} key={group._id}>
						<GroupPreview {...group} />
					</Col>
				);
			})}
		</Row>
	);
}

export default ChatGroupList;
