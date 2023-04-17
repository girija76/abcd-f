import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Card, Spin } from 'antd';
import { useQuery } from 'react-query';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Linkify from 'react-linkify';
import playlistApi from 'apis/playlist';
import Video from './Video';
import PlaylistItem from 'components/playlist/PlaylistItem';
import Comments from 'components/playlist/Comments';
import { isLite } from 'utils/config';
import './styles.scss';
import dayjs from 'dayjs';
import VideoTracker from 'utils/learning_center/VideoTracker';
import FeedbackForm from 'components/feedback/Form';

const getParamsFromUrl = search => {
	const params = new URLSearchParams(search);
	return {
		playlistId: params.get('p'),
		playlistItemId: params.get('i'),
		videoId: params.get('v'),
		viewAs: params.get('viewAs'),
		phases: params.get('phases'),
	};
};

const VideoPage = ({ location: { search: searchParams } }) => {
	const { playlistId, playlistItemId, videoId, viewAs, phases } = useMemo(
		() => getParamsFromUrl(searchParams),
		[searchParams]
	);
	const [video, setVideo] = useState();
	const [queryToPass, setQueryToPass] = useState('');
	const [loading, setLoading] = useState(true);
	const [videoStats, setVideoStats] = useState([]);
	const { data: playlist } = useQuery(playlistId, playlistApi.getPlaylist, {
		staleTime: 10 * 60 * 1000,
	});

	useEffect(() => {
		playlistApi
			.getVideoStats({
				videoId,
			})
			.then(res => {
				setVideoStats(res);
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		if (playlist) {
			playlist.items.forEach(playlistItem => {
				if (playlistItem._id === playlistItemId) {
					setVideo(playlistItem.resource);
				}
			});
		}
	}, [playlist, playlistItemId, videoId]);
	useEffect(() => {
		if (viewAs && phases) {
			setQueryToPass(`viewAs=${viewAs}&phases=${encodeURIComponent(phases)}`);
		}
	}, [viewAs, phases]);
	const isLiveNow = useMemo(() => {
		if (video) {
			const liveFrom = dayjs(video.liveFrom);
			const liveTill = dayjs(video.liveTill);
			return (
				video.type === 'Live' &&
				dayjs().isSameOrAfter(liveFrom) &&
				dayjs().isSameOrBefore(liveTill)
			);
		}
		return false;
	}, [video]);

	useEffect(() => {
		if (isLiveNow && video.liveUrl) {
			try {
				const videoTracker = new VideoTracker(video._id);
				videoTracker.onJoinLive();

				const timeoutId = setTimeout(() => {
					window.location = video.liveUrl;
				}, 2000);
				return () => {
					clearTimeout(timeoutId);
					videoTracker.onExit();
				};
			} catch (e) {
				console.log(e);
			}
		}
	}, [isLiveNow, video]);

	return playlist && !loading ? (
		<div
			className={classnames('learning-center-video', {
				'no-margin': isLite,
			})}
		>
			<Card
				style={{ width: '100%', borderRadius: 0 }}
				bordered={false}
				bodyStyle={{ padding: '0' }}
				headStyle={{ fontSize: '1.2rem' }}
				title={
					video ? (
						<div>
							<Link
								style={{ marginRight: 12 }}
								to={`./playlist?p=${playlistId}${queryToPass ? `&${queryToPass}` : ''}`}
							>
								<ArrowLeftOutlined />
							</Link>
							<span>{video.title}</span>
						</div>
					) : (
						'Video'
					)
				}
			>
				<div className="playlist-with-player">
					{video ? (
						<div style={{ flexGrow: 1 }}>
							<Video
								key={video._id}
								{...video}
								videoId={videoId}
								playlistId={playlistId}
								playlistItemId={playlistItemId}
								lastPosition={videoStats[0]?.lastPosition || 0}
							/>
							<h2 className="video-title">{video.title}</h2>

							<FeedbackForm
								item={playlistId}
								itemRef="Playlist"
								formFor={'child'}
								otherRefs={[
									{ type: 'Video', value: video._id },
									{ type: 'PlaylistItem', value: playlistItemId },
								]}
							/>

							<Linkify>
								<div className="video-description">{video.description}</div>
							</Linkify>
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								backgroundColor: '#212121',
							}}
						>
							<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
						</div>
					)}
					<div className="suggestion-list">
						{playlist.items
							.filter(i => {
								const shouldBeShown =
									i.resource._id !== (video ? video._id : undefined);
								return shouldBeShown;
							})
							.filter((item, index) => index < 3)
							.map(item => (
								<PlaylistItem
									playlistId={playlistId}
									{...item}
									key={item._id}
									viewDirection="vertical"
								/>
							))}
					</div>
				</div>
				<Comments
					videoId={videoId}
					playlistId={playlistId}
					playlistItemId={playlistItemId}
				/>
			</Card>
		</div>
	) : (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				paddingTop: 40,
			}}
		>
			<Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
			<div style={{ marginTop: 8 }}>Loading video...</div>
		</div>
	);
};
export default VideoPage;
