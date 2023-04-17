import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { forEach, get, toLower } from 'lodash';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { AiOutlineDownload as DownloadIcon } from 'react-icons/ai';
import dayjs from 'dayjs';
import Play from 'components/images/play';
import { URLS } from '../urls';
import { isLite, learningCenterConfig } from 'utils/config';
import VideoTracker from 'utils/learning_center/VideoTracker';
import PlaylistItemAvailabilityText from './ItemAvailabilityText';
import PlaylistItemActions from './admin/edit/Actions';
import { queryCache, useQuery } from 'react-query';
import { Progress } from 'antd';
import playlistApi from 'apis/playlist';

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

const parseCookie = str =>
	str
		.split(';')
		.map(v => v.split('='))
		.reduce((acc, v) => {
			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return acc;
		}, {});

function getTokenFromCookie() {
	return parseCookie(document.cookie).auth;
}

const getVideoUrlConfig = (
	video,
	playlistItemId,
	playlistId,
	isAvailable,
	isLiveNow
) => {
	if (isLiveNow && video.liveUrl) {
		return {
			component: 'a',
			url: video.liveUrl,
			target: '_blank',
		};
	}
	const userAgent = toLower(navigator.userAgent);
	const searchParams = new URLSearchParams(window.location.search);
	const isInWebView = searchParams.get('isinwebview');
	const isAndroidApp = isLite && userAgent.indexOf('android') > -1;
	let component = Link;
	let videoBaseUrl = URLS.learningCenterVideoPlayerUrl;
	const extraParams = {};
	if (!isAvailable) {
		component = 'div';
	}
	let addTargetUrl = false;
	let passTo = '';
	let isNativeAllowedOnDomainLevel = true;
	if (get(learningCenterConfig, [toLower(video.embedType)]) === 'play_inline') {
		isNativeAllowedOnDomainLevel = false;
	}
	if (isAndroidApp && !isInWebView && isNativeAllowedOnDomainLevel) {
		if (video.isEmbeded) {
			if (isAvailable) {
				component = 'a';
			}
			if (toLower(video.embedType) === 'youtube') {
				videoBaseUrl = 'prepleaf://video';
				videoBaseUrl += '/youtube';
				extraParams.youtubeVideoId = video.embedUrlId;
			} else if (toLower(video.embedType) === 'vimeo') {
				// passTo = 'prepleaf://video/vimeo';
				// videoBaseUrl += '/vimeo';
				// extraParams.embedUrlId = video.embedUrlId;
				// addTargetUrl = true;
				component = Link;
			}
			extraParams.as_int =
				(process.env.NODE_ENV === 'development' ? 0.2 : 4) * 60 * 1000;
			extraParams.authToken = getTokenFromCookie();
		}
	}
	const videoId = video._id;

	let mainUrl = `${videoBaseUrl}?v=${videoId}&i=${playlistItemId}&p=${playlistId}`;
	if (addTargetUrl) {
		mainUrl = `${window.location.origin}/vimeo_player?i=${extraParams.embedUrlId}&pwa=1&isinwebview=1`;
		mainUrl = `${passTo}?target_url=${encodeURIComponent(
			mainUrl
		)}&v=${videoId}&i=${playlistItemId}&p=${playlistId}`;
	}
	let mainUrlWithExtraParams = mainUrl;
	forEach(extraParams, (value, key) => {
		mainUrlWithExtraParams += `&${key}=${value}`;
	});

	return { url: mainUrlWithExtraParams, component };
};

