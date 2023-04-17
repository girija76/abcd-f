import React from 'react';
import { Button, List, message } from 'antd';
import User from '../users/User';
import axios from 'axios';
import { URLS } from 'components/urls';
import { isArray } from 'lodash';
import { AddUser } from './Create';
import { AiOutlineEye } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';

function ParentList({ isAdding, onCancelAdding }) {
	const [isFetching, setIsFetching] = React.useState(false);
	const [users, setUsers] = React.useState([]);
	const history = useHistory();

	const getParent = React.useCallback(async () => {
		setIsFetching(true);
		await axios
			.get(`${URLS.backendUsers}/getParents`, {
				withCredentials: true,
				headers: {
					authorization: `Token ${window.localStorage.getItem('token')}`,
				},
			})
			.then(res => {
				const data = res.data;
				if (isArray(data)) {
					setUsers(data);
				} else {
					message.error('Error while fetching users');
				}
			})
			.catch(err => {
				message.error('Error while fetching users');
			})
			.finally(() => setIsFetching(false));
	}, [setIsFetching]);

	React.useEffect(() => {
		getParent();
	}, [getParent]);

	return (
		<div
			style={{
				padding: '2rem',
			}}
		>
			<AddUser
				isAdding={isAdding}
				onCancel={onCancelAdding}
				role="parent"
				refresh={() => getParent()}
			/>
			<List loading={isFetching} pagination={{ pageSize: 10, size: 'small' }}>
				{users.map(user => {
					return (
						<User
							style={{ padding: 12 }}
							key={user._id}
							user={user}
							extra={
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										height: '100%',
										alignItems: 'center',
									}}
								>
									<Button
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											marginRight: 8,
										}}
										onClick={() => {
											history.push({
												pathname: `/dashboard/admin/users/profile/user?uid=${user._id}`,
												state: {
													userId: user._id,
													name: user.name,
												},
											});
										}}
										icon={
											<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 8 }} />
										}
									>
										Profile
									</Button>
								</div>
							}
						/>
					);
				})}
			</List>
		</div>
	);
}

export default ParentList;
