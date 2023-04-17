import { Button, DatePicker, Form } from 'antd';
import attendanceApi from 'apis/attendance';
import SelectAdminSubject from 'components/subject/SelectAdmin';
import React, { useCallback, useState } from 'react';
import { useAdminCurrentPhase } from 'utils/hooks/phase';

function CreateLecture({ phase, onDone }) {
	const [isCreating, setIsCreating] = useState(false);
	const phaseId = useAdminCurrentPhase();
	const handleSubmit = useCallback(
		async values => {
			setIsCreating(true);
			try {
				const lecture = await attendanceApi.createLecture({ ...values, phase });
				onDone(lecture);
			} finally {
				setIsCreating(false);
			}
		},
		[onDone, phase]
	);
	return (
		<Form layout="vertical" onFinish={handleSubmit}>
			<Form.Item
				label="Select Subject"
				name="subject"
				rules={[{ required: true }]}
			>
				<SelectAdminSubject phase={phaseId} />
			</Form.Item>
			<Form.Item name="date" label="Date" rules={[{ required: true }]}>
				<DatePicker style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item noStyle>
				<Button loading={isCreating} htmlType="submit" type="primary">
					Create Lecture
				</Button>
			</Form.Item>
		</Form>
	);
}

export default CreateLecture;
