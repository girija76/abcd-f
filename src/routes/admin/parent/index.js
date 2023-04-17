import { Button, Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import ParentList from 'components/admin/parent';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

function ParentListRoutes() {
	const [isAdding, setIsAdding] = useState(false);
	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Parents
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
					Add Parent
				</Button>
			}
		>
			<ParentList isAdding={isAdding} onCancelAdding={() => setIsAdding(false)} />
		</Card>
	);
}

export default ParentListRoutes;
