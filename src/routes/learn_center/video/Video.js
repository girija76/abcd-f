import React, { useCallback, useMemo, useRef, useState } from 'react';
import toLower from 'lodash/toLower';
import YouTubeEmbed from 'components/playlist/YouTubeEmbed';
import VimeoEmbed from 'components/playlist/VimeoEmbed';
import HLSEmbed from 'components/playlist/HLSEmbed';
import classNames from 'classnames';

const Video = ({
	isEmbeded,
	embedType,
	embedUrlId,
	title,
	playlistId,
	playlistItemId,
	videoId,
	endpoints,
	resourceType,
	lastPosition,
}) => {
	const ref = useRef();

	const [isPlayerReady, setIsPlayerReady] = useState(false);

	const dummyCoverList = useMemo(() => {
		const length = Math.floor(Math.random() * 49) + 1;
		const list = [];
		for (let i = 0; i < length; i++) {
			list.push(i);
		}
		return list;
	}, []);

	const onPlayerReady = useCallback(() => {
		setIsPlayerReady(true);
	}, []);

	return (
		<div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
			<div style={{ width: '100%' }}>
				<div
					className={classNames('youtube-video-root-element', {})}
					ref={ref}
					style={{
						position: 'relative',
					}}
				>
					{isPlayerReady
						? null
						: dummyCoverList.map((i, index) => <Cover key={i} />)}
					{!isEmbeded ? (
						<HLSEmbed
							videoId={videoId}
							playlistItemId={playlistItemId}
							embedType={embedType}
							playlistId={playlistId}
							embedId={embedUrlId}
							title={title}
							onReady={onPlayerReady}
							endpoints={endpoints}
						/>
					) : isEmbeded && ['youtube'].indexOf(toLower(embedType)) > -1 ? (
						<YouTubeEmbed
							videoId={videoId}
							playlistItemId={playlistItemId}
							embedType={embedType}
							playlistId={playlistId}
							embedId={embedUrlId}
							title={title}
							onReady={onPlayerReady}
							lastPosition={lastPosition}
						/>
					) : isEmbeded && toLower(embedType) === 'vimeo' ? (
						<VimeoEmbed
							videoId={videoId}
							playlistItemId={playlistItemId}
							embedType={embedType}
							playlistId={playlistId}
							embedId={embedUrlId}
							title={title}
							onReady={onPlayerReady}
							lastPosition={lastPosition}
						/>
					) : (
						'Video Not Supported. Please contact admin.'
					)}
					{isPlayerReady
						? null
						: dummyCoverList.map((i, index) => <Cover key={i} />)}
				</div>
			</div>
		</div>
	);
};

const chars = 'qwsaedf_rtgy__uip_lkjhgzxvcbnm_';

const Cover = () => {
	const className = useMemo(() => {
		let l = 'prepleaf-youtube-player-video-item vid-';
		const randomNumber = Math.floor(Math.random() * 12) + 1;
		for (var i = 0; i < randomNumber; i++) {
			const r = Math.floor(Math.random() * chars.length);
			l += chars[r];
		}
		return l;
	}, []);
	return (
		<div
			className={className}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				zIndex: 10,
				opacity: 0,
			}}
		>
			<div></div>
		</div>
	);
};

export default Video;
