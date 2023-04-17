import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Modal, Space } from 'antd';
import createForumApi from 'apis/forum';
import ForumFilesUploader from './UploadFiles';

const forumApi = createForumApi();

function WriteAnswer({ questionId, onCancel, onComplete }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState();
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [form] = Form.useForm();
	const handleSubmit = formValues => {
		setIsSubmitting(true);
		forumApi
			.postAnswer(questionId, formValues.body, 'text', formValues.files)
			.then(() => {
				setIsSubmitted(true);
				form.resetFields(['body']);
			})
			.catch(e => {
				setSubmissionError(
					'Error occurred while posting your answer. Please check your internet connection.'
				);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};
	useEffect(() => {
		if (isSubmitted) {
			const timeoutId = setTimeout(() => {
				setIsSubmitted(false);
				onComplete();
			}, 4000);
			return () => clearTimeout(timeoutId);
		}
	}, [isSubmitted, onComplete]);
	return (
		<div>
			<Form layout="vertical" onFinish={handleSubmit} form={form}>
				<Form.Item
					label="Write your answer below"
					name="body"
					rules={[
						{
							validator: async (_, body) => {
								if (!body || typeof body !== 'string') {
									return Promise.reject(new Error('Please write answer'));
								}
								if (body.trim().length < 10) {
									return Promise.reject(
										new Error('Answer must be at least 10 chatacters long')
									);
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item label="Attachments" name="files">
					<ForumFilesUploader />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					<Space direction="vertical" style={{ width: '100%' }}>
						<Space size="middle">
							<Button htmlType="submit" type="primary" loading={isSubmitting}>
								Post your answer
							</Button>
							{onCancel && <Button onClick={onCancel}>Cancel</Button>}
						</Space>
						{submissionError ? (
							<div>
								<Alert message={submissionError} type="error" />
							</div>
						) : null}
					</Space>
				</Form.Item>
			</Form>
			<Modal
				visible={isSubmitted}
				onCancel={onComplete}
				closable={false}
				footer={
					<Button type="primary" onClick={onComplete}>
						Okay
					</Button>
				}
				centered
			>
				🎉🎉🎉🎉 Thank you for answering .
			</Modal>
		</div>
	);
}

export default WriteAnswer;
