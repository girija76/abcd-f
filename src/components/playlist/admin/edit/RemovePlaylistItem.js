import React, { useCallback, useState } from 'react';
import { Modal } from 'antd';
import { get } from 'lodash';
import videoApi from 'apis/video';
import { getLabelForResourceType } from 'utils/playlist';

function RemovePlaylistItem({
	playlistItemId,
	playlistId,
	isVisible,
	onCancel,
	onComplete,
	resource,
	resourceType,
}) {
	const resourceLabel = getLabelForResourceType(resourceType);
	const [isWorking, setIsWorking] = useState(false);
	const handleSubmit = useCallback(() => {
		setIsWorking(true);
		videoApi
			.removePlaylistItem(playlistId, playlistItemId)
			.then(() => {
				onComplete();
			})
			.finally(() => {
				setIsWorking(false);
			});
	}, [onComplete, playlistId, playlistItemId]);
	return (
		<Modal
			visible={isVisible}
			onCancel={onCancel}
			title={
				<>
					Are you sure you want to remove <i>{get(resource, 'title')}</i> from
					playlist
				</>
			}
			onOk={handleSubmit}
			okText="Yes, Remove"
			cancelText="No, Cancel"
			okButtonProps={{ type: 'primary', danger: true, loading: isWorking }}
			centered
			width="80%"
		>
			<div>
				The {resourceLabel} will not be deleted from the Library and you will be
				able to access the {resourceLabel} from library and add it back.
			</div>
		</Modal>
	);
}

export default RemovePlaylistItem;
