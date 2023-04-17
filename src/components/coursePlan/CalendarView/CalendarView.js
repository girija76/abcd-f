import React, { useEffect, useMemo, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import dayjs from 'dayjs';
import './CalendarView.scss';
import CalendarToolbar from './Toolbar';
import CalendarEvent from './CalendarEvent';
import SelectedEventsShow from './SelectedEventsShow';
import { eventTransformer } from '../utils';
import { isAtLeastMentor } from 'utils/auth';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';
import CreateScheduledLecture from '../../admin/attendance/CreateScheduledLecture';
import { Modal } from 'antd';
import CopyLectures from 'components/admin/attendance/CopyScheduledLectures';

const createEventPropGetter = filters => {
	const stylesByCategory = {};
	filters.forEach(filter => {
		stylesByCategory[filter.value] = filter.style;
	});
	return event => {
		const backgroundStyle = event.isCompleted
			? stylesByStateFilterKey.Completed
			: event.isUpcoming
			? stylesByStateFilterKey.Upcoming
			: stylesByStateFilterKey.Missed;
		return {
			className: 'custom-event',
			style: { ...backgroundStyle, ...stylesByCategory[event.category] },
		};
	};
};

const localizer = momentLocalizer(moment);
const components = {
	event: CalendarEvent,
};
const views = ['month', 'week'];

const stylesByStateFilterKey = {
	Completed: {
		pillColor: '#33B679',
		backgroundColor: '#33b67933',
	},
	Missed: {
		pillColor: '#f34e4e',
		backgroundColor: '#f34e4e19',
	},
	Upcoming: {
		pillColor: '#4e4ef3',
		backgroundColor: '#4e4ef333',
	},
};

const stateFilters = [
	{ value: 'Completed', style: stylesByStateFilterKey.Completed },
	{ value: 'Missed', style: stylesByStateFilterKey.Missed },
	{ value: 'Upcoming', style: stylesByStateFilterKey.Upcoming },
];
const allColors = [
	{
		color: '#039BE5',
	},
	{
		color: '#3F51B5',
	},
	{
		color: '#0B8043',
	},
	{
		color: '#a600f7',
	},
	{
		color: 'rgb(254,90,90)',
	},
];

const createFilters = allCategories => {
	let lastUsedColorIndex = -1;
	return allCategories
		.sort((a, b) => (!a || a === 'Other' ? 1 : !b || b === 'Other' ? -1 : 0))
		.map(category => {
			const colorIndex = (lastUsedColorIndex + 1) % allColors.length;
			lastUsedColorIndex += 1;
			return { style: allColors[colorIndex], value: category || 'Other' };
		});
};

const getEventsOnDate = (items, date, unit) => {
	const selectedDate = dayjs(date);
	return items.filter(({ start }) => selectedDate.isSame(start, unit));
};

function InferredCoursePlanOfPhaseCalendarView({
	items,
	phaseId,
	lecturer,
	refetch,
}) {
	const role = useSelector(roleSelector);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const handleSelectSlot = slot => {
		setSelectedSlot(slot);
	};
	const [selectedDetails, setSelectedDetails] = useState({});
	const [currentView, setCurrentView] = useState(
		isAtLeastMentor(role) ? 'week' : 'month'
	);
	const [currentDate, setCurrentDate] = useState(new Date());
	const events = useMemo(() => items.map(eventTransformer), [items]);
	const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);
	const [selectedStateFilters, setSelectedStateFilters] = useState(
		stateFilters.map(f => f.value)
	);

	const allCategories = useMemo(() => {
		const allCategories = [];
		events.forEach(event => {
			if (!allCategories.includes(event.category)) {
				allCategories.push(event.category);
			}
		});
		return allCategories;
	}, [events]);
	const filters = useMemo(() => createFilters(allCategories), [allCategories]);
	const eventPropGetter = useMemo(() => createEventPropGetter(filters), [
		filters,
	]);

	useEffect(() => {
		setSelectedCategoryFilters(filters.map(filter => filter.value));
	}, [filters]);

	const handleViewChange = view => {
		setCurrentView(view);
	};
	const handleNavigate = date => {
		setCurrentDate(date);
	};
	const handleDrillDown = (date, unit) => {
		const filteredEventsForDate = getEventsOnDate(filteredEvents, date, unit);
		setSelectedDetails({
			title: `${dayjs(date).format('DD MMMM YYYY')}`,
			events: filteredEventsForDate,
			show: true,
			isSingleItem: false,
		});
	};
	const handleSelectEvent = event => {
		if (event) {
			setSelectedDetails({
				title: null,
				events: [event],
				show: true,
				isSingleItem: true,
			});
		}
	};

	const filteredEvents = useMemo(
		() =>
			events
				.filter(event => selectedCategoryFilters.includes(event.category))
				.filter(event => {
					return selectedStateFilters.some(filter => {
						if (filter === 'Upcoming') {
							return event.isUpcoming;
						}
						if (filter === 'Completed') {
							return event.isCompleted;
						}
						if (filter === 'Missed') {
							return !event.isCompleted && !event.isUpcoming;
						}
						return false;
					});
				}),
		[events, selectedCategoryFilters, selectedStateFilters]
	);
	return (
		<div>
			<div className="course-plan-calendar-view">
				<CalendarToolbar
					onNavigate={handleNavigate}
					onView={handleViewChange}
					date={currentDate}
					view={currentView}
					stateFilters={stateFilters}
					categoryFilters={filters}
					selectedCategoryFilters={selectedCategoryFilters}
					selectedStateFilters={selectedStateFilters}
					onCategoryFiltersChange={setSelectedCategoryFilters}
					onStateFiltersChange={setSelectedStateFilters}
					showViews={isAtLeastMentor(role)}
				/>
				<div
					style={{
						minHeight: 'calc(100vh - 210px)',
						backgroundColor: 'white',
					}}
				>
					<BigCalendar
						elementProps={{
							style: { minHeight: 'inherit', backgroundColor: 'white' },
						}}
						events={filteredEvents}
						localizer={localizer}
						view={currentView}
						views={views}
						onView={handleViewChange}
						onNavigate={handleNavigate}
						date={currentDate}
						selectable={currentView === 'week' && isAtLeastMentor(role)}
						onSelectSlot={handleSelectSlot}
						eventPropGetter={eventPropGetter}
						components={components}
						toolbar={false}
						onDrillDown={handleDrillDown}
						onSelectEvent={handleSelectEvent}
					/>
				</div>
				{phaseId ? (
					<CopyLectures
						onNavigate={handleNavigate}
						date={currentDate}
						onCancel={() => {}}
						onSuccess={refetch}
						currentView={currentView}
						phaseId={phaseId}
					/>
				) : null}
			</div>
			<SelectedEventsShow
				onClose={() => setSelectedDetails({})}
				afterChange={refetch}
				{...selectedDetails}
			/>
			<CreateScheduledLectureWrapper
				onCancel={() => setSelectedSlot(null)}
				refetch={refetch}
				slot={selectedSlot}
				phase={phaseId}
				lecturer={lecturer}
			/>
		</div>
	);
}

const CreateScheduledLectureWrapper = ({
	slot,
	onCancel,
	phase,
	refetch,
	lecturer,
}) => {
	const phases = useMemo(() => [phase], [phase]);
	return (
		<Modal
			onCancel={onCancel}
			visible={slot}
			forceRender
			footer={null}
			closable={false}
			centered
		>
			{slot ? (
				<CreateScheduledLecture
					lecturer={lecturer}
					phases={phases}
					endTime={slot.end}
					startTime={slot.start}
					onCancel={onCancel}
					onSuccess={() => {
						refetch();
						onCancel();
					}}
				/>
			) : null}
		</Modal>
	);
};

export default InferredCoursePlanOfPhaseCalendarView;
