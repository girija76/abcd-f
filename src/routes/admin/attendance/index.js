import { Button, Card, Modal, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import LectureList from 'components/admin/attendance';
import MarkAttendance from 'components/admin/attendance/Mark';
import React, { useCallback, useState } from 'react';
import { AiOutlinePlus, AiOutlineReload } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';

function AttendanceRoutes() {
	const [renderKey, setRenderKey] = useState(0);
	const [isOpen, open, close] = useBoolean(false);
	const handleRefresh = useCallback(() => {
		setRenderKey(renderKey + 1);
	}, [renderKey]);
	const handleClose = () => {
		close();
		handleRefresh();
	};
	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Attendance
				</Title>
			}
			bordered={false}
			style={{ borderRadius: 0 }}
			bodyStyle={{ padding: 0 }}
			extra={
				<Space>
					<Button
						icon={<AiOutlineReload style={{ marginRight: 6 }} />}
						onClick={handleRefresh}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						Refresh
					</Button>
					<Button
						type="primary"
						icon={<AiOutlinePlus style={{ marginRight: 6 }} />}
						onClick={open}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						Mark Attendance
					</Button>
				</Space>
			}
		>
			<LectureList onRefresh={handleRefresh} renderKey={renderKey} />
			<Modal
				title="Mark Attendance"
				width="80%"
				visible={isOpen}
				onCancel={handleClose}
				forceRender
				centered
				closable={false}
				footer={<Button onClick={handleClose}>Close</Button>}
			>
				{isOpen ? (
					<MarkAttendance onCancel={handleClose} onRefresh={handleRefresh} />
				) : null}
			</Modal>
		</Card>
	);
}

export default AttendanceRoutes;
