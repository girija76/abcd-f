import { Button } from 'antd';
import { LeaveRequests } from 'components/admin/leaves/LeaveRequests';
import { ListLeaves } from 'components/admin/leaves/listLeaves';
import { PeopleOnLeave } from 'components/admin/leaves/PeopleOnLeave';
import React, { useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { userSelector } from 'selectors/user';
import { erp } from 'utils/config';
import { AskLeave } from '../../../components/admin/leaves/AskLeave';

const LeaveRoutes = () => {
	if (!erp.leave) {
		window.location.href = '/dashboard';
	}
	const UserData = useSelector(userSelector);

	const [moderatorReload, setModeratorReload] = useState({
		leaveRequest: true,
		peopleOnLeave: true,
	});

	const [mentorReload, setMentorReload] = useState(true);

	return (
		<div>
			{UserData.role === 'mentor' && (
				<>
					<AskLeave setReload={setMentorReload} />
					<ListLeaves reload={mentorReload} setReload={setMentorReload} />
				</>
			)}
			{UserData.role === 'moderator' && (
				<>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<Button
							type="primary"
							style={{ display: 'flex', alignItems: 'center', margin: '1rem' }}
							icon={<BiRefresh style={{ marginRight: 6 }} />}
						>
							Refresh
						</Button>
					</div>
					<PeopleOnLeave reload={moderatorReload} onReload={setModeratorReload} />
					<div style={{ margin: '1rem 0' }}></div>
					<LeaveRequests reload={moderatorReload} onReload={setModeratorReload} />
				</>
			)}
		</div>
	);
};

export default LeaveRoutes;
