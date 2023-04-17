import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Skeleton from 'antd/es/skeleton';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import { createLinkForSession } from 'utils/session';
import { getTopicNameMapping } from 'components/libs/lib';
import PracticeInstructions from '../instructions/PracticeInstructions';
import RegistrationPrompt from 'components/login/Prompt';
import { hidePractice } from 'utils/config';
import Radar from '../plots/Radar';
import {
	generateSmartInstructionsNew,
	categoryProbabilities,
	behaviourMapNew,
	bluffs,
} from './lib';

import { getPhaseFromSubscription } from '../libs/lib';

import './analysis_part_five.scss';

import './Overall.css';

import { URLS } from '../urls';
import { defaultTopics } from '../extra';

import { LockTwoTone, ArrowRightOutlined } from '@ant-design/icons';

const subTopicsForReattemptSession = [
	'5d1f1bbbc144745ffcdcbac1',
	'5d5f02d3eaf5f804d9c7eb7f',
	'5da78ac3f0197223284a2761',
	'5da78acdf0197223284a2763',
	'5da78ad5f0197223284a2766',
	'5da78adbf0197223284a276a',
	'5da78ae2f0197223284a276c',
	'5d6e111e40f68a74e25d12c5',
	'5da78b30f0197223284a277b',
	'5da78b42f0197223284a277e',
	'5da78b50f0197223284a277f',
	'5da78b58f0197223284a2780',
	'5da78b5ef0197223284a2782',
];

function getTopicRecommendations(topics, TopicNameMapping) {
	const weakTopics = [];
	topics.forEach(topic => {
		topic.subTopics.forEach(subTopic => {
			const cPP = categoryProbabilities({
				'correct-too-fast': subTopic['correct-too-fast'],
				'correct-optimum': subTopic['correct-optimum'],
				'correct-too-slow': subTopic['correct-too-slow'],
				'incorrect-too-fast': subTopic['incorrect-too-fast'],
				'incorrect-optimum': subTopic['incorrect-optimum'],
				'incorrect-too-slow': subTopic['incorrect-too-slow'],
			});
			const subtopicCorrects =
				subTopic['correct-too-fast'] +
				subTopic['correct-optimum'] +
				subTopic['correct-too-slow'];
			const subtopicIncorrects =
				subTopic['incorrect-too-fast'] +
				subTopic['incorrect-optimum'] +
				subTopic['incorrect-too-slow'];
			if (cPP.incorrectProb >= 0.35 && subtopicIncorrects) {
				weakTopics.push({
					score: cPP.incorrectProb,
					topicName: TopicNameMapping[topic.id],
					name: TopicNameMapping[subTopic.id],
					id: subTopic.id,
					levels: [],
				});
			} else if (
				cPP.incorrectProb >= 0.25 &&
				subtopicIncorrects &&
				subTopic['unattempted'] + subtopicIncorrects > subtopicCorrects
			) {
				weakTopics.push({
					score: cPP.incorrectProb,
					topicName: TopicNameMapping[topic.id],
					name: TopicNameMapping[subTopic.id],
					id: subTopic.id,
					levels: [],
				});
			} else if (subTopic['unattempted'] + subtopicIncorrects > subtopicCorrects) {
				weakTopics.push({
					score: 0.01,
					topicName: TopicNameMapping[topic.id],
					name: TopicNameMapping[subTopic.id],
					id: subTopic.id,
					levels: [],
				});
			}
		});
	});
	weakTopics.sort(function(a, b) {
		return b.score - a.score;
	});
	return weakTopics;
}

function getAllSubtopics2(topics) {
	const allSubTopics = [];
	topics.forEach(topic => {
		topic.subTopics.forEach(subTopic => {
			allSubTopics.push({ subTopic: subTopic.id });
		});
	});
	return allSubTopics;
}

