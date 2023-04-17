import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import DateTimePicker from 'components/inputs/DateTimePicker';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { get } from 'lodash';
import videoApi from 'apis/video';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

function EditPlaylistItem({
	availableFrom,
	availableTill,
	playlistItemId,
	playlistId,
	isVisible,
	onCancel,
	onComplete,
	resource,
}) {
	const [isWorking, setIsWorking] = useState(false);
	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue({
			availableFrom: dayjs(availableFrom),
			availableTill: availableTill ? dayjs(availableTill) : null,
		});
	}, [availableFrom, availableTill, form]);
	const handleSubmit = useCallback(() => {
		const values = form.getFieldsValue();
		setIsWorking(true);
		const { availableFrom, availableTill } = values;
		videoApi
			.updatePlaylistItem(playlistId, playlistItemId, {
				availableFrom: availableFrom ? availableFrom.toDate() : availableFrom,
				availableTill: availableTill ? availableTill.toDate() : availableTill,
			})
			.then(() => {
				onComplete();
			})
			.finally(() => {
				setIsWorking(false);
			});
	}, [form, onComplete, playlistId, playlistItemId]);
	return (
		<Modal
			visible={isVisible}
			onCancel={onCancel}
			title={
				<>
					Edit <i>{get(resource, 'title')}</i>
				</>
			}
			footer={
				<div style={{ display: 'flex' }}>
					<Button loading={isWorking} type="primary" onClick={handleSubmit}>
						Update
					</Button>
					<Button onClick={onCancel}>Cancel</Button>
				</div>
			}
			centered
			width="80%"
		>
			<Form form={form} layout="vertical">
				<Form.Item label="Available from" name="availableFrom">
					<DateTimePicker />
				</Form.Item>
				<Form.Item label="Available till" name="availableTill">
					<DateTimePicker />
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default EditPlaylistItem;
