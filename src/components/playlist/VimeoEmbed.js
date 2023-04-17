import React, { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';
import VideoTracker from 'utils/learning_center/VideoTracker';

const VimeoEmbed = ({
	embedId,
	videoId,
	playlistItemId,
	playlistId,
	onReady,
	lastPosition,
}) => {
	const iframeRef = useRef();
	const [videoDimensions, setVideoDimensions] = useState({
		width: 400,
		height: 300,
	});

	const videoRef = useRef({
		duration: 0,
		currentTime: 0,
	});

	useEffect(() => {
		console.log({ onReady, playlistId, playlistItemId, videoId });
		const player = new Player(iframeRef.current);
		const videoTracker = new VideoTracker(videoId, playlistItemId, playlistId);
		player.ready().then(() => {
			onReady();
			Promise.all([
				player.getVideoWidth(),
				player.getVideoHeight(),
				player.getDuration(),
			]).then(function(response) {
				var width = response[0];
				var height = response[1];
				var dur = response[2];
				setVideoDimensions({ height, width });
				videoRef.current.duration = dur;
			});
		});
		console.log('player', player);
		player.on('playing', () => {
			console.log('playing vimeo video	');
			videoTracker.onPlaying();
		});
		player.on('pause', () => {
			console.log('vimeo video paused');
			videoTracker.onPaused();
		});
		player.on('bufferstart', () => {
			videoTracker.onBuffering();
			console.log('vimeo video buffer start');
		});
		player.on('ended', () => videoTracker.onStopped());

		const timerInterval = setInterval(() => {
			player.getCurrentTime().then(res => {
				videoRef.current.currentTime = res;
			});
		}, 2000);
		return () => {
			player.off('playing');
			player.off('pause');
			player.off('bufferstart');
			clearInterval(timerInterval);
			videoTracker.onExit(videoRef.current.currentTime, videoRef.current.duration);
		};
	}, [onReady, playlistId, playlistItemId, videoId]);

	console.log('lp', lastPosition);

	return (
		<div
			style={{
				height: 0,
				paddingBottom: `${Math.round(
					(videoDimensions.height / videoDimensions.width) * 100
				)}%`,
			}}
		>
			<iframe
				ref={iframeRef}
				title="Video"
				src={`https://player.vimeo.com/video/${embedId}#t=${lastPosition}s`}
				frameborder="0"
				allow="autoplay; fullscreen"
				allowfullscreen
				webkitallowfullscreen
				mozallowfullscreen
				style={{
					width: '100%',
					height: '100%',
					border: 0,
					left: 0,
					position: 'absolute',
					top: 0,
					display: 'block',
				}}
			/>
		</div>
	);
};

export default VimeoEmbed;
