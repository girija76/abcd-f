import { Avatar, List, Space } from 'antd';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import Modal from 'antd/lib/modal/Modal';
import videoApi from 'apis/video';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import Title from 'antd/lib/typography/Title';
import LiveIcon from 'components/playlist/LiveIcon';

dayjs.extend(durationPlugin);

function VideoViewers({ onCancel, isVisible, resource }) {
	const videoId = get(resource, '_id');
	const { data, isFetching } = useQuery(
		['video-viewers', videoId],
		() => videoApi.getViewersOfVideo(videoId),
		{
			staleTime: 6e5,
		}
	);
	const { items } = useMemo(() => (data ? data : {}), [data]);
	return (
		<Modal
			visible={isVisible}
			onCancel={onCancel}
			title={
				<>
					Users who viewed <i>{get(resource, 'title')}</i>
				</>
			}
			centered
			width="80%"
			footer={null}
		>
			<List
				dataSource={items}
				loading={isFetching}
				renderItem={({
					u: user,
					wt: watchTime,
					iw: isWatched,
					djl: didJoinLive,
					isDummy,
				}) => {
					return (
						<List.Item
							extra={
								<>
									{didJoinLive ? (
										<span
											style={{
												fontWeight: 500,
												color: '#313131',
												display: 'inline-flex',
												alignItems: 'center',
											}}
										>
											<LiveIcon size={24} color="#4295f5" />
											<span style={{ marginLeft: 6 }}>Joined Live</span>
										</span>
									) : null}
									{isWatched ? (
										<span style={{ fontWeight: 500, color: '#313131' }}>
											<div style={{ textAlign: 'right' }}>
												Watched{' '}
												<Title level={5}>
													{dayjs.duration(watchTime, 'millisecond').humanize()}
												</Title>
											</div>
										</span>
									) : null}
								</>
							}
						>
							<List.Item.Meta
								title={isDummy ? 'Details' : user.name}
								avatar={!isDummy && <Avatar src={user.dp} size="default" />}
								description={
									<Space>
										<span>{isDummy ? null : user.email}</span>
									</Space>
								}
							/>
						</List.Item>
					);
				}}
			/>
		</Modal>
	);
}

export default VideoViewers;
