/* eslint-disable no-nested-ternary */
import React from 'react';
import { isEmpty, reduce } from 'lodash';
import { accessMsgWithRevocationReason, accessMessage } from 'utils/config';

import { InfoCircleTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getRevocationReason } from 'components/libs/lib';

const subscriptionsSelector = state => state.api.UserData.subscriptions;
const createMessage = (template, revocationReason) => {
	return !isEmpty(revocationReason)
		? reduce(
				revocationReason,
				(result, value, key) => {
					return result.replace(new RegExp(`{{${key}}}`, 'gi'), value);
				},
				template
		  )
		: accessMessage;
};

const AccessNotGranted = () => {
	const subscriptions = useSelector(subscriptionsSelector);
	const revocationReason = getRevocationReason(subscriptions);
	return (
		<div
			style={{
				padding: 24,
				fontWeight: 500,
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<InfoCircleTwoTone style={{ fontSize: 18, marginRight: 8 }} />
			{createMessage(accessMsgWithRevocationReason, revocationReason)}
		</div>
	);
};

export default AccessNotGranted;
