import { Form, Image, Input, message, Modal } from 'antd';
import playlistApi from 'apis/playlist';
import videoApi from 'apis/video';
import FileUploader from 'components/inputs/File';
import { PlaylistPreview } from 'components/playlist/Playlist';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { activePhaseSelector, roleSelector } from 'selectors/user';
import { useBoolean } from 'use-boolean';

import { getViewAsPhase } from 'utils/viewAs';

function CreatePlaylist({
	subject: initialSubject,
	resourceType: initialResourceType,
	isVisible,
	onCancel,
	onCreate,
}) {
	const [form] = Form.useForm();
	const [thumbnail, setThumbnail] = useState(null);
	const userPhase = useSelector(activePhaseSelector);
	const role = useSelector(roleSelector);
	const [isWorking, setIsWorking] = useState(false);
	const handleSubmit = useCallback(async () => {
		try {
			await form.validateFields();
			const values = form.getFieldsValue(true);
			setIsWorking(true);
			const { title, description, resourceType, 'tags.Subject': subject } = values;
			const tags = [];
			if (subject) {
				tags.push({
					key: 'Subject',
					value: subject,
				});
			}
			playlistApi
				.createPlaylist({
					title,
					description,
					tags,
					thumbNailsUrls: thumbnail,
					accessibleTo: [
						{
							type: 'Phase',
							value: getViewAsPhase(userPhase, role),
						},
					],
					resourceType,
				})
				.then(() => {
					message.success('Playlist created');
					onCreate();
				})
				.finally(() => {
					setIsWorking(false);
				});
		} catch (e) {}
	}, [form, onCreate, role, thumbnail, userPhase]);
	useEffect(() => {
		form.setFieldsValue({
			'tags.Subject': initialSubject,
			resourceType: initialResourceType,
		});
		// TODO: match subject name and select Playlist.subject
	}, [initialSubject, initialResourceType, form]);
	const handleThumbnailUpload = ({ url }) => {
		setThumbnail(url);
	};
	return (
		<Modal
			visible={isVisible}
			title="Create new Playlist"
			onCancel={onCancel}
			onOk={handleSubmit}
			okButtonProps={{ loading: isWorking }}
			okText="Create"
			centered
		>
			<Form layout="vertical" form={form}>
				<Form.Item
					label="Name"
					name="title"
					rules={[{ required: true, message: 'Playlist name is required' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="Description" name="description">
					<Input.TextArea />
				</Form.Item>
				<Form.Item label="Thumbnail">
					{thumbnail ? <Image src={thumbnail} height={150} /> : null}
					<FileUploader
						getPolicy={videoApi.getResourceUploadPolicy}
						onAdd={handleThumbnailUpload}
					/>
				</Form.Item>
				<Form.Item label="Subject" name="tags.Subject">
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
}

function CreatePlaylistTile({ onRefresh, ...props }) {
	const [isOpen, open, close] = useBoolean(false);
	const handleOnCreate = () => {
		close();
		onRefresh();
	};
	return (
		<>
			<PlaylistPreview isCreateNew onClick={open} />
			{isOpen ? (
				<CreatePlaylist
					{...props}
					isVisible
					onCancel={close}
					onCreate={handleOnCreate}
				/>
			) : null}
		</>
	);
}

export default CreatePlaylistTile;
