import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { useBoolean } from 'use-boolean';
import { ArrowLeftOutlined } from '@ant-design/icons';
import StartChat from 'components/chats/Start';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { getViewAsPhase } from 'utils/viewAs';
import ChatGroupList from 'components/chats/GroupList';
import { useRouteMatch } from 'react-router';
import ChatGroup from './Chat';
import { Link } from 'react-router-dom';

const { Title } = Typography;

function ChatRoutes({ match: { isExact, url } }) {
	const [refreshKey, setRefreshKey] = useState(0);
	const [
		isStartChatModalOpen,
		openStartChatModal,
		closeStartChatModal,
	] = useBoolean(false);
	const activePhaseId = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = useMemo(() => getViewAsPhase(activePhaseId, role), [
		activePhaseId,
		role,
	]);
	const chatGroupRouteMatch = useRouteMatch({ path: `${url}/i/:groupId` });
	const refresh = useCallback(() => {
		setRefreshKey(refreshKey + 1);
		closeStartChatModal();
	}, [closeStartChatModal, refreshKey]);
	return (
		<>
			<Card
				title={
					<Space align="center">
						{!isExact ? (
							<Link
								to={url}
								style={{
									width: 32,
									height: 32,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: 'transparent',
									border: 'none',
								}}
							>
								{!isExact && <ArrowLeftOutlined />}
							</Link>
						) : null}
						<Title level={4} style={{ margin: 0 }}>
							Chats
						</Title>
					</Space>
				}
				bordered={false}
				style={{ borderRadius: 0 }}
				extra={
					<Button type="primary" size="large" onClick={openStartChatModal}>
						New Chat
					</Button>
				}
				bodyStyle={{ padding: chatGroupRouteMatch ? 0 : '' }}
			>
				<div style={{ display: isExact ? '' : 'none' }}>
					<ChatGroupList refreshKey={refreshKey} />
				</div>
				{chatGroupRouteMatch ? (
					<ChatGroup group={chatGroupRouteMatch.params.groupId} />
				) : null}
			</Card>
			<StartChat
				visible={isStartChatModalOpen}
				onCancel={closeStartChatModal}
				onComplete={refresh}
				phase={phaseId}
			/>
		</>
	);
}

export default ChatRoutes;
