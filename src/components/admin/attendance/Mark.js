import { Button, List, Space } from 'antd';
import attendanceApi from 'apis/attendance';
import userApi from 'apis/user';
import { forEach, map } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { getViewAsPhase } from 'utils/viewAs';
import User from '../users/User';
import CreateLecture from './CreateLecture';

function MarkAttendanceItem({ user, lecture, onChange, status: savedStatus }) {
	const [isUpdating, setIsUpdating] = useState(false);
	const { data: statuses } = useQuery(
		['getAttendanceStatuses'],
		() => attendanceApi.getAllStatusList(),
		{
			staleTime: 6e6,
		}
	);
	const handleSelect = useCallback(
		async status => {
			setIsUpdating(status);
			try {
				await attendanceApi.markAttendance({ lecture, user, status });
				onChange(status);
			} finally {
				setIsUpdating(false);
			}
		},
		[lecture, onChange, user]
	);

	return (
		<div>
			{statuses ? (
				<Space
					style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}
				>
					{map(statuses, status => (
						<Button
							disabled={isUpdating}
							loading={status === isUpdating}
							key={status}
							type={savedStatus === status ? 'primary' : 'default'}
							onClick={() => handleSelect(status)}
						>
							{status}
						</Button>
					))}
				</Space>
			) : null}
		</div>
	);
}

function MarkAttendance({
	visible,
	onCancel,
	onRefresh,
	lecture: initialLectureId,
}) {
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);
	const [statusByUserId, setStatusByUserId] = useState({});
	const { data, isFetching } = useQuery(
		['users-of-phase', phaseId],
		() =>
			userApi.listUsers(
				{
					phases: [phaseId],
					skip: 0,
					limit: 500,
					select: ['dp'],
				},
				{}
			),
		{
			staleTime: 6e5,
		}
	);
	const { items: users } = useMemo(() => (data ? data : {}), [data]);
	const [lecture, setLecture] = useState(null);

	const handleStatusChange = useCallback((userId, status) => {
		setStatusByUserId(statusByUserId => ({
			...statusByUserId,
			[userId]: status,
		}));
	}, []);

	useEffect(() => {
		const fetchAttendanceSheet = async () => {
			try {
				const { items } = await attendanceApi.getLectureAttendanceSheet({
					lecture: initialLectureId,
				});
				const statusByUserId = {};
				forEach(items, item => {
					statusByUserId[item.user] = item.status;
				});
				setStatusByUserId(statusByUserId);
			} catch (e) {}
		};
		if (initialLectureId) {
			setLecture(initialLectureId);
			fetchAttendanceSheet();
		}
	}, [initialLectureId]);
	return (
		<div>
			{!lecture ? (
				<CreateLecture onDone={lecture => setLecture(lecture)} phase={phaseId} />
			) : (
				<List
					loading={isFetching}
					dataSource={users}
					renderItem={user => (
						<User
							key={user._id}
							user={user}
							extra={
								<MarkAttendanceItem
									status={statusByUserId[user._id]}
									onChange={status => handleStatusChange(user._id, status)}
									user={user}
									lecture={lecture}
								/>
							}
						/>
					)}
				/>
			)}
		</div>
	);
}

export default MarkAttendance;
