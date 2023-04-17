import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';
import { isAtLeastModerator } from 'utils/auth';
import dayjs from 'dayjs';
import attendanceApi from 'apis/attendance';
import { Button, message, Modal } from 'antd';
import { useBoolean } from 'use-boolean';

function CopyLectures({
	date,
	onSuccess,
	onCancel,
	phaseId,
	currentView,
	onNavigate,
}) {
	const [isWorking, startWorking, endWorking] = useBoolean();
	const [isConfirming, openConfirmation, closeConfirmation] = useBoolean(false);
	const role = useSelector(roleSelector);
	const handleCopySchedule = useCallback(async () => {
		const thisWeekStart = dayjs(date).startOf('week');
		const nextWeekStart = dayjs(thisWeekStart).add(1, 'week');
		try {
			closeConfirmation();
			startWorking();
			await attendanceApi.copyScheduledLectures({
				usePreviousPhases: true,
				fromPhases: [phaseId],
				addDuration: 1,
				durationUnit: 'week',
				fromTime: thisWeekStart,
				tillTime: nextWeekStart,
			});
			message.success('Schedule copied successfully');
			onNavigate(nextWeekStart.toDate());
			onSuccess();
		} catch (e) {
			message.error('Error occurred while copying. Please retry');
		} finally {
			endWorking();
		}
	}, [
		closeConfirmation,
		date,
		endWorking,
		onNavigate,
		onSuccess,
		phaseId,
		startWorking,
	]);
	return (
		<div>
			{isAtLeastModerator(role) && currentView === 'week' ? (
				<Button loading={isWorking} onClick={openConfirmation}>
					Copy Schedule to Next Week
				</Button>
			) : null}
			<Modal
				visible={isConfirming}
				title="Are you sure?"
				onOk={handleCopySchedule}
				onCancel={closeConfirmation}
				centered
			>
				<div>
					All the classes scheduled in this week will be copied to next week.
				</div>
			</Modal>
		</div>
	);
}

export default CopyLectures;
