import { get } from 'lodash';
import React, { useMemo } from 'react';
import { getLabelForResourceType } from 'utils/playlist';
import UploadAssignment from './upload/Assignment';
import UploadDocument from './upload/Document';
import UploadVideo from './upload/Video';

const componentMap = {
	Video: UploadVideo,
	ResourceDocument: UploadDocument,
	Assignment: UploadAssignment,
};
const InvalidComponent = ({ resourceType }) => {
	return (
		<div>
			Upload for <b>{getLabelForResourceType(resourceType)}</b> is not supported
			yet. If you think that's a mistake, please let us know.
		</div>
	);
};
function UploadResource({
	resourceType,
	resource,
	onUpload,
	onCancel,
	showCancel,
}) {
	const Component = useMemo(
		() => get(componentMap, resourceType, InvalidComponent),
		[resourceType]
	);
	return (
		<Component
			resource={resource}
			onUpload={onUpload}
			onCancel={onCancel}
			resourceType={resourceType}
			showCancel={showCancel}
		/>
	);
}

export default UploadResource;
