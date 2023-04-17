import { Card, Col, Divider, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import Loading from 'components/extra/Loading';
import LazyLoadImageNativeDetector from 'components/LazyLoadImage';
import { URLS } from 'components/urls';
import { capitalize } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from 'selectors/user';
import { axiosCfg } from 'utils/config';

export const PeopleOnLeave = ({ reload, onReload }) => {
	const [todaysLeaves, setTodaysLeaves] = React.useState([]);
	const [leaveLoading, setLeaveLoading] = React.useState(true);
	const UserData = useSelector(userSelector);

	const getPeopleOnLeave = React.useCallback(async () => {
		setLeaveLoading(true);
		if (UserData.role === 'mentor') {
			setTodaysLeaves([]);
		} else {
			await axios
				.post(`${URLS.backendLeaves}/todays-leaves`, {}, axiosCfg)
				.then(res => {
					onReload({ ...reload, peopleOnLeave: false });
					setTodaysLeaves(res.data);
				})
				.catch(err => {
					console.log(err);
				});
		}
		setLeaveLoading(false);
	}, [setTodaysLeaves, setLeaveLoading]);

	React.useEffect(() => {
		if (reload.peopleOnLeave) {
			getPeopleOnLeave();
			onReload({ ...reload, peopleOnLeave: false });
		}
	}, [reload, getPeopleOnLeave]);

	return (
		<>
			{todaysLeaves.length > 0 ? (
				<Card style={{ margin: 5 }}>
					<Title style={{ marginBottom: '2rem' }} level={3}>
						People on Leave
					</Title>
					{leaveLoading ? (
						<Loading simple />
					) : (
						<Row>
							{todaysLeaves.map((leave, key) => {
								return (
									<Col xs={8} lg={6} xl={6} xxl={4} key={key}>
										<Card style={{ margin: '0 1rem', padding: '.5rem 0' }}>
											<LazyLoadImageNativeDetector
												src={leave.user.dp}
												style={{ padding: 0 }}
											/>
											<Divider />
											<p
												style={{
													textAlign: 'center',
													padding: 0,
													margin: 0,
													fontWeight: 600,
												}}
											>
												{leave.user.name} (
												{capitalize(leave.leaveType) +
													' - ' +
													(leave.fullDay ? 'Full' : 'Half')}
												)
											</p>
										</Card>
									</Col>
								);
							})}
						</Row>
					)}
				</Card>
			) : (
				<Card style={{ margin: 5 }}>
					<Title style={{ textAlign: 'center', margin: 0 }} level={4}>
						No Leaves Found Today...
					</Title>
				</Card>
			)}
		</>
	);
};
