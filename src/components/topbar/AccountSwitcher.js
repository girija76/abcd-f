import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	accountUserListSelector,
	userAccountSelector,
} from 'selectors/userAccount';
import { userIdSelector } from 'selectors/user';
import { Select } from 'antd';
import { get, map } from 'lodash';
import createUserAccountApi from 'apis/userAccount';
import { clearUserData } from 'utils/user';
import { BsChevronDown } from 'react-icons/bs';

const userAccountApi = createUserAccountApi();

const DefaultSwitcherComponent = ({ value, onChange, options }) => {
	return (
		<Select
			value={value}
			onChange={onChange}
			suffixIcon={<BsChevronDown color="#000" />}
			bordered={false}
			style={{
				backgroundColor: '#fff',
				boxShadow: '2px 2px 9px 2px rgba(0,0,0,0.09)',
				borderRadius: 8,
			}}
			size="large"
			dropdownMatchSelectWidth={false}
			options={options}
		/>
	);
};

/**
 *
 * @param {function} onSuccess - called on successful account switch, if not passed window.location.reload will be called
 */
function AccountSwitcher({ renderer: RendererComponent, onSuccess }) {
	const userAccount = useSelector(userAccountSelector);
	const users = useSelector(accountUserListSelector);
	const currentUserId = useSelector(userIdSelector);
	const [isSwitching, setIsSwitching] = useState(false);
	const handleSelectUser = userId => {
		setIsSwitching(true);
		userAccountApi
			.switchUser(userId)
			.then(() => {
				setIsSwitching(true);
				clearUserData();
				if (onSuccess) {
					onSuccess();
				} else {
					window.location.reload();
				}
			})
			.catch(() => {
				setIsSwitching(false);
			});
	};
	if (!userAccount || !users || users.length < 2) {
		return null;
	}

	return (
		<RendererComponent
			isSwitching={isSwitching}
			value={currentUserId}
			onChange={handleSelectUser}
			options={map(users, user => ({
				label: get(user, ['phases', 0, 'name']),
				value: get(user, ['_id']),
			}))}
		/>
	);
}

AccountSwitcher.defaultProps = {
	renderer: DefaultSwitcherComponent,
};

export default AccountSwitcher;
