import React from 'react';
import { useSelector } from 'react-redux';
import { roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';
import UserAccount from './Account';
import AdminPhase from './AdminPhase';
import './styles.scss';

function Switcher() {
	const role = useSelector(roleSelector);

	return isAtLeastMentor(role) ? <AdminPhase /> : <UserAccount />;
}

export default Switcher;
