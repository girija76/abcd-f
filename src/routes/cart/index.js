import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CartDialog from 'components/payment/Cart';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const CartPage = ({ history: { goBack } }) => {
	const query = useQuery();
	const [initiallySelectedServices, setInitiallySelectedServices] = useState(
		undefined
	);
	const initiallySelectedServicesString = query.get('i');
	const initiallySelectedServicePlanId = query.get('sp');
	useEffect(() => {
		if (!initiallySelectedServices) {
			try {
				setInitiallySelectedServices(JSON.parse(initiallySelectedServicesString));
			} catch (e) {}
		}
	}, [initiallySelectedServicesString, initiallySelectedServices]);
	return (
		<CartDialog
			visible
			onCancel={goBack}
			initiallySelectedServices={initiallySelectedServices}
			initiallySelectedServicePlanId={initiallySelectedServicePlanId}
		/>
	);
};

export default CartPage;
