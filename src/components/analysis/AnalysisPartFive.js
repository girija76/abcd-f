/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Divider, Modal } from 'antd';
import { createLinkForSession } from 'utils/session';
import { hidePractice } from 'utils/config';
import { getTopicNameMapping } from 'components/libs/lib';
import PracticeInstructions from '../instructions/PracticeInstructions';

import Radar from '../plots/Radar';

import {
	generateSmartInstructions,
	categoryProbabilities,
	behaviourMapNew,
	behaviourMap,
	bluffs,
} from './lib';

import {
	getIntent,
	getEndurance,
	getStubbornness,
	defaultEndurance2,
	defaultStubbornness2,
	defaultStamina2,
	defaultSelectivity2,
} from '../../utils/userIndexes';

import { intentModel } from '../../MLModels/intentModel';

import { ArrowRightOutlined } from '@ant-design/icons';

import './analysis_part_five.scss';

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

const sessionTypes = {
	1: 'intent',
	2: 'endurance',
	3: 'selectivity',
	4: 'stubbornness',
	5: 'stamina',
};

function getTopicRecommendations(topics, subtopics, TopicNameMapping) {
	console.log('getting Recommendation,', topics);
	const weakTopics = subtopics.map(() => []);
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

			console.log('check params', cPP, subtopicIncorrects);

			if (cPP.incorrectProb >= 0.35 && subtopicIncorrects) {
				subtopics.forEach((st, idx) => {
					if (st.subTopics[subTopic.id]) {
						if (TopicNameMapping[subTopic.id] === undefined) {
							console.log(
								'check map',
								idx,
								TopicNameMapping[subTopic.id],
								subTopic,
								TopicNameMapping
							);
						}
						weakTopics[idx].push({
							score: cPP.incorrectProb,
							topicName: TopicNameMapping[topic.id],
							sectionName: st.section,
							name: TopicNameMapping[subTopic.id],
							id: subTopic.id,
							levels: [],
						});
					}
				});
			} else if (
				cPP.incorrectProb >= 0.25 &&
				subtopicIncorrects &&
				subTopic['unattempted'] + subtopicIncorrects > subtopicCorrects
			) {
				subtopics.forEach((st, idx) => {
					if (st.subTopics[subTopic.id]) {
						if (TopicNameMapping[subTopic.id] === undefined) {
							console.log(
								'check map',
								idx,
								TopicNameMapping[subTopic.id],
								subTopic,
								TopicNameMapping
							);
						}
						weakTopics[idx].push({
							score: cPP.incorrectProb,
							topicName: TopicNameMapping[topic.id],
							sectionName: st.section,
							name: TopicNameMapping[subTopic.id],
							id: subTopic.id,
							levels: [],
						});
					}
				});
			} else if (subTopic['unattempted'] + subtopicIncorrects > subtopicCorrects) {
				subtopics.forEach((st, idx) => {
					if (st.subTopics[subTopic.id]) {
						if (TopicNameMapping[subTopic.id] === undefined) {
							console.log(
								'check map',
								idx,
								TopicNameMapping[subTopic.id],
								subTopic,
								TopicNameMapping
							);
						}
						weakTopics[idx].push({
							score: 0.01,
							topicName: TopicNameMapping[topic.id],
							sectionName: st.section,
							name: TopicNameMapping[subTopic.id],
							id: subTopic.id,
							levels: [],
						});
					}
				});
			}
		});
	});
	weakTopics.forEach(weakTopic => {
		weakTopic.sort(function(a, b) {
			return b.score - a.score;
		});
	});
	weakTopics.sort(function(a, b) {
		if (!a[0]) return -1;
		else if (!b[0]) return 1;
		return b[0].score - a[0].score;
	});
	console.log('check it!!', weakTopics);
	return weakTopics;
}

function getAllSubtopics(topics) {
	const allSubTopics = [];
	topics.forEach(topic => {
		topic.subTopics.forEach(subTopic => {
			allSubTopics.push({ subTopic: subTopic.id });
		});
	});
	return allSubTopics;
}

