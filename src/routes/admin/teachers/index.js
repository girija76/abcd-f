import { Button, Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import TeacherList from 'components/admin/teachers';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

function TeacherListRoutes() {
	const [isAdding, setIsAdding] = useState(false);
	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Teachers
				</Title>
			}
			bordered={false}
			style={{ borderRadius: 0 }}
			bodyStyle={{ padding: 0 }}
			extra={
				<Button
					type="primary"
					icon={<AiOutlinePlus style={{ marginRight: 6 }} />}
					onClick={() => setIsAdding(true)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					Add Teacher
				</Button>
			}
		>
			<TeacherList isAdding={isAdding} onCancelAdding={() => setIsAdding(false)} />
		</Card>
	);
}

export default TeacherListRoutes;
