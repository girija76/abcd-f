import React, { PureComponent, useMemo } from 'react';
import { every, reduce, some } from 'lodash';
import classnames from 'classnames';
import {
	Button,
	Card,
	Dropdown,
	Menu,
	Modal,
	Table,
	Tooltip,
	Typography,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import DifficultyBar from '../plots/DifficultyBar';
import TimeBar from '../plots/TimeBar';
import Roadmap from '../plots/Roadmap';
import { createMapSubmissionMetaSection } from 'utils/assessment';

import './TestLevel.scss';
import './analysis_part_three.scss';
import { AiFillQuestionCircle } from 'react-icons/ai';

const { Title, Paragraph } = Typography;
const timePrior = {
	fast: {
		fastCorrect: 0.57,
		perfectCorrect: 0.29,
		slowCorrect: 0.14,
		fastIncorrect: 0.62,
		perfectIncorrect: 0.25,
		slowIncorrect: 0.13,
	},
	perfect: {
		fastCorrect: 0.2,
		perfectCorrect: 0.4,
		slowCorrect: 0.2,
		fastIncorrect: 0.33,
		perfectIncorrect: 0.5,
		slowIncorrect: 0.17,
	},
	slow: {
		fastCorrect: 0.14,
		perfectCorrect: 0.29,
		slowCorrect: 0.57,
		fastIncorrect: 0.28,
		perfectIncorrect: 0.28,
		slowIncorrect: 0.44,
	},
};

const accuracyPrior = {
	good: {
		fastCorrect: 0.5,
		perfectCorrect: 0.67,
		slowCorrect: 0.83,
		fastIncorrect: 0.5,
		perfectIncorrect: 0.33,
		slowIncorrect: 0.17,
	},
	bad: {
		fastCorrect: 0.33,
		perfectCorrect: 0.5,
		slowCorrect: 0.67,
		fastIncorrect: 0.33,
		perfectIncorrect: 0.5,
		slowIncorrect: 0.33,
	},
};

const categoryProbabilities = category => {
	let tooFastProb = 1;
	let optimumProb = 1;
	let tooSlowProb = 1;
	let correctProb = 1;
	let incorrectProb = 1;

	Object.keys(category).forEach(c => {
		const n = category[c];
		if (c === 'correct-too-fast') {
			tooFastProb *= Math.pow(timePrior.fast.fastCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.fastCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.fastCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.fastCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.fastCorrect, n);
		} else if (c === 'correct-optimum') {
			tooFastProb *= Math.pow(timePrior.fast.perfectCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.perfectCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.perfectCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.perfectCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.perfectCorrect, n);
		} else if (c === 'correct-too-slow') {
			tooFastProb *= Math.pow(timePrior.fast.slowCorrect, n);
			optimumProb *= Math.pow(timePrior.perfect.slowCorrect, n);
			tooSlowProb *= Math.pow(timePrior.slow.slowCorrect, n);
			correctProb *= Math.pow(accuracyPrior.good.slowCorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.slowCorrect, n);
		}
		if (c === 'incorrect-too-fast') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.fastIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.fastIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.fastIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.fastIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.fastIncorrect, n);
		} else if (c === 'incorrect-optimum') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.perfectIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.perfectIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.perfectIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.perfectIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.perfectIncorrect, n);
		} else if (c === 'incorrect-too-slow') {
			tooFastProb *= Math.sqrt(Math.pow(timePrior.fast.slowIncorrect, n));
			optimumProb *= Math.sqrt(Math.pow(timePrior.perfect.slowIncorrect, n));
			tooSlowProb *= Math.sqrt(Math.pow(timePrior.slow.slowIncorrect, n));
			correctProb *= Math.pow(accuracyPrior.good.slowIncorrect, n);
			incorrectProb *= Math.pow(accuracyPrior.bad.slowIncorrect, n);
		}
	});

	const sumSpeedProb = tooFastProb + optimumProb + tooSlowProb;
	if (sumSpeedProb > 0) {
		tooFastProb = tooFastProb / sumSpeedProb;
		optimumProb = optimumProb / sumSpeedProb;
		tooSlowProb = tooSlowProb / sumSpeedProb;
	} else {
		tooFastProb = 0.33;
		optimumProb = 0.34;
		tooSlowProb = 0.33;
	}

	const sumAccuracyProb = correctProb + incorrectProb;
	if (sumAccuracyProb > 0) {
		correctProb = correctProb / sumAccuracyProb;
		incorrectProb = incorrectProb / sumAccuracyProb;
	} else {
		correctProb = 0.5;
		incorrectProb = 0.5;
	}

	return { tooFastProb, optimumProb, tooSlowProb, correctProb, incorrectProb };
};

