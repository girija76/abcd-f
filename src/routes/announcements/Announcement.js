import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import createAnnouncementApi from 'apis/announcement';
import { Button, Spin } from 'antd';
import AnnouncementDetail from 'components/announcement/AnnouncementDetail';

const announcementApi = createAnnouncementApi();

function AnnouncementPage({ announcementId, onLoad }) {
	const { data, isFetching, isError, refetch, isSuccess } = useQuery(
		['get-announcement-by-id', announcementId],
		() => announcementApi.getAnnouncement(announcementId),
		{
			staleTime: 3e5,
		}
	);
	const announcement = useMemo(() => {
		if (isSuccess) {
			return data;
		}
		return {};
	}, [data, isSuccess]);
	useEffect(() => {
		if (isSuccess && announcement) {
			onLoad(announcement);
		}
	}, [announcement, isSuccess, isFetching, onLoad]);
	if (isFetching && !isSuccess) {
		return (
			<div style={{ textAlign: 'center' }}>
				<Spin />
				<div>Loading announcement</div>
			</div>
		);
	}
	if (isError) {
		return (
			<div style={{ textAlign: 'center' }}>
				<Spin />
				<div>Error occurred. Please try again.</div>
				<Button onClick={refetch}>Reload</Button>
			</div>
		);
	}
	return <AnnouncementDetail announcement={announcement} onRefresh={refetch} />;
}

export default AnnouncementPage;
