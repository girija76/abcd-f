import React from 'react';
import { Progress } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import { URLS } from 'components/urls';
import playlistApi from 'apis/playlist';

const formatNumber = n => (typeof n === 'number' && !isNaN(n) ? n : 0);

const format = (watched, total) => {
	return `${formatNumber(watched)}/${formatNumber(total)}`;
};

const MyProgress = ({ rootStyle, textStyle }) => {
	const { data: numberOfVideos } = useQuery(
		['getVideosCount', 'Video'],
		playlistApi.getItemCount,
		{
			staleTime: 30 * 60 * 1000,
		}
	);
	const { data: numberOfVideosWatched } = useQuery(
		'getMyProgress',
		playlistApi.videosWatched,
		{
			staleTime: 30 * 60 * 1000,
		}
	);
	const percent = isNaN(numberOfVideosWatched / numberOfVideos)
		? 0
		: numberOfVideosWatched / numberOfVideos;
	return (
		<Link style={rootStyle} to={URLS.learningCenter}>
			<Progress
				type="circle"
				percent={percent}
				width={80}
				format={percent => format(numberOfVideosWatched, numberOfVideos)}
			/>
			<div style={textStyle}>Videos Watched</div>
		</Link>
	);
};

export default MyProgress;