class AnalysisPartThree extends PureComponent {
	constructor(props) {
		super(props);
		const { category, assessmentId } = props;
		let assessmentCategory = { category: 0 };
		if (category && category.assessments) {
			category.assessments.forEach(assessment => {
				if (assessment.assessment === assessmentId) assessmentCategory = assessment;
			});
		}

		const filter1 = [
			{
				name: 'Perfect',
				active: false,
				color: 'rgba(80, 195, 70,.9)',
			},
			{
				name: 'Too Fast',
				active: true,
				color: 'red',
			},
			{
				name: 'Overtime',
				active: true,
				color: '#FFC900',
			},
		];
		const filter2 = [
			{
				name: 'Correct',
				active: false,
				color: 'rgba(80, 195, 70,.9)',
			},
			{
				name: 'Incorrect',
				active: true,
				color: 'rgba(255, 50, 50,.6)',
			},
			{
				name: 'Unattempted',
				active: true,
				color: '#546e7a',
			},
		];
		let topicFilter = '';
		if (assessmentCategory.category === 1) {
			// show incorrect
			filter2[0].active = false;
			filter2[2].active = false;
		} else if (assessmentCategory.category === 2) {
			// show topic
			assessmentCategory.category.topics.forEach(topic => {
				const cp = categoryProbabilities(topic);
				if (cp.incorrectProb > 0.8) topicFilter = topic.id;
			});
		} else if (assessmentCategory.category === 3) {
			// show too fast

			filter1[0].active = false;
			filter1[2].active = false;
		} else if (assessmentCategory.category === 4) {
			// show incorrect
			filter2[0].active = false;
			filter2[2].active = false;
		} else if (assessmentCategory.category === 5) {
			// show normal
		} else if (assessmentCategory.category === 6) {
			// show normal
		} else if (assessmentCategory.category === 7) {
			// show overtime incorrect
			filter1[0].active = false;
			filter1[1].active = false;
			filter2[0].active = false;
			filter2[2].active = false;
		} else if (assessmentCategory.category === 8) {
			// show overtime correct
			filter1[0].active = false;
			filter1[1].active = false;
			filter2[1].active = false;
			filter2[2].active = false;
		} else if (assessmentCategory.category === 9) {
			// show normal
		} else if (assessmentCategory.category === 10) {
			// show normal
		} else {
			// normal
		}

		this.state = {
			key: 'tab1',
			filter1,
			filter2,
			topicFilter,
		};
	}

	toggleFilter1 = idx => {
		const { filter1 } = this.state;
		const newFilter = filter1.slice();
		newFilter[idx].active = !filter1[idx].active;
		this.setState({ filter1: newFilter });
	};

	toggleFilter2 = idx => {
		const { filter2 } = this.state;
		const newFilter = filter2.slice();
		newFilter[idx].active = !filter2[idx].active;
		this.setState({ filter2: newFilter });
	};

	updateTopicFilter = k => {
		this.setState({ topicFilter: k });
	};

	openHowToReadRoadmapModal = () => {
		this.setState({ isHowToReadRoadmapModalOpen: true });
	};
	closeHowToReadRoadmapModal = () => {
		this.setState({ isHowToReadRoadmapModalOpen: false });
	};

