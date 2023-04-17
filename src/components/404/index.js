import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { URLS } from '../urls';

const { Text } = Typography;

const NOT_FOUND = () => (
	<div style={{ paddingTop: '20vh' }}>
		<div style={{ textAlign: 'center' }}>
			<Text type="warning">
				<ExclamationCircleFilled style={{ fontSize: 48 }} />
			</Text>
			<div style={{ margin: '1.5rem 0', fontSize: '1.5rem' }}>
				Sorry, the page you visited does not exist.
			</div>
			<Link to={URLS.landingPage}>
				<Button type="primary">Back Home</Button>
			</Link>
		</div>
	</div>
);

export default NOT_FOUND;
