import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import ForumFilesUploader from 'components/inputs/Files';
import React, { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import createAnnouncementApi from 'apis/announcement';
import { URLS } from 'components/urls';
import { BsCheckCircle } from 'react-icons/bs';

const { Title } = Typography;
const announcementApi = createAnnouncementApi();

function CreateAnnouncement({ phase: phaseId, onComplete }) {
	const history = useHistory();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [postedAnnouncement, setPostedAnnouncement] = useState(null);
	const handleSubmit = useCallback(
		formValues => {
			setIsSubmitting(true);
			announcementApi
				.postAnnouncement({ ...formValues, phases: [phaseId] })
				.then(announcement => {
					setIsSubmitted(true);
					setPostedAnnouncement(announcement);
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		},
		[phaseId]
	);
	const handleViewAnnouncement = () => {
		history.push(`${URLS.announcements}/announcement/${postedAnnouncement._id}`);
		onComplete();
	};
	const handleCloseModal = () => {
		onComplete();
		history.push(`${URLS.announcements}`);
	};
	return (
		<>
			<Form onFinish={handleSubmit} layout="vertical">
				<Form.Item label="Title" name="title">
					<Input type="text" />
				</Form.Item>
				<Form.Item label="Body" name="body">
					<Input.TextArea type="text" />
				</Form.Item>
				<Form.Item label="Attachments" name="files">
					<ForumFilesUploader getPolicy={announcementApi.getUploadPolicy} />
				</Form.Item>
				<Form.Item>
					<Space>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							loading={isSubmitting}
						>
							Post Announcement
						</Button>
						<Link to="./">
							<Button size="large">Cancel</Button>
						</Link>
					</Space>
				</Form.Item>
			</Form>
			<Modal
				visible={isSubmitted}
				centered
				closable={false}
				onCancel={handleCloseModal}
				okText="View Announcement"
				onOk={handleViewAnnouncement}
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
						Announcement Posted
					</Title>
					<div>Announcement has been published.</div>
				</div>
			</Modal>
		</>
	);
}

export default CreateAnnouncement;
