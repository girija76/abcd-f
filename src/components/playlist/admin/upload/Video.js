import { Alert, Button, Form, Input, Radio, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import videoApi from 'apis/video';
import DateTimePicker from 'components/inputs/DateTimePicker';
import dayjs from 'dayjs';
import { get, toLower } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from 'utils/axios';
import { getTagValueByKey } from 'utils/tags';

const getPlatformFromEmbedUrl = url => {
	if (typeof url === 'string') {
		const lowerUrl = toLower(url);
		if (lowerUrl.includes('youtu')) {
			return 'Youtube';
		}
		if (lowerUrl.includes('vimeo')) {
			return 'vimeo';
		}
	}
	return null;
};

function UploadVideo({ resource, onUpload, onCancel, showCancel }) {
	const videoId = get(resource, '_id');
	const [isNew, setIsNew] = useState(true);
	const [form] = Form.useForm();
	const [isCreating, setIsCreating] = useState(false);
	const [selectedType, setSelectedType] = useState();
	const [isSameAsLive, setIsSameAsLive] = useState(true);
	const [liveUrl, setLiveUrl] = useState('');
	const [error, setError] = useState(null);
	const isLive = selectedType === 'Live';
	const handleFormValuesChange = changedValues => {
		if ('embedUrl' in changedValues) {
			setIsSameAsLive(false);
		}
		setSelectedType(form.getFieldValue('type'));
		setLiveUrl(form.getFieldValue('liveUrl'));
		const embedUrl = form.getFieldValue('embedUrl');
		const embedType = getPlatformFromEmbedUrl(embedUrl);
		form.setFieldsValue({ embedType });
	};
	const handleSubmit = useCallback(
		values => {
			setError(null);
			const {
				title,
				type,
				embedType,
				embedUrl,
				liveUrl,
				description,
				'tags.Topic': topic,
				'tags.LectureNo': lectureNo,
				liveFrom,
				liveTill,
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
			const embedData = {
				title,
				liveFrom: liveFrom && liveFrom.toDate(),
				liveTill: liveFrom && liveTill.toDate(),
				type,
				embedType,
				embedUrl,
				liveUrl,
				description,
				tags,
			};
			setIsCreating(true);
			const promise = isNew
				? videoApi.createEmbed(embedData)
				: videoApi.updateEmbed(videoId, embedData);

			promise
				.then(({ video }) => {
					onUpload(video);
				})
				.catch(apiError => {
					const errorMessage = getErrorMessage(apiError, {
						message: 'Unknonw error occurred. Please try again.',
					});
					setError(errorMessage);
				})
				.finally(() => {
					setIsCreating(false);
				});
		},
		[isNew, onUpload, videoId]
	);
	useForm(() => {
		form.setFieldsValue({});
	}, []);
	useEffect(() => {
		if (isLive && isSameAsLive) {
			form.setFieldsValue({
				embedUrl: liveUrl,
				embedType: getPlatformFromEmbedUrl(liveUrl),
			});
		}
	}, [form, isLive, isSameAsLive, liveUrl]);
	useEffect(() => {
		if (resource) {
			const {
				title,
				type,
				liveFrom,
				liveTill,
				liveUrl,
				embedType,
				embedUrlId,
				description,
				tags,
			} = resource;
			const values = {
				title,
				description,
				type,
				embedType,
				embedUrl: embedUrlId,
			};
			if (type === 'Live') {
				if (liveFrom) {
					values.liveFrom = dayjs(liveFrom);
				}
				if (liveTill) {
					values.liveTill = dayjs(liveTill);
				}
				if (liveUrl) {
					values.liveUrl = liveUrl;
				}
			}
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
			setIsSameAsLive(false);
			setSelectedType(type);
			form.setFieldsValue(values);
			setIsNew(false);
		}
	}, [form, resource]);
	return (
		<Form
			onFinish={handleSubmit}
			onValuesChange={handleFormValuesChange}
			form={form}
			layout="vertical"
		>
			<Form.Item name="type" style={{ paddingBottom: 0, marginBottom: 6 }}>
				<Radio.Group
					optionType="button"
					buttonStyle="solid"
					options={[
						{
							label: 'Live Video',
							value: 'Live',
							style: { minWidth: 120, textAlign: 'center' },
						},
						{
							label: 'Recorded Video',
							value: 'Video',
							style: { minWidth: 120, textAlign: 'center' },
						},
					]}
				/>
			</Form.Item>
			{selectedType && (
				<>
					<Form.Item
						label="Title"
						name="title"
						rules={[{ required: true, message: 'Video title is required' }]}
					>
						<Input type="text" />
					</Form.Item>
					<Form.Item label="Description" name="description">
						<Input.TextArea type="text" />
					</Form.Item>
					{isLive && (
						<Form.Item
							label="Live URL"
							name="liveUrl"
							help="When live, students will be redirect to this URL"
						>
							<Input type="text" />
						</Form.Item>
					)}
					<Form.Item
						label={isLive ? 'Recorded Video URL' : 'Video URL'}
						rules={[{ required: true, message: 'Video URL is required' }]}
						name="embedUrl"
					>
						<Input
							type="text"
							placeholder="https://www.youtube.com/watch?v=yasAhsaX"
						/>
					</Form.Item>
					<Form.Item
						name="embedType"
						label="Platform"
						help="Automatically selected based on Video URL"
					>
						<Select>
							<Select.Option value="Youtube">YouTube</Select.Option>
							<Select.Option value="vimeo">Vimeo</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="Topic" name="tags.Topic">
						<Input type="text" />
					</Form.Item>
					<Form.Item label="Lecture Number" name="tags.LectureNo">
						<Input type="text" />
					</Form.Item>
					{isLive ? (
						<>
							<Form.Item label="Live from" name="liveFrom">
								<DateTimePicker />
							</Form.Item>
							<Form.Item label="Live till" name="liveTill">
								<DateTimePicker />
							</Form.Item>
						</>
					) : null}
					{error && <Alert message={error} type="error" />}

					<Space>
						<Button loading={isCreating} type="primary" htmlType="submit">
							{isNew ? 'Create' : 'Update'}
						</Button>
						{showCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
					</Space>
				</>
			)}
		</Form>
	);
}

export default UploadVideo;
