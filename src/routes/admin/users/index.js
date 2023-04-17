import { Button, Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import ListUsers from 'components/admin/users';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

function UserListRoute({ filters }) {
	const [isAdding, setIsAdding] = React.useState(false);
	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Users
				</Title>
			}
			bodyStyle={{ padding: 0 }}
			bordered={false}
			style={{ borderRadius: 0 }}
			extra={
				<Button
					type="primary"
					icon={<AiOutlinePlus style={{ marginRight: 6 }} />}
					onClick={() => setIsAdding(true)}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					Add Student
				</Button>
			}
		>
			<ListUsers
				filters={filters}
				isAdding={isAdding}
				onCancel={() => setIsAdding(false)}
			/>
		</Card>
	);
}

export default UserListRoute;
