import { Card, Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { activePhaseSelector, userSelector } from 'selectors/user';

const UserInfo = ({ wrapper }) => {
	const activePhase = useSelector(activePhaseSelector);
	const user = useSelector(userSelector);

	const getTestName = () => {
		const wrapperPhase =
			wrapper !== null && wrapper.phases.find(p => p.phase === activePhase._id);
		return wrapperPhase
			? wrapperPhase.name
				? wrapperPhase.name
				: wrapper.name
			: 'Live-Test';
	};

	return (
		<Card bordered={false}>
			<div>
				<Typography.Text>Test: {getTestName()}</Typography.Text>
			</div>
			<div>
				<Typography.Text>Name: {user.name}</Typography.Text>
			</div>
			<div>
				<Typography>Roll No.: {user.username}</Typography>
			</div>
			<Typography.Text>Phase: {activePhase.name}</Typography.Text>
		</Card>
	);
};

export default UserInfo;
