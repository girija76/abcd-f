import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import { URLS } from '../../urls';

const { Text } = Typography;

const AlreadyAttempted = ({ liveTestId }) => {
	const link = `${URLS.analysisId}/?wid=${liveTestId}`;

	return (
		<div style={{ paddingTop: '20vh' }}>
			<div style={{ textAlign: 'center' }}>
				<Text type="warning">
					<ExclamationCircleFilled style={{ fontSize: 48 }} />
				</Text>
				<div style={{ margin: '1.5rem 0', fontSize: '1.5rem' }}>
					You have already attempted this assessment!
				</div>
				<Link to={link}>
					<Button type="primary" key="console">
						Check Solution
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default AlreadyAttempted;