	render = () => {
		const {
			roadmap,
			duration,
			assessmentCore,
			submission,
			meta: {
				correctQuestions,
				incorrectQuestions,
				correctTime,
				incorrectTime,
				unattemptedTime,
				precision,
				firstSeenTime,
				firstSeenCorrect,
				firstSeenIncorrect,
			},
			bestQuestionGroupChoices,
			difficulty,
			difficultyStats,
			TopicNameMapping,
		} = this.props;

		const { filter1, filter2, topicFilter } = this.state;
		const countFn = (count, filter) => {
			if (filter.active) {
				return count + 1;
			}
			return count;
		};
		const selectedItemsCountInFilter1 = reduce(filter1, countFn, 0);
		const selectedItemsCountInFilter2 = reduce(filter2, countFn, 0);

		let analysisCardWidth =
			window.innerWidth < 900
				? window.innerWidth - 80 - 48 - 24
				: window.innerWidth - 32 * 2 - 24 * 2 - 200 - 50 * 2; // write a function to get all widths

		if (window.innerWidth < 900) {
			analysisCardWidth = Math.max(500, window.innerWidth) - 48 - 24 - 24;
		}

		let showModifications = false;
		roadmap.forEach(r => {
			if (r.questionsAttempted) showModifications = true;
		});

		let correct = correctQuestions;
		let incorrect = incorrectQuestions;

		const yourEasyTime = difficulty.easy.totalAttempts
			? difficulty.easy.time / difficulty.easy.totalAttempts
			: 0;
		const yourMediumTime = difficulty.medium.totalAttempts
			? difficulty.medium.time / difficulty.medium.totalAttempts
			: 0;
		const yourHardTime = difficulty.hard.totalAttempts
			? difficulty.hard.time / difficulty.hard.totalAttempts
			: 0;

		const avgEasyTime = difficultyStats.easy.meanTime
			? difficultyStats.easy.meanTime
			: 0;
		const avgMediumTime = difficultyStats.medium.meanTime
			? difficultyStats.medium.meanTime
			: 0;
		const avgHardTime = difficultyStats.hard.meanTime
			? difficultyStats.hard.meanTime
			: 0;

		const difficultyDataTime = [];

		if (difficultyStats.easy.totalAttempts) {
			difficultyDataTime.push({
				difficulty: 'Easy',
				you: yourEasyTime,
				average: avgEasyTime,
			});
		}
		if (difficultyStats.medium.totalAttempts) {
			difficultyDataTime.push({
				difficulty: 'Medium',
				you: yourMediumTime,
				average: avgMediumTime,
			});
		}
		if (difficultyStats.hard.totalAttempts) {
			difficultyDataTime.push({
				difficulty: 'Hard',
				you: yourHardTime,
				average: avgHardTime,
			});
		}

		const attemptTime = [
			{
				name: 'Correct',
				avgTime: correctTime,
			},
			{
				name: 'Incorrect',
				avgTime: incorrectTime,
			},
			{
				name: 'Unattempted',
				avgTime: unattemptedTime,
			},
		];

		let text_ = '';
		if (firstSeenTime === -1) {
			if (firstSeenCorrect + firstSeenIncorrect) {
				text_ = `You havn't seen the complete paper and attempted ${firstSeenCorrect +
					firstSeenIncorrect} questions
					with an first look accuracy of ${Math.round(
						(100.0 * firstSeenCorrect) / (firstSeenCorrect + firstSeenIncorrect)
					)}%. Attempting easy questions first and marking tough
					questions for later is the key to get good marks.`;
			} else {
				text_ = `You havn't seen the complete paper and attempted ${correct +
					incorrect} questions
					with an accuracy of ${Math.round(
						precision
					)}%. Attempting easy questions first and marking tough
					questions for later is the key to get good marks.`;
			}
		} else {
			if (firstSeenCorrect + firstSeenIncorrect) {
				text_ = `You have seen the complete paper in ${Math.floor(
					firstSeenTime / 60000.0
				)} minutes and attempted ${firstSeenCorrect + firstSeenIncorrect} questions
					with an first look accuracy of ${Math.round(
						(100.0 * firstSeenCorrect) / (firstSeenCorrect + firstSeenIncorrect)
					)}%. Attempting easy questions first and marking tough
					questions for later is the key to get good marks.`;
			} else {
				text_ = `You have seen the complete paper in ${Math.floor(
					firstSeenTime / 60000.0
				)} minutes and attempted ${correct + incorrect} questions
					with an accuracy of ${Math.round(
						precision
					)}%. Attempting easy questions first and marking tough
					questions for later is the key to get good marks.`;
			}
		}

		// text_ += behaviourMap[assessmentCategory.category].description
		// 	? ` ${behaviourMap[assessmentCategory.category].description}`
		// 	: '';

		const topicDropdown = {};
		roadmap.forEach(r => {
			if (TopicNameMapping[r.topic]) {
				topicDropdown[r.topic] = TopicNameMapping[r.topic];
			}
		});
		const isTopicFilterVisible = Object.keys(topicDropdown).length > 1;

		const topicMenu = (
			<Menu>
				<Menu.Item
					onClick={() => {
						this.setState({ topicFilter: '' });
					}}
				>
					All
				</Menu.Item>
				{Object.keys(topicDropdown).map(k => {
					return (
						<Menu.Item onClick={this.updateTopicFilter.bind(this, k)} key={k}>
							{topicDropdown[k]}
						</Menu.Item>
					);
				})}
			</Menu>
		);

		const analysisCardWidth2 =
			window.screen.width < 900 ? analysisCardWidth - 24 : analysisCardWidth / 2;
		return (
			<Card className="analysis-part-three" style={{ width: '100%' }}>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
					<div
						style={{
							fontSize: 16,
							fontWeight: 'bold',
							marginRight: 12,
						}}
					>
						Roadmap
					</div>
					<button
						style={{
							background: 'transparent',
							padding: 0,
							border: 'none',
							display: 'inline-flex',
							cursor: 'pointer',
						}}
						onClick={this.openHowToReadRoadmapModal}
					>
						<AiFillQuestionCircle size={24} />
					</button>
				</div>
				<div>
					Roadmap will give the timeline of the paper i.e at what time you attempted
					which question and how you performed in each question. Use filters below to
					deep dive in paper analysis.
				</div>

				<Roadmap
					googleAnalyticsData={{
						eventAction: 'View Roadmap',
						eventCategory: 'Analysis',
						eventLabel: 'Roadmap with filter option',
					}}
					isGraphReady={this.props.isGraphReady}
					roadmap={roadmap}
					data_x={showModifications ? 'lastVisit' : 'firstVisit'}
					data_y="timeToughness"
					filter1={filter1}
					filter2={filter2}
					topicFilter={topicFilter}
					width={analysisCardWidth}
					duration={duration}
					firstSeenTime={firstSeenTime / 1000}
				/>

				<div className="roadmap-filters-container">
					<div className="filter-list">
						{filter1.map((f, idx) => {
							const isDisabled = selectedItemsCountInFilter1 === 1 && f.active;
							const component = (
								<button
									data-ga-on="click"
									data-ga-event-action="Change Roadmap Filter"
									data-ga-event-category="Analysis"
									data-ga-event-label={`${f.active ? 'Unselect' : 'Select'} ${f.name}`}
									className={classnames('filter-list-item', {
										'is-active': f.active,
										'cursor-not-allowed': isDisabled,
									})}
									onClick={isDisabled ? undefined : this.toggleFilter1.bind(this, idx)}
								>
									<div
										style={{
											width: 15,
											height: 15,
											marginRight: 8,
										}}
									>
										<svg width="15" height="15">
											{f.name === 'Too Fast' ? (
												<polygon points="0,0 0,15 15,15 15,0" fill="#333" />
											) : f.name === 'Overtime' ? (
												<polygon
													points="7.5,15 1.00480947161671,3.7500000000000004 13.99519052838329,3.7500000000000004"
													fill="#333"
												/>
											) : (
												<circle cx={7.5} cy={7.5} r={7.5} fill="#333" />
											)}
										</svg>
									</div>
									{f.name}
								</button>
							);
							if (isDisabled) {
								return (
									<Tooltip title="At least one item must be selected">
										{component}
									</Tooltip>
								);
							}
							return component;
						})}
					</div>
					{isTopicFilterVisible && (
						<Dropdown overlay={topicMenu} placement="bottomLeft">
							<Button>
								{TopicNameMapping[topicFilter] ? TopicNameMapping[topicFilter] : 'All'}
							</Button>
						</Dropdown>
					)}
					<div className="filter-list">
						{filter2.map((f, idx) => {
							const isDisabled = selectedItemsCountInFilter2 === 1 && f.active;

							const component = (
								<button
									data-ga-on="click"
									data-ga-event-action="Change Roadmap Filter"
									data-ga-event-category="Analysis"
									data-ga-event-label={`${f.active ? 'Unselect' : 'Select'} ${f.name}`}
									className={classnames('filter-list-item', {
										'is-active': f.active,
										'cursor-not-allowed': isDisabled,
									})}
									onClick={isDisabled ? undefined : this.toggleFilter2.bind(this, idx)}
								>
									<div
										style={{
											backgroundColor: f.color,
											width: 14,
											height: 14,
											marginRight: 4,
											borderRadius: 1000,
										}}
									></div>
									{f.name}
								</button>
							);
							if (isDisabled) {
								return (
									<Tooltip title="At least one item must be selected">
										{component}
									</Tooltip>
								);
							}
							return component;
						})}
					</div>
				</div>

				<div style={{ margin: '8px 0' }}>{text_}</div>

				<div
					style={{
						marginTop: 20,
						paddingTop: 20,
						marginBottom: 4,
						fontSize: 16,
						fontWeight: '600',
						width: '100%',
						borderTop: 'solid 1px #dcdae0',
					}}
				>
					Time Usage
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-evenly',
					}}
					className="time-difficulty-wrapper"
				>
					<TimeBar data={attemptTime} width={analysisCardWidth2} />
					{false && difficultyDataTime.length ? (
						<DifficultyBar
							type="time"
							data={difficultyDataTime}
							width={analysisCardWidth2}
						/>
					) : null}
				</div>
				<OptionalQuestionSelection
					submission={submission}
					assessmentCore={assessmentCore}
					bestQuestionGroupChoices={bestQuestionGroupChoices}
				/>
				<Modal
					visible={this.state.isHowToReadRoadmapModalOpen}
					onCancel={this.closeHowToReadRoadmapModal}
					centered
					footer={
						<Button onClick={this.closeHowToReadRoadmapModal} type="primary">
							Okay
						</Button>
					}
					title="How to interpret Roadmap?"
				>
					<Paragraph>
						There is one point in the graph for every question you have visited.
						<br />
						<br />
						Circle, Square, and Triangle are present for Perfect, Too Fast, and
						Overtime labelled attempts, respectively.
						<br />
						An attempt is labelled <b>Too Fast</b> if you spend very little time on
						the question, <b>Too Slow</b> if you spend too much time on the question,
						otherwise Perfect.
						<br />
						<br />
						Green, Red, and, Grey colours represent correct, incorrect, and
						unattempted questions, respectively.
					</Paragraph>
					<Paragraph>
						You can filter out the attempts by selecting or unselecting boxes(Perfect,
						Too Fast, Overtime, Correct, Incorrect, Unattempted).
					</Paragraph>
					<Paragraph>
						Hover over or click a point in the graph to see question details.
						<br />
						Details like the time you have spent, times you visited a question,
						average accuracy, and average time are present when you hover or click a
						point in the graph.
					</Paragraph>
				</Modal>
			</Card>
		);
	};
}

