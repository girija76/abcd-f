import React, { useEffect, useRef } from 'react';
import PlyrComponent from './PlyrComponent';
import VideoTracker from 'utils/learning_center/VideoTracker';

export const getYoutubeIdFromUrl = url => {
	const splits = url.split('/');
	return splits[splits.length - 1];
};

const preventRightClick = e => {
	e.preventDefault();
	return false;
};

const YouTubeEmbed = ({
	embedId,
	playlistItemId,
	playlistId,
	videoId,
	onReady,
	lastPosition,
}) => {
	const playerRef = useRef();
	const videoTrackerRef = useRef();

	useEffect(() => {
		document.body.addEventListener('contextmenu', preventRightClick);
		return () =>
			document.body.removeEventListener('contextmenu', preventRightClick);
	}, []);

	const handleReady = () => {
		const plyr = playerRef.current.player;
		plyr.on('loadedmetadata', () => {
			plyr.rewind(1000);
		});
		onReady();
	};

	const handlePlyrInitialization = () => {
		console.log('hanled');
		const videoTracker = videoTrackerRef.current;
		console.log(playerRef.current);
		const plyr = playerRef.current.player;

		plyr.once('ready', () => {
			plyr.currentTime = lastPosition;
			handleReady();
		});

		if (plyr.ready) {
			handleReady();
		} else {
			plyr.on('ready', () => {
				handleReady();
			});
		}
		plyr.on('statechange', e => {
			const code = e.detail.code;
			switch (code) {
				case 0:
					videoTracker.onStopped();
					break;
				case 1:
					videoTracker.onPlaying();
					break;
				case 2:
					videoTracker.onPaused();
					break;
				case 3:
					videoTracker.onBuffering();
					break;
				default:
					break;
			}
		});
	};

	useEffect(() => {
		const plyr = playerRef.current.player;
		videoTrackerRef.current = new VideoTracker(
			videoId,
			playlistItemId,
			playlistId
		);

		return () => {
			videoTrackerRef.current.onExit(plyr.currentTime, plyr.duration);
		};
	}, [playlistId, playlistItemId, videoId]);

	return (
		<PlyrComponent
			onPlyrInitializaion={handlePlyrInitialization}
			ref={playerRef}
			sources={{
				type: 'video',
				sources: [{ src: embedId, provider: 'youtube' }],
			}}
		/>
	);
};

export default YouTubeEmbed;
