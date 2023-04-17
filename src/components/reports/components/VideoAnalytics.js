import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { cloneDeep, filter, forEach } from 'lodash';
import playlistApi from 'apis/video';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import durationPlugin from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { isDev } from 'utils/config';
import VideoAnalyticsGraph from './VideoAnalyticsGraph';
import { getTagValueByKey } from 'utils/tags';
dayjs.extend(durationPlugin);
dayjs.extend(isSameOrBefore);

const defaultStat = {
	watchDuration: 0,
	topics: [],
	videoIds: [],
};

const getWatchDurationInOrder = items => {
	const statsByDate = {};
	let durationUnit = 'minutes';
	let maxDuration = 0;
	let minDate = isDev ? dayjs().subtract(5, 'days') : null;
	let maxDate = dayjs();
	const videosById = {};
	forEach(items, videoUserItem => {
		if (!videosById[videoUserItem.v._id]) {
			videosById[videoUserItem.v._id] = videoUserItem.v;
		}
		const videoId = videoUserItem.v._id;
		const video = videoUserItem.v;
		forEach(videoUserItem.a, item => {
			const createdAt = dayjs(item.at);
			const date = createdAt.format('YYYY-MM-DD');
			if (!minDate) {
				minDate = createdAt;
			}
			if (!maxDate) {
				maxDate = createdAt;
			}
			if (createdAt.isBefore(minDate)) {
				minDate = createdAt;
			}
			if (createdAt.isAfter(maxDate)) {
				maxDate = createdAt;
			}
			if (!statsByDate[date]) {
				statsByDate[date] = cloneDeep(defaultStat);
			}
			statsByDate[date].watchDuration += item.d;
			const topic = getTagValueByKey(video.tags, 'Topic');

			if (topic && statsByDate[date].topics.indexOf(topic) === -1) {
				statsByDate[date].topics.push(topic);
			}
			if (statsByDate[date].videoIds.indexOf(videoId) === -1) {
				statsByDate[date].videoIds.push(videoId);
			}
			if (statsByDate[date].watchDuration > maxDuration) {
				maxDuration = statsByDate[date].watchDuration;
			}
		});
	});
	if (!minDate) {
		return { stats: [], durationUnit: 'minutes' };
	}
	const stats = [];
	if (maxDuration > 1.5 * 60 * 60 * 1000) {
		// 1 hours
		durationUnit = 'hours';
	}
	let position = 0;
	for (
		let date = minDate;
		date.isSameOrBefore(maxDate);
		date = date.add(1, 'days')
	) {
		position += 1;
		const stat = statsByDate[date.format('YYYY-MM-DD')]
			? statsByDate[date.format('YYYY-MM-DD')]
			: cloneDeep(defaultStat);
		const duration = dayjs.duration({ milliseconds: stat.watchDuration });
		stat.watchDuration = Math.round(duration.as(durationUnit) * 10) / 10;
		stat.videoTitles = stat.videoIds.map(videoId => videosById[videoId].title);
		stats.push({
			date,
			position,
			stat,
		});
	}
	return { stats, durationUnit };
};

const createFilter = () => i => {
	return i && i.v;
};

function VideoAnalytics({ printableElementRef }) {
	const { data } = useQuery('getMyVideoStats', playlistApi.getVideoStats, {
		staleTime: 60 * 60 * 1000,
	});
	const [filters] = useState({ Topic: '' });
	const filteredData = useMemo(() => filter(data, createFilter(filters)), [
		data,
		filters,
	]);
	const { stats, durationUnit } = useMemo(
		() => getWatchDurationInOrder(filteredData),
		[filteredData]
	);
	return (
		<div ref={printableElementRef}>
			{!stats.length ? (
				<div>You haven't watched enough videos</div>
			) : (
				<VideoAnalyticsGraph data={stats} durationUnit={durationUnit} />
			)}
		</div>
	);
}

export default VideoAnalytics;
