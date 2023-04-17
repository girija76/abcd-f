import React, { useEffect } from 'react';
import { map } from 'lodash';
import ThreadOverview from '../../components/forum/ThreadOverview';
import { Col, Pagination, Row, Spin, Typography } from 'antd';
import { useGetQuestions } from './hooks';

const { Text } = Typography;

function ListQuestion({ refreshKey, phase, subject }) {
	const {
		items,
		isFetching,
		isFetched,
		total,
		pageSize,
		currentPage,
		onPageChange,
		refetch,
	} = useGetQuestions([phase, subject]);
	useEffect(() => {
		refetch();
	}, [refetch, refreshKey]);
	return (
		<div>
			{isFetching ? (
				<Spin />
			) : isFetched ? (
				<>
					<Row gutter={[16, 16]}>
						{map(items, question => {
							return (
								<Col key={question._id} xs={24} md={12} lg={8} xxl={6}>
									<ThreadOverview question={question} phase={phase} />
								</Col>
							);
						})}
					</Row>
					{items && items.length >= total ? (
						<div style={{ textAlign: 'center', marginTop: total ? '2rem' : 0 }}>
							<Text type="secondary">
								{total ? "That's all" : 'No questions here'}
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

export default ListQuestion;
