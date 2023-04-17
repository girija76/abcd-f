import React, { useMemo, useState } from 'react';
import { Card, Col, Image, Row, Typography } from 'antd';
import { get, map } from 'lodash';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { URLS } from 'components/urls';
import { useLoadMyServicePlans, useLoadServicePlans } from './hooks';
import { logoDark } from 'utils/config';
import { calculateOfferDiscount, getBestOffer } from 'utils/servicePlan';
import OfferText from 'components/payment/components/OfferText';

const { Text, Title } = Typography;

const Currency = ({ children }) => {
	if (children === 'INR') {
		return <>&#8377;</>;
	}
	return <>{children}</>;
};

const ServicePlan = ({
	currency,
	thumbNailUrl,
	basePrice,
	name,
	_id,
	offers,
	buyNowQuery,
	services,
}) => {
	const selectedService = useMemo(() => services[0], [services]);
	const [thumbNailToShow, setThumbNailToShow] = useState(
		thumbNailUrl || logoDark
	);
	const bestOffer = useMemo(() => getBestOffer(offers, basePrice), [
		basePrice,
		offers,
	]);
	const discount = calculateOfferDiscount(bestOffer, basePrice);
	return (
		<Card
			style={{ overflow: 'hidden', height: '100%' }}
			cover={
				<Image
					src={thumbNailToShow}
					alt="thumbnail"
					fallback={logoDark}
					preview={false}
					onError={() => setThumbNailToShow(logoDark)}
				/>
			}
			bodyStyle={{ padding: 8 }}
		>
			<Title level={4} style={{ marginBottom: 8 }}>
				{name}
			</Title>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div>
					<div>
						{discount ? (
							<Text
								type="secondary"
								delete
								style={{ marginRight: 4, fontSize: '1.2rem' }}
							>
								<Currency>{currency}</Currency>
								{basePrice / 100}
							</Text>
						) : null}
						<Text style={{ fontSize: '1.2rem' }}>
							<Currency>{currency}</Currency>
							{(basePrice - discount) / 100}
						</Text>
					</div>
					{discount ? (
						<div>
							<Text type="success">
								<OfferText offer={bestOffer} />
							</Text>
						</div>
					) : null}
				</div>
				<div>
					<Link
						className="ant-btn ant-btn-primary"
						to={`${URLS.cart}?sp=${_id}&${buyNowQuery}&sign_up_subGroup=${get(
							selectedService,
							'subGroupId'
						)}&sign_up_superGroup=${get(
							selectedService,
							'superGroupId'
						)}&sign_up_phase=${get(selectedService, 'phase')}`}
					>
						Buy Now
					</Link>
				</div>
			</div>
		</Card>
	);
};

const ServicePlanGroup = ({ label, items, colSizes, buyNowQuery }) => {
	return (
		<div>
			<Title level={3}>{label}</Title>
			<Row gutter={[8, 8]}>
				{map(items, servicePlan => {
					return (
						<Col
							xs={colSizes.xs}
							sm={colSizes.sm}
							md={colSizes.md}
							lg={colSizes.lg}
							xl={colSizes.xl}
							xxl={colSizes.xxl}
							style={{ height: 'inherit', padding: 5 }}
						>
							<ServicePlan
								key={servicePlan._id}
								{...servicePlan}
								buyNowQuery={buyNowQuery}
							/>
						</Col>
					);
				})}
			</Row>
		</div>
	);
};

const ServicePlanGroups = ({ groups, colSizes, buyNowQuery }) => {
	return (
		<div>
			{map(groups, (group, index) => (
				<ServicePlanGroup
					key={index}
					{...group}
					colSizes={colSizes}
					buyNowQuery={buyNowQuery}
				/>
			))}
		</div>
	);
};

function ServicePlans({ WrapperComponent = 'div', colSizes, buyNowQuery }) {
	const { subscribedServicePlanIds } = useLoadMyServicePlans();
	const { isLoaded, isLoading, servicePlanGroups } = useLoadServicePlans(
		subscribedServicePlanIds
	);
	if (!servicePlanGroups || !servicePlanGroups.length) {
		return null;
	}
	return (
		<WrapperComponent>
			{isLoading ? (
				<div style={{ padding: 12, textAlign: 'center' }}>
					<LoadingOutlined style={{ fontSize: '2rem' }} />
				</div>
			) : isLoaded ? (
				<ServicePlanGroups
					groups={servicePlanGroups}
					colSizes={colSizes}
					buyNowQuery={buyNowQuery}
				/>
			) : null}
		</WrapperComponent>
	);
}

ServicePlans.defaultProps = {
	colSizes: {
		xs: 24,
		sm: 24,
		md: 8,
		lg: 6,
		xl: 6,
		xxl: 4,
	},
};

export default ServicePlans;
