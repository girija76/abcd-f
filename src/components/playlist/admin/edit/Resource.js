import { Modal } from 'antd';
import { get } from 'lodash';
import React from 'react';
import UploadResource from '../UploadResource';

function EditResource({
	availableFrom,
	availableTill,
	playlistItemId,
	playlistId,
	isVisible,
	onCancel,
	onComplete,
	resource,
	resourceType,
}) {
	return (
		<Modal
			visible={isVisible}
			onCancel={onCancel}
			title={
				<>
					Edit <i>{get(resource, 'title')}</i>
				</>
			}
			centered
			width="80%"
			footer={null}
		>
			<UploadResource
				onCancel={onCancel}
				onUpload={onComplete}
				resource={resource}
				resourceType={resourceType}
				showCancel
			/>
		</Modal>
	);
}

export default EditResource;
