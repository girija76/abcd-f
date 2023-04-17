import React, { useEffect, useMemo, useRef } from 'react';
import { get } from 'lodash';
import VideoTracker from 'utils/learning_center/VideoTracker';
import PlyrComponent from './PlyrComponent';

const HLSEmbed = ({
	onReady,
	playlistItemId,
	playlistId,
	videoId,
	endpoints,
}) => {
	const videoSrc = useMemo(() => {
		const hls = get(endpoints, ['HLS']);
		console.log({ hls });
		return hls;
	}, [endpoints]);
	const playerRef = useRef();
	const videoTrackerRef = useRef();

	const handleReady = () => {
		const plyr = playerRef.current.player;
		plyr.on('loadedmetadata', () => {
			plyr.rewind(1000);
		});
		onReady();
	};
	const handlePlyrInitialization = () => {
		const videoTracker = videoTrackerRef.current;
		const plyr = playerRef.current.player;
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
		videoTrackerRef.current = new VideoTracker(
			videoId,
			playlistItemId,
			playlistId
		);

		return () => {
			videoTrackerRef.current.onExit();
		};
	}, [playlistId, playlistItemId, videoId]);
	return (
		<PlyrComponent
			ref={playerRef}
			onPlyrInitializaion={handlePlyrInitialization}
			sources={{ type: 'video', sources: [{ src: videoSrc, provider: 'video' }] }}
		/>
	);
};

export default HLSEmbed;