const sessionTypes = {
	1: 'intent',
	2: 'endurance',
	3: 'selectivity',
	4: 'stubbornness',
	5: 'stamina',
};

const sessionTypeNames = {
	intent: 'Intent',
	endurance: 'Endurance',
	selectivity: 'Selectivity',
	stubbornness: 'Agility',
	stamina: 'Stamina',
};

class OverallRecommendation extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			showInstructions: false,
			showModal: false,
		};
	}

	createFilterConfig = (cAssigned, supergroup) => {
		// const cAssigned = 5;
		const config = {
			allowReattempt: true,
			canSkip: true,
			totalQuestions: 11,
			canIgnoreQuestions: 0,
			timeLimit: 1200,
			// selector: 'nucleus',
			selector: 'demo',
			sessionType: sessionTypes[cAssigned],
		};
		if (supergroup === '5d10e42744c6e111d0a17d0a') {
			//placement
			config.timeLimit = 1200;
			config.totalQuestions = 11;
		} else if (supergroup === '5d10e43944c6e111d0a17d0c') {
			//cat

			config.timeLimit = 1200;
			config.totalQuestions = 11;
		} else if (supergroup === '5dd95e8097bc204881be3f2c') {
			//jee
			config.timeLimit = 1800;
			config.totalQuestions = 15;
		}

		// // // // //
		if (cAssigned === 1) {
			config.preventTooFast = true;
			config.tooFastMultiplier = 2;
		} else if (cAssigned === 2) {
			// endurance // prevent too slow
			config.tooSlowDetector = 'ts';
			config.preventTooSlow = '1';
			delete config.timeLimit;
		} else if (cAssigned === 3) {
			// selectivity // 11 out of 14

			if (supergroup === '5d10e42744c6e111d0a17d0a') {
				//placement
				config.totalQuestions = 14;
				config.shouldSelect = 11;
				config.questionSelectionTimeLimit = 150;
			} else if (supergroup === '5d10e43944c6e111d0a17d0c') {
				//cat

				config.totalQuestions = 14;
				config.shouldSelect = 11;
				config.questionSelectionTimeLimit = 150;
			} else if (supergroup === '5dd95e8097bc204881be3f2c') {
				//jee
				config.totalQuestions = 20;
				config.shouldSelect = 15;
				config.questionSelectionTimeLimit = 240;
			}
		} else if (cAssigned === 4) {
			// stubbornness // alert on slow and too many hops
			// config.alertStubbornness = true;
			// config.tooSlowDetector = 'puq';
			// config.preventTooSlow = true;
			config.alertBeforeTooSlow = 15;
		} else if (cAssigned === 5) {
			// stamina // alert if attempt rate is less
			// config.alertLowStamina = true;
			if (supergroup === '5d10e42744c6e111d0a17d0a') {
				//placement
				delete config.totalQuestions;
				config.timeLimit = 2400;
			} else if (supergroup === '5d10e43944c6e111d0a17d0c') {
				//cat

				delete config.totalQuestions;
				config.timeLimit = 2400;
			} else if (supergroup === '5dd95e8097bc204881be3f2c') {
				//jee
				delete config.totalQuestions;
				config.timeLimit = 3600;
			}
		}

		return config;
	};

	createFilters = (weaktopics, alltopics) => {
		const filters = [];

		[...weaktopics].splice(0, 2).forEach(wt => {
			filters.push({ subTopic: wt.id, levels: [] });
		});

		alltopics.forEach(wt => {
			filters.push({ subTopic: wt.subTopic, levels: [] });
		});

		if (filters.length >= 7) {
			[...weaktopics].splice(0, 2).forEach(wt => {
				filters.push({ subTopic: wt.id, levels: [] });
			});
		}

		return filters;
	};

	render = () => {
		const {
			Category,
			UserData: { subscriptions, email },
			Phase,
			titleFontSize,
			mode,
		} = this.props;

		const { showInstructions, showModal } = this.state;

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		let activePhase = Phase
			? Phase
			: getPhaseFromSubscription(subscriptions, currentSupergroup);

		let bluff1 = 0;
		let bluff2 = 0;
		let bluff3 = 0;
		let bluff4 = 0;
		let bluff5 = 0;
		let endurance = 80;
		let pickingAbility = 70;
		let stubborness = 22;
		let intent = 100;
		let stamina = 54;
		let cAssigned = 5;
		let topics = [];
		let loading = false;
		let locked = false;

		if (!activePhase) {
			locked = true;
			// add dummy data
		} else if (Category === undefined) {
			// ??
			loading = true;
		} else if (Category === null || !Category.totalAssessments) {
			locked = true;
		} else if (Category !== null) {
			bluff1 = Category.bluff1;
			bluff2 = Category.bluff2;
			bluff3 = Category.bluff3;
			bluff4 = Category.bluff4;
			bluff5 = Category.bluff5;
			endurance = Category.endurance;
			pickingAbility = Category.pickingAbility;
			stubborness = Category.stubborness;
			intent = Category.intent;
			stamina = Category.stamina;
			cAssigned = Category.cAssigned;
			topics = Category.topics;
		}

		if (email === 'demo3@prepleaf.com') {
			bluff1 = false;
			bluff2 = false;
			bluff3 = false;
			bluff4 = false;
			bluff5 = false;
			intent = 78;
			endurance = 85;
			pickingAbility = 43;
			stubborness = 7;
			stamina = 87;
			cAssigned = 3;
		} else if (email === 'demo6@prepleaf.com') {
			bluff1 = false;
			bluff2 = false;
			bluff3 = false;
			bluff4 = false;
			bluff5 = false;
			intent = 78;
			endurance = 85;
			pickingAbility = 67;
			stubborness = 61;
			stamina = 87;
			cAssigned = 4;
		} else if (email === 'demo7@prepleaf.com') {
			bluff1 = false;
			bluff2 = false;
			bluff3 = false;
			bluff4 = false;
			bluff5 = false;
			intent = 78;
			endurance = 85;
			pickingAbility = 78;
			stubborness = 7;
			stamina = 36;
			cAssigned = 5;
		}

		// cAssigned = 5;

		if (locked && defaultTopics[currentSupergroup]) {
			topics.push(...defaultTopics[currentSupergroup]);
		}

		const data = [
			{ name: 'Intent', value: Math.min(95, Math.max(10, intent)) },
			{ name: 'Endurance', value: Math.min(95, Math.max(10, endurance)) },
			{ name: 'Selectivity', value: Math.min(95, Math.max(10, pickingAbility)) },
			{
				name: 'Agility',
				value: Math.min(95, Math.max(10, 100 - stubborness)),
			},
			{ name: 'Stamina', value: Math.min(95, Math.max(10, stamina)) },
		];

		const { Topics } = this.props;
		const TopicNameMapping = getTopicNameMapping(Topics);

		const weakTopics = getTopicRecommendations(topics, TopicNameMapping);

		const showSmartPractice = !hidePractice && !locked;

		const config = this.createFilterConfig(cAssigned, currentSupergroup);

		const filters = this.createFilters(weakTopics, getAllSubtopics2(topics));

		const smartPracticeLinkCombined = createLinkForSession({
			filters: filters,
			title: 'Smart Practice',
			config: config,
		});

		const instructions = generateSmartInstructionsNew(cAssigned, config);

		const additionalInfo = sessionTypeNames[config.sessionType];

		return (
			<div>
				<Skeleton loading={loading}>
					<div
						className="overall-recommendation-wrapper"
						style={{ position: 'relative' }}
					>
						<div
							className="weak-topic-container"
							style={{ display: 'flex', flex: 2, margin: 0, marginTop: 24 }}
						>
							<div style={{ flex: 1 }}>
								<h3
									className="weak-topic-title"
									style={{ fontSize: titleFontSize, fontWeight: 'bold' }}
								>
									Weak categories
								</h3>
								<div className="weak-topic-list">
									{weakTopics.length ? (
										weakTopics.slice(0, 2).map((weakTopic, idx) => {
											const backgroundColor =
												weakTopic.score > 0.5
													? 'rgba(244, 102, 74, 0.3)'
													: weakTopic.score > 0.2
													? 'rgba(250, 173, 30, 0.3)'
													: 'rgba(48, 191, 120, 0.3)';
											console.log(weakTopic);
											return (
												<>
													{(weakTopic.name || weakTopic.topicName) && (
														<div
															className="overall-weak-topic-list-item"
															key={`wt-${idx}`}
															style={{ backgroundColor }}
														>
															<div style={{ width: '100%' }}>
																<div>{weakTopic.name}</div>
																<div
																	className="overall-parent-topic"
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'space-between',
																	}}
																>
																	<div>{weakTopic.topicName}</div>
																	{mode === 'demo' ? (
																		<div
																			onClick={() => {
																				this.setState({ showModal: true });
																			}}
																		>
																			{!hidePractice ? (
																				<Button
																					size="small"
																					type="primary"
																					style={{ padding: '0px 12px' }}
																				>
																					Practice Now
																				</Button>
																			) : null}
																		</div>
																	) : (
																		<Link
																			to={createLinkForSession({
																				config: {
																					allowReattempt:
																						subTopicsForReattemptSession.indexOf(weakTopic.id) > -1,
																					selector: 'topicAdaptive',
																				},
																				filters: [{ subTopic: weakTopic.id }],
																				title: `Practice - ${weakTopic.name}`,
																			})}
																		>
																			{!hidePractice ? (
																				<Button
																					size="small"
																					type="primary"
																					style={{ padding: '0px 12px' }}
																				>
																					Practice Now
																				</Button>
																			) : null}
																		</Link>
																	)}
																</div>
															</div>
														</div>
													)}
												</>
											);
										})
									) : (
										<div>Perfect. You don't have any weak category.</div>
									)}
								</div>
							</div>
							<div
								style={{
									borderRight: '1px solid #e8e8e8',
									width: 24,
									marginTop: 24,
									marginBottom: 24,
									marginRight: 24,
								}}
								className="overall-recommendation-divider"
							></div>
						</div>
						<div
							className="behaviour-needed-container"
							style={{ flex: 3, margin: 0, marginTop: 24 }}
						>
							<h3
								className="behaviour-needed-title"
								style={{ fontSize: titleFontSize, fontWeight: 'bold' }}
							>
								Behaviour needed
							</h3>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>
									<div
										style={{
											fontSize: 32,
											fontWeight: 'bolder',
											padding: '8px 0',
											paddingTop: 0,
											color: '#429add',
										}}
									>
										{behaviourMapNew[cAssigned].name}
									</div>
									<div>
										<div>{behaviourMapNew[cAssigned].description}</div>
										<div style={{ marginTop: 12 }}>
											{bluff1 || bluff2 ? <div>{bluffs[0].description}</div> : null}
											{bluff3 ? <div>{bluffs[1].description}</div> : null}
											{bluff4 ? <div>{bluffs[2].description}</div> : null}
											{bluff5 ? <div>{bluffs[3].description}</div> : null}
										</div>
									</div>
								</div>
								<div>
									<Radar width={280} height={240} data={data} />
								</div>
							</div>
						</div>
						{locked ? (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'space-evenly',
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									backgroundColor: 'rgba(255, 255, 255, 0.7)',
								}}
								className="lock-wrapper"
							>
								<div
									style={{
										position: 'absolute',
										bottom: 0,
										display: 'flex',
										alignItems: 'center',
										width: '100%',
									}}
								>
									<div style={{ marginRight: 8 }}>
										<LockTwoTone style={{ fontSize: 24, color: '#429add' }} />
									</div>
									<div
										style={{
											fontSize: 18,
											fontWeight: 'bold',
											color: 'black',
											textAlign: 'center',
										}}
									>
										Attempt an assessment to unlock advance analysis
									</div>
								</div>
							</div>
						) : null}
					</div>
					{showSmartPractice ? (
						0 && cAssigned === 1 ? (
							<div
								style={{
									backgroundColor: '#dae2f6',
									border: 'solid 1px rgba(40, 52, 229, 0.219608)',
									borderRadius: 10,
									padding: '12px 18px',
									marginTop: 18,
								}}
							>
								<h2 className="heading">Please attempt another test</h2>
								<div>
									Since you didn't focus much on giving your best in assessments, we
									couldn't judge you properly. Please attempt another test and focus on
									these points-
									<ul>
										{bluff1 || bluff2 ? (
											<li>Do not bluff on too many questions</li>
										) : null}
										{bluff3 ? <li>Do not leave too many questions unattempted</li> : null}
										{bluff4 ? <li>Do not sit idle during the paper</li> : null}
										{bluff5 ? <li>Do not submit your response too early</li> : null}
									</ul>
								</div>
								<Link to={URLS.compete}>
									<Button
										type="primary"
										size="large"
										onClick={() => this.setState({ showInstructions: true })}
									>
										<span>Go to Compete</span>
										<span style={{ marginLeft: 8 }}>
											<ArrowRightOutlined />
										</span>
									</Button>
								</Link>
							</div>
						) : (
							<div
								style={{
									backgroundColor: '#dae2f6',
									border: 'solid 1px rgba(40, 52, 229, 0.219608)',
									borderRadius: 10,
									padding: '12px 18px',
									marginTop: 18,
								}}
							>
								<h2 className="heading">AI-powered personalized practice</h2>
								<ul>
									<li>
										The improvement test is different for each user targeting to improve
										his weak topics and test giving pattern.
									</li>
									<li>
										Questions are based on your performance in the assessments, giving
										priority to your weak topics.
									</li>
									<li>
										Extra restrictions have been included in the test based on your
										behavioral analysis.
									</li>
								</ul>
								<div className="footer">
									<Button
										type="primary"
										size="large"
										onClick={() => this.setState({ showInstructions: true })}
									>
										<span>Attempt now</span>
										<span style={{ marginLeft: 8 }}>
											<ArrowRightOutlined />
										</span>
									</Button>
									<Link to="/dashboard/activity/practice_session">
										<Button type="primary" size="large" ghost style={{ marginLeft: 18 }}>
											<span>View Old Sessions</span>
										</Button>
									</Link>
								</div>
							</div>
						)
					) : null}
					<Modal
						title={`Smart Practice (${additionalInfo} Improvement)`}
						visible={showInstructions}
						onCancel={() => {
							this.setState({ showInstructions: false });
						}}
						footer={
							<>
								<Link
									data-ga-on="click"
									data-ga-event-action="Click Smart Practice"
									data-ga-event-category="Smart Practice"
									data-ga-event-label="Overall"
									to={smartPracticeLinkCombined}
									className="ant-btn ant-btn-primary ant-btn-lg"
								>
									<span>Start</span>
								</Link>
							</>
						}
						style={{ width: 840, fontSize: '16px' }}
						bodyStyle={{ fontSize: '16px' }}
					>
						<PracticeInstructions instructions={instructions} />
					</Modal>
					<RegistrationPrompt
						visible={showModal}
						onCancel={() => {
							this.setState({ showModal: false });
						}}
					/>
				</Skeleton>
			</div>
		);
	};
}

export default connect((state, ownProps) => {
	return {
		Phase: state.api.Phase,
		UserData: state.api.UserData,
		Topics: state.api.Topics,
		Category: state.api.Category,
	};
})(OverallRecommendation);
