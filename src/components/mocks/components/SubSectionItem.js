import { Card, Progress, Typography } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const { Title } = Typography;

function SubSectionItem({ label, items, baseUrl }) {
	const attemptedCount = useMemo(
		() => items.filter(assessmentWrapper => assessmentWrapper.submission).length,
		[items]
	);
	const total = items.length;
	const attemptedPercentage = useMemo(
		() => Math.floor((100 * attemptedCount) / total),
		[attemptedCount, total]
	);
	return (
		<Link to={`${baseUrl}/${label}`}>
			<Card size="small">
				<Title level={4}>{label}</Title>
				<Progress
					type="line"
					percent={attemptedPercentage}
					format={() => `${attemptedCount}/${total}`}
				/>
			</Card>
		</Link>
	);
}

export default SubSectionItem;
