import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { get, map } from 'lodash';
import { Avatar, Button, Card, Divider, Modal, Typography } from 'antd';
import { useGetAllPhaseSubjects } from 'components/subject/hook';
import phaseApi from 'apis/phase';
import { MessageOutlined } from '@ant-design/icons';
import chatApi from 'apis/chat';
import { useHistory } from 'react-router';
import { URLS } from 'components/urls';

const { Text, Title } = Typography;

const createGroups = (mentors, subjectsById) => {
	const groupsBySubjectId = {};
	mentors.forEach(phaseMentor => {
		const { subject: subjectId } = phaseMentor;
		if (!groupsBySubjectId[subjectId]) {
			const subject = get(subjectsById, [subjectId], { _id: subjectId });
			groupsBySubjectId[subjectId] = {
				subject,
				mentors: [],
			};
		}
		groupsBySubjectId[subjectId].mentors.push(phaseMentor);
	});
	return map(groupsBySubjectId);
};

const UserListItem = ({
	dp,
	name,
	username,
	_id,
	phaseMentorId,
	onComplete,
}) => {
	const history = useHistory();
	const handleStartChat = useCallback(() => {
		chatApi.startChat(phaseMentorId).then(({ group }) => {
			history.push(`${URLS.chats}/i/${group._id}`);
			onComplete();
		});
	}, [history, onComplete, phaseMentorId]);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Avatar src={dp} style={{ marginRight: 8 }} size={36} />
				<Text>{name || username}</Text>
			</div>
			<div>
				<Button
					onClick={handleStartChat}
					icon={<MessageOutlined />}
					type="primary"
					ghost
				>
					Send Message
				</Button>
			</div>
		</div>
	);
};

function StartChat({ phase: phaseId, visible, onCancel, onComplete }) {
	const {
		subjectsById,
		isSuccess: arePhaseSubjectsSuccess,
	} = useGetAllPhaseSubjects([phaseId]);
	const { data, isSuccess: areMentorsSuccess } = useQuery(
		['get-mentors-of-phase', phaseId],
		() => phaseApi.getMentorsOfPhase(phaseId),
		{
			staleTime: 6e5,
		}
	);
	const { items } = useMemo(() => (data ? data : {}), [data]);
	const mentorsGroupedBySubject = useMemo(() => {
		if (areMentorsSuccess && arePhaseSubjectsSuccess) {
			const groups = createGroups(items, subjectsById);
			return groups;
		}
		return [];
	}, [areMentorsSuccess, arePhaseSubjectsSuccess, items, subjectsById]);
	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title="Start New Chat"
			closable={false}
			centered
			footer={<Button onClick={onCancel}>Close</Button>}
		>
			{map(mentorsGroupedBySubject, ({ subject, mentors: phaseMentors }) => {
				return (
					<Card
						size="small"
						title={
							<Title level={3} style={{ marginBottom: 4 }}>
								{subject.name}
							</Title>
						}
						style={{ marginBottom: 12 }}
					>
						<div>
							{map(phaseMentors, (phaseMentor, index) => {
								const { _id, user } = phaseMentor;
								return (
									<>
										{index > 0 ? <Divider style={{ margin: 6 }} /> : null}
										<UserListItem
											key={_id}
											{...user}
											phaseMentorId={_id}
											onComplete={onComplete}
										/>
									</>
								);
							})}
						</div>
					</Card>
				);
			})}
		</Modal>
	);
}

export default StartChat;
