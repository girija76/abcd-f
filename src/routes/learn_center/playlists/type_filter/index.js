import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Space, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineFrown } from 'react-icons/ai';
import playlistApi from 'apis/playlist';
import Playlists from 'components/playlist/Playlists';
import { filterPlaylistsByResourceType } from 'utils/learning_center';
import { isAtLeastMentor } from 'utils/auth';
import CreatePlaylistTile from 'components/playlist/admin/create/Playlist';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';

const { Text } = Typography;

const PlaylistTypeFilter = ({ resourceType, mode, activePhase }) => {
	const role = useSelector(roleSelector);
	const [playlists, setPlaylists] = useState(undefined);
	const { data, isFetching, refetch } = useQuery(
		['/playlists', mode, activePhase],
		playlistApi.getPlaylists,
		{
			staleTime: 5 * 60 * 1000,
		}
	);
	const filteredPlaylists = filterPlaylistsByResourceType(
		playlists,
		resourceType
	);
	useEffect(() => {
		if (data) {
			setPlaylists(data.playlists);
		} else {
			setPlaylists(undefined);
		}
	}, [data]);
	return (
		<div>
			{isFetching ? (
				<div style={{ paddingTop: 24, paddingBottom: 24 }}>
					<Space style={{ width: '100%' }} direction="vertical" align="center">
						<Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
						<Text>Loading...</Text>
					</Space>
				</div>
			) : playlists ? (
				<>
					{filteredPlaylists.length ? (
						<Playlists
							onRefresh={refetch}
							resourceType={resourceType}
							playlists={filteredPlaylists}
						/>
					) : (
						<div style={{ paddingTop: 24, paddingBottom: 24 }}>
							<Space style={{ width: '100%' }} direction="vertical" align="center">
								<AiOutlineFrown style={{ fontSize: 32 }} />
								<Text type="secondary">Nothing in here</Text>
							</Space>
						</div>
					)}
					<div>
						{isAtLeastMentor(role) ? (
							<CreatePlaylistTile onRefresh={refetch} resourceType={resourceType} />
						) : null}
					</div>
				</>
			) : (
				<div style={{ paddingTop: 24, paddingBottom: 24 }}>
					<Space style={{ width: '100%' }}>
						<Button onClick={refetch} type="primary">
							Retry
						</Button>
					</Space>
				</div>
			)}
		</div>
	);
};

export default PlaylistTypeFilter;
