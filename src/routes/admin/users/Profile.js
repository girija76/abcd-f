import UserProfile from 'components/admin/users/Profile';
import React from 'react';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';

const UserProfileRoute = () => {
	const params = new URLSearchParams(window.location.search);
	const userId = params.get('uid');
	const role = useSelector(roleSelector);

	return <UserProfile userId={userId} role={role} />;
};

export default UserProfileRoute;
