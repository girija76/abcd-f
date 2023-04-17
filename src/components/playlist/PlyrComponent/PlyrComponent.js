/* eslint-disable react/self-closing-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';
import './styles.css';

class PlyrComponent extends React.Component {
	componentDidMount() {
		this.useHlsIfRequired();
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.destroy();
		}
	}

	useHlsIfRequired = () => {
		const { onPlyrInitializaion } = this.props;
		const sources = this.props.sources;
		const source = sources.sources[0];
		const defaultOptions = {};

		if (source.provider === 'video') {
			const video = this.videoRef;
			if (!Hls.isSupported()) {
				video.src = source.src;
			} else {
				// For more Hls.js options, see https://github.com/dailymotion/hls.js
				const hls = new Hls();
				this.hls = hls;
				hls.loadSource(source.src);
				hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
					console.log(event, data);
					// Transform available levels into an array of integers (height values).
					const availableQualities = hls.levels.map(l => l.height);

					// Add new qualities to option
					defaultOptions.quality = {
						default: availableQualities[0],
						options: availableQualities,
						// this ensures Plyr to use Hls to update quality level
						// Ref: https://github.com/sampotts/plyr/blob/master/src/js/html5.js#L77
						forced: true,
						onChange: e => this.updateQuality(e),
					};

					// Initialize new Plyr player with quality options
					this.player = new Plyr(video, defaultOptions);
					onPlyrInitializaion();
				});
				hls.attachMedia(video);
			}
		} else {
			this.player = new Plyr(this.videoRef, this.props.options);
			this.player.source = this.props.sources;
			setTimeout(() => {
				onPlyrInitializaion();
			});
		}
	};
	updateQuality = newQuality => {
		this.hls.levels.forEach((level, levelIndex) => {
			if (level.height === newQuality) {
				console.log('Found quality match with ' + newQuality);
				this.hls.currentLevel = levelIndex;
			}
		});
	};

	render() {
		return (
			<video ref={ref => (this.videoRef = ref)} className="js-plyr plyr"></video>
		);
	}
}

PlyrComponent.defaultProps = {
	options: {
		controls: [
			'rewind',
			'play',
			'fast-forward',
			'progress',
			'current-time',
			'duration',
			'mute',
			'volume',
			'settings',
			'fullscreen',
		],
		i18n: {
			restart: 'Restart',
			rewind: 'Rewind {seektime}s',
			play: 'Play',
			pause: 'Pause',
			fastForward: 'Forward {seektime}s',
			seek: 'Seek',
			seekLabel: '{currentTime} of {duration}',
			played: 'Played',
			buffered: 'Buffered',
			currentTime: 'Current time',
			duration: 'Duration',
			volume: 'Volume',
			mute: 'Mute',
			unmute: 'Unmute',
			enableCaptions: 'Enable captions',
			disableCaptions: 'Disable captions',
			download: 'Download',
			enterFullscreen: 'Enter fullscreen',
			exitFullscreen: 'Exit fullscreen',
			frameTitle: 'Player for {title}',
			captions: 'Captions',
			settings: 'Settings',
			menuBack: 'Go back to previous menu',
			speed: 'Speed',
			normal: 'Normal',
			quality: 'Quality',
			loop: 'Loop',
		},
	},
	sources: {
		type: 'video',
		sources: [
			{
				src:
					'https://rawcdn.githack.com/chintan9/Big-Buck-Bunny/e577fdbb23064bdd8ac4cecf13db86eef5720565/BigBuckBunny720p30s.mp4',
				type: 'video/mp4',
				size: 720,
			},
			{
				src:
					'https://rawcdn.githack.com/chintan9/Big-Buck-Bunny/e577fdbb23064bdd8ac4cecf13db86eef5720565/BigBuckBunny1080p30s.mp4',
				type: 'video/mp4',
				size: 1080,
			},
		],
	},
};

PlyrComponent.propTypes = {
	options: PropTypes.object,
	sources: PropTypes.object,
	source: PropTypes.func,
	destroy: PropTypes.func,
};

export default PlyrComponent;
