import React, { useState } from 'react';
import { Alert, Button, message, Typography } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import assignmentApi from 'apis/assignment';
import { map } from 'lodash';
import FileUploader from 'components/inputs/File';

const { Text, Title } = Typography;

function SubmitAssignment({
	assignmentId,
	playlistId,
	playlistItemId,
	onSubmit,
}) {
	const [files, setFiles] = useState([]);
	const [isWorking, setIsWorking] = useState(false);
	const [newKey, setNewKey] = useState(0);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const handleAddNew = file => {
		setFiles([...files, file]);
		setNewKey(newKey + 1);
		setErrorMessage(null);
	};
	const handleRemove = index => {
		setFiles(files.filter((_f, i) => i !== index));
	};
	const handleSubmit = () => {
		if (files.length < 1) {
			setErrorMessage('Please select at least one file');
			return;
		}
		setErrorMessage(null);
		setIsWorking(true);
		assignmentApi
			.submitAssignment(assignmentId, files)
			.then(() => {
				setIsSubmitted(true);
				message.success('Assignment submitted successfully');
				setTimeout(() => {
					onSubmit();
				}, 1000);
			})
			.catch(error => {
				setErrorMessage('Failed to submit assignment. Please retry.');
				setIsWorking(false);
			});
	};
	return (
		<div style={{ marginBottom: '1rem' }}>
			<div className="assignment-title">
				<Title level={4} style={{ marginBottom: 0 }}>
					Submit Assignment
				</Title>
			</div>
			{isSubmitted ? (
				<div className="assignment-message-container">
					<Text type="success">
						<LikeOutlined /> Assignment has been submitted successfully.
					</Text>
				</div>
			) : (
				<>
					<div className="assignment-upload-list">
						{map(files, (file, index) => {
							return (
								<FileUploader
									key={index}
									{...file}
									onRemove={() => handleRemove(index)}
								/>
							);
						})}
						<FileUploader
							key={newKey}
							onAdd={handleAddNew}
							getPolicy={assignmentApi.getUploadPolicy}
						/>
					</div>
					<div className="assignment-footer">
						{errorMessage ? (
							<Alert
								style={{ marginBottom: '1rem', maxWidth: 300 }}
								message={errorMessage}
								type="error"
							/>
						) : null}
						<Button type="primary" loading={isWorking} onClick={handleSubmit}>
							Submit
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

export default SubmitAssignment;
