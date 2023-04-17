import { Button, Modal } from 'antd';
import UserAttendance from 'components/userAttendance';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';

function ViewAttendanceButton({ name, _id }) {
	const [isAttendanceVisible, showAttendance, hideAttendance] = useBoolean(
		false
	);
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				onClick={showAttendance}
				icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />}
			>
				Attendance
			</Button>
			<Modal
				width="80%"
				title={`${name}'s  Attendance`}
				visible={isAttendanceVisible}
				onOk={hideAttendance}
				onCancel={hideAttendance}
				centered
				closable={false}
				bodyStyle={{ padding: 0 }}
				footer={
					<Button type="primary" onClick={hideAttendance}>
						Ok
					</Button>
				}
			>
				{isAttendanceVisible ? <UserAttendance userId={_id} /> : null}
			</Modal>
		</>
	);
}

export default ViewAttendanceButton;
