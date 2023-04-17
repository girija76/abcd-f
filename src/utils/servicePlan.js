import { map } from 'lodash';

export const calculateOfferDiscount = (offer, basePrice) => {
	if (!offer) {
		return 0;
	}
	if (offer.discount.unit === 'absolute') {
		// maximum discount makes no sense when discount is absolute
		return Math.min(basePrice, offer.discount.value);
	} else if (offer.discount.unit === 'percentage') {
		const maxDiscount =
			offer.discount.maximumAmount === -1
				? basePrice
				: offer.discount.maximumAmount;
		return Math.min((basePrice * offer.discount.value) / 100, maxDiscount);
	}
	return 0;
};

export const getBestOffer = (offers, basePrice) => {
	let bestOffer = null;
	let maxDiscount = 0;
	map(offers, offer => {
		const discount = calculateOfferDiscount(offer, basePrice);
		if (discount > maxDiscount) {
			maxDiscount = discount;
			bestOffer = offer;
		}
	});
	return bestOffer;
};
