import React, { useEffect, useRef, useState } from 'react';
import { Button, Progress, Space, Typography } from 'antd';
import { get, map } from 'lodash';
import { CloudUploadOutlined, ReloadOutlined } from '@ant-design/icons';
import mime from 'mime';
import './file.scss';
import { getErrorResponse } from 'utils/axios';

const { Text } = Typography;

const FileUploader = ({
	accept,
	name: initialName,
	url: initialUrl,
	onAdd,
	onRemove,
	getPolicy,
	placeholder,
}) => {
	const inputRef = useRef();
	const fileRef = useRef();
	const [inputKey, setInputKey] = useState(0);
	const [url, setUrl] = useState('');
	const [name, setName] = useState('');
	const [isUploading, setIsUploading] = useState(false);
	const isUploaded = !!url;
	const [message, setMessage] = useState(null);
	const [messageType, setMessageType] = useState();
	const [uploadProgress, setUploadProgress] = useState(0);

	const onSuccess = item => {
		onAdd(item);
	};

	const upload = () => {
		setMessage(null);
		setMessageType(null);
		const fileType = fileRef.current.type;
		getPolicy(fileRef.current.type, fileRef.current.name)
			.then(({ data: { fields, url: uploadURL }, filePath }) => {
				const endpoint = `${uploadURL}/${filePath}`;
				setIsUploading(true);
				setMessage('starting to upload');
				const formData = new FormData();
				map(fields, (value, key) => {
					formData.append(key, value);
				});
				formData.append('file', fileRef.current);
				var xhr = new XMLHttpRequest();
				xhr.open('POST', uploadURL, true);
				xhr.upload.onprogress = e => {
					if (e.lengthComputable) {
						const percentage = Math.floor((10 * 100 * e.loaded) / e.total) / 10;
						setUploadProgress(`${percentage}%`);
					}
				};
				xhr.upload.onloadstart = e => {
					setMessage('Uploading');
				};
				xhr.upload.onloadend = e => {
					setMessage('Uploaded, fetching data');
				};
				xhr.onload = e => {
					setIsUploading(false);
					setUrl(endpoint);
					setMessage('Uploaded successfully');
					const mimeType = mime.getType(fileType);
					const fileExtension = mime.getExtension(fileType);
					console.log({ mimeType, fileExtension, fileType });
					onSuccess({
						url: endpoint,
						name: fileRef.current.name,
						type: fileType,
						extension: fileExtension,
					});
					// onAdd({ url: endpoint, name });
				};
				xhr.onerror = e => {
					const errorMessage = get(
						getErrorResponse(e, { message: 'Failed to upload file' }),
						['message']
					);
					setIsUploading(false);
					setMessage(errorMessage);
					setMessageType('error');
				};
				xhr.send(formData);
			})
			.catch(() => {
				setMessage('Failed to connect');
				setMessageType('error');
			});
	};
	const handleFileChange = e => {
		const file = e.target.files[0];
		if (file) {
			fileRef.current = file;
			setInputKey(inputKey + 1);
			setName(file.name);
			console.log(file.name);
			upload();
		}
	};

	useEffect(() => {
		if (initialName) {
			setName(initialName);
		} else if (initialUrl) {
			setName(initialUrl);
		}
		if (initialUrl) {
			setUrl(initialUrl);
		}
	}, [initialName, initialUrl]);

	return (
		<label
			for={isUploaded ? null : `assignment-file-${inputKey}`}
			className="file-uploader-item"
		>
			{isUploaded ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						marginRight: 4,
					}}
				>
					<Text ellipsis>{name}</Text>
					<Button style={{}} onClick={onRemove}>
						Remove
					</Button>
				</div>
			) : (
				<>
					<CloudUploadOutlined style={{ fontSize: 24 }} />
					<div style={{ marginTop: '0.25rem', color: isUploading ? '#78797a' : '' }}>
						{isUploading ? 'Uploading file' : placeholder || 'Upload a file'}
					</div>
					{message && messageType === 'error' ? (
						<Space direction="vertical">
							<Text type={messageType === 'error' ? 'danger' : 'secondary'}>
								{message}
							</Text>
							<div style={{ textAlign: 'center' }}>
								<Button
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										upload();
									}}
									size="small"
									icon={<ReloadOutlined />}
									type="primary"
								>
									Retry
								</Button>
							</div>
						</Space>
					) : null}
					<input
						disabled={isUploaded || isUploading}
						key={inputKey}
						ref={inputRef}
						type="file"
						accept={accept}
						id={`assignment-file-${inputKey}`}
						onChange={handleFileChange}
						style={{ display: 'none' }}
					/>
					{isUploading || isUploaded ? <Progress percent={uploadProgress} /> : null}
				</>
			)}
		</label>
	);
};

export default FileUploader;
