import { Tooltip, Typography } from 'antd';
import attendanceApi from 'apis/attendance';
import React from 'react';
import { useQuery } from 'react-query';
import { useGetAdminSubjects } from 'utils/hooks/phase';
import { get, map } from 'lodash';
import { detailsByStatus } from 'components/admin/attendance/help';
import AttendanceGraph from './components/AttendanceGraph';

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

const calculateAttendance = data => {
	const T = data.length;
	const P = data.filter(stats => stats.status === 'P').length;
	const A = data.filter(stats => stats.status === 'A').length;
	const L = data.filter(stats => stats.status === 'L').length;
	const LP = data.filter(stats => stats.status === 'LP').length;
	const CL = data.filter(stats => stats.status === 'CL').length;
	const SL = data.filter(stats => stats.status === 'SL').length;

	// console.log(data);

	return { P: P, A: A, L: L, LP: LP, CL: CL, SL: SL, T: T };
};

const UserAttendance = ({ id, userId }) => {
	const { subjects } = useGetAdminSubjects();

	const { data: totalData } = useQuery(['get-user-attendance', userId], () =>
		attendanceApi.getUserAttendance(userId)
	);

	const { data: statuses } = useQuery(
		['getAttendanceStatuses'],
		() => attendanceApi.getAllStatusList(),
		{
			staleTime: 6e6,
		}
	);

	const totalAttendance =
		totalData !== undefined ? calculateAttendance(totalData) : {};

	return (
		<div id={id} style={{ paddingBottom: '3rem' }}>
			{subjects.length > 1 ? (
				<div style={{ padding: '1rem' }}>
					<Title level={3}>Total Lectures - {totalAttendance.T}</Title>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							// justifyContent: 'center',
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
										{get(totalAttendance, [status], 0)}
									</div>
									<div>{status}</div>
								</span>
							</Tooltip>
						))}
					</div>

					<AttendanceGraph userId={userId} showPie={true} showLine={true} />
				</div>
			) : (
				<></>
			)}

			<div style={{ padding: '1rem' }}>
				{subjects.map((sub, index) => {
					return (
						<div key={index}>
							<Title level={3}> {sub.name} </Title>
							<AttendanceGraph
								userId={userId}
								subjectId={sub._id}
								showPie={true}
								showLine={true}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default UserAttendance;
