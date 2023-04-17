import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { map } from 'lodash';
import { URLS } from 'components/urls';
import { paymentGatewayOptions } from 'utils/config';

const { backendPayments } = URLS;

const StartOrderPaymentFlow = ({
	callbackUrl,
	orderId: initialOrderId,
	submitOnMount,
}) => {
	const [orderId, setOrderId] = useState(initialOrderId || '');
	const formRef = useRef();
	const handleOrderIdChange = e => {
		setOrderId(e.target.value);
	};
	const handleSubmit = e => {
		console.log('submit');
	};
	useEffect(() => {
		if (submitOnMount) {
			formRef.current.submit();
		}
	}, [submitOnMount]);
	return (
		<form
			ref={formRef}
			method="POST"
			submit={handleSubmit}
			action={`${backendPayments}/service/order/pay`}
		>
			<Form.Item label="Callback Url">
				<Input
					type="text"
					name="callbackUrl"
					value={callbackUrl || window.location.href}
				/>
			</Form.Item>
			<Form.Item label="Order Id">
				<Input
					type="text"
					name="order"
					value={orderId}
					onChange={handleOrderIdChange}
				/>
			</Form.Item>
			{map(paymentGatewayOptions, (value, key) => (
				<input type="hidden" name={`paymentGatewayOptions[${key}]`} value={value} />
			))}
			<Button htmlType="submit">Pay Now</Button>
		</form>
	);
};

export default StartOrderPaymentFlow;
