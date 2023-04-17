import { get, map } from 'lodash';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import attendanceApi from 'apis/attendance';
import CalendarView from 'components/coursePlan/CalendarView';
import { useGetAllPhaseSubjects } from 'components/subject/hook';
import { activePhaseIdSelector } from 'selectors/user';
import { Button, Modal } from 'antd';
import { AiOutlineEye } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';

function TeacherScheduleView({ lecturer: lecturerId }) {
	const { data, refetch } = useQuery(
		[lecturerId],
		() => attendanceApi.listScheduledLecturesByLecturer(lecturerId),
		{
			staleTime: 5e5,
		}
	);
	const activePhaseId = useSelector(activePhaseIdSelector);

	const { subjectsById } = useGetAllPhaseSubjects(activePhaseId);

	const scheduledLecturesDayJsObject = useMemo(
		() =>
			map(get(data, ['items']), scheduledLecture => {
				const subject = get(subjectsById, get(scheduledLecture, 'subject'), {
					name: 'Others',
				});
				const subjectName = get(subject, 'name', 'Others');
				return {
					...scheduledLecture,
					subjectName,
					title: get(scheduledLecture, 'label', subjectName),
					startTime: dayjs(scheduledLecture.startTime),
					endTime: dayjs(scheduledLecture.endTime),
					type: 'ScheduledLecture',
				};
			}),
		[data, subjectsById]
	);
	return (
		<div>
			<CalendarView refetch={refetch} items={scheduledLecturesDayJsObject} />
		</div>
	);
}

function TeacherScheduleViewButton(props) {
	const [isOpen, open, close] = useBoolean();
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 8 }} />}
				onClick={open}
			>
				Schedule
			</Button>
			<Modal
				closable={false}
				footer={<Button onClick={close}>Ok</Button>}
				forceRender
				onCancel={close}
				visible={isOpen}
				width="80%"
			>
				{isOpen ? <TeacherScheduleView {...props} /> : null}
			</Modal>
		</>
	);
}

export default TeacherScheduleViewButton;
