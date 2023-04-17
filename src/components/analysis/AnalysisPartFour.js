/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import Card from 'antd/es/card';
import DifficultyBar from '../plots/DifficultyBar';
import AcademicBar from '../plots/AcademicBar';

class AnalysisPartFour extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filter: 'all',
			key: 'tab1',
			pie: 'q',
			width: window.innerWidth,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	};

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	render = () => {
		const {
			difficulty,
			difficultyStats,
			topics,
			assessmentId,
			TopicNameMapping,
		} = this.props;

		const { width } = this.state;

		const yourEasyAccuracy =
			difficulty.easy.correct + difficulty.easy.incorrect
				? Math.round(
						(10000 * difficulty.easy.correct) /
							(difficulty.easy.correct + difficulty.easy.incorrect)
				  ) / 100
				: 0;
		const yourMediumAccuracy =
			difficulty.medium.correct + difficulty.medium.incorrect
				? Math.round(
						(10000 * difficulty.medium.correct) /
							(difficulty.medium.correct + difficulty.medium.incorrect)
				  ) / 100
				: 0;
		const yourHardAccuracy =
			difficulty.hard.correct + difficulty.hard.incorrect
				? Math.round(
						(10000 * difficulty.hard.correct) /
							(difficulty.hard.correct + difficulty.hard.incorrect)
				  ) / 100
				: 0;

		const yourEasyTime = difficulty.easy.totalAttempts
			? difficulty.easy.time / difficulty.easy.totalAttempts
			: 0;
		const yourMediumTime = difficulty.medium.totalAttempts
			? difficulty.medium.time / difficulty.medium.totalAttempts
			: 0;
		const yourHardTime = difficulty.hard.totalAttempts
			? difficulty.hard.time / difficulty.hard.totalAttempts
			: 0;

		const avgEasyAccuracy =
			difficultyStats.easy.correct + difficultyStats.easy.incorrect
				? Math.round(
						(10000 * difficultyStats.easy.correct) /
							(difficultyStats.easy.correct + difficultyStats.easy.incorrect)
				  ) / 100
				: 0;
		const avgMediumAccuracy =
			difficultyStats.medium.correct + difficultyStats.medium.incorrect
				? Math.round(
						(10000 * difficultyStats.medium.correct) /
							(difficultyStats.medium.correct + difficultyStats.medium.incorrect)
				  ) / 100
				: 0;
		const avgHardAccuracy =
			difficultyStats.hard.correct + difficultyStats.hard.incorrect
				? Math.round(
						(10000 * difficultyStats.hard.correct) /
							(difficultyStats.hard.correct + difficultyStats.hard.incorrect)
				  ) / 100
				: 0;

		const avgEasyTime = difficultyStats.easy.totalAttempts
			? difficultyStats.easy.time / difficultyStats.easy.totalAttempts
			: 0;
		const avgMediumTime = difficultyStats.medium.totalAttempts
			? difficultyStats.medium.time / difficultyStats.medium.totalAttempts
			: 0;
		const avgHardTime = difficultyStats.hard.totalAttempts
			? difficultyStats.hard.time / difficultyStats.hard.totalAttempts
			: 0;

		const difficultyData = [];
		if (difficultyStats.easy.totalAttempts) {
			difficultyData.push({
				difficulty: 'Easy',
				you: yourEasyAccuracy,
				average: avgEasyAccuracy,
			});
		}
		if (difficultyStats.medium.totalAttempts) {
			difficultyData.push({
				difficulty: 'Medium',
				you: yourMediumAccuracy,
				average: avgMediumAccuracy,
			});
		}
		if (difficultyStats.hard.totalAttempts) {
			difficultyData.push({
				difficulty: 'Hard',
				you: yourHardAccuracy,
				average: avgHardAccuracy,
			});
		}

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

		const topicData = [];
		const subtopicData = [];
		topics.forEach(t => {
			if (t.test_performance) {
				Object.keys(t.test_performance).forEach(k => {
					if (k === assessmentId) {
						const { correct, incorrect, unattempted } = t.test_performance[k];
						topicData.push({
							topic: TopicNameMapping[t.id],
							correct,
							incorrect,
							unattempted,
							total: correct + incorrect + unattempted,
							attemptRate:
								(100.0 * (correct + incorrect)) / (correct + incorrect + unattempted),
							precision:
								correct + incorrect ? (100.0 * correct) / (correct + incorrect) : 0,
						});
					}
				});
			}
			if (t.sub_topics) {
				t.sub_topics.forEach(st => {
					if (st.test_performance) {
						Object.keys(st.test_performance).forEach(k => {
							if (k === assessmentId) {
								const { correct, incorrect, unattempted } = st.test_performance[k];
								subtopicData.push({
									topic: TopicNameMapping[st.id],
									correct,
									incorrect,
									unattempted,
									total: correct + incorrect + unattempted,
									attemptRate:
										(100.0 * (correct + incorrect)) / (correct + incorrect + unattempted),
									precision:
										correct + incorrect ? (100.0 * correct) / (correct + incorrect) : 0,
								});
							}
						});
					}
				});
			}
		});

		let selectedData;
		if (false && subtopicData.length > 5) {
			selectedData = topicData;
		} else {
			selectedData = subtopicData;
		}

		const analysisCardWidth =
			width < 900 ? width - 80 - 48 - 24 : width - 32 * 2 - 24 * 2 - 200 - 50 * 2; // write a function to get all widths

		return (
			<Card style={{ width: '100%' }}>
				<div
					style={{
						marginTop: 8,
						marginBottom: 4,
						fontSize: 16,
						fontWeight: 'bold',
						width: '100%',
					}}
				>
					Topic and Difficulty Analysis
				</div>
				<div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
					<div
						style={{
							position: 'relative',
							flex: 1,
							marginTop: 50,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{selectedData.length ? (
							<AcademicBar
								data={selectedData}
								type="accuracy"
								width={analysisCardWidth}
							/>
						) : null}
					</div>
					{difficultyData.length ? (
						<div style={{ flex: 1 }}>
							<DifficultyBar
								data={difficultyData}
								type="accuracy"
								width={analysisCardWidth}
							/>
						</div>
					) : null}
				</div>
			</Card>
		);
	};
}

export default AnalysisPartFour;
