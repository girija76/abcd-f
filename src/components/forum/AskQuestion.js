import React, { useState } from 'react';
import { Alert, Button, Form, Input, Modal, Space, Typography } from 'antd';
import SelectSubject from 'components/subject/Select';
import createForumApi from 'apis/forum';
import { BsCheckCircle } from 'react-icons/bs';
import { useHistory } from 'react-router';
import { URLS } from 'components/urls';
import ForumFilesUploader from './UploadFiles';

const forumApi = createForumApi();
const { Title } = Typography;

function AskQuestion({ onCancel, onComplete, phase }) {
	const history = useHistory();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState();
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [form] = Form.useForm();
	const [postedQuestion, setPostedQuestion] = useState(null);
	const handleViewQuestion = () => {
		history.push(`${URLS.forum}/question/${postedQuestion._id}`);
		onComplete();
	};
	const handleCloseModal = () => {
		onComplete();
		history.push(`${URLS.forum}`);
	};
	const handleSubmit = formValues => {
		setIsSubmitting(true);
		forumApi
			.postQuestion(
				phase,
				formValues.subject,
				formValues.title,
				formValues.body,
				'text',
				formValues.files
			)
			.then(({ question }) => {
				setIsSubmitted(true);
				setPostedQuestion(question);
			})
			.catch(e => {
				setSubmissionError(
					'Error occurred while posting your question. Please check your internet connection.'
				);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};
	return (
		<div>
			<Form layout="vertical" onFinish={handleSubmit} form={form}>
				<Form.Item
					label="Title"
					// help="Be specific and imagine you're asking a question to another person"
					name="title"
					validateTrigger={['onBlur', 'onChange']}
					rules={[
						{
							validator: async (_, title) => {
								if (!title || typeof title !== 'string') {
									return Promise.reject(new Error('Please enter your question'));
								}
								if (title.trim().length < 15) {
									return Promise.reject(
										new Error('Question must be at least 15 chatacters long')
									);
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input type="text" />
				</Form.Item>
				<Form.Item
					label="Body"
					help="Include all the information someone would need to answer your question"
					name="body"
				>
					<Input.TextArea />
				</Form.Item>
				<Form.Item label="Attachments" name="files">
					<ForumFilesUploader />
				</Form.Item>
				<Form.Item
					label="Subject"
					name="subject"
					rules={[
						{
							validator: async (_, title) => {
								if (!title) {
									return Promise.reject(new Error('Please select subject'));
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<SelectSubject placeholder="Select a subject" phase={phase} />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					<Space direction="vertical" style={{ width: '100%' }} size="middle">
						<Space size="middle">
							<Button
								htmlType="submit"
								type="primary"
								size="large"
								loading={isSubmitting}
							>
								Post your question
							</Button>
							{onCancel && (
								<Button onClick={onCancel} size="large">
									Cancel
								</Button>
							)}
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
				centered
				closable={false}
				onCancel={handleCloseModal}
				okText="View Question"
				onOk={handleViewQuestion}
			>
				<div style={{ textAlign: 'left' }}>
					<Title
						level={2}
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<BsCheckCircle style={{ color: 'green', marginRight: 8 }} />
						Question Posted
					</Title>
					<div>
						Your question has been posted. We will notify you as soon as someone
						responds.
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default AskQuestion;
