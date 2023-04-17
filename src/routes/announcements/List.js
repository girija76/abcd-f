import React, { useEffect } from 'react';
import { Col, Pagination, Row, Spin, Typography } from 'antd';
import { useGetAnnouncements } from 'components/announcement/hooks';
import AnnouncementTile from 'components/announcement/AnnouncementTile';

const { Text } = Typography;

function AnnouncementList({ phase, refreshKey }) {
	const {
		items,
		isFetching,
		isFetched,
		total,
		pageSize,
		currentPage,
		onPageChange,
		refetch,
	} = useGetAnnouncements([phase]);
	useEffect(() => {
		refetch();
	}, [refetch]);
	return (
		<div>
			{isFetching ? (
				<Spin />
			) : isFetched ? (
				<>
					<Row direction="vertical" gutter={[8, 8]}>
						{items.map(announcement => {
							return (
								<Col key={announcement._id} xs={24} xl={8}>
									<AnnouncementTile key={announcement._id} {...announcement} />
								</Col>
							);
						})}
					</Row>
					{items.length >= total ? (
						<div style={{ textAlign: 'center', marginTop: total > 0 ? '2rem' : 0 }}>
							<Text type="secondary">
								{total > 0 ? "That's all" : 'No announcements yet.'}
							</Text>
						</div>
					) : (
						<div
							style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
						>
							<Pagination
								onChange={onPageChange}
								current={currentPage}
								total={total}
								pageSize={pageSize}
							/>
						</div>
					)}
				</>
			) : null}
		</div>
	);
}

export default AnnouncementList;
