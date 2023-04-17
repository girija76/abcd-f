import createAnnouncementApi from 'apis/forum';
import { useQuery } from 'react-query';
import { useMemo, useState } from 'react';

const forumApi = createAnnouncementApi();

const limit = process.env.NODE_ENV === 'development' ? 3 : 30;
export function useGetQuestions([phase, subject]) {
	const [currentPage, setCurrentPage] = useState(1);
	const onPageChange = pageNumber => {
		setCurrentPage(pageNumber);
	};
	const skip = (currentPage - 1) * limit;
	const { data, isFetching, isFetched, refetch } = useQuery(
		['get-forum-questions', phase, subject, skip, limit],
		() =>
			subject && phase
				? forumApi.listQuestions(phase, subject, skip, limit)
				: Promise.resolve({}),
		{
			staleTime: 36e4,
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
