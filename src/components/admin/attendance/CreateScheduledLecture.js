import DateTimePicker from 'components/inputs/DateTimePicker';
import { Alert, Button, Form, Input, message, Space } from 'antd';
import { get, has } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import SelectAdminSubject from 'components/subject/SelectAdmin';
import dayjs from 'dayjs';
import SelectTeacher from 'components/admin/components/SelectTeacher';
import attendanceApi from 'apis/attendance';
import { getErrorMessage } from 'utils/axios';

function CreateScheduledLecture({
	_id,
	startTime,
	endTime,
	label,
	subject,
	phases,
	lecturer,
	onCancel,
	onSuccess,
}) {
	const isNew = !_id;
	const [form] = Form.useForm();
	const [isWorking, setIsWorking] = useState(false);
	const [error, setError] = useState(null);
	const [selectedSubject, setSelectedSubject] = useState();
	const handleValuesChange = changedValues => {
		if (has(changedValues, 'subject')) {
			setSelectedSubject(get(changedValues, 'subject'));
		}
	};
	const handleSubmit = useCallback(async () => {
		const values = form.getFieldsValue();
		try {
			setError(null);
			if (isNew) {
				attendanceApi.createScheduledLecture(values);
			} else {
				attendanceApi.updateScheduledLecture(_id, values);
			}
			message.success('Created successfully');
			form.resetFields();
			onSuccess();
		} catch (e) {
			console.error(e);
			const errorMessage = getErrorMessage(e);
			setError(errorMessage);
		} finally {
			setIsWorking(false);
		}
	}, [_id, isNew, form, onSuccess]);
	useEffect(() => {
		const startsAt = startTime ? dayjs(startTime) : dayjs();
		const endsAt = endTime ? dayjs(endTime) : startsAt.add(1, 'h');
		form.setFieldsValue({
			startTime: startsAt,
			endTime: endsAt,
			subject,
			phases,
			lecturer,
			label,
		});
	}, [endTime, form, label, lecturer, phases, startTime, subject]);
	return (
		<div>
			<Form
				form={form}
				layout="vertical"
				onValuesChange={handleValuesChange}
				onFinish={handleSubmit}
			>
				<Form.Item label="Starts at" name="startTime">
					<DateTimePicker />
				</Form.Item>
				<Form.Item label="Ends at" name="endTime">
					<DateTimePicker />
				</Form.Item>
				<Form.Item label="Subject" name="subject">
					<SelectAdminSubject />
				</Form.Item>
				<Form.Item label="Teacher" name="lecturer">
					<SelectTeacher suggestionConfig={{ subject: selectedSubject }} />
				</Form.Item>
				{error ? (
					<Form.Item>
						<Alert message={error} type="error" />
					</Form.Item>
				) : null}
				<Form.Item name="label" label="Title">
					<Input placeholder="Optional" />
				</Form.Item>
				<Form.Item name="phases" label="Phase" hidden></Form.Item>
				<Form.Item noStyle>
					<Space>
						<Button htmlType="submit" loading={isWorking} type="primary">
							{isNew ? 'Schedule' : 'Update Schedule'}
						</Button>
						<Button onClick={onCancel}>Cancel</Button>
					</Space>
				</Form.Item>
			</Form>
		</div>
	);
}

export default CreateScheduledLecture;
