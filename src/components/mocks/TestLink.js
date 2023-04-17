import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { Card, Modal, notification, Tag, Tooltip } from 'antd';
import { includes } from 'lodash';

import Instructions from '../instructions/Instructions';
import Syllabus from '../instructions/Syllabus';

import {
	parseTimeString,
	parseTestDateTime2,
	getTopicNameMapping,
} from '../libs/lib';

import { URLS } from '../urls';

import { customSyllabus } from '../customSyllabus';

import {
	ProfileTwoTone,
	LockTwoTone,
	InfoCircleTwoTone,
} from '@ant-design/icons';

import './TestLink.css';
import './TestLinks.css';
import dayjs from 'dayjs';
import ensureServicePlansLoad, {
	selectServiceIds,
	selectSubscribedServiceIds,
} from 'components/servicePlans/EnsureServicePlans';
import { isAtLeastMentor } from 'utils/auth';
import Loading from 'components/extra/Loading';

var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function getTotalQuestions(instructions) {
	let total = null;
	instructions.forEach(i => {
		if (total === null && i.type === 'text' && i.instruction) {
			if (i.instruction.indexOf(' questions)') >= 0) {
				const data = i.instruction.split(' questions)')[0].split(' (');
				if (data.length === 2) total = data[1];
			}
		}
	});
	if (total === null) return 'N/A';
	return total;
}

const colors = {
	'Level 1': 'orange',
	'Level 2': 'red',
};

const padZeros = n => (n < 10 ? `0${n}` : `${n}`);

