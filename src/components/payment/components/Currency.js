import React from 'react';

const Currency = ({ children }) => {
	if (children === 'INR') {
		return <>&#8377;</>;
	}
	return <>{children}</>;
};

export default Currency;
