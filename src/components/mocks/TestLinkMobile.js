import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { get, includes, map } from 'lodash';
import { Modal, Card, Tag, Tooltip } from 'antd';

import ensureServicePlansLoad, {
	selectServiceIds,
	selectSubscribedServiceIds,
} from 'components/servicePlans/EnsureServicePlans';
import Instructions from '../instructions/Instructions';
import Syllabus from '../instructions/Syllabus';
import {
	parseTimeString,
	parseTestDateTime2,
	getTopicNameMapping,
} from '../libs/lib';

import { URLS } from '../urls';

import {
	ProfileTwoTone,
	LockTwoTone,
	InfoCircleTwoTone,
	ClockCircleOutlined,
	CheckSquareOutlined,
} from '@ant-design/icons';

import testIcon from '../images/t2.svg';

import './TestLink.css';
import './TestLinks.css';

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

class TestLink extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			key: 'tab1',
			visible: false,
			buyModal: false,
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

	renderTabContent = () => {
		const { test, status, mode } = this.props;

		let testUrl = URLS.liveTest;

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
						customInstructions={test.core.customInstructions}
						id={test._id}
						cost={test.cost}
						reward={test.reward}
						status={status}
						mode={mode}
						testUrl={testUrl}
						disableBegin={af > tn}
					/>
				),
				tab2: <Syllabus syllabus={test.core.syllabus} />,
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
			Topics,
			subscribedServiceIds,
			serviceIds: allServiceIds,
		} = this.props;
		const { key, visible } = this.state;
		const [tabList, contentList] = this.renderTabContent();

		const color = test.submission ? '#f6ffed' : 'rgba(230, 255, 251, 0.35)';

		const TopicNameMapping = getTopicNameMapping(Topics);

		const miniSyllabus = [];
		test.core.syllabus.topics.forEach(topic => {
			topic.subTopics.forEach(subTopic => {
				if (TopicNameMapping[subTopic.id]) {
					miniSyllabus.push(TopicNameMapping[subTopic.id]);
				}
			});
		});

		const serviceIdsNotSubscribed = [];

		let locked = false;
		if (test.visibleForServices.length) locked = true;
		test.visibleForServices.forEach(visibleForService => {
			if (includes(subscribedServiceIds, visibleForService)) {
				locked = false;
			} else if (includes(allServiceIds, visibleForService)) {
				serviceIdsNotSubscribed.push(visibleForService);
			}
		});

		const {
			UserData: { subscriptions },
		} = this.props;

		let c2020Found = false;

		if (subscriptions) {
			subscriptions.forEach(subscription => {
				subscription.subgroups.forEach(subgroup => {
					if (subgroup.group === '5e80ae9aefb5ea5e22de38d5') {
						c2020Found = true;
					}
				});
			});
		}

		// console.log('check 2021', c2020Found, subscriptions);

		if (c2020Found && test._id === '5e80c319294d791e89cfa16a') {
			test.availableFrom = new Date('2020-04-07T18:31:00Z');
		}

		if (c2020Found && test._id === '5e8989129e584c1ab56767e5') {
			test.availableFrom = new Date('2020-04-08T18:31:00Z');
		}

		if (c2020Found && test._id === '5e8988cc0eb7901ac15f46da') {
			test.availableFrom = new Date('2020-04-08T18:31:00Z');
		}

		if (c2020Found && test._id === '5e8904cf147d2a0b3019f146') {
			test.availableFrom = new Date('2020-04-08T18:31:00Z');
		}

		const af = new Date(test.availableFrom).getTime();
		const tn = new Date().getTime();
		const eo = test.expiresOn ? new Date(test.expiresOn).getTime() : tn + 1000000;

		const { customHeaderComponent } = window.config;

		const { FEATURES } = window.config;
		const showTTSyllabus =
			FEATURES && FEATURES.ENABLE_TOPIC_MOCK_SYLLABUS ? true : false;

		return (
			<div
				style={{
					display: 'flex',
					width: '100%',
					borderBottom: '1px solid #dadada',
					padding: '14px 16px',
					alignItems: 'center',
				}}
			>
				<div style={{ marginRight: 8 }}>
					<div style={{ height: 32 }}>
						<img alt="test" src={testIcon} height="100%" />
					</div>
				</div>
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex' }}>
						<div style={{ fontWeight: 600, marginRight: 12 }}>{test.name}</div>
						<div>
							{test.type === 'TOPIC-MOCK' && !showTTSyllabus ? (
								test.difficulty ? (
									<Tag
										color={colors[test.difficulty]}
										style={{ fontSize: 11, lineHeight: '16px' }}
									>
										{test.difficulty}
									</Tag>
								) : null
							) : test.type === 'LIVE-TEST' &&
							  !test.submission &&
							  eo > tn &&
							  af > tn ? (
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
					</div>
					<div style={{ display: 'flex', marginTop: 2 }}>
						<div style={{ marginRight: 12 }}>
							<ClockCircleOutlined style={{ marginRight: 4 }} />
							{parseTimeString(test.core.duration)}
						</div>
						<div style={{}}>
							<CheckSquareOutlined style={{ marginRight: 4 }} />
							{getTotalQuestions(test.core.instructions)} ques
						</div>
					</div>
				</div>
				<div style={{ marginLeft: 12 }}>
					{locked ? (
						<Link
							to={`/dashboard/cart?i=${encodeURIComponent(
								JSON.stringify(serviceIdsNotSubscribed)
							)}`}
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 600,
								padding: '6px 16px',
								border: '1px solid #cdcdcd',
								borderRadius: 100,
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
					) : eo < tn && !test.submission ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 600,
								padding: '6px 16px',
								border: '1px solid #cdcdcd',
								borderRadius: 100,
								backgroundColor: 'rgba(150, 150, 150, 0.35)',
								cursor: 'pointer',
							}}
						>
							<span>Test Expired</span>
						</div>
					) : af < tn ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 600,
								padding: '6px 16px',
								border: '1px solid #cdcdcd',
								borderRadius: 100,
								backgroundColor: color,
								cursor: 'pointer',
							}}
							onClick={test.submission ? this.showSolution : this.showInstructions}
						>
							{test.submission ? 'View Analysis' : 'Attempt'}
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontWeight: 600,
								padding: '6px 16px',
								border: '1px solid #cdcdcd',
								borderRadius: 100,
								backgroundColor: 'rgba(150, 150, 150, 0.35)',
								cursor: 'pointer',
							}}
						>
							{0 && customHeaderComponent !== 'reliable'
								? 'Coming Soon'
								: 'Starts - ' + parseTestDateTime2(af)}
						</div>
					)}
				</div>
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
			</div>
		);
	}
}

const mapStateToProps = state => ({
	Topics: state.api.Topics,
	UserData: state.api.UserData,
});

export default withRouter(
	connect(mapStateToProps)(
		ensureServicePlansLoad(TestLink, {
			lazy: false,
			select: { ...selectSubscribedServiceIds, ...selectServiceIds },
		})
	)
);
