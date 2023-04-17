import createAnnouncementApi from 'apis/announcement';
import { useQuery } from 'react-query';
import { useMemo, useState } from 'react';

const announcementApi = createAnnouncementApi();

const limit = process.env.NODE_ENV === 'development' ? 3 : 30;
export function useGetAnnouncements([phaseId]) {
	const [currentPage, setCurrentPage] = useState(1);
	const onPageChange = pageNumber => {
		setCurrentPage(pageNumber);
	};
	const skip = (currentPage - 1) * limit;
	const { data, isFetching, isFetched, refetch } = useQuery(
		['get-announcements', phaseId, skip, limit],
		() => announcementApi.getAnnouncements(phaseId, skip, limit),
		{
			staleTime: 5 * 60 * 1000,
		}
	);
	const { items, total } = useMemo(
		() => (data ? data : { items: [], total: 0 }),
		[data]
	);

	return {
		isFetching,
		isFetched,
		currentPage,
		pageSize: limit,
		onPageChange,
		items,
		total,
		refetch,
	};
}
