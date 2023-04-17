import React from 'react';
import { connect } from 'react-redux';
import Button from 'antd/es/button';

import {
	getIntent,
	getEndurance,
	getStubbornness,
} from '../../../utils/userIndexes';

import { bluffs, bluffs2 } from '../../analysis/lib';

import { updateAssessmentWrappersAndFeeds } from '../../api/ApiAction';
import getwrappers from '../../api/getwrappers';

export class Feedback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		const { AssessmentWrappers, activePhase } = this.props;
		if (
			activePhase &&
			(AssessmentWrappers === null || AssessmentWrappers === undefined)
		) {
			const { _id } = activePhase;
			getwrappers(_id)
				.then(response => {
					if (response.ok) {
						response.json().then(responseJson => {
							if (responseJson.success) {
								// this.props.updateAssessmentWrappersAndFeeds(responseJson);
							}
						});
					}
				})
				.catch(err => {
					if (err === 'already-fetched') {
						//
					} else {
						console.log('check error in fetching topic tests', err);
					}
				});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			(nextProps.AssessmentWrappers === null ||
				nextProps.AssessmentWrappers === undefined) &&
			nextProps.activePhase &&
			this.props.activePhase !== nextProps.activePhase
		) {
			const {
				activePhase: { _id },
			} = nextProps;
			getwrappers(_id)
				.then(response => {
					if (response.ok) {
						response.json().then(responseJson => {
							if (responseJson.success) {
								// this.props.updateAssessmentWrappersAndFeeds(responseJson);
							}
						});
					}
				})
				.catch(err => {
					if (err === 'already-fetched') {
						//
					} else {
						console.log('check error in fetching topic tests', err);
					}
				});
		}
	}

	getIntent = session => {
		const { config, questions } = session;
		const { Category } = this.props;

		let previousIntent = -1;
		if (Category) {
			previousIntent = Math.round(Category.intent);
		}

		let correctBluffs = 0;
		let corrects = 0;
		let totalAttempts = 0;
		let totalQuestions = config.questions.total;
		let maxIdleTime = 0;
		let earlyExitTime = 0;
		let duration = config.timeLimit; //update this
		let totalTooFastAttempts = 0;

		questions.forEach(question => {
			if (question.attempt.isCorrect) {
				corrects += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					correctBluffs += 1;
				}
			}

			if (question.attempt.isAnswered) {
				totalAttempts += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					totalTooFastAttempts += 1;
				}
			}

			// totalQuestions += 1; //update this??
			earlyExitTime += question.attempt.time;
		});
		earlyExitTime = duration - earlyExitTime;

		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		if (correctBluffs > 0.4 * corrects) {
			bluff1 = true;
			// cAssigned = 1;
		}
		if (totalTooFastAttempts > 0.4 * totalAttempts) {
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

		const intent = getIntent(
			correctBluffs,
			corrects,
			totalAttempts,
			totalQuestions,
			maxIdleTime,
			earlyExitTime,
			duration
		);

		const toDo = [];
		const notToDo = [];
		if (bluff1 || bluff2) {
			toDo.push(bluffs[0].description);
		} else {
			notToDo.push(bluffs2[0].description);
		}
		if (bluff3) {
			toDo.push(bluffs[1].description);
		} else {
			notToDo.push(bluffs2[1].description);
		}
		if (bluff4) {
			toDo.push(bluffs[2].description);
		} else {
			notToDo.push(bluffs2[2].description);
		}
		if (bluff5) {
			toDo.push(bluffs[3].description);
		} else {
			notToDo.push(bluffs2[3].description);
		}

		return (
			<div>
				<div>
					<span style={{ fontSize: 18, lineHeight: '22px' }}>
						Your intent index in this session is{' '}
					</span>
					<span style={{ fontWeight: 'bold', fontSize: 18 }}>{intent}</span>
					<span style={{ fontSize: 18 }}>
						. Ideal range for this index is 90 - 100.
					</span>
				</div>
				<div>
					{previousIntent !== -1 && intent > previousIntent ? (
						<span>
							Your intent index has increased compared to previous value, which is{' '}
							{previousIntent}.
						</span>
					) : null}
				</div>

				{notToDo.length ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>Things you have done right</div>
						<ul>
							{notToDo.map(td => {
								return <li>{td}</li>;
							})}
						</ul>
					</div>
				) : null}
				{toDo.length ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>Things you have done wrong</div>
						<ul>
							{toDo.map(td => {
								return <li>{td}</li>;
							})}
						</ul>
					</div>
				) : null}
			</div>
		);
	};

	getEndurance = session => {
		const { config, questions } = session;
		let correctsInTime = 0;
		let allNotInTime = 0;

		let correctBluffs = 0;
		let corrects = 0;
		let totalAttempts = 0;
		// let totalQuestions = 0;
		let totalQuestions = config.questions.total;
		let maxIdleTime = 0;
		let earlyExitTime = 0;
		let duration = config.timeLimit; //update this
		let totalTooFastAttempts = 0;

		questions.forEach(question => {
			//
			if (
				question.attempt.isAnswered &&
				question.attempt.time < question.attempt.perfectTimeLimits.max
			) {
				correctsInTime += 1;
			} else if (question.attempt.time >= question.attempt.perfectTimeLimits.max) {
				allNotInTime += 1;
			}

			if (question.attempt.isCorrect) {
				corrects += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					correctBluffs += 1;
				}
			}

			if (question.attempt.isAnswered) {
				totalAttempts += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					totalTooFastAttempts += 1;
				}
			}

			// totalQuestions += 1; //update this??
			earlyExitTime += question.attempt.time;
		});
		if (!duration) duration = earlyExitTime;
		earlyExitTime = duration - earlyExitTime;

		const endurance = getEndurance(correctsInTime, allNotInTime);

		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		let cAssigned = 0;
		if (correctBluffs > 0.4 * corrects) {
			bluff1 = true;
			// cAssigned = 1;
		}
		if (totalTooFastAttempts > 0.4 * totalAttempts) {
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

		const intent = getIntent(
			correctBluffs,
			corrects,
			totalAttempts,
			totalQuestions,
			maxIdleTime,
			earlyExitTime,
			duration
		);

		if (intent < 60) {
			cAssigned = 1;
		}

		return (
			<div>
				<div>
					<span style={{ fontSize: 18, lineHeight: '22px' }}>
						Your endurance index in this session is{' '}
					</span>
					<span style={{ fontWeight: 'bold', fontSize: 18 }}>{endurance}</span>
					<span style={{ fontSize: 18 }}>
						. Ideal range for this index is 70 - 100.
					</span>
				</div>
				<div>
					{correctsInTime + allNotInTime ? (
						<span style={{ fontSize: 18 }}>
							You have attempted {correctsInTime} questions correctly in time out of{' '}
							{correctsInTime + allNotInTime} questions.
						</span>
					) : (
						<span style={{ fontSize: 18 }}>
							You haven't delivered any question correctly in time.
						</span>
					)}
				</div>
				<div style={{ marginTop: 12 }}>
					<span style={{ fontWeight: 'bold' }}>
						Try to solve questions in the given time limit to increase your endurance.
					</span>
				</div>
				{cAssigned === 1 ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>
							Note: Your intent to attempt this session is too low.
						</div>
						<ul>
							{bluff1 || bluff2 ? <li>{bluffs[0].description}</li> : null}
							{bluff3 ? <li>{bluffs[1].description}</li> : null}
							{bluff4 ? <li>{bluffs[2].description}</li> : null}
							{bluff5 ? <li>{bluffs[3].description}</li> : null}
						</ul>
					</div>
				) : null}
			</div>
		);
	};

	getSelectivity = session => {
		const { config, questions, selectedQuestionsToAttempt } = session;
		const { sessionId } = this.props;
		const {
			questions: { total, shouldSelect },
		} = config;

		const questions_ = [...questions];
		questions_.sort((a, b) => {
			if (a.attempt.demoRank <= b.attempt.demoRank) {
				return -1;
			} else {
				return 1;
			}
		});

		const selectedMap = {};
		selectedQuestionsToAttempt.forEach(q => {
			selectedMap[q] = true;
		});

		let selectionScore = 0;
		let bestPossibleScore = 0;
		let correctSelections = 0;
		questions_.forEach((q, i) => {
			if (i < shouldSelect) {
				bestPossibleScore += 0.05 + 0.95 * Math.exp(-i / total);
			}
			if (selectedMap[q.question]) {
				if (i < shouldSelect) {
					correctSelections += 1;
					selectionScore += 0.05 + 0.95 * Math.exp(-i / total);
				} else {
					selectionScore += -0.5 * (0.05 + 0.95 * Math.exp(-(total - i) / total));
				}
			}
		});

		const selectivity = Math.round((100.0 * selectionScore) / bestPossibleScore);

		let correctBluffs = 0;
		let corrects = 0;
		let totalAttempts = 0;
		// let totalQuestions = 0;
		let totalQuestions = config.questions.total;
		let maxIdleTime = 0;
		let earlyExitTime = 0;
		let duration = config.timeLimit; //update this
		let totalTooFastAttempts = 0;

		questions.forEach(question => {
			if (question.attempt.isCorrect) {
				corrects += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					correctBluffs += 1;
				}
			}

			if (question.attempt.isAnswered) {
				totalAttempts += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					totalTooFastAttempts += 1;
				}
			}

			// totalQuestions += 1; //update this??
			earlyExitTime += question.attempt.time;
		});
		earlyExitTime = duration - earlyExitTime;

		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		let cAssigned = 0;
		if (correctBluffs > 0.4 * corrects) {
			bluff1 = true;
			// cAssigned = 1;
		}
		if (totalTooFastAttempts > 0.4 * totalAttempts) {
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

		const intent = getIntent(
			correctBluffs,
			corrects,
			totalAttempts,
			totalQuestions,
			maxIdleTime,
			earlyExitTime,
			duration
		);

		if (intent < 60) {
			cAssigned = 1;
		}

		return (
			<div>
				<div style={{ marginBottom: 12 }}>
					<span>Your selectivity index in this session is </span>
					<span style={{ fontWeight: 'bold' }}>{selectivity}</span>
					<span>. Ideal range for this index is 80 - 100.</span>
				</div>
				<div style={{ marginBottom: 12 }}>
					<span style={{ fontWeight: 'bold' }}>
						You made {correctSelections} correct selections out of {shouldSelect}.
					</span>
				</div>
				<div>
					{selectivity < 80 ? (
						<span>
							Select easy questions and leave hard questions in order to improve your
							selectivity and score more marks.
						</span>
					) : (
						<span>
							You have improved your selectivity index. Try attempting more tests to
							improve your marks.
						</span>
					)}
				</div>
				{cAssigned === 1 ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>
							Note: Your intent to attempt this session is too low.
						</div>
						<ul>
							{bluff1 || bluff2 ? <li>{bluffs[0].description}</li> : null}
							{bluff3 ? <li>{bluffs[1].description}</li> : null}
							{bluff4 ? <li>{bluffs[2].description}</li> : null}
							{bluff5 ? <li>{bluffs[3].description}</li> : null}
						</ul>
					</div>
				) : null}
				<a
					data-ga-on="click"
					data-ga-event-action="click"
					data-ga-event-category="Practice Session: Ended Session"
					data-ga-event-label="Review Questions"
					href={`/practice/active?s=${sessionId}&review&from=session_detail_page`}
				>
					<Button type="primary" ghost>
						Review Selectivity
					</Button>
				</a>
			</div>
		);
	};

	getStubbornness = session => {
		const { config, questions } = session;
		let questionsStuckOn = 0;

		let correctBluffs = 0;
		let corrects = 0;
		let totalAttempts = 0;
		// let totalQuestions = 0;
		let totalQuestions = config.questions.total;
		let maxIdleTime = 0;
		let earlyExitTime = 0;
		let duration = config.timeLimit; //update this
		let totalTooFastAttempts = 0;

		questions.forEach(question => {
			if (question.attempt.time > 1.25 * question.attempt.perfectTimeLimits.max) {
				questionsStuckOn += 1;
			}

			if (question.attempt.isCorrect) {
				corrects += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					correctBluffs += 1;
				}
			}

			if (question.attempt.isAnswered) {
				totalAttempts += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					totalTooFastAttempts += 1;
				}
			}

			// totalQuestions += 1; //update this??
			earlyExitTime += question.attempt.time;
		});
		earlyExitTime = duration - earlyExitTime;

		const stubbornness = getStubbornness(questionsStuckOn, totalAttempts);

		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		let cAssigned = 0;
		if (correctBluffs > 0.4 * corrects) {
			bluff1 = true;
			// cAssigned = 1;
		}
		if (totalTooFastAttempts > 0.4 * totalAttempts) {
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

		const intent = getIntent(
			correctBluffs,
			corrects,
			totalAttempts,
			totalQuestions,
			maxIdleTime,
			earlyExitTime,
			duration
		);

		if (intent < 60) {
			cAssigned = 1;
		}
		return (
			<div>
				<div>
					<span style={{ fontSize: 18 }}>
						Your agility index in this session is{' '}
					</span>
					<span style={{ fontWeight: 'bold', fontSize: 18 }}>{stubbornness}</span>
					<span style={{ fontSize: 18 }}>
						. Ideal range for this index is 90 - 100.
					</span>
				</div>
				<div>
					{questionsStuckOn ? (
						<span style={{ fontSize: 18 }}>
							You stuck in {questionsStuckOn} questions.
						</span>
					) : (
						<span style={{ fontSize: 18 }}>You didn't stuck in any question.</span>
					)}
				</div>
				<div style={{ marginTop: 12 }}>
					{questionsStuckOn ? (
						<span style={{ fontWeight: 'bold' }}>
							Once you get the alert message, you should leave the question as you have
							already spent more than the optimum time required in the question to
							improve your agility.
						</span>
					) : null}
				</div>
				{cAssigned === 1 ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>
							Note: Your intent to attempt this session is too low.
						</div>
						<ul>
							{bluff1 || bluff2 ? <li>{bluffs[0].description}</li> : null}
							{bluff3 ? <li>{bluffs[1].description}</li> : null}
							{bluff4 ? <li>{bluffs[2].description}</li> : null}
							{bluff5 ? <li>{bluffs[3].description}</li> : null}
						</ul>
					</div>
				) : null}
			</div>
		);
	};

	getStamina = session => {
		const { config, questions, startTime } = session;
		const { Category } = this.props;

		let previousStamina = -1;
		if (Category) {
			previousStamina = Math.round(Category.stamina);
		}

		let correctBluffs = 0;
		let corrects = 0;
		let totalAttempts = 0;
		let totalQuestions = 0;
		let maxIdleTime = 0;
		let earlyExitTime = 0;
		let duration = config.timeLimit; //update this
		let totalTooFastAttempts = 0;

		let firstHalfAnswered = 0;
		let secondHalfAnswered = 0;

		const batches = [];
		for (let i = 0; i < config.timeLimit / 240.0; i++) {
			batches.push({
				activity: 0,
			});
		}

		questions.forEach(question => {
			if (question.attempt.isCorrect) {
				corrects += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					correctBluffs += 1;
				}
			}

			if (question.attempt.isAnswered) {
				totalAttempts += 1;
				if (question.attempt.time < question.attempt.perfectTimeLimits.min) {
					totalTooFastAttempts += 1;
				}
			}

			totalQuestions += 1; //update this??
			earlyExitTime += question.attempt.time;

			if (question.attempt.isAnswered) {
				question.attempt.answerSelectionFlow.forEach((f, i) => {
					const eventTime = new Date(f.createdAt).getTime();
					const startTime_ = new Date(startTime).getTime();
					const batchNumber = Math.min(
						batches.length - 1,
						Math.max(0, Math.floor((eventTime - startTime_) / 240000.0))
					);
					batches[batchNumber].activity += 1;
					if (i === question.attempt.answerSelectionFlow.length - 1) {
						if (f.data) {
							const threshold =
								new Date(startTime).getTime() + 0.5 * config.timeLimit * 1000;
							const eventTime = new Date(f.createdAt).getTime();
							if (eventTime < threshold) {
								firstHalfAnswered += 1;
							} else {
								secondHalfAnswered += 1;
							}
						}
					}
				});
			}
		});

		let emptyBatches = 0;
		batches.forEach(b => {
			if (!b.activity) emptyBatches += 1;
		});

		earlyExitTime = duration - earlyExitTime;

		const stamina = Math.round(100 - (100 * emptyBatches) / batches.length);

		let bluff1 = false;
		let bluff2 = false;
		let bluff3 = false;
		let bluff4 = false;
		let bluff5 = false;
		let cAssigned = 0;
		// let intent = 0;
		if (correctBluffs > 0.4 * corrects) {
			bluff1 = true;
			// cAssigned = 1;
		}
		if (totalTooFastAttempts > 0.4 * totalAttempts) {
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

		const intent = getIntent(
			correctBluffs,
			corrects,
			totalAttempts,
			totalQuestions,
			maxIdleTime,
			earlyExitTime,
			duration
		);

		if (intent < 60) {
			cAssigned = 1;
		}
		/*

<span style={{ fontSize: 18 }}>
						You attempted {firstHalfAnswered} questions in first half of of the
						session and {secondHalfAnswered} in second half of the session.
					</span>

*/
		return (
			<div>
				<div>
					<span style={{ fontSize: 18 }}>
						Your stamina index in this session is{' '}
					</span>
					<span style={{ fontWeight: 'bold', fontSize: 18 }}>{stamina}</span>
					<span style={{ fontSize: 18 }}>
						. Ideal range for this index is 70 - 100.
					</span>
				</div>
				<div>
					<span style={{ fontSize: 18 }}>
						You attempted {firstHalfAnswered} questions in first half of of the
						session and {secondHalfAnswered} in second half of the session.
					</span>
				</div>
				<div>
					<span style={{ fontSize: 18 }}>
						The aim of this session is to increase your sitting efficiency and
						maintain your concentration level for at least one hour. Once you will
						develope your sitting capability for one hour we will increase your
						session time to increase your stamina for longer test
					</span>
				</div>
				<div>
					{0 && previousStamina !== -1 && stamina > previousStamina ? (
						<span>
							Your intent index has increased compared to previous value, which is{' '}
							{previousStamina}.
						</span>
					) : null}
				</div>
				{cAssigned === 1 ? (
					<div style={{ marginTop: 18 }}>
						<div style={{ fontWeight: 'bold' }}>
							Note: Your intent to attempt this session is too low.
						</div>
						<ul>
							{bluff1 || bluff2 ? <li>{bluffs[0].description}</li> : null}
							{bluff3 ? <li>{bluffs[1].description}</li> : null}
							{bluff4 ? <li>{bluffs[2].description}</li> : null}
							{bluff5 ? <li>{bluffs[3].description}</li> : null}
						</ul>
					</div>
				) : null}
			</div>
		);
	};

	render() {
		const { session } = this.props;

		const {
			config: { sessionType },
		} = session;

		const functionMap = {
			intent: this.getIntent,
			endurance: this.getEndurance,
			selectivity: this.getSelectivity,
			stubbornness: this.getStubbornness,
			stamina: this.getStamina,
		};

		const feedback = functionMap[sessionType] ? (
			functionMap[sessionType](session)
		) : (
			<div>No feedback</div>
		);

		return (
			<div style={{ display: 'flex', alignItems: 'center' }}>{feedback}</div>
		);
	}
}

const mapStateToProps = state => ({
	AssessmentWrappers: state.api.AssessmentWrappers,
	Category: state.api.Category,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
