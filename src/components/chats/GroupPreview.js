import { Avatar, Button, Typography } from 'antd';
import { URLS } from 'components/urls';
import { map } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userSelector } from 'selectors/user';
import { MessageOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

function GroupPreview({ _id, members, numberOfMessages, type }) {
	const user = useSelector(userSelector);
	const membersExceptMe = useMemo(
		() => members.filter(member => member._id !== user._id),
		[members, user._id]
	);
	return (
		<Link
			to={`${URLS.chats}/i/${_id}`}
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: 'space-between',
				background: '#fafafa',
				border: 'solid 1px #d0d0d0',
				padding: 8,
				borderRadius: 6,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
				}}
			>
				<div style={{ marginRight: 8 }}>
					{map(membersExceptMe, member => {
						const { _id, dp, role } = member;
						const isMentor = role !== 'user';
						return (
							<Avatar
								size={36}
								src={dp}
								key={_id}
								style={{
									border: isMentor
										? '2px solid rgb(255, 140, 140)'
										: 'solid 2px transparent',
								}}
							/>
						);
					})}
				</div>
				<div>
					{membersExceptMe.map(member => (
						<div>
							<Title level={5} style={{ marginBottom: 0, lineHeight: 'normal' }}>
								{member.name || member.username}
							</Title>
							<Text type="secondary" style={{ marginTop: 0 }}>
								{member.role !== 'user' ? 'Teacher' : 'Student'}
							</Text>
						</div>
					))}
				</div>
			</div>
			<Button icon={<MessageOutlined />}>Message</Button>
		</Link>
	);
}

export default GroupPreview;
