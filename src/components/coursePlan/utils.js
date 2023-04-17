import dayjs from 'dayjs';
import { get } from 'lodash';
import { URLS } from 'components/urls';
import { topicTestsTitle } from 'utils/config';

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

function getItemType(item) {
	const resourceModel = get(item, 'resourceModel');
	if (resourceModel) {
		return resourceModel;
	}
	const assessmentType = get(item, 'type');
	if (
		['FULL-MOCK', 'LIVE-TEST', 'SECTIONAL-MOCK', 'TOPIC-MOCK'].includes(
			assessmentType
		)
	) {
		return 'Assessment';
	}
	const isScheduledLecture = get(item, 'type') === 'ScheduledLecture';
	if (isScheduledLecture) {
		return 'ScheduledLecture';
	}
	return 'unknown';
}

function titleAccessor(item) {
	const itemType = getItemType(item);
	if (
		itemType === 'Video' ||
		itemType === 'ResourceDocument' ||
		itemType === 'Assignment'
	) {
		return get(item, ['resource', 'title']);
	}
	if (itemType === 'Assessment') {
		return get(item, ['name']);
	}
	return get(item, ['resource', 'title'], get(item, 'title'));
}

function startAccessor(item) {
	const itemType = getItemType(item);
	if (
		['Video', 'ResourceDocument', 'Assignment', 'Assessment'].includes(itemType)
	) {
		return item.availableFrom ? item.availableFrom.toDate() : new Date();
	}
	if (itemType === 'ScheduledLecture') {
		return item.startTime ? item.startTime.toDate() : new Date();
	}
	return item.availableFrom ? item.availableFrom.toDate() : new Date();
}

function endAccessor(item) {
	const itemType = getItemType(item);

	if (
		['Video', 'ResourceDocument', 'Assignment', 'Assessment'].includes(itemType)
	) {
		const availableFrom = startAccessor(item);
		return dayjs(availableFrom)
			.add(1, 'hours')
			.toDate();
	}
	if (itemType === 'ScheduledLecture') {
		return item.endTime ? item.endTime.toDate() : new Date();
	}
}

const assessmentTypeMap = {
	'LIVE-TEST': 'Live Test',
	'FULL-MOCK': 'Mock Test',
	'SECTIONAL-MOCK': 'Sectional Test',
	'TOPIC-MOCK': topicTestsTitle || 'Topic Test',
};

function categoryAccessor(item) {
	const itemType = getItemType(item);
	if (['Video', 'ResourceDocument', 'Assignment'].includes(itemType)) {
		return get(item, ['subject'], 'Other');
	}
	if ('Assessment' === itemType) {
		const actualType = get(item, 'type', '');
		return get(assessmentTypeMap, actualType, actualType);
	}
	if ('ScheduledLecture' === itemType) {
		return get(item, ['subjectName'], 'Other');
	}
	return 'Other';
}

function isCompletedAccessor(item) {
	const itemType = getItemType(item);
	if (itemType === 'Assessment') {
		return !!get(item, ['submission']);
	}
	if (itemType === 'Video') {
		return get(item, ['isCompleted']);
	}
	if (itemType === 'Assignment') {
		return !!get(item, ['submission']);
	}
	return false;
}

function isUpcomingAccessor(item) {
	const startDate = startAccessor(item);
	if (dayjs().isBefore(startDate)) {
		return true;
	}
	return false;
}

function isOngoingAccessor(item) {
	const startDate = startAccessor(item);
	const endDate = endAccessor(item);
	if (dayjs().isSameOrAfter(startDate) && dayjs().isSameOrBefore(endDate)) {
		return true;
	}
	return false;
}

function urlAccessor(item) {
	const itemType = getItemType(item);
	if (itemType === 'Assessment') {
		if (isCompletedAccessor(item)) {
			return `${URLS.analysisId}?wid=${get(item, ['_id'])}`;
		} else {
			return `${URLS.assessments}?id=${get(item, ['_id'])}`;
		}
	}
	if (itemType === 'Video') {
		const resourceId = get(item, ['resource', '_id']);
		const playlistItemId = get(item, '_id');
		const playlistId = get(item, 'playlistId');
		return `${URLS.learningCenterVideoPlayerUrl}?v=${resourceId}&i=${playlistItemId}&p=${playlistId}`;
	}
	if (itemType === 'ResourceDocument') {
		const playlistId = get(item, 'playlistId');
		return `${URLS.learningCenterAssignmentPlaylist}?p=${playlistId}`;
	}
	if (itemType === 'Assignment') {
		const playlistId = get(item, 'playlistId');
		const resourceId = get(item, ['resource', '_id']);
		const playlistItemId = get(item, '_id');
		return `${URLS.learningCenterAssignmentViewUrl}?r=${resourceId}&i=${playlistItemId}&p=${playlistId}`;
	}
}

function allDayAccessor(item) {
	const itemType = getItemType(item);
	if (itemType === 'ScheduledLecture') {
		return false;
	}
	return true;
}

function originalDataAccessor(item) {
	const itemType = getItemType(item);
	if (itemType === 'ScheduledLecture') {
		return item;
	}
	return null;
}

export const eventTransformer = item => ({
	start: startAccessor(item),
	end: endAccessor(item),
	title: titleAccessor(item),
	category: categoryAccessor(item),
	isCompleted: isCompletedAccessor(item),
	isUpcoming: isUpcomingAccessor(item),
	isOngoing: isOngoingAccessor(item),
	url: urlAccessor(item),
	allDay: allDayAccessor(item),
	type: getItemType(item),
	originalData: originalDataAccessor(item),
});
