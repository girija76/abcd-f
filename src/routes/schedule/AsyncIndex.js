import React from 'react';
import { Card } from 'antd';
import InferredCoursePlanOfPhase from 'components/coursePlan/InferredCoursePlanOfPhase';

function ScheduleRoutes() {
	return (
		<div>
			<Card
				bordered={false}
				style={{ borderRadius: 0, marginBottom: '3rem' }}
				bodyStyle={{ padding: 8, paddingTop: 1 }}
			>
				<InferredCoursePlanOfPhase viewType="calendar" />
			</Card>
		</div>
	);
}

export default ScheduleRoutes;
