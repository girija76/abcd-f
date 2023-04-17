import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AssessmentDetails from './AssessmentDetails';
import AssessmentAction from './AssessmentAction';

import Topbar from '../courses/Topbar';
import Footer from '../landingPage/LandingPageFooter';

import { URLS } from '../urls';

import { LoadingOutlined } from '@ant-design/icons';

import NotFound from 'components/404';

import '../resources/Resources.css';

import './style.css';
import { name as clientName } from 'utils/config';
import { useSelector } from 'react-redux';
import { accountUserListSelector } from 'selectors/userAccount';
import { forEach, get, intersection, keys, size } from 'lodash';
import createUserAccountApi from 'apis/userAccount';
import { userIdSelector } from 'selectors/user';

const userAccountApi = createUserAccountApi();
const Assessment = () => {
	const [state, setState] = useState({
		loaded: false,
		assessmentWrapper: null,
		assessmentCore: null,
		isLoggedIn: false,
		accessAllowed: false,
		isAlreadyAttempted: false,
		isAvailableForPhase: true,
		topicMap: {},
		error: '',
		phaseDiff: true,
	});
	const refresh = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const wrapperId = searchParams.get('id');
		if (wrapperId) {
			fetch(`${URLS.backendAssessment}/getassessment/${wrapperId}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})
				.then(resposne => {
					resposne
						.json()
						.then(resposneJson => {
							if (resposneJson.success) {
								setState({
									success: true,
									assessmentWrapper: resposneJson.assessmentWrapper,
									assessmentCore: resposneJson.assessmentCore,
									isLoggedIn: resposneJson.isLoggedIn,
									accessAllowed: resposneJson.accessAllowed,
									isAlreadyAttempted: resposneJson.isAlreadyAttempted,
									topicMap: resposneJson.topicMap,
									isAvailableForPhase: resposneJson.isAvailableForPhase,
									loaded: true,
								});
							} else {
								setState({
									loaded: true,
									error: 'Something wrong. Please contact support@prepleaf.com.',
								});
							}
						})
						.catch(() => {
							setState({
								loaded: true,
								error: 'Something wrong. Please contact support@prepleaf.com.',
							});
						});
				})
				.catch(() => {
					setState({
						loaded: true,
						error: 'Something wrong. Please contact support@prepleaf.com.',
					});
				});
		} else {
			setState({ loaded: true, error: 'Invalid Test Url' });
		}
	};

	useEffect(() => {
		refresh();
	}, []);

	const {
		loaded,
		success,
		assessmentWrapper,
		assessmentCore,
		isLoggedIn,
		accessAllowed,
		topicMap,
		isAlreadyAttempted,
		isAvailableForPhase,
	} = state;

	const assessmentAvailableInPhaseIds = useMemo(
		() =>
			((assessmentWrapper && assessmentWrapper.phases) || []).map(
				({ phase }) => phase
			),
		[assessmentWrapper]
	);
	const users = useSelector(accountUserListSelector);
	const currentUserId = useSelector(userIdSelector);
	const userByPhaseId = useMemo(() => {
		const userByPhaseId = {};
		forEach(users, user => {
			forEach(get(user, ['phases']), phase => {
				userByPhaseId[phase._id] = user._id;
			});
		});
		return userByPhaseId;
	}, [users]);

	useEffect(() => {
		if (
			!isAvailableForPhase &&
			size(intersection(keys(userByPhaseId), assessmentAvailableInPhaseIds))
		) {
			let switchToUser = null;
			forEach(assessmentAvailableInPhaseIds, availableInPhase => {
				if (userByPhaseId[availableInPhase] && switchToUser !== currentUserId) {
					switchToUser = userByPhaseId[availableInPhase];
				}
			});
			if (switchToUser) {
				userAccountApi.switchUser(switchToUser).then(() => {
					window.location.reload();
				});
			}
		}
	}, [
		accessAllowed,
		assessmentAvailableInPhaseIds,
		currentUserId,
		isAvailableForPhase,
		userByPhaseId,
	]);

	return (
		<div>
			{!loaded ? (
				<div style={{ textAlign: 'center', marginTop: '30vh' }}>
					<LoadingOutlined style={{ fontSize: 24 }} />
				</div>
			) : success ? (
				<div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
					<Helmet>
						<title>
							{assessmentWrapper.name} - {clientName}
						</title>
						<meta
							name="description"
							content="Online Test - Trusted by thousands of students."
						/>
					</Helmet>
					<Topbar
						isLoggedIn={isLoggedIn}
						position="relative"
						linkColor="#333"
						background="#e0e0e0"
					/>
					<div>
						<div
							style={{
								minHeight: 'calc(100vh - 92px)',
								display: 'flex',
								justifyContent: 'center',
							}}
							className="assessment-details-action-wrapper"
						>
							<div className="resource-outer-wrapper">
								<div
									style={{
										display: 'flex',
										paddingTop: 0,
										justifyContent: 'space-evenly',
									}}
									className="course-structure-wrapper"
								>
									<div
										style={{
											flex: 2,
											backgroundColor: 'white',
											border: '1px solid #dadada',
											borderRadius: 4,
										}}
										className="resource-inner-wrapper"
									>
										<AssessmentDetails
											assessmentWrapper={assessmentWrapper}
											assessmentCore={assessmentCore}
											topicMap={topicMap}
										/>
									</div>
								</div>
							</div>
							<AssessmentAction
								isLoggedIn={isLoggedIn}
								accessAllowed={accessAllowed}
								isAlreadyAttempted={isAlreadyAttempted}
								isAvailableForPhase={isAvailableForPhase}
								assessmentWrapper={assessmentWrapper}
								assessmentCore={assessmentCore}
								topicMap={topicMap}
							/>
						</div>
					</div>
					<div style={{ backgroundColor: 'white' }}>
						<Footer />
					</div>
				</div>
			) : (
				<NotFound />
			)}
		</div>
	);
};

export default Assessment;
