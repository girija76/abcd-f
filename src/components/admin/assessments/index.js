import { Button, Card, Typography } from 'antd';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import DraftList from './draft/List';
import PublishedAssessments from './published';

const { Title } = Typography;
const Assessments = () => {
	const history = useHistory();
	const location = useLocation();
	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Assessments
				</Title>
			}
			// bodyStyle={{ padding: 0 }}
			bordered={false}
			style={{ borderRadius: 0 }}
		>
			<Card
				title={
					<Title level={4} style={{ margin: 0 }}>
						Create new Assessment
					</Title>
				}
				style={{
					marginBottom: '1rem',
				}}
			>
				<Button
					style={{
						marginBottom: '1rem',
					}}
					type="primary"
					onClick={() => history.push(`${location.pathname}/create`)}
				>
					Create New
				</Button>
			</Card>

			<Card
				title={
					<Title level={4} style={{ margin: 0 }}>
						Drafts
					</Title>
				}
				style={{
					marginBottom: '1rem',
				}}
			>
				<DraftList />
			</Card>
			<Card
				title={
					<Title level={4} style={{ margin: 0 }}>
						Published
					</Title>
				}
				style={{
					marginBottom: '1rem',
				}}
			>
				<PublishedAssessments />
			</Card>
		</Card>
	);
};

export default Assessments;
