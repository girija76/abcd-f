import { Button, Input, List, Space } from 'antd';
import userApi from 'apis/user';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { useDebounce } from 'utils/hooks/debounce';
import { getViewAsPhase } from 'utils/viewAs';
import User from './User';
import ViewScoreboardButton from './ViewScoreboard';
import { enableScoreboard } from 'utils/config';
import { useHistory } from 'react-router';
import { AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import ViewGradesButton from './ViewGrades';
import ViewAttendanceButton from './ViewAttendance';
import ViewReportButton from './ViewReport';
import { AddUser } from '../teachers/Create';

function ListUsers({ isAdding, onCancel }) {
	const history = useHistory();
	const [query, setQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);
	const pageSize = 100;
	const params = useMemo(
		() => ({
			limit: pageSize,
			phases: [phaseId],
			q: query,
			select: ['dp'],
		}),
		[pageSize, phaseId, query]
	);
	const debouncedParams = useDebounce(params, 1000);
	const { data, isFetching } = useQuery(
		['users-of-phase', debouncedParams, currentPage, pageSize],
		() =>
			userApi.listUsers(
				{
					...debouncedParams,
					skip: (currentPage - 1) * pageSize,
				},
				{ roles: ['user'] }
			),
		{
			staleTime: 6e5,
		}
	);
	const { items: users, count } = useMemo(() => (data ? data : {}), [data]);
	return (
		<div style={{ padding: 16 }}>
			<AddUser isAdding={isAdding} onCancel={onCancel} role="user" />
			<Space style={{ display: 'flex' }} direction="vertical" size="middle">
				<div>
					<Input
						size="large"
						placeholder="Search"
						onChange={e => setQuery(e.target.value)}
						value={query}
					/>
				</div>
				<div>Total {count} students</div>
				<div>
					<List
						loading={isFetching}
						pagination={{
							onChange: pageNumber => setCurrentPage(pageNumber),
							total: count,
							pageSize,
							current: currentPage,
							size: 'small',
						}}
						bordered
						dataSource={users}
						renderItem={user => (
							<User
								key={user._id}
								user={user}
								extra={
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end',
											height: '100%',
										}}
									>
										<Space style={{ margin: 0 }}>
											<Button
												style={{ display: 'inline-flex', alignItems: 'center', margin: 0 }}
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
													<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />
												}
											>
												Profile
											</Button>
											<ViewAttendanceButton _id={user._id} name={user.name} />
											<ViewGradesButton _id={user._id} name={user.name} />
											<ViewReportButton
												_id={user._id}
												name={user.name}
												username={user.username}
											/>

											{enableScoreboard ? (
												<ViewScoreboardButton _id={user._id} name={user.name} />
											) : null}
										</Space>
									</div>
								}
							/>
						)}
					/>
				</div>
			</Space>
		</div>
	);
}

export default ListUsers;
