import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, Spin } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { activePhaseSelector } from 'selectors/user';
import SubjectWiseCoursePlanViewer from './SubjectView';
import InferredCoursePlanOfPhaseCalendarView from './CalendarView';
import { useGetCoursePlan } from './hooks';
import QuickCourseView from './QuickView';
import { size } from 'lodash';

dayjs.extend(advancedFormat);

const componentsByViewType = {
	subject: SubjectWiseCoursePlanViewer,
	calendar: InferredCoursePlanOfPhaseCalendarView,
	quickView: QuickCourseView,
};

function CoursePlanOfPhase({ viewType = 'subject', phaseId }) {
	const ViewComponent = useMemo(() => componentsByViewType[viewType] || null, [
		viewType,
	]);
	const title = 'Course Plan and Progress';
	const resourceTypeAliasMap = { Video: 'Lecture' };
	const { isFetched, isFetching, refetch, now, items } = useGetCoursePlan();

	return (
		<div>
			{isFetching && (!items || !size(items)) ? (
				<Card title={title}>
					<Spin icon={<Loading3QuartersOutlined />} />
				</Card>
			) : isFetched ? (
				<ViewComponent
					title={title}
					publishedTill={now}
					items={items}
					resourceTypeAliasMap={resourceTypeAliasMap}
					phaseId={phaseId}
					refetch={refetch}
				/>
			) : (
				'Could not fetch course plan'
			)}
		</div>
	);
}

const InferredCoursePlanOfPhase = ({ viewType }) => {
	const activePhase = useSelector(activePhaseSelector);
	const inferCoursePlan = useMemo(
		() => activePhase && activePhase.inferCoursePlan,
		[activePhase]
	);
	if (inferCoursePlan) {
		return (
			<CoursePlanOfPhase
				phaseId={activePhase && activePhase._id}
				viewType={viewType}
			/>
		);
	}
	return null;
};

export default InferredCoursePlanOfPhase;
