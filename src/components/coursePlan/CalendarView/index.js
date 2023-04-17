import asyncComponent from 'components/AsyncComponent';

export default asyncComponent(() =>
	import(/* webpackChunkName: "InferredCourseCalendarView" */ './CalendarView')
);