class AnalysisPartFive extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filter: 'all',
			key: 'tab1',
			pie: 'q',
			showInstructions: false,
		};
	}

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

	render = () => {
		const { allTopics, sections, duration, type } = this.props;
		const { showInstructions } = this.state;
		const subtopicMap = getTopicNameMapping(allTopics);

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const { assessmentId, category, TopicNameMapping } = this.props;

		let assessmentCategory = null;
		if (category) {
			category.assessments.forEach(assessment => {
				if (assessment.assessment === assessmentId) assessmentCategory = assessment;
			});
		}

		const categoryAssigned = assessmentCategory ? assessmentCategory.category : 0;

		let cAssigned = 0;
		const wk_topics_combined = [];
		const wk_topics = [];
		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		let endurance = 0;
		// let pickingAbility = 0;
		let selectivity = 0;
		let stubborness = 0;
		let stamina = 0;
		let intent = 0;
		const weakTopics = [];
		const alltopics__ = [];
		if (assessmentCategory) {
			let totalQuestions = 0;
			sections.forEach(section => {
				totalQuestions += section.questions.length;
			});

			const {
				correctBluffs,
				corrects,
				totalTooFastAttempts,
				totalAttempts,
				maxIdleTime,
				earlyExitTime,
				correctsInTime,
				allNotInTime,
				questionsStuckOn,
				tooSlowQuestionTimes,
				topics,
				selectivity: s,
				stamina: stamina_,
			} = assessmentCategory;

			alltopics__.push(...topics);

			console.log('check sel', s);

			if (correctBluffs >= 0.4 * corrects) {
				bluff1 = true;
				// cAssigned = 1;
			}
			if (totalTooFastAttempts >= 0.4 * totalAttempts) {
				bluff2 = true;
				// cAssigned = 1;
			}
			if (totalAttempts <= 0.2 * totalQuestions || totalAttempts <= 3) {
				bluff3 = true;
				// cAssigned = 1;
			}
			if (maxIdleTime >= Math.max(600, 0.1 * duration)) {
				bluff4 = true;
				// cAssigned = 1;
			}
			if (earlyExitTime >= 0.3 * duration) {
				bluff5 = true;
				// cAssigned = 1;
			}

			/* Get User Indexes */
			const pintent = getIntent(
				correctBluffs,
				corrects,
				totalAttempts,
				totalQuestions,
				maxIdleTime,
				earlyExitTime,
				duration
			);
			const percent_attempt = (1.0 * totalAttempts) / totalQuestions;
			const percent_early_exit = (1.0 * earlyExitTime) / duration;
			const percent_guesses = totalAttempts
				? (1.0 * totalTooFastAttempts) / totalAttempts
				: 1;
			const percent_idle =
				duration - earlyExitTime > 0
					? (1.0 * maxIdleTime) / (duration - earlyExitTime)
					: 1;
			intent = Math.max(
				0,
				Math.min(
					100,
					100 *
						intentModel([
							percent_attempt,
							percent_early_exit,
							percent_guesses,
							percent_idle,
						])[0]
				)
			);
			console.log('check diff', pintent, intent);
			endurance = getEndurance(correctsInTime, allNotInTime);
			selectivity = s;

			if (tooSlowQuestionTimes) {
				console.log('check too slow question times', tooSlowQuestionTimes);
				let sum_ = 0;
				Object.keys(tooSlowQuestionTimes).forEach(k => {
					sum_ += Math.min(tooSlowQuestionTimes[k], 2);
				});
				stubborness = getStubbornness(sum_, totalAttempts);
			} else {
				stubborness = getStubbornness(questionsStuckOn, totalAttempts);
			}

			stamina = stamina_; //getStamina(totalAttempts, totalQuestions, patches);
			/* User Indexes Ends Here*/

			if (intent < 60) {
				cAssigned = 1;
				endurance = 0.8 * defaultEndurance2 + 0.2 * endurance;
				stubborness = 0.8 * defaultStubbornness2 + 0.2 * stubborness;
				stamina = 0.8 * defaultStamina2 + 0.2 * stamina;
				selectivity = 0.8 * defaultSelectivity2 + 0.2 * selectivity;
			}

			if (!cAssigned && endurance < 60) {
				cAssigned = 2;
			}
			if (!cAssigned && selectivity < 60) {
				cAssigned = 3;
			}
			if (!cAssigned && stubborness < 60) {
				cAssigned = 4;
			}
			if (!cAssigned && stamina < 60) {
				cAssigned = 5;
			}
			if (!cAssigned) {
				cAssigned = 6;
			}

			const subtopicsCombined = {};
			const subtopics = sections.map(sec => {
				const subtopic_ = {};
				sec.questions.forEach(que => {
					subtopic_[que.sub_topic] = true;
					subtopicsCombined[que.sub_topic] = true;
				});
				return { section: sec.name, subTopics: subtopic_ };
			});

			weakTopics.push(
				...getTopicRecommendations(topics, subtopics, TopicNameMapping)
			);
		}

		const smartPracticeConfigs = wk_topics.map(wk_topics_ => {
			const weak_topics_ = wk_topics_.slice(0, 2).map(wt => {
				return { subTopic: wt.id, levels: wt.levels };
			});
			const all_topics_ = wk_topics_.map(wt => {
				return { subTopic: wt.id, levels: wt.levels };
			});
			return { weakTopics: weak_topics_, allTopics: all_topics_ };
		});

		const weak_topics_ = wk_topics_combined.slice(0, 2).map(wt => {
			return { subTopic: wt.id, levels: wt.levels };
		});
		const all_topics_ = wk_topics_combined.map(wt => {
			return { subTopic: wt.id, levels: wt.levels };
		});

		const smartPracticeConfigCombined = {
			weakTopics: weak_topics_,
			allTopics: all_topics_,
		};

		const smartPracticeLinks = smartPracticeConfigs.map(smartPracticeConfig => {
			const filters = this.createFilters(
				smartPracticeConfig.weakTopics,
				smartPracticeConfig.allTopics
			);
			return createLinkForSession({
				filters: filters,
				title: 'Smart Practice',
				config: this.createFilterConfig(cAssigned, currentSupergroup),
				assessment: assessmentId,
			});
		});

		const filters = this.createFilters(weakTopics, getAllSubtopics(alltopics__));

		const smartPracticeLinkCombined = createLinkForSession({
			filters: filters,
			title: 'Smart Practice',
			config: this.createFilterConfig(cAssigned, currentSupergroup),
			assessment: assessmentId,
		});

		const testingLinks = smartPracticeConfigs.length
			? behaviourMap.map((behaviour, bIdx) => {
					const filters = this.createFilters(
						smartPracticeConfigs[0].weakTopics,
						smartPracticeConfigs[0].allTopics
					);
					return {
						link: createLinkForSession({
							filters: filters,
							title: 'Smart Practice ' + behaviour.name,
							config: this.createFilterConfig(bIdx),
							assessment: assessmentId,
						}),
						behaviour: behaviour.name,
					};
			  })
			: [];

		let instructions = generateSmartInstructions(
			smartPracticeConfigCombined,
			categoryAssigned,
			subtopicMap
		);

		// if (smartPracticeConfigs.length) {
		// 	instructions = this.generateInstructions(
		// 		smartPracticeConfigs[0],
		// 		categoryAssigned
		// 	);
		// }

		const data = [
			{ name: 'Intent', value: Math.min(95, Math.max(10, intent)) },
			{ name: 'Endurance', value: Math.min(95, Math.max(10, endurance)) },
			{ name: 'Selectivity', value: Math.min(95, Math.max(10, selectivity)) },
			{
				name: 'Stubborness',
				value: Math.min(95, Math.max(10, stubborness)),
			},
			{ name: 'Stamina', value: Math.min(95, Math.max(10, stamina)) },
		];

		return (
			<div className="analysis-part-five">
				<div className="first-section">
					{type !== 'TOPIC-MOCK' ? (
						<div className="weak-topic-container" style={{ flex: 1 }}>
							<h3 className="weak-topic-title">Weak categories</h3>
							<div className="weak-topic-list">
								{weakTopics.length > 1 ? (
									weakTopics.map((weakTopic, idx) => {
										if (weakTopic.length) {
											return (
												<div className="weak-topic-list-item" key={`wt-${idx}`}>
													<div style={{ width: '100%' }}>
														<div>{weakTopic[0].name}</div>
														<div
															className="parent-topic"
															style={{
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'space-between',
															}}
														>
															<div>{weakTopic[0].sectionName}</div>
															{!hidePractice ? (
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
																	<Button
																		size="small"
																		type="primary"
																		style={{ padding: '0px 12px' }}
																	>
																		Practice Now
																	</Button>
																</Link>
															) : null}
														</div>
													</div>
												</div>
											);
										}
										return null;
									})
								) : weakTopics.length ? (
									weakTopics[0].slice(0, 2).map((weakTopic, idx) => {
										return (
											<div className="weak-topic-list-item" key={`wt-${idx}`}>
												<div style={{ width: '100%' }}>
													<div>{weakTopic.name}</div>
													<div
														className="parent-topic"
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<div>{weakTopic.topicName}</div>
														{!hidePractice ? (
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
																<Button
																	size="small"
																	type="primary"
																	style={{ padding: '0px 12px' }}
																>
																	Practice Now
																</Button>
															</Link>
														) : null}
													</div>
												</div>
											</div>
										);
									})
								) : (
									<div>Perfect. You don't have any weak category.</div>
								)}
							</div>
							<div
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									padding: 24,
									display: 'none',
								}}
							>
								{smartPracticeLinks.map((smartPracticeLink, idx) => {
									const name = sections[idx].name;
									return (
										<Link
											className="ant-btn ant-btn-primary ant-btn-lg"
											to={smartPracticeLink}
											data-ga-on="click"
											data-ga-event-action="Click Smart Practice"
											data-ga-event-category="Smart Practice"
											data-ga-event-label={name}
										>
											{`Smart Practice for ${name}`}
										</Link>
									);
								})}
								<div>
									{testingLinks.map(smartPracticeLink => {
										return (
											<Link
												className="ant-btn ant-btn-primary ant-btn-lg"
												to={smartPracticeLink.link}
												data-ga-on="click"
												data-ga-event-action="Click Smart Practice"
												data-ga-event-category="Smart Practice"
												style={{ margin: 12 }}
											>
												{'SP- ' + smartPracticeLink.behaviour}
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					) : null}
					{type !== 'TOPIC-MOCK' ? (
						<Divider
							type="vertical"
							style={{ height: 200, marginTop: 24 }}
							className="test-level-recommendation-divider"
						/>
					) : null}
					<div
						className="behaviour-needed-container"
						style={{ flex: 2, display: 'flex' }}
					>
						<div>
							<h3 className="behaviour-needed-title">Behaviour needed</h3>

							<div
								style={{
									fontSize: 42,
									fontWeight: 'bolder',
									padding: '8px 0',
									paddingTop: 0,
								}}
							>
								{0
									? behaviourMap[categoryAssigned].name
									: behaviourMapNew[cAssigned].name}
							</div>
							<div>
								<div>
									<div>
										{0
											? behaviourMap[categoryAssigned].description
											: behaviourMapNew[cAssigned].description}
									</div>
									<div>
										{bluff1 || bluff2 ? <div>{bluffs[0].description}</div> : null}
									</div>
									<div>{bluff3 ? <div>{bluffs[1].description}</div> : null}</div>
									<div>{bluff4 ? <div>{bluffs[2].description}</div> : null}</div>
									<div>{bluff5 ? <div>{bluffs[3].description}</div> : null}</div>
								</div>
							</div>
						</div>
						<div>
							<Radar width={300} height={260} data={data} />
						</div>
					</div>
				</div>
				{!hidePractice && smartPracticeLinkCombined ? (
					<div className="second-section">
						<div className="smart-practice-card">
							<h2 className="heading">AI-powered personalized test</h2>
							<ul>
								<li>
									The improvement test is different for each user targeting to improve
									his weak topics and test giving pattern.
								</li>
								<li>
									Questions are based on your performance in the assessment, giving
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
									<span>Practice now</span>
									<span style={{ marginLeft: 8 }}>
										<ArrowRightOutlined />
									</span>
								</Button>
							</div>
						</div>
					</div>
				) : null}
				<Modal
					title={'Smart Practice'}
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
								data-ga-event-label={sections[0].name}
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
			</div>
		);
	};
}

export default connect(state => {
	return {
		allTopics: state.api.Topics,
	};
})(AnalysisPartFive);
