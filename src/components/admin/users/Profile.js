import { Button, Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import PurchesedPlans from 'components/admin/users/Plans';
import Loading from 'components/extra/Loading';
import { URLS } from 'components/urls';
import React from 'react';
import { BiArrowBack, BiSearchAlt } from 'react-icons/bi';
import { useHistory } from 'react-router';
import { isAtLeastModerator } from 'utils/auth';
import { Col, Row, Form, DatePicker, Table } from 'antd';
import { Grades } from './Grades';
import { findUserAverage } from '../analysis/utils';

// const { TabPane } = Tabs;

const UserProfile = ({ userId, role }) => {
	const history = useHistory();

	const axiosCfg = {
		withCredentials: true,
		headers: {
			authorization: `Token ${window.localStorage.getItem('token')}`,
		},
	};

	const [userLoading, setUserLoading] = React.useState(true);
	const [userData, setUserData] = React.useState({});
	const [overall, setOverall] = React.useState({});

	const getUserData = React.useCallback(async () => {
		setUserLoading(true);
		await axios
			.all([
				axios.get(`${URLS.backendAnalytics}/user/getData/${userId}`, axiosCfg),
				axios.post(
					`${URLS.backendAnalytics}/assessment/overall/user`,
					{ user: userId },
					axiosCfg
				),
			])
			.then(res => {
				setUserData(res[0].data);
				setOverall(findUserAverage(res[1].data));
			})
			.catch(err => console.log(err));
		setUserLoading(false);
	}, [setUserData, setOverall]);

	React.useEffect(() => {
		getUserData();
	}, [getUserData]);

	return (
		<>
			{!userLoading ? (
				<div
					style={{
						padding: '2rem',
					}}
				>
					<Card
						style={{
							marginBottom: 12,
						}}
					>
						<div
							id={'header'}
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Button
								onClick={() =>
									history.push(
										userData.role === 'user'
											? '/dashboard/admin/users'
											: '/dashboard/admin/teachers'
									)
								}
							>
								<BiArrowBack />
							</Button>
							<Title level={4} style={{ margin: 13 }}>
								{userData.name}'s Profile
							</Title>
						</div>
						<Row
							style={{
								textAlign: 'center',
							}}
						>
							<Col xs={24} lg={12} xl={8}>
								<Title level={5}>Email : {userData.email}</Title>
							</Col>
							<Col xs={24} lg={12} xl={8}>
								<Title level={5}>Mobile : {userData.mobileNumber}</Title>
							</Col>
							<Col xs={24} lg={12} xl={8}>
								<Title level={5}>
									Phases : {userData.subscriptions[0].subgroups[0].phases[0].phase.name}
								</Title>
							</Col>
							{userData.oldPhases && userData.oldPhases.length > 0 && (
								<Col xs={24} lg={24} xl={24}>
									<Title level={5}>
										OldPhases : {userData.oldPhases.map(phase => phase.name + ' ')}
									</Title>
								</Col>
							)}
						</Row>
					</Card>
					{userData.role === 'user' && <Grades user={userData} overall={overall} />}

					{isAtLeastModerator(role) && userData.role === 'user' && (
						<Card
							title={'Purchased Plans'}
							style={{
								marginBottom: 12,
							}}
						>
							<PurchesedPlans id="plans" userd={userId} />
						</Card>
					)}
				</div>
			) : (
				<Loading simple />
			)}
		</>
	);
};

export default UserProfile;
