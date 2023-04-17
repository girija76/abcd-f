import { Alert, Button, Form, Input, message, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useBoolean } from 'use-boolean';
import { getLabelForResourceType } from 'utils/playlist';
import { BiPlus } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';
import { get } from 'lodash';
import DateTimePicker from 'components/inputs/DateTimePicker';
import videoApi from 'apis/video';
import SelectResource from './SelectResource';
import { getErrorMessage } from 'utils/axios';

const AddResource = ({
	_id: playlistId,
	resourceType,
	title: playlistTitle,
	onClose,
	isOpen,
	onSuccess,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [error, setError] = useState(null);
	const [form] = Form.useForm();
	const resourceTypeLabel = getLabelForResourceType(resourceType);
	const [selectedResource, setSelectedResource] = useState(null);
	const handleSubmit = useCallback(() => {
		const { availableFrom, availableTill } = form.getFieldsValue(true);
		setIsAdding(true);
		setError(null);
		videoApi
			.addItemToPlaylist({
				id: playlistId,
				items: [
					{
						resource: selectedResource._id,
						availableFrom: availableFrom ? availableFrom.format() : new Date(),
						availableTill,
					},
				],
			})
			.then(() => {
				message.success(`${resourceTypeLabel} added successfully`);
				onSuccess();
				onClose();
			})
			.catch(error => {
				setError(getErrorMessage(error));
			})
			.finally(() => {
				setIsAdding(false);
			});
	}, [
		form,
		onClose,
		playlistId,
		resourceTypeLabel,
		selectedResource,
		onSuccess,
	]);
	return (
		<Modal
			bodyStyle={{ padding: 0 }}
			title={`Add ${resourceTypeLabel} to ${playlistTitle}`}
			visible={isOpen}
			footer={
				<div style={{ display: 'flex' }}>
					<Button
						loading={isAdding}
						disabled={!selectedResource}
						type="primary"
						onClick={handleSubmit}
					>
						Add {resourceTypeLabel}
					</Button>
					<Button
						disabled={!selectedResource}
						onClick={() => setSelectedResource(null)}
					>
						Choose another
					</Button>
					<Button onClick={onClose}>Cancel</Button>
				</div>
			}
			onCancel={onClose}
			forceRender
			centered
			width="80%"
		>
			{!selectedResource ? (
				<SelectResource
					onSelect={setSelectedResource}
					playlistId={playlistId}
					resourceType={resourceType}
				/>
			) : (
				<Form form={form} layout="vertical" style={{ padding: 12 }}>
					<Form.Item label={`${getLabelForResourceType(resourceType)} title`}>
						<Input type="text" disabled value={get(selectedResource, ['title'])} />
					</Form.Item>
					<Form.Item
						label="Available from"
						name="availableFrom"
						help="Content will be available from this time onwards"
					>
						<DateTimePicker />
					</Form.Item>
					<Form.Item
						label="Available till"
						name="availableTill"
						help="Content will not be available after this time"
					>
						<DateTimePicker />
					</Form.Item>
					{error && (
						<Form.Item>
							<Alert message={error} type="error" />
						</Form.Item>
					)}
				</Form>
			)}
		</Modal>
	);
};

const AddResourceToPlaylistButton = ({
	resourceType,
	_id: playlistId,
	title: playlistTitle,
	onSuccess,
}) => {
	const role = useSelector(roleSelector);
	const [isOpen, open, close] = useBoolean(false);
	const [modalKey, setModalKey] = useState(0);
	const resourceTypeLabel = getLabelForResourceType(resourceType);
	useEffect(() => {
		if (!isOpen) {
			const timeoutId = setTimeout(() => {
				setModalKey(modalKey + 1);
			}, 200);
			return () => {
				clearTimeout(timeoutId);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);
	if (role === 'user') {
		return null;
	}
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				type="primary"
				ghost
				icon={<BiPlus style={{ fontSize: '1.25em', marginRight: 4 }} />}
				onClick={open}
			>
				Add {resourceTypeLabel}
			</Button>
			<AddResource
				key={modalKey}
				isOpen={isOpen}
				onClose={close}
				title={playlistTitle}
				_id={playlistId}
				resourceType={resourceType}
				onSuccess={onSuccess}
			/>
		</>
	);
};

export default AddResourceToPlaylistButton;
