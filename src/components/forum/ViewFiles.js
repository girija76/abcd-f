import React from 'react';
import { map } from 'lodash';
import { Typography } from 'antd';
import { AiOutlineDownload } from 'react-icons/ai';

const { Title } = Typography;

const ViewFile = ({ url, name, extension, type }) => {
	if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
		return <img src={url} alt="" style={{ maxWidth: '100%' }} />;
	}
	return (
		<a href={url} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
			{name || 'File'}{' '}
			<AiOutlineDownload style={{ fontSize: '1.2em', marginLeft: 4 }} />
		</a>
	);
};

function ViewFiles({ files }) {
	if (!Array.isArray(files) || !files.length) {
		return null;
	}
	return (
		<div>
			<Title level={5}>Attachments ({files.length})</Title>
			{map(files, file => {
				return <ViewFile key={file._id} {...file} />;
			})}
		</div>
	);
}

export default ViewFiles;
