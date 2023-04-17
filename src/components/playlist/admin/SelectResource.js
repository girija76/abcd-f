import { Tabs } from 'antd';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { getLabelForResourceType } from 'utils/playlist';
import VideoOrDocument from './list/resources/VideoOrDocument';
import UploadResource from './UploadResource';

const InvalidComponent = ({ resourceType }) => {
	return (
		<div>
			Listing <b>{getLabelForResourceType(resourceType)}</b> is not supported yet.
			If you think that's a mistake, please let us know.
		</div>
	);
};
const libraryByResourceType = {
	Video: VideoOrDocument,
	ResourceDocument: VideoOrDocument,
	Assignment: VideoOrDocument,
};

const tabPanStyle = { padding: 12, paddingTop: 0 };
function SelectResource({ resourceType, onSelect }) {
	const resourceTypeLabel = getLabelForResourceType(resourceType);
	const [activeTabKey, setActiveTabKey] = useState('upload');
	const LibrarySelectorComponent = useMemo(
		() => get(libraryByResourceType, resourceType, InvalidComponent),
		[resourceType]
	);
	return (
		<Tabs onChange={setActiveTabKey} activeKey={activeTabKey}>
			<Tabs.TabPane
				key="upload"
				tab={`Upload ${resourceTypeLabel}`}
				style={tabPanStyle}
			>
				<UploadResource onUpload={onSelect} resourceType={resourceType} />
			</Tabs.TabPane>
			<Tabs.TabPane key="list" tab={`Library`} style={tabPanStyle}>
				<LibrarySelectorComponent onSelect={onSelect} resourceType={resourceType} />
			</Tabs.TabPane>
		</Tabs>
	);
}
export default SelectResource;
