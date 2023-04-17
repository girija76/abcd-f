import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Space } from 'antd';
import videoApi from 'apis/video';
import FileUploader from 'components/inputs/File';
import { get, map, size } from 'lodash';
import { getErrorMessage } from 'utils/axios';
import dayjs from 'dayjs';
import { getTagValueByKey } from 'utils/tags';

const getThumbmnailForFileType = type => {
	const defaultIcon = '';
	const thumbnailsByType = {
		'application/pdf': 'https://static.prepleaf.com/icons/commons/pdf-2310.png',
	};
	return thumbnailsByType[type] || defaultIcon;
};

function UploadDocument({ resource, onCancel, onUpload, showCancel }) {
	const [form] = Form.useForm();
	const [isNew, setIsNew] = useState(false);
	const documentId = get(resource, '_id');
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [error, setError] = useState(null);
	const [endpoints, setEndpoints] = useState([]);
	const [thumbNailsUrls, setThumbNailsUrls] = useState([]);

	const onAddFile = ({ url, type }) => {
		setThumbNailsUrls([getThumbmnailForFileType(type)]);
		setEndpoints([url]);
	};
	const createDraftAndUpload = values => {
		const {
			title,
			description,
			'tags.Topic': topic,
			'tags.LectureNo': lectureNo,
		} = values;
		const tags = [];
		if (topic) {
			tags.push({
				key: 'Topic',
				value: topic,
			});
		}
		if (lectureNo) {
			tags.push({
				key: 'Lect No.',
				value: lectureNo,
			});
		}
		setIsCreatingDraft(true);
		setError(null);
		const data = {
			title,
			description,
			endpoints,
			tags,
			thumbNailsUrls,
		};
		if (!isNew) {
			data._id = documentId;
		}
		const promise = isNew
			? videoApi.createResourceDocument(data)
			: videoApi.updateResourceDocument(data);
		promise
			.then(({ resourceDocument }) => {
				onUpload(resourceDocument);
			})
			.catch(error => {
				setError(getErrorMessage(error));
			})
			.finally(() => {
				setIsCreatingDraft(false);
			});
	};
	const handleSubmit = values => {
		createDraftAndUpload(values);
	};
	useEffect(() => {
		if (resource) {
			const { title, description, tags, thumbNailsUrls, endpoints } = resource;
			const values = { title, description };
			if (tags) {
				const lectureNo = getTagValueByKey('Lect No.');
				const topic = getTagValueByKey('Topic');
				if (typeof lectureNo !== 'undefined' || lectureNo !== null) {
					values['tags.LectureNo'] = lectureNo;
				}
				if (topic) {
					values.Topic = topic;
				}
			}
			setEndpoints(endpoints);
			setThumbNailsUrls(thumbNailsUrls);
			setIsNew(false);
			form.setFieldsValue(values);
		} else {
			setIsNew(true);
		}
	}, [form, resource]);
	return (
		<div>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				<Form.Item
					label="Title"
					name="title"
					rules={[{ required: true, message: 'Document title is required' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="Description" name="description">
					<Input.TextArea />
				</Form.Item>
				<Form.Item label="Select File">
					{map(endpoints, endpoint => (
						<FileUploader url={endpoint} />
					))}
					{!size(endpoints) && (
						<FileUploader
							key={size(endpoints)}
							getPolicy={videoApi.getResourceUploadPolicy}
							onAdd={onAddFile}
							onRemove={() => {
								setThumbNailsUrls([]);
								setEndpoints([]);
							}}
						/>
					)}
				</Form.Item>
				<Form.Item label="Topic" name="tags.Topic">
					<Input type="text" />
				</Form.Item>
				<Form.Item label="Lecture Number" name="tags.LectureNo">
					<Input type="text" />
				</Form.Item>
				{error && <Alert message={error} />}
				<Space style={{ marginTop: 24 }}>
					<Button
						disabled={!size(endpoints) || isCreatingDraft}
						type="primary"
						htmlType="submit"
					>
						{isNew ? 'Create' : 'Update'}
					</Button>
					{showCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
				</Space>
			</Form>
		</div>
	);
}

export default UploadDocument;
