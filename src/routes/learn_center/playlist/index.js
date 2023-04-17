import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { generatePath, Link } from 'react-router-dom';
import { Card, Spin } from 'antd';
import { useQuery } from 'react-query';
import { ArrowLeftOutlined } from '@ant-design/icons';
import playlistApi from 'apis/playlist';
import Playlist from 'components/playlist/Playlist';
import { isLite } from 'utils/config';
import AddResourceToPlaylistButton from 'components/playlist/admin/AddResource';
import { URLS } from 'components/urls';

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

const PlaylistPage = ({
	location: { search: searchParams },
	match: { params },
}) => {
	const { playlistId, viewAs, phases } = useMemo(
		() => getParamsFromUrl(searchParams),
		[searchParams]
	);
	const [queryToPass, setQueryToPass] = useState('');
	const { data: playlist, refetch } = useQuery(
		playlistId,
		playlistApi.getPlaylist,
		{
			staleTime: process.env.NODE_ENV === 'development' ? 3e4 : 9e5,
		}
	);

	useEffect(() => {
		if (viewAs && phases) {
			setQueryToPass(`viewAs=${viewAs}&phases=${encodeURIComponent(phases)}`);
		}
	}, [viewAs, phases]);
	const backBasePath = generatePath(URLS.learningCenterPlaylists, {
		resourceType: `${params.resourceType}`,
	});

	return playlist ? (
		<div
			className={classnames('learning-center-playlist', {
				'no-margin': isLite,
			})}
		>
			<Card
				style={{ width: '100%', overflow: 'hidden', borderRadius: 0 }}
				bodyStyle={{ padding: '0' }}
				headStyle={{ fontSize: '1.2rem' }}
				bordered={false}
				title={
					playlist ? (
						<div>
							<Link
								style={{ marginRight: 12 }}
								to={`${backBasePath}${queryToPass ? `?${queryToPass}` : ''}`}
							>
								<ArrowLeftOutlined />
							</Link>
							<span>{playlist.title}</span>
						</div>
					) : (
						'Playlist'
					)
				}
				extra={
					<AddResourceToPlaylistButton
						onSuccess={refetch}
						title={playlist.title}
						resourceType={playlist.resourceType}
						_id={playlist._id}
					/>
				}
			>
				<Playlist query={queryToPass} {...playlist} />
			</Card>
		</div>
	) : (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				paddingTop: 40,
				flexDirection: 'column',
			}}
		>
			<Spin />
			<div style={{ marginTop: 4 }}>Loading Playlist</div>
		</div>
	);
};
export default PlaylistPage;
