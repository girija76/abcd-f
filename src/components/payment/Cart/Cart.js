import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { filter, reduce } from 'lodash';
import classnames from 'classnames';
import { every, forEach, isEmpty, map, some } from 'lodash';
import {
	Alert,
	Button,
	Checkbox,
	Col,
	Form,
	Grid,
	Input,
	Result,
	Row,
	Spin,
	Typography,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { AiOutlineFrown as FrownOutlined } from 'react-icons/ai';

import { URLS } from 'components/urls';
import createPaymentsAPI from 'apis/payments';
import StartOrderPaymentFlow from 'components/payment/StartOrderPaymentFlow';
import './cart.scss';
import ReactMarkdown from 'react-markdown';
import { useLoadServicePlans } from 'components/servicePlans/hooks';
import { calculateOfferDiscount, getBestOffer } from 'utils/servicePlan';
import OfferText from '../components/OfferText';
import Currency from '../components/Currency';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const paymentsApi = createPaymentsAPI();
const { createOrderForCart, getDiscountedPrice } = paymentsApi;

const createTextForMarkdown = t => {
	return t;
	// return t.replace(/\n/g, '<br/>');
};

const Amount = ({ number }) => {
	const a = Math.round((number + Number.EPSILON) * 100) / 100;
	return <>{a}</>;
};

const ServicePlan = ({
	coupon,
	footer,
	servicePlan,
	isSelected,
	onSelect,
	onUnselect,
	couponState,
	offer,
}) => {
	const multipleServices = servicePlan.services.length > 1;
	const basePrice = servicePlan.basePrice;
	const offerDiscount = useMemo(() => calculateOfferDiscount(offer, basePrice), [
		offer,
		basePrice,
	]);
	const priceAfterOffer = basePrice - offerDiscount;
	const discountedAmount =
		couponState && couponState.success ? couponState.res.amount : priceAfterOffer;
	const screens = useBreakpoint();

	return (
		<div
			className={classnames('cart-list-item', {
				singleService: !multipleServices,
			})}
		>
			<div className="selection-side">
				<Checkbox
					size="large"
					checked={isSelected}
					onChange={e => (e.target.checked ? onSelect() : onUnselect())}
				/>
			</div>
			<div className="detail-side">
				<Row align="middle" justify="space-between" className="service-plan-detail">
					<Col xs={24} sm={18}>
						<Title
							ellipsis={{ rows: 3 }}
							style={{ marginBottom: 0, color: '#3F51B5' }}
							level={4}
						>
							{servicePlan.name}
						</Title>
					</Col>
					<Col className="price">
						<Row>
							<Col style={{ textAlign: screens.xs ? 'left' : 'right' }} xs={24}>
								<Text
									className={classnames('price-item', {})}
									style={{ fontSize: 18, textAlign: 'right' }}
								>
									<Currency>{servicePlan.currency}</Currency>
									{discountedAmount / 100}
								</Text>
							</Col>
						</Row>
						<Text
							className={classnames('price-item', {
								hide: !(offerDiscount > 0),
							})}
							style={{ color: '#388e3c', marginRight: 8, fontWeight: 600 }}
						>
							<OfferText offer={offer} />
						</Text>
						<Text
							className={classnames('price-item', {
								crossed: discountedAmount !== basePrice,
								hide: discountedAmount === basePrice,
							})}
							disabled={discountedAmount !== basePrice}
							delete={discountedAmount !== basePrice}
						>
							<Currency>{servicePlan.currency}</Currency>
							{basePrice / 100}
						</Text>
					</Col>
				</Row>
				<div className="service-list">
					{servicePlan.services.map(service => (
						<Row className="service-detail" key={service._id}>
							<Col xs={24} className="name">
								<Title style={{ marginBottom: 0 }} level={4}>
									{service.name}
								</Title>
							</Col>
							<Col xs={24} className="description">
								<ReactMarkdown
									escapeHtml={false}
									source={createTextForMarkdown(service.description)}
								/>
							</Col>
						</Row>
					))}
				</div>
			</div>
			{footer ? <div className="cart-list-item-footer">{footer}</div> : null}
		</div>
	);
};

const addPrices = (
	servicePlans,
	offerDiscountsByServicePlanId,
	discountsByServicePlanId
) => {
	const prices = { INR: 0 };
	servicePlans &&
		servicePlans.forEach(servicePlan => {
			const offerDiscount = isNaN(offerDiscountsByServicePlanId[servicePlan._id])
				? 0
				: offerDiscountsByServicePlanId[servicePlan._id];
			if (!prices[servicePlan.currency]) {
				prices[servicePlan.currency] = 0;
			}
			let discountedAmount = 0;
			try {
				discountedAmount = discountsByServicePlanId[servicePlan._id].success
					? discountsByServicePlanId[servicePlan._id].res.amount
					: servicePlan.basePrice - offerDiscount;
			} catch (e) {
				discountedAmount = servicePlan.basePrice - offerDiscount;
			}
			prices[servicePlan.currency] += discountedAmount;
		});
	// return Object.keys(prices)
	// 	.map(currency => `${currency} ${prices[currency] / 100}`)
	// 	.join(', ');
	return prices.INR / 100;
};

const Cart = ({
	onCancel,
	initiallySelectedServices,
	initiallySelectedServicePlanId,
}) => {
	const [couponCode, setCouponCode] = useState('');
	const [order, setOrder] = useState(null);
	const [orderTotal, setOrderTotal] = useState('');
	const [servicePlansById, setServicePlansById] = useState({});
	const [creatingOrder, setCreatingOrder] = useState(false);
	const [orderCreationError, setOrderCreationError] = useState(null);
	const [couponError, setCouponError] = useState(null);
	const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
	const [appliedCoupon, setAppliedCoupon] = useState(null);
	const [discountsByServicePlanId, setDiscountsByServicePlanId] = useState({});
	const [
		offerDiscountsByServicePlanId,
		setofferDiscountsByServicePlanId,
	] = useState({});
	const [selectedServicePlans, setSelectedServicePlans] = useState([]);
	const [
		selectedOfferIdsByServicePlanId,
		setSelectedOfferIdsByServicePlanId,
	] = useState({});
	const [offersById, setOffersById] = useState({});

	const basePriceTotal = useMemo(
		() =>
			reduce(
				selectedServicePlans,
				(result, value, key) => {
					console.log(result, value, key, servicePlansById[value]);
					return result + servicePlansById[value].basePrice;
				},
				0
			) / 100,
		[selectedServicePlans, servicePlansById]
	);

	const {
		items: servicePlans,
		isLoading: isFetching,
		failureCount,
		refetch,
	} = useLoadServicePlans();

	const addSelection = id => {
		if (!selectedServicePlans.includes(id)) {
			setSelectedServicePlans([...selectedServicePlans, id]);
		}
	};
	const removeSelection = id => {
		setSelectedServicePlans(selectedServicePlans.filter(i => i !== id));
	};
	const handleSubmit = useCallback(
		e => {
			setCreatingOrder(true);
			setOrderCreationError(null);
			const offersByServicePlanId = {};
			forEach(selectedOfferIdsByServicePlanId, (offerId, servicePlanId) => {
				if (offerId) {
					offersByServicePlanId[servicePlanId] = offerId;
				}
			});
			createOrderForCart({
				servicePlans: selectedServicePlans,
				couponCode: appliedCoupon ? couponCode : undefined,
				offersByServicePlanId,
			})
				.then(order => {
					setCreatingOrder(false);
					setOrder(order);
				})
				.catch(error => {
					console.log('error occurred', error, error && error.message);
					setOrderCreationError(
						(error && error.message) || 'Unknown error occurred'
					);
					setCreatingOrder(false);
				});
		},
		[
			appliedCoupon,
			couponCode,
			selectedOfferIdsByServicePlanId,
			selectedServicePlans,
		]
	);
	const applyCoupon = useCallback(() => {
		setCouponError(null);
		setIsApplyingCoupon(true);
		Promise.all(
			selectedServicePlans.map(
				servicePlan =>
					new Promise((resolve, reject) => {
						getDiscountedPrice({
							couponCode,
							servicePlan,
							offer: selectedOfferIdsByServicePlanId[servicePlan] || '',
						})
							.then(res => {
								resolve({ success: true, res, servicePlan });
							})
							.catch(error => {
								resolve({ success: false, error, servicePlan });
							});
					})
			)
		)
			.then(items => {
				let error;
				if (
					!every(items, item => {
						if (!item.success) {
							error = item.error;
						}
						return item.success;
					})
				) {
					throw error;
				}
				setIsApplyingCoupon(false);
				setAppliedCoupon(couponCode);
				const discountsByServicePlanId = {};
				forEach(items, item => {
					discountsByServicePlanId[item.servicePlan] = item;
				});
				setDiscountsByServicePlanId(discountsByServicePlanId);
			})
			.catch(error => {
				setCouponError(error.message || 'Unable to apply this coupon');
				setIsApplyingCoupon(false);
			});
	}, [couponCode, selectedOfferIdsByServicePlanId, selectedServicePlans]);
	const handleApplyCouponClick = e => {
		applyCoupon();
	};
	useEffect(() => {
		setOrderTotal(
			addPrices(
				selectedServicePlans.map(id => servicePlansById[id]),
				offerDiscountsByServicePlanId,
				discountsByServicePlanId
			)
		);
	}, [
		selectedServicePlans,
		servicePlansById,
		discountsByServicePlanId,
		offerDiscountsByServicePlanId,
	]);
	useEffect(() => {
		setAppliedCoupon(null);
		const offerDiscountsByServicePlanId = {};
		map(selectedServicePlans, servicePlanId => {
			offerDiscountsByServicePlanId[servicePlanId] = calculateOfferDiscount(
				offersById[selectedOfferIdsByServicePlanId[servicePlanId]],
				servicePlansById[servicePlanId].basePrice
			);
		});
		setofferDiscountsByServicePlanId(offerDiscountsByServicePlanId);
	}, [
		offersById,
		selectedOfferIdsByServicePlanId,
		selectedServicePlans,
		servicePlansById,
	]);
	useEffect(() => {
		const servicePlansById = {};
		const bestOfferIdsByServicePlanId = {};
		const offersById = {};
		servicePlans &&
			servicePlans.forEach(servicePlan => {
				const { offers, ...servicePlanExceptOffers } = servicePlan;
				servicePlansById[servicePlan._id] = servicePlanExceptOffers;
				const bestOffer = getBestOffer(offers, servicePlan.basePrice);
				bestOfferIdsByServicePlanId[servicePlan._id] = bestOffer
					? bestOffer._id
					: null;
				forEach(offers, offer => {
					offersById[offer._id] = offer;
				});
			});
		setOffersById(offersById);
		setSelectedOfferIdsByServicePlanId(bestOfferIdsByServicePlanId);
		setServicePlansById(servicePlansById);
	}, [servicePlans]);
	useEffect(() => {
		if (
			isEmpty(selectedServicePlans) &&
			!isEmpty(initiallySelectedServices) &&
			Array.isArray(initiallySelectedServices)
		) {
			const newlySelectedServicePlans = [];
			map(servicePlansById, servicePlan => {
				some(servicePlan.services, service => {
					if (
						initiallySelectedServices.includes(service.machineName) ||
						initiallySelectedServices.includes(service._id)
					) {
						newlySelectedServicePlans.push(servicePlan._id);
						return true;
					}
					return false;
				});
			});
			setSelectedServicePlans(newlySelectedServicePlans);
		}
		if (initiallySelectedServicePlanId) {
			const newlySelectedServicePlans = [];
			map(servicePlansById, servicePlan => {
				if (servicePlan._id === initiallySelectedServicePlanId) {
					newlySelectedServicePlans.push(servicePlan._id);
				}
			});
			setSelectedServicePlans(newlySelectedServicePlans);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		initiallySelectedServices,
		servicePlansById,
		initiallySelectedServicePlanId,
	]);

	useEffect(() => {
		if (!appliedCoupon) {
			setDiscountsByServicePlanId(null);
		}
	}, [appliedCoupon]);

	const filteredSelectedPlans = useMemo(
		() => filter(servicePlans, s => selectedServicePlans.indexOf(s._id) > -1),
		[servicePlans, selectedServicePlans]
	);

	return isFetching ? (
		<div style={{ textAlign: 'center', padding: 40 }}>
			<div style={{ marginBottom: 16 }}>
				<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
			</div>
			<div>Just a moment...</div>
		</div>
	) : failureCount ? (
		<div>
			<div>Failed to fetch</div>
			<button onClick={refetch}>Retry</button>
		</div>
	) : (
		<div className="cart">
			<div className="cart-header">
				<h1>My Cart ({selectedServicePlans.length})</h1>
			</div>

			{filteredSelectedPlans.length ? (
				<div className="cart-list">
					{filteredSelectedPlans.map(servicePlan => (
						<ServicePlan
							couponState={
								true
									? null
									: discountsByServicePlanId && discountsByServicePlanId[servicePlan._id]
							}
							isSelected={selectedServicePlans.includes(servicePlan._id)}
							onSelect={() => addSelection(servicePlan._id)}
							onUnselect={() => removeSelection(servicePlan._id)}
							key={servicePlan._id}
							servicePlan={servicePlan}
							offer={offersById[selectedOfferIdsByServicePlanId[servicePlan._id]]}
							footer={
								<Row justify="center">
									<Button
										block
										onClick={() => removeSelection(servicePlan._id)}
										danger
										type="link"
										size="large"
									>
										Remove from cart
									</Button>
								</Row>
							}
							offers={servicePlan.offers}
						/>
					))}
				</div>
			) : (
				<div className="cart-empty-message">
					<Result
						icon={<FrownOutlined style={{ fontSize: '3em' }} />}
						title="Your cart is empty!"
					/>
				</div>
			)}

			{orderCreationError ? (
				<div className="cart-message-container">
					<Alert type="error" message={orderCreationError} />
				</div>
			) : null}
			{filteredSelectedPlans.length ? (
				<Form style={{ margin: '12px 0' }} onFinish={handleApplyCouponClick}>
					<Row gutter={8} className="cart-coupon-container">
						{appliedCoupon ? null : (
							<Col xs={24} md={16} lg={18}>
								<Input
									size="large"
									placeholder="Coupon code"
									type="text"
									value={couponCode}
									onChange={e => setCouponCode(e.target.value)}
								/>
							</Col>
						)}
						{appliedCoupon ? null : (
							<Col xs={24} md={8} lg={6}>
								<Button
									loading={isApplyingCoupon}
									disabled={isApplyingCoupon}
									type="link"
									size="large"
									block
									onClick={handleApplyCouponClick}
								>
									Apply Coupon
								</Button>
							</Col>
						)}
						{couponError ? (
							<Col xs={24}>
								<Text type="danger">{couponError}</Text>
							</Col>
						) : appliedCoupon ? (
							<Col xs={24}>
								<Row>
									<Col style={{ textAlign: 'center' }} xs={24}>
										<Text style={{ color: 'rgb(56, 142, 60)' }} type="success">
											Coupon has been applied
										</Text>
									</Col>
									<Col style={{ textAlign: 'center', marginTop: 8 }} xs={24}>
										<Button onClick={() => setAppliedCoupon(null)}>Remove Coupon</Button>
									</Col>
								</Row>
							</Col>
						) : null}
					</Row>
				</Form>
			) : null}
			{servicePlans.filter(s => selectedServicePlans.indexOf(s._id) === -1)
				.length > 0 ? (
				<div className="cart-group">
					<div className="cart-group-heading">
						<Title level={4}>Suggestions for you</Title>
					</div>
					<div className="cart-list">
						{servicePlans
							.filter(s => selectedServicePlans.indexOf(s._id) === -1)
							.map(servicePlan => (
								<ServicePlan
									isSelected={selectedServicePlans.includes(servicePlan._id)}
									onSelect={() => addSelection(servicePlan._id)}
									onUnselect={() => removeSelection(servicePlan._id)}
									key={servicePlan._id}
									servicePlan={servicePlan}
									offer={offersById[selectedOfferIdsByServicePlanId[servicePlan._id]]}
									footer={
										<Row justify="center">
											<Button
												block
												onClick={() => addSelection(servicePlan._id)}
												type="link"
												size="large"
											>
												Add to cart
											</Button>
										</Row>
									}
									offers={servicePlan.offers}
								/>
							))}
					</div>
				</div>
			) : null}
			<Row className="cart-actions" align="middle">
				<Col xs={12} sm={12} md={12}>
					<div className="cart-order-total">
						<Currency>INR</Currency>
						{orderTotal}
					</div>
					{basePriceTotal > orderTotal ? (
						<div style={{ color: 'green' }} className="cart-order-total original">
							<Currency>INR</Currency>
							{basePriceTotal !== orderTotal ? (
								<>
									<Amount number={basePriceTotal - orderTotal} /> off
								</>
							) : (
								''
							)}
						</div>
					) : null}
				</Col>
				<Col xs={12} sm={12} md={12}>
					<Button
						loading={creatingOrder}
						disabled={creatingOrder || selectedServicePlans.length === 0}
						size="large"
						className="cart-buy-now-button"
						block
						type="primary"
						onClick={handleSubmit}
					>
						Buy now
					</Button>
				</Col>
			</Row>
			{order ? (
				<div className="cart-order-payment-flow-starter">
					<StartOrderPaymentFlow
						callbackUrl={`${window.location.origin}${URLS.learningCenter}`}
						submitOnMount
						orderId={order._id}
					/>
				</div>
			) : null}
		</div>
	);
};

Cart.propTypes = {
	initiallySelectedServices: PropTypes.arrayOf(PropTypes.string),
	initiallySelectedServicePlanId: PropTypes.string,
};

Cart.defaultProps = {
	initiallySelectedServices: [],
};

const CartDialog = ({ visible, onCancel, ...otherProps }) => {
	return (
		<Modal
			centered
			width={700}
			contentLabel="Buy courses"
			overlayClassName="cart-modal"
			style={{
				content: {
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					padding: 0,
					border: 'none',
					position: 'fixed',
					zIndex: 1001,
					borderRadius: 0,
				},
			}}
			isOpen={visible}
			footer={null}
			onRequestClose={onCancel}
		>
			<Cart {...otherProps} />
		</Modal>
	);
};

export default CartDialog;
// export default Cart;
