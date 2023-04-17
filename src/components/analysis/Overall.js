import React, { useState } from 'react';
import { Card, Grid, Skeleton, Typography } from 'antd';
import { connect } from 'react-redux';
import Ranking from './utils/Ranking';
import SectionPie from '../plots/SectionPie';
import OverallRecommendations from './OverallRecommendations';
import { getTopicNameMapping } from '../libs/lib';

import { LockTwoTone } from '@ant-design/icons';

import './TestLevel.scss';
import './Overall.css';

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Overall = ({
	UserData: {
		stats: { topics },
		stats,
	},
	locked,
	Topics,
	totalLiveGraded,
	totalLiveAttempts,
	loading,
}) => {
	const [key, setKey] = useState('tab1');
	const [pie] = useState('q');
	const screens = useBreakpoint();
	const onTabChange = key => {
		setKey(key);
	};

	const TopicNameMapping = getTopicNameMapping(Topics);

	const tabList = [{ key: 'tab1', tab: 'Overall' }];
	topics.forEach((topic, topicIndex) => {
		tabList.push({
			key: 'tab' + (topicIndex + 2),
			tab: TopicNameMapping[topic.id],
		});
	});

	let correct = stats.test_performance.correct;
	let incorrect = stats.test_performance.incorrect;
	let unattempted = stats.test_performance.unattempted;
	let correctT = stats.test_performance.correctTime;
	let incorrectT = stats.test_performance.incorrectTime;
	let unattemptedT = stats.test_performance.unattemptedTime;
	if (key !== 'tab1') {
		correct = topics[parseInt(key.substring(3)) - 2].test_performance.correct;
		incorrect = topics[parseInt(key.substring(3)) - 2].test_performance.incorrect;
		unattempted =
			topics[parseInt(key.substring(3)) - 2].test_performance.unattempted;
		correctT =
			topics[parseInt(key.substring(3)) - 2].test_performance.correctTime;
		incorrectT =
			topics[parseInt(key.substring(3)) - 2].test_performance.incorrectTime;
		unattemptedT =
			topics[parseInt(key.substring(3)) - 2].test_performance.unattemptedTime;
	}

	let pieData = [];
	if (pie === 'q') {
		pieData = [
			{
				label: 'Correct',
				color: '#4caf50',
				count: correct,
				value: correct + (correct > 1 ? ' Questions' : ' Question'),
			},
			{
				label: 'Incorrect',
				color: '#f44336',
				count: incorrect,
				value: incorrect + (incorrect > 1 ? ' Questions' : ' Question'),
			},
			{
				label: 'Unattempted',
				color: '#8e989c',
				count: unattempted,
				value: unattempted + (unattempted > 1 ? ' Questions' : ' Question'),
			},
		];
	} else {
		pieData = [
			{
				label: 'Correct',
				count: correctT,
				color: '#4caf50',
				value: Math.round(correctT) + ' secs',
			},
			{
				label: 'Incorrect',
				color: '#f44336',
				count: incorrectT,
				value: Math.round(incorrectT) + ' secs',
			},
			{
				label: 'Unattempted',
				color: '#8e989c',
				count: unattemptedT,
				value: Math.round(unattemptedT) + ' secs',
			},
		];
	}

	if (!pieData[0].count && !pieData[1].count && !pieData[2].count)
		pieData[2].count = 1;

	let message = '';
	if (totalLiveAttempts === 0) {
		message = 'Attempt atleast one assessments to unlock overall analysis.';
	} else if (totalLiveAttempts === 1) {
		// message = 'Attempt one more live assessment to unlock overall analysis.';
	} else if (totalLiveGraded < 1) {
		// 2
		message = 'Overall analysis will be shown once the assessments are graded.';
	}

	return (
		<Skeleton loading={loading}>
			{locked ? (
				<div
					style={{ display: 'flex', alignItems: 'flex-start' }}
					className="overall-na"
				>
					<LockTwoTone style={{ fontSize: 18, margin: '0px 5px' }} />
					<div style={{ fontWeight: 'bold' }}>{message}</div>
				</div>
			) : (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						marginTop: screens.xs ? 8 : 0,
					}}
				>
					{screens.xs ? null : (
						<div
							style={{
								marginTop: 10,
								marginBottom: 0,
								fontSize: 20,
								fontWeight: 'bold',
								width: '100%',
							}}
						>
							Ranking
						</div>
					)}
					<Ranking
						title={screens.xs ? 'Ranking' : null}
						style={{
							border: screens.xs ? undefined : 0,
							marginTop: screens.xs ? 12 : undefined,
						}}
					/>
					{screens.xs ? null : (
						<>
							<OverallRecommendations titleFontSize={20} />
							<div
								style={{
									marginTop: 20,
									marginBottom: 5,
									fontSize: 20,
									fontWeight: 'bold',
									width: '100%',
								}}
							>
								Topic Stats
							</div>
						</>
					)}

					<Card
						style={{
							width: '100%',
							border: screens.xs ? undefined : '0px',
							marginTop: screens.xs ? 20 : undefined,
						}}
						bodyStyle={{
							display: 'flex',
							justifyContent: 'space-around',
							alignItems: 'center',
						}}
						tabList={tabList}
						activeTabKey={key}
						onTabChange={key => {
							onTabChange(key);
						}}
					>
						<div
							style={{
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-evenly',
								flexWrap: 'wrap',
							}}
						>
							<div style={{ maxWidth: 400, marginRight: 12, marginLeft: 12 }}>
								<SectionPie data={pieData} />
							</div>
							<div>
								{pieData.map(pieItem => {
									return (
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												marginBottom: 12,
											}}
										>
											<span
												style={{ display: 'flex', alignItems: 'center', marginRight: 32 }}
											>
												<span
													style={{
														display: 'inline-flex',
														border: 'solid 8px',
														borderColor: pieItem.color,
														marginRight: 6,
													}}
												/>
												<Text style={{ textTransform: 'capitalize' }}>{pieItem.label}</Text>
											</span>
											<span style={{ textAlign: 'right' }}>{pieItem.value}</span>
										</div>
									);
								})}
							</div>
						</div>
					</Card>
				</div>
			)}
		</Skeleton>
	);
};

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		Topics: state.api.Topics,
		Recommendations: state.api.Recommendations,
		SuperGroups: state.api.SuperGroups,
	};
};

export default connect(mapStateToProps)(Overall);
