import axios from 'axios';
import {
	setOverallAssessmentAnalysis,
	setUserAssessmentAnalytics,
} from 'components/api/ApiAction';
import Loading from 'components/extra/Loading';
import { URLS } from 'components/urls';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userSelector } from 'selectors/user';
import { findUserAverage } from './utils';
import Title from 'antd/lib/typography/Title';

function Overall() {
	const UserAnalytics = useSelector(state => state.api.UserAssessment);
	const OverallAnalytics = useSelector(state => state.api.OverallAssessment);
	const dispatch = useDispatch();
	const phase = useSelector(userSelector).subscriptions[0].subgroups[0].phases[0]
		.phase._id;
	const params = new URLSearchParams(window.location.search);
	const history = useHistory();
	const user = params.get('uid');
	if (!user || user === undefined || user.trim() === '') {
		history.push(URLS.dashboard);
	}
	const [userAverage, setUserAverage] = React.useState({});

	React.useEffect(() => {
		axios
			.post(`${URLS.backendAnalytics}/assessment/overall/user`, {
				user,
			})
			.then(async res => {
				dispatch(setUserAssessmentAnalytics(await res.data));
			})
			.catch(err => {
				console.log(err);
			});
		axios
			.post(`${URLS.backendAnalytics}/assessment/overall/phase`, {
				phase,
			})
			.then(async res => {
				dispatch(setOverallAssessmentAnalysis(res.data));
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	React.useEffect(() => {
		setUserAverage(findUserAverage(UserAnalytics));
	}, [UserAnalytics]);

	return (
		<>
			{/* {!userAverage ? (
				<Loading simple />
			) : (
				<OverallBar
					title="Analytics"
					data={getDataPoints(userAverage)}
					type="column"
				/>
			)} */}
			<Title level={2} style={{ textAlign: 'center', margin: '2rem 0' }}>
				<Loading simple text="  " />
				Work in Progress, will updating feature on 25 April 2022!
			</Title>
		</>
	);
}

export default Overall;
