import React from 'react';
import { isEmpty } from 'lodash';
import Currency from './Currency';

const OfferText = ({ offer }) => {
	if (isEmpty(offer)) {
		return null;
	}
	if (offer.discount.unit === 'absolute') {
		// maximum discount makes no sense when discount is absolute
		return (
			<>
				<Currency>INR</Currency>
				{offer.discount.value / 100} off
			</>
		);
	} else if (offer.discount.unit === 'percentage') {
		return <>{offer.discount.value}% off</>;
	}
};

export default OfferText;
