import { Button } from 'antd';
import React from 'react';
import { apiBaseUrl } from 'utils/config';

const DataDownload = () => {
	const baseURL = `${apiBaseUrl}`;
	return (
		<div style={{ padding: 16, paddingTop: 0 }}>
			<a
				style={{ color: '#1a8fff' }}
				href={`${baseURL}/video/activity/myStats`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Button type="primary">Download Video Watch Time</Button>
			</a>
		</div>
	);
};

export default DataDownload;
