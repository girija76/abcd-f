import { Button, Input, Spin } from 'antd';
import chatApi from 'apis/chat';
import ChatCompose from 'components/chats/Compose';
import GroupHead from 'components/chats/GroupHead';
import MessageList from 'components/chats/MessageList';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

function ChatGroup({ group: groupId }) {
	const [limit, setLimit] = useState(100);
	const [after, setAfter] = useState();
	const [before, setBefore] = useState();
	const [refreshKey, setRefreshKey] = useState(0);
	const { data, isError, isSuccess, isFetching, refetch } = useQuery(
		['get-group-chat', groupId, after, before, limit],
		() => chatApi.getGroup(groupId, after, before, limit),
		{
			staleTime: 5e3,
			refetchInterval: 2e4,
			refetchIntervalInBackground: 6e4,
			refetchOnWindowFocus: true,
		}
	);
	const refresh = () => {
		setRefreshKey(refreshKey + 1);
	};

	useEffect(() => {
		refetch();
	}, [refetch, refreshKey]);

	if (isFetching && !isSuccess) {
		return (
			<div style={{ textAlign: 'center' }}>
				<div>
					<Spin />
				</div>
				<div>Loading messages</div>
			</div>
		);
	}
	if (isError || !isSuccess) {
		return (
			<div>
				<div>Failed to load messages</div>
				<div>
					<Button onClick={refetch}>Reload</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<GroupHead {...data.group} type="chat-header" />
			<ChatCompose groupId={groupId} onSend={refresh} />
			<MessageList
				items={data.items}
				refreshKey={refreshKey}
				members={data.group.members}
			/>
		</div>
	);
}

export default ChatGroup;