const PlaylistItem = ({
	_id,
	availableFrom: availableFromProp,
	availableTill: availableTillProp,
	hasAccess,
	resource,
	resourceModel,
	playlistId,
	viewDirection = 'horizontal',
	showActions = false,
}) => {
	const [renderKey, setRenderKey] = useState(0);
	const [availableFrom, setAvailableFrom] = useState(dayjs(availableFromProp));
	const [availableTill, setAvailableTill] = useState(
		availableTillProp ? dayjs(availableTillProp) : null
	);
	const [liveFrom] = useState(dayjs(resource.liveFrom));
	const [liveTill] = useState(dayjs(resource.liveTill));
	const [progress, setProgress] = useState(0);
	const isLiveVideo = resource.type === 'Live';
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const now = useMemo(() => dayjs(), [renderKey]);
	const hasStreamed = useMemo(
		() => (resource.type === 'Live') & now.isAfter(liveTill),
		[liveTill, now, resource.type]
	);
	const isLiveNow = useMemo(
		() =>
			resource.type === 'Live' &&
			now.isSameOrAfter(liveFrom) &&
			now.isSameOrBefore(liveTill),
		[liveFrom, liveTill, now, resource.type]
	);

	const { data: videoStats, isSuccess } = useQuery(
		['get-video-stat-data', resource._id],
		() =>
			playlistApi.getVideoStats({
				videoId: resource._id,
			}),
		{
			staleTime: 6e5,
		}
	);

	useEffect(() => {
		isSuccess && setProgress(videoStats[0]?.progress || 0);
	}, [videoStats]);

	const isAvailable =
		!!resource.endpoints || !!resource.embedUrlId || !!resource.files;
	const isAvailableInFuture = useMemo(() => availableFrom.isAfter(now), [
		availableFrom,
		now,
	]);
	const isAvailableIndefinite = !availableTillProp;
	const isDownload = resourceModel !== 'Video' && resourceModel !== 'Assignment';
	let LinkComponent = 'div';
	let clickUrl = '';
	let linkTarget;
	if (isDownload) {
		LinkComponent = 'a';
		if (isAvailable) {
			clickUrl = resource.endpoints[0];
		} else {
			LinkComponent = 'div';
			clickUrl = '';
		}
	} else if (resourceModel === 'Assignment') {
		clickUrl = `${URLS.learningCenterAssignmentViewUrl}/?r=${resource._id}&i=${_id}&p=${playlistId}`;
		LinkComponent = Link;
	} else {
		const videoUrlConfig = getVideoUrlConfig(
			resource,
			_id,
			playlistId,
			isAvailable,
			isLiveNow
		);
		LinkComponent = videoUrlConfig.component;
		clickUrl = videoUrlConfig.url;
		if (videoUrlConfig.target) {
			linkTarget = videoUrlConfig.target;
		}
	}
	const linkOnClickHandler = useCallback(() => {
		if (isLiveNow) {
			console.log('clicked');
			const videoTracker = new VideoTracker(resource._id);
			if (resourceModel === 'Video') {
				videoTracker.onJoinLive();
				videoTracker.onExit();
			}
		}
	}, [isLiveNow, resource._id, resourceModel]);
	const linkComponentProps = useMemo(() => {
		const linkProps = {};
		if (isDownload) {
			linkProps.href = isAvailable ? clickUrl : undefined;
			linkProps.target = '_blank';
		} else if (LinkComponent === 'a') {
			linkProps.href = clickUrl;
		} else {
			linkProps.to = isAvailable ? clickUrl : undefined;
		}
		linkProps.onClick = linkOnClickHandler;
		if (linkTarget) {
			linkProps.target = linkTarget;
		}
		return linkProps;
	}, [
		LinkComponent,
		clickUrl,
		isAvailable,
		isDownload,
		linkOnClickHandler,
		linkTarget,
	]);
	const thumbnailUrl = resource.thumbNailsUrls[0];
	const handleItemUpdate = () => {
		queryCache.invalidateQueries(playlistId);
	};
	useEffect(() => {
		setAvailableFrom(dayjs(availableFromProp));
		setAvailableTill(availableTillProp ? dayjs(availableTillProp) : null);
	}, [availableFromProp, availableTillProp]);
	return (
		<div
			data-parent-dir={viewDirection}
			className={classnames('playlist-group-item', { disabled: !isAvailable })}
		>
			<LinkComponent
				className="playlist-group-item-thumbnail-container"
				{...linkComponentProps}
			>
				<div
					className="cover-image"
					style={{ backgroundImage: `url("${thumbnailUrl}")` }}
				></div>
				<img className="playlist-group-item-thumbnail" alt="" src={thumbnailUrl} />
				<span className="play-icon">
					{resourceModel === 'Video' ? (
						<Play size={''} />
					) : resourceModel === 'ResourceDocument' ? (
						<DownloadIcon className="download-icon" />
					) : null}
				</span>
			</LinkComponent>
			<LinkComponent
				className="playlist-group-item-info-container"
				{...linkComponentProps}
			>
				<Progress percent={progress} showInfo={false} />
				<h6 className="playlist-group-item-title">{resource.title}</h6>
				<PlaylistItemAvailabilityText
					isLiveNow={isLiveNow}
					availableFrom={availableFrom}
					availableTill={availableTill}
					hasAccess={hasAccess}
					isAvailable={isAvailable}
					isAvailableInFuture={isAvailableInFuture}
					isAvailableIndefinite={isAvailableIndefinite}
					isLiveVideo={isLiveVideo}
					hasStreamed={hasStreamed}
					liveFrom={liveFrom}
					liveTill={liveTill}
					onLive={() => {
						setRenderKey(renderKey + 1);
					}}
				/>
				<div style={{ display: 'none' }}>
					Lect No:{' '}
					{resource.tags
						.filter(tag => tag.key === 'Lect No.' || tag.key === 'LectureNo')
						.map(tag => tag.value)}
				</div>
			</LinkComponent>
			{showActions && (
				<PlaylistItemActions
					playlistId={playlistId}
					availableFrom={availableFrom}
					availableTill={availableTill}
					_id={_id}
					resource={resource}
					resourceType={resourceModel}
					onRefresh={handleItemUpdate}
				/>
			)}
		</div>
	);
};

export default PlaylistItem;
