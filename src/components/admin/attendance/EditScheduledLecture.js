import { Alert, Button, Modal, Spin } from 'antd';
import attendanceApi from 'apis/attendance';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';
import { getErrorMessage } from 'utils/axios';
import CreateScheduledLecture from './CreateScheduledLecture';

function EditScheduledLecture({ _id, onCancel, onSuccess }) {
	const [scheduledLecture, setScheduledLecture] = useState(null);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);
	const load = useCallback(async () => {
		try {
			setError(null);
			setIsFetching(true);
			const scheduledLecture = await attendanceApi.getScheduledLecture(_id);
			setScheduledLecture(scheduledLecture);
		} catch (e) {
			setError(getErrorMessage(e));
		} finally {
			setIsFetching(false);
		}
	}, [_id]);
	useEffect(() => {
		load();
	}, [load]);
	return (
		<div>
			{isFetching ? (
				<Spin />
			) : error ? (
				<Alert
					action={<Button onClick={load}>Retry</Button>}
					type="error"
					message={error}
				/>
			) : (
				<CreateScheduledLecture
					onCancel={onCancel}
					onSuccess={onSuccess}
					{...scheduledLecture}
				/>
			)}
		</div>
	);
}

function EditScheduledLectureButton({ _id, onSuccess }) {
	const [isEditing, open, close] = useBoolean(false);
	const handleSuccess = () => {
		close();
		onSuccess();
	};
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				icon={<AiOutlineEdit style={{ fontSize: '1.25rem', marginRight: 8 }} />}
				onClick={open}
			>
				Edit
			</Button>
			<Modal
				visible={isEditing}
				onCancel={close}
				centered
				footer={null}
				forceRender
			>
				{isEditing ? (
					<EditScheduledLecture
						_id={_id}
						onCancel={close}
						onSuccess={handleSuccess}
					/>
				) : null}
			</Modal>
		</>
	);
}

export default EditScheduledLectureButton;
