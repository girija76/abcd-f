import React, { useMemo } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { eventTransformer } from '../utils';
import CoursePlanEvent from '../components/CoursePlanEvent';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { isLite } from 'utils/config';

const { Title } = Typography;

const categories = [
	{
		title: 'Today',
		key: 'today',
		createFilter: now => event => now.isSame(event.start, 'day'),
		createSortFn: now => (a, b) => {
			if (now.isBefore(a.start) && now.isBefore(b.start)) {
				// both are upcoming
				return a.start - b.start;
			}

			return b.start - a.start;
		},
		getLimit: breakpoints => {
			if (breakpoints.xs) {
				return 2;
			}
			return 100;
		},
	},
	{
		title: 'Upcoming',
		key: 'upcoming',
		createFilter: now => event =>
			now.isBefore(event.start, 'day') && event.isUpcoming,
		createSortFn: now => (a, b) => a.start - b.start,
		getLimit: breakpoints => (breakpoints.xs ? 2 : 3),
	},
	{
		title: 'Last week',
		key: 'lastweek',
		createFilter: now => event =>
			!event.isUpcoming &&
			now
				.clone()
				.subtract(1, 'week')
				.isBefore(event.start, 'day') &&
			now.isAfter(event.start, 'day'),
		createSortFn: now => (a, b) => {
			return b.start - a.start;
		},
		getLimit: breakpoints => (breakpoints.xs ? 2 : 6),
	},
];

const singleItemColumnProps = {
	xs: 24,
};

const multipleItemsColumnProps = {
	xs: 24,
	md: 12,
	lg: 12,
	xl: 12,
	xxl: 8,
};

const Category = ({
	title,
	createFilter,
	createSortFn,
	now,
	events,
	getLimit,
	refetch,
}) => {
	const filter = useMemo(() => createFilter(now), [createFilter, now]);
	const sortFn = useMemo(() => createSortFn(now), [createSortFn, now]);
	const breakpoints = useBreakpoint();
	const limit = useMemo(() => getLimit(breakpoints), [breakpoints, getLimit]);
	const filteredEvents = useMemo(
		() =>
			events
				.filter(filter)
				.sort(sortFn)
				.slice(0, limit),
		[events, filter, limit, sortFn]
	);
	if (!filteredEvents.length) {
		return null;
	}
	const isSingleItem = filteredEvents.length === 1;
	return (
		<Card
			title={
				<Title style={{ marginBottom: 4 }} level={4}>
					{title}
				</Title>
			}
			size={breakpoints.xs ? 'small' : 'default'}
			bordered={!isLite}
			style={{ marginBottom: 12, borderRadius: isLite ? 0 : '' }}
			bodyStyle={{ padding: 12 }}
		>
			<div style={{ padding: '0 0 0px' }}>
				<Row gutter={[12, 12]}>
					{filteredEvents.map((event, index) => {
						return (
							<Col
								{...(isSingleItem ? singleItemColumnProps : multipleItemsColumnProps)}
								key={index}
							>
								<CoursePlanEvent
									{...event}
									key={event._id}
									options={{
										showStart: true,
										showStartInNewLine: !isSingleItem,
										titleEllipsis: true,
									}}
									afterChange={refetch}
								/>
							</Col>
						);
					})}
				</Row>
			</div>
		</Card>
	);
};

function QuickCourseView({
	publishedTill,
	items,
	resourceTypeAliasMap,
	refetch,
}) {
	const events = useMemo(() => items.map(eventTransformer), [items]);
	return (
		<div>
			{categories.map(category => {
				return (
					<Category
						{...category}
						now={publishedTill}
						events={events}
						key={category.key}
						refetch={refetch}
					/>
				);
			})}
		</div>
	);
}

export default QuickCourseView;