const OptionalQuestionSelection = ({
	assessmentCore,
	bestQuestionGroupChoices,
	submission,
}) => {
	const submissionMetaSectionModified = useMemo(
		() =>
			submission.meta.sections.map(
				createMapSubmissionMetaSection(
					assessmentCore,
					bestQuestionGroupChoices,
					submission
				)
			),
		[assessmentCore, bestQuestionGroupChoices, submission]
	);
	const data = useMemo(() => {
		let questionOffset = 0;
		return submissionMetaSectionModified.map(section => {
			const bestQuestions = [];
			const worstQuestions = [];
			let bestChosen = 0;
			let worstChosen = 0;
			section.questions.forEach((question, questionIndex) => {
				if (question.isOptional) {
					const d = {
						index: questionIndex,
						number: questionOffset + questionIndex + 1,
						isAnswered: question.isAnswered,
					};
					if (question.isBestChoice) {
						bestQuestions.push(d);
						if (question.isAnswered) {
							bestChosen += 1;
						}
					} else {
						worstQuestions.push(d);
						if (question.isAnswered) {
							worstChosen += 1;
						}
					}
				}
			});
			questionOffset += section.questions.length;
			return {
				name: section.name,
				bestQuestions,
				worstQuestions,
				bestChosen,
				worstChosen,
				ratio:
					worstChosen === 0 && bestChosen === 0
						? 'NA'
						: bestChosen / (bestChosen + worstChosen),
			};
		});
	}, [submissionMetaSectionModified]);
	const columns = [
		{
			title: 'Section',
			dataIndex: 'name',
		},
		{
			title: 'Best Choices',
			dataIndex: 'bestQuestions',
			render: (questions, d) => {
				return questions.map(question => {
					return (
						<span
							style={{
								display: 'inline-flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								minWidth: 40,
								marginRight: 8,
							}}
						>
							<Tooltip
								title={
									question.isAnswered ? 'Great, you attempted this question.' : null
								}
							>
								<span
									style={{
										display: 'inline-flex',
										height: 28,
										width: 28,
										borderRadius: 30,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: question.isAnswered ? 'rgba(0,255,0,0.2)' : '',
									}}
								>
									{question.number}
								</span>
							</Tooltip>
							<span style={{ display: 'none' }}>
								{question.isAnswered ? (
									<Tooltip title="Great, you attempted this question.">
										<CheckCircleOutlined style={{ marginLeft: 8, color: 'green' }} />
									</Tooltip>
								) : (
									''
								)}
							</span>
						</span>
					);
				});
			},
		},
		{
			title: 'Worst Choices',
			dataIndex: 'worstQuestions',
			render: questions => {
				return questions.map(question => {
					return (
						<span
							style={{
								display: 'inline-flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								minWidth: 40,
								marginRight: 8,
							}}
						>
							<Tooltip
								title={
									question.isAnswered
										? 'You should not have attempted this question.'
										: null
								}
							>
								<span
									style={{
										display: 'inline-flex',
										height: 28,
										width: 28,
										borderRadius: 30,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: question.isAnswered ? 'rgba(255,0,0,0.2)' : '',
									}}
								>
									{question.number}
								</span>
							</Tooltip>
							<span style={{ display: 'none' }}>
								{question.isAnswered ? (
									<Tooltip title="You should not have attempted this question.">
										<CloseCircleOutlined style={{ marginLeft: 8, color: 'red' }} />
									</Tooltip>
								) : (
									''
								)}
							</span>
						</span>
					);
				});
			},
		},
		{
			title: 'Selectivity',
			dataIndex: 'ratio',
			render: ratio => {
				if (typeof ratio !== 'number') {
					return ratio;
				}
				return (
					<div>
						<div
							style={{
								width: '100%',
								minWidth: 40,
								position: 'relative',
								display: 'flex',
								height: 16,
								overflow: 'hidden',
								borderRadius: 8,
							}}
						>
							<div
								style={{
									backgroundColor: '#61c858',
									width: `${ratio * 100}%`,
									height: 16,
									display: 'flex',
								}}
							/>
							<div
								style={{ backgroundColor: '#f43a3a', flexGrow: 1, display: 'flex' }}
							/>
						</div>
						<div style={{ marginLeft: 8, marginTop: 4 }}>
							{parseInt(ratio * 100)}%
						</div>
					</div>
				);
			},
		},
	];
	const hasOptionGroups = useMemo(() => {
		return every(
			assessmentCore.sections,
			section =>
				Array.isArray(section.questionGroups) &&
				section.questionGroups.length &&
				some(section.questionGroups, g => g.questions && g.questions.length)
		);
	}, [assessmentCore.sections]);
	if (!hasOptionGroups) {
		return null;
	}
	return (
		<div style={{ marginTop: '1rem' }}>
			<Title level={4}>Optional Question Selection</Title>
			<div>
				<Table pagination={false} columns={columns} dataSource={data} />
			</div>
		</div>
	);
};

export default AnalysisPartThree;
