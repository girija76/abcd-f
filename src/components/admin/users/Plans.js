import React from 'react';
import { useQuery } from 'react-query';
import { hasServicesEnabled } from 'utils/config';
import createPaymentsApi from 'apis/payments';
import { Card, Col, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { AiFillClockCircle } from 'react-icons/ai';

const PurchesedPlans = ({ id, userId }) => {
	const paymentsApi = createPaymentsApi();

	const { data, isSuccess } = useQuery(
		['get-user-plans-for-userId', userId],
		() =>
			hasServicesEnabled && userId
				? paymentsApi.getPlansOfUser(userId)
				: () => null,
		{
			staleTime: 3.6e6,
			retry: 2,
		}
	);

	return (
		<div id={id}>
			<Row>
				{isSuccess && data && data.length > 0
					? data.map(plan => {
							const duration = dayjs
								.duration(plan.details.duration, 'milliseconds')
								.asDays();
							return (
								<Col lg={4} xs={12}>
									<div
										style={{
											padding: '1rem',
										}}
									>
										<Card
											title={<Typography>{plan.details.name}</Typography>}
											extra={
												<Space>
													<Typography>
														<AiFillClockCircle /> {duration} days
													</Typography>
												</Space>
											}
										>
											<Typography>{plan.details.description}</Typography>
										</Card>
									</div>
								</Col>
							);
					  })
					: 'You have not purchased any plans.'}
			</Row>
		</div>
	);
};

export default PurchesedPlans;
