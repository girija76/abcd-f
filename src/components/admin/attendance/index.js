import { Button, Col, List, Modal, Row, Tabs, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { get, map } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useBoolean } from 'use-boolean';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { getViewAsPhase } from 'utils/viewAs';
import attendanceApi from 'apis/attendance';
import { useGetAllPhaseSubjects } from 'components/subject/hook';
import { detailsByStatus } from './help';
import MarkAttendance from './Mark';
import { useGetAdminSubjects } from 'utils/hooks/phase';

const { Title } = Typography;

const statusStyles = {
	P: {
		backgroundColor: 'lightgreen',
		color: '#000',
	},
	A: {
		backgroundColor: 'lightcoral',
		color: '#000',
	},
	L: {
		backgroundColor: 'lightsalmon',
		color: '#000',
	},
	LP: {
		backgroundColor: 'lightblue',
		color: '#000',
	},
	CL: {
		backgroundColor: 'lightgray',
		color: '#000',
	},
	SL: {
		backgroundColor: '#e0e5ff',
		color: '#000',
	},
};

function LectureListItem({ lecture, phase: phaseId, onRefresh }) {
	const [isModalOpen, openEditModal, closeEditModal] = useBoolean(false);
	const { subjectsById } = useGetAllPhaseSubjects([phaseId]);
	const subject = get(subjectsById, get(lecture, ['subject']), 'Unkonwn');
	const date = useMemo(() => dayjs(get(lecture, 'date')), [lecture]);
	const label = useMemo(() => get(lecture, ['label'], null), [lecture]);
	const { data: statuses } = useQuery(
		['getAttendanceStatuses'],
		() => attendanceApi.getAllStatusList(),
		{
			staleTime: 6e6,
		}
	);
	const handleCloseModal = () => {
		closeEditModal();
		onRefresh();
	};
	return (
		<>
			<List.Item style={{ paddingLeft: 12, paddingRight: 0 }}>
				<Row gutter={[8, 8]} style={{ width: '100%' }}>
					<Col xs={12} md={10}>
						<span>
							<span>
								<span style={{ fontSize: '2em', marginRight: 4 }}>
									{date.format('DD')}
								</span>
								<span style={{ fontSize: '1.2em' }}>{date.format('MMM')}</span>
							</span>
							<Title style={{ marginBottom: 0 }} level={5}>
								{subject.name}
							</Title>
							<span>{label}</span>
							<Button
								size="small"
								type="text"
								icon={<AiOutlineEdit style={{ marginRight: 4 }} />}
								style={{ display: 'flex', alignItems: 'center', marginLeft: -4 }}
								onClick={openEditModal}
							>
								Update
							</Button>
						</span>
					</Col>
					<Col xs={12} md={14}>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								alignItems: 'center',
								justifyContent: 'flex-end',
							}}
						>
							{map(statuses, status => (
								<Tooltip
									key={status}
									title={get(detailsByStatus, [status, 'label'], status)}
								>
									<span
										style={{
											display: 'inline-flex',
											flexDirection: 'column',
											alignItems: 'center',
											padding: '16px 0',
											justifyContent: 'center',
											borderRadius: 4,
											width: 72,
											height: 72,
											margin: 8,
											...statusStyles[status],
										}}
									>
										<div style={{ fontSize: '2em', lineHeight: 'normal' }}>
											{get(lecture, ['stats', status], 0)}
										</div>
										<div>{status}</div>
									</span>
								</Tooltip>
							))}
						</div>
					</Col>
				</Row>
			</List.Item>
			<Modal
				width="80%"
				title="Update Attendance"
				visible={isModalOpen}
				onCancel={handleCloseModal}
				forceRender
				centered
				footer={<Button onClick={handleCloseModal}>Close</Button>}
			>
				{isModalOpen ? (
					<MarkAttendance lecture={lecture._id} onCancel={handleCloseModal} />
				) : null}
			</Modal>
		</>
	);
}

function LectureList({ renderKey, onRefresh }) {
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 20;
	const skip = (currentPage - 1) * limit;
	const [selectedSubject, setSelectedSubject] = useState(null);
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);
	const { subjects } = useGetAdminSubjects();

	const { data, isFetching } = useQuery(
		['get-lectures', limit, skip, phaseId, selectedSubject, renderKey],
		() =>
			selectedSubject
				? attendanceApi.getLectureStats({
						limit,
						skip,
						phase: phaseId,
						subject: selectedSubject,
				  })
				: { items: [], total: 0 },
		{
			staleTime: 6e5,
		}
	);
	const { items, total } = useMemo(() => (data ? data : {}), [data]);
	useEffect(() => {
		setSelectedSubject(get(subjects, [0, '_id']));
	}, [subjects]);
	return (
		<div>
			<Tabs onChange={key => setSelectedSubject(key)}>
				{map(subjects, subject => (
					<Tabs.TabPane
						active={selectedSubject === subject._id}
						tab={subject.name}
						key={subject._id}
					/>
				))}
			</Tabs>
			<List
				loading={isFetching}
				dataSource={items}
				pagination={{
					total,
					onChange: currentPage => setCurrentPage(currentPage),
				}}
				renderItem={lecture => (
					<LectureListItem
						key={lecture._id}
						lecture={lecture}
						phase={phaseId}
						onRefresh={onRefresh}
					/>
				)}
				style={{ marginBottom: 12 }}
			/>
		</div>
	);
}

export default LectureList;