const AvailableFromCountDown = ({ availableFrom, onAvailable }) => {
	const [isCountdownOn, setIsCountdownOn] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(null);
	useEffect(() => {
		const now = Date.now();
		if (availableFrom - now < 60 * 60 * 1000 && availableFrom > now) {
			setIsCountdownOn(true);
			setTimeRemaining(availableFrom - Date.now());
		}
	}, [availableFrom]);
	useEffect(() => {
		if (timeRemaining !== null) {
			const timeoutId = setTimeout(() => {
				setTimeRemaining(availableFrom - Date.now());
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [availableFrom, timeRemaining]);
	useEffect(() => {
		if (timeRemaining !== null && timeRemaining <= 0) {
			onAvailable();
			console.log('onAvailableCalled');
		}
	}, [onAvailable, timeRemaining]);
	const duration = useMemo(
		() => (timeRemaining ? dayjs.duration(timeRemaining) : null),
		[timeRemaining]
	);

	return isCountdownOn
		? `Starts in ${padZeros(duration.minutes())}:${padZeros(duration.seconds())}`
		: 'Starts - ' + parseTestDateTime2(availableFrom);
};

const AdminViewAnalyticsButton = props => {
	const history = useHistory();
	return (
		<span
			onClick={() => {
				history.push(`/dashboard/admin/assessments/stats?wid=${props.id}`);
			}}
		>
			View Analytics
		</span>
	);
};

class TestLink extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			key: 'tab1',
			visible: false,
			regradeLoading: false,
		};
	}

	showInstructions = () => {
		this.setState({ visible: true });
	};

	hideInstructions = () => {
		this.setState({ visible: false });
	};

	showSolution = () => {
		let {
			test: { _id: wid },
		} = this.props;
		this.props.history.push(`${URLS.analysisId}?wid=${wid}`);
	};

	showAnalytics = () => {};

	regrade = wrapperId => {
		this.setState({ regradeLoading: true });

		const token = localStorage.getItem('token');
		fetch(`${URLS.backendAssessment}/gradewrapper/${wrapperId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Token ' + token,
			},
		})
			.then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.setState({ regradeLoading: false });
					});
				} else {
					this.setState({ regradeLoading: false });
				}
			})
			.catch(error => {
				this.setState({ regradeLoading: false });
				console.log(error);
			});
	};

	renderTabContent = () => {
		const { test, status, mode } = this.props;
		const customInstructions = test.core.customInstructions;

		let testUrl = URLS.liveTest;

		let cs = null;
		if (test.core.customSyllabus && test.core.customSyllabus.length) {
			cs = test.core.customSyllabus;
		} else if (customSyllabus[test._id]) {
			cs = customSyllabus[test._id];
		}

		const af = new Date(test.availableFrom).getTime();
		const tn = new Date().getTime();
		const hideSyllabus =
			Array.isArray(test.core.customInstructions) &&
			test.core.customInstructions.length;

		return [
			this.renderTabs(hideSyllabus),
			{
				tab1: (
					<Instructions
						instructions={test.core.instructions}
						sectionInstructions={test.core.sectionInstructions}
						customInstructions={customInstructions}
						id={test._id}
						cost={test.cost}
						reward={test.reward}
						status={status}
						mode={mode}
						testUrl={testUrl}
						disableBegin={af > tn}
					/>
				),
				tab2: <Syllabus syllabus={test.core.syllabus} customSyllabus={cs} />,
			},
		];
	};

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
	};

	renderTabs = hideSyllabus => {
		if (hideSyllabus) {
			return [
				{
					key: 'tab1',
					tab: 'Instructions',
				},
			];
		}
		return [
			{
				key: 'tab1',
				tab: 'Instructions',
			},
			{
				key: 'tab2',
				tab: 'Syllabus',
			},
		];
	};

	render() {
		const {
			test,
			increasedWidth,
			Topics,
			mode,
			classname,
			subscribedServiceIds,
			serviceIds: allServiceIds,
			UserData,
		} = this.props;
		const { key, visible } = this.state;
		const [tabList, contentList] = this.renderTabContent();

		const color = test.submission ? '#f6ffed' : 'rgba(230, 255, 251, 0.35)';

		const TopicNameMapping = getTopicNameMapping(Topics);
		let cs = null;
		if (test.core.customSyllabus && test.core.customSyllabus.length) {
			cs = test.core.customSyllabus;
		} else if (customSyllabus[test._id]) {
			cs = customSyllabus[test._id];
		}

		const miniSyllabus = [];

		if (cs && cs.length) {
			cs.forEach(t => {
				t.subTopics.forEach(st => {
					miniSyllabus.push(st.name);
				});
			});
		} else {
			test.core.syllabus.topics.forEach(topic => {
				topic.subTopics.forEach(subTopic => {
					if (TopicNameMapping[subTopic.id]) {
						miniSyllabus.push(TopicNameMapping[subTopic.id]);
					}
				});
			});
		}

		const serviceIdsNotSubscribed = [];

		let locked = false;
		if (mode !== 'demo' && test.visibleForServices) {
			if (test.visibleForServices.length) locked = true;
			test.visibleForServices.forEach(visibleForService => {
				if (includes(subscribedServiceIds, visibleForService)) {
					locked = false;
				} else if (includes(allServiceIds, visibleForService)) {
					serviceIdsNotSubscribed.push(visibleForService);
				}
			});
		}

		const availableFrom = new Date(test.availableFrom).getTime();
		const availableTill = new Date(test.availableTill).getTime();
		const timeNow = new Date().getTime();
		const expiresOn = test.expiresOn
			? new Date(test.expiresOn).getTime()
			: timeNow + 1000000;

		const className = classname
			? classname
			: increasedWidth
			? 'test-card-2'
			: 'test-card';

		const { FEATURES } = window.config;
		const showTTSyllabus =
			FEATURES && FEATURES.ENABLE_TOPIC_MOCK_SYLLABUS ? true : false;
		return (
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div style={{ flex: 1 }}>
							<Tooltip title={test.name}>
								{test.slang ? test.slang : test.name}
							</Tooltip>
						</div>
						{test.type === 'TOPIC-MOCK' && !showTTSyllabus ? (
							test.difficulty ? (
								<Tag color={colors[test.difficulty]}>{test.difficulty}</Tag>
							) : null
						) : test.type === 'LIVE-TEST' &&
						  !test.submission &&
						  expiresOn > timeNow &&
						  availableFrom > timeNow ? (
							<ProfileTwoTone
								style={{ fontSize: 18 }}
								onClick={this.showInstructions}
							/>
						) : (
							<Tooltip title={miniSyllabus.join(', ')}>
								<ProfileTwoTone style={{ fontSize: 18 }} />
							</Tooltip>
						)}
					</div>
				}
				style={{
					margin: 12,
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 4,
				}}
				headStyle={{ padding: '0px 12px' }}
				bodyStyle={{
					padding: 0,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
				}}
				className={className}
			>
				{this.state.regradeLoading && (
					<Loading text="Wait until we complete regrading" />
				)}
				<div style={{ padding: 12, flex: 1 }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<div>Questions</div>
						<div>{getTotalQuestions(test.core.instructions)}</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<div>Duration</div>
						<div>{parseTimeString(test.core.duration)}</div>
					</div>
					{test.type === 'LIVE-TEST' && availableTill > timeNow ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Started on</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								{parseTestDateTime2(test.availableFrom)}
							</div>
						</div>
					) : null}
					{test.type === 'LIVE-TEST' && availableTill > timeNow ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>End Date</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Tooltip
									title={
										<div style={{ fontSize: 12 }}>
											{parseTestDateTime2(test.availableFrom)} -{' '}
											{parseTestDateTime2(test.availableTill)}
										</div>
									}
									placement="top"
								>
									<InfoCircleTwoTone
										style={{ fontSize: 16, marginRight: 4 }}
										className="end-date-icon"
									/>
								</Tooltip>
								{parseTestDateTime2(test.availableTill)}
							</div>
						</div>
					) : null}
				</div>
				{locked ? (
					<Link
						to={`/dashboard/cart?i=${encodeURIComponent(
							JSON.stringify(serviceIdsNotSubscribed)
						)}`}
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontWeight: 'bold',
							padding: 10,
							borderTop: '1px solid #cdcdcd',
							borderBottomLeftRadius: 3,
							borderBottomRightRadius: 3,
							backgroundColor: 'rgba(150, 150, 150, 0.35)',
							cursor: 'pointer',
						}}
					>
						<LockTwoTone
							style={{ marginRight: 8, fontSize: 18 }}
							twoToneColor="gray"
						/>
						<span>Unlock Now</span>
					</Link>
				) : expiresOn < timeNow && !test.submission ? (
					isAtLeastMentor(UserData.role) ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 'bold',
								padding: 10,
								borderTop: '1px solid #cdcdcd',
								borderBottomLeftRadius: 10,
								borderBottomRightRadius: 10,
								cursor: 'pointer',
								backgroundColor: color,
							}}
						>
							<p
								style={{
									margin: 0,
									fontWeight: 700,
								}}
							>
								<span
									onClick={() => {
										this.regrade(test._id);
									}}
								>
									Regrade
								</span>
								&nbsp;|&nbsp;
								<AdminViewAnalyticsButton id={test._id} />
							</p>
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 'bold',
								padding: 10,
								borderTop: '1px solid #cdcdcd',
								borderBottomLeftRadius: 10,
								borderBottomRightRadius: 10,
								backgroundColor: 'rgba(150, 150, 150, 0.35)',
								cursor: 'pointer',
							}}
						>
							<span>Test Expired</span>
						</div>
					)
				) : availableFrom < timeNow ? (
					<button
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontWeight: 'bold',
							padding: 10,
							border: 'none',
							borderTop: '1px solid #cdcdcd',
							borderBottomLeftRadius: 4,
							borderBottomRightRadius: 4,
							backgroundColor: color,
							cursor: 'pointer',
						}}
						onClick={
							!isAtLeastMentor(UserData.role) && test.onlyCBT && !test.submission
								? () => {}
								: test.submission
								? this.showSolution
								: this.showInstructions
						}
					>
						{isAtLeastMentor(UserData.role) ? (
							<p
								style={{
									margin: 0,
									fontWeight: 700,
								}}
							>
								<span
									onClick={() => {
										this.regrade(test._id);
									}}
								>
									Regrade
								</span>
								&nbsp;|&nbsp;
								<AdminViewAnalyticsButton id={test._id} />
							</p>
						) : (
							<>
								{test.onlyCBT && !test.submission ? (
									<span>This was CBT only</span>
								) : (
									<span>{test.submission ? 'View Analytics' : 'Attempt'}</span>
								)}
							</>
						)}
					</button>
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontWeight: 'bold',
							padding: 10,
							borderTop: '1px solid #cdcdcd',
							borderBottomLeftRadius: 10,
							borderBottomRightRadius: 10,
							backgroundColor: 'rgba(150, 150, 150, 0.35)',
							cursor: 'pointer',
						}}
					>
						<AvailableFromCountDown
							availableFrom={availableFrom}
							onAvailable={() => this.forceUpdate()}
						/>
					</div>
				)}
				<Modal
					title={
						<div>
							<span style={{ fontWeight: 'bolder' }}>{test.name}</span>
							{test.description ? (
								<Tooltip
									title={test.description}
									placement="top"
									overlayClassName="rating-description-tooltip"
								>
									<InfoCircleTwoTone style={{ fontSize: 16, marginLeft: 10 }} />
								</Tooltip>
							) : null}
						</div>
					}
					visible={visible}
					footer={null}
					onCancel={this.hideInstructions}
					bodyStyle={{ padding: 0 }}
					headStyle={{ borderBottom: '0px' }}
					style={{ color: 'blue' }}
					className="instructions-modal"
				>
					<Card
						className="instructions-card"
						headStyle={{ fontSize: 24 }}
						tabList={tabList}
						activeTabKey={key}
						onTabChange={key => {
							this.onTabChange(key, 'key');
						}}
						bordered={false}
						bodyStyle={{ padding: 18 }}
					>
						{contentList[this.state.key]}
					</Card>
				</Modal>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	Topics: state.api.Topics,
	UserData: state.api.UserData,
});

const TestLinkWithConnect = withRouter(
	connect(mapStateToProps)(
		ensureServicePlansLoad(TestLink, {
			lazy: false,
			select: { ...selectSubscribedServiceIds, ...selectServiceIds },
		})
	)
);
export default TestLinkWithConnect;
