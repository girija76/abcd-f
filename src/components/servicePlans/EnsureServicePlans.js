import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { forEach, get } from 'lodash';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { useLoadMyServicePlans } from './hooks';

function ServicePlansLoader({
	component: Component,
	lazy,
	select,
	...otherProps
}) {
	const servicesData = useLoadMyServicePlans();

	const selectedProps = useMemo(() => {
		const selectedProps = {};
		forEach(select, (targetPropKey, key) => {
			selectedProps[targetPropKey] = get(servicesData, [key]);
		});
		return selectedProps;
	}, [select, servicesData]);

	if (servicesData.isFetching && !lazy) {
		return (
			<div>
				<Spin icon={<Loading3QuartersOutlined style={{ fontSize: '4rem' }} />} />
				<div>Loading...</div>
			</div>
		);
	}

	return <Component {...otherProps} {...selectedProps} />;
}

export const selectSubscribedServiceIds = {
	subscribedServiceIds: 'subscribedServiceIds',
};
export const selectServiceIds = {
	serviceIds: 'serviceIds',
};

function ensureServicePlansLoad(component, options) {
	const lazy = get(options, ['lazy'], false);
	const select = get(options, ['select'], {});
	return function(props) {
		return (
			<ServicePlansLoader
				select={select}
				component={component}
				lazy={lazy}
				{...props}
			/>
		);
	};
}

export default ensureServicePlansLoad;
