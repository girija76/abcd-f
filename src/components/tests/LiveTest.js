import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { notification, Modal, message, Button, Space } from 'antd';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';

import Instructions from 'components/instructions/Instructions';
import Sidebar from 'components/sidebar/Sidebar';
import { URLS } from 'components/urls';
import { getTotalTimeSpentInQuestion } from 'utils/flow';

import QuestionWrapper from './QuestionWrapper';
import ScrollablePaper from './ScrollablePaper';
import './LiveTest.css';

import { moveToQuestion } from '../api/ApiAction';
import { clearUserApiResponseCache } from 'utils/user';
import { autoUpdateFlowAsync } from 'actions/assessment';
import { getCriticalSyncInfo } from 'utils/assessment';
import * as liveTestSelectors from 'selectors/liveTest';
import { MdSyncProblem } from 'react-icons/md';
import { isDev } from 'utils/config';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

class LiveTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showInstructions: false,
			submitting: 0,
			showScrollablePaper: false,
		};
	}

	componentDidMount() {
		this.setupAutoSync();
	}

	componentWillUnmount() {
		this.cleanUpAutoSync();
	}

	componentDidUpdate() {
		this.handleSyncAlert();
	}

	handleSyncAlert = () => {
		const { syncFailCount, isSyncing, lastSyncedAt } = this.props;
		const now = Date.now();
		const durationNotSynced = now - lastSyncedAt;
		let syncErrorMessage = '';
		if (isNaN(durationNotSynced)) {
			syncErrorMessage =
				'Trouble saving your progress. Please check your internet.';
		} else {
			const duration = dayjs.duration(durationNotSynced);
			try {
				syncErrorMessage = `Progress in last ${duration.humanize(
					false
				)} not saved. Please check your internet.`;
			} catch (e) {
				syncErrorMessage = 'Error occurred while saving progress.';
				console.error(e);
			}
		}
		const messageKey = 'assessment-flow-sync-failed-alert';
		if (syncFailCount > 10) {
			message.success({
				content: (
					<Space>
						<span>{syncErrorMessage}</span>
						<Button
							size="small"
							loading={isSyncing}
							onClick={() => this.conditionallyDecideAndUpdateSyncFlow(true)}
						>
							Try now
						</Button>
					</Space>
				),
				duration: 0,
				key: messageKey,
				icon: (
					<MdSyncProblem
						style={{ fontSize: 22, float: 'left', marginRight: 8 }}
						color="red"
					/>
				),
			});
		} else {
			message.destroy(messageKey);
		}
	};

	conditionallyDecideAndUpdateSyncFlow = (skipTimeCheck = false) => {
		const {
			hasCriticalInfoSyncPending,
			isSyncing,
			lastSyncedAt,
			syncFailCount,
		} = this.props;
		const { submitting } = this.state;
		if (isSyncing || submitting) {
			return;
		}
		const now = Date.now();
		// normally sync after 120 seconds
		let minInterval = 120 * 1000;
		// definitely sync after this duration
		let maxSyncDuration = 420 * 1000;
		if (hasCriticalInfoSyncPending) {
			// answer has been changed, so it's critical to sync
			// when critical, sync after 15 seconds
			minInterval = 15 * 1000;
			maxSyncDuration = 300 * 1000;
		}
		const totalIntervalDueToFailures = Math.min(
			maxSyncDuration,
			minInterval * (1 + syncFailCount)
		);
		if (
			skipTimeCheck ||
			!lastSyncedAt ||
			now - lastSyncedAt > totalIntervalDueToFailures
		) {
			this.props.autoUpdateFlowAsync();
		}
	};
	setupAutoSync = () => {
		this.autoSyncTimeoutId = setInterval(() => {
			this.conditionallyDecideAndUpdateSyncFlow();
		}, 1000);
	};
	cleanUpAutoSync = () => {
		clearInterval(this.autoSyncTimeoutId);
	};

	startTest = () => {
		this.setState({ showInstructions: false });
	};

	toggleInstructions = () => {
		this.setState({ showInstructions: true });
	};

	submitTest = async (myQuestions, flow, sEvent) => {
		// this should be locked -> only one submission at a time

		const { hasCriticalInfoSyncPending } = this.props;

		const { submitting } = this.state;

		if (submitting === 0) {
			const { id } = this.props;

			this.setState({ submitting: 1 });

			if (hasCriticalInfoSyncPending) {
				const savingProgressModal = Modal.info({
					content: 'Saving progress before submitting',
					onCancel: e => true,
					okButtonProps: { style: { display: 'none' } },
				});
				try {
					await this.props.autoUpdateFlowAsync();
					savingProgressModal.destroy();
				} catch (e) {
					let errorCode = null;
					try {
						errorCode = e.code;
					} catch (e) {}
					if (errorCode !== 'assessment-time-exceeded') {
						savingProgressModal.destroy();
						const modal = Modal.error({
							content: (
								<Space direction="vertical">
									<div>
										Failed to save progress. Check your internet connection and retry.
									</div>
									<Space>
										{sEvent === 'user' ? (
											<Button
												onClick={() => {
													this.setState({ submitting: 0 });
													modal.destroy();
												}}
											>
												Cancel
											</Button>
										) : null}
										<Button
											onClick={() => {
												this.setState({ submitting: 0 }, () => {
													this.submitTest(myQuestions, flow, sEvent);
													modal.destroy();
												});
											}}
										>
											Retry
										</Button>
									</Space>
								</Space>
							),
							keyboard: sEvent === 'user',
							onCancel: () => {
								this.setState({ submitting: 0 });
							},
							okText: 'Retry',
							okButtonProps: {
								style: { display: 'none' },
							},
						});
						return;
					}
				}
			}

			fetch(`${URLS.backendAssessment}/submit`, {
				// check if syncFlow is not pending!!!
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					assessmentId: id,
					response: myQuestions,
					sEvent,
					useFlow: true,
				}),
			})
				.then(res => res.json())
				.then(result => {
					localStorage.removeItem('myQuestions');
					localStorage.removeItem('flow');
					localStorage.removeItem('currSection');
					localStorage.removeItem('currQuestion');
					localStorage.removeItem('startTime');
					localStorage.removeItem('liveTestId');
					localStorage.removeItem('questionStartTime');
					this.setState({ submitting: 2 });

					localStorage.setItem(`s-${id}`, JSON.stringify(result['submission'])); //with a expiry date?
					localStorage.setItem(`exp-${id}`, JSON.stringify(new Date().getTime()));
					clearUserApiResponseCache();

					setTimeout(() => {
						window.location = `${URLS.analysisId}/?wid=${id}&from=storage`;
					}, 600);
				})
				.catch(error => {
					this.setState({ submitting: 0 });
					notification.error({
						message: 'Error occurred while submitting. Please try again.',
					});
				});
		} else {
			// do nothing??
		}
	};

	getSidebarLinks = () => {
		const { test } = this.props;
		const sections = test ? test.sections : [];
		let offset = 0;
		return sections.map(sec => {
			offset += sec.questions.length;
			return {
				name: sec.name,
				duration: sec.duration ? sec.duration : -1,
				questions: sec.questions.map((que, id_que) => {
					return id_que;
				}),
				offset: offset - sec.questions.length,
			};
		});
	};
	handleEndQuestionTimer = () => {
		const {
			currentSectionIndex,
			currentQuestionIndex,
			nonTimedOutQuestionsBySections,
		} = this.props;
		const availableBefore = [];
		const availableAfter = [];
		forEach(
			nonTimedOutQuestionsBySections,
			(nonTimedOutQuestions, sectionIndexString) => {
				const sectionIndex = parseInt(sectionIndexString, 10);
				forEach(nonTimedOutQuestions, questionIndex => {
					if (
						currentSectionIndex === sectionIndex &&
						questionIndex === currentQuestionIndex
					) {
						return;
					}
					if (
						sectionIndex < currentSectionIndex ||
						(sectionIndex === currentSectionIndex &&
							questionIndex < currentQuestionIndex)
					) {
						availableBefore.push([sectionIndex, questionIndex]);
					} else {
						availableAfter.push([sectionIndex, questionIndex]);
					}
				});
			}
		);
		const availableQuestionsInOrder = [...availableAfter, ...availableBefore];
		if (availableQuestionsInOrder.length === 0) {
			console.log('no questions available to attempt, submitting now...');
		} else {
			const moveTo = availableQuestionsInOrder[0];
			this.props.moveToQuestion({ section: moveTo[0], question: moveTo[1] });
			console.log(
				`moving to next question section: ${moveTo[0] +
					1}, question number: ${moveTo[1] + 1}`
			);
		}
	};
	render() {
		const { showInstructions, showScrollablePaper, submitting } = this.state;

		const {
			test,
			startTime,
			duration,
			nonTimedOutQuestionsBySections,
			timeSpentBySectionAndQuestion,
			currentSectionIndex,
			currentQuestionIndex,
		} = this.props;

		const sidebarLinks = this.getSidebarLinks();

		if (showScrollablePaper) {
			return (
				<ScrollablePaper
					closeScrollViewMode={() => this.setState({ showScrollablePaper: false })}
					test={test}
				/>
			);
		}
		return (
			<div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						backgroundColor: '#f4f7f7',
						minHeight: '100vh',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'flex-start',
							width: '100%',
							justifyContent: 'center',
						}}
						className="live-test-wrapper"
					>
						<Sidebar
							nonTimedOutQuestionsBySections={nonTimedOutQuestionsBySections}
							sidebarLinks={sidebarLinks}
							questionNumberingConfig={get(test, ['config', 'questionNumbering'])}
							config={get(test, ['config'])}
							wrapper={this.props.wrapper}
							moveToQuestion={this.moveToQuestion}
							toggleInstructions={this.toggleInstructions}
							startTime={startTime}
							duration={duration}
							onSubmit={this.submitTest}
							submitting={submitting}
							openScrollViewMode={() => this.setState({ showScrollablePaper: true })}
							onClickTrySync={() => this.conditionallyDecideAndUpdateSyncFlow(true)}
						/>
						<QuestionWrapper
							previouslyElapsedTime={get(timeSpentBySectionAndQuestion, [
								currentSectionIndex,
								currentQuestionIndex,
							])}
							onTimerEnd={this.handleEndQuestionTimer}
							test={test}
							save={this.save}
							toggleMark={this.toggleMark}
							skip={this.skip}
							onAnswerUpdate={this.save}
							questionOffsets={sidebarLinks}
							questionNumberingConfig={get(test, ['config', 'questionNumbering'])}
						/>
					</div>
				</div>
				<Modal
					title="Instructions"
					visible={showInstructions}
					footer={null}
					onCancel={() => {
						this.setState({ showInstructions: false });
					}}
					className="instructions-modal-test"
				>
					<Instructions
						instructions={test.instructions}
						sectionInstructions={test.sectionInstructions}
						customInstructions={test.customInstructions}
						onStart={this.startTest}
						hideButton={true}
					/>
				</Modal>
				{isDev ? (
					<Space style={{ position: 'fixed', bottom: 10, right: 10 }}>
						<Button
							size="small"
							onClick={() => this.conditionallyDecideAndUpdateSyncFlow(true)}
						>
							Sync Now
						</Button>
						<Button size="small" onClick={() => this.cleanUpAutoSync()}>
							Clear Auto Sync
						</Button>
						<Button size="small" onClick={() => this.setupAutoSync()}>
							Set Auto Sync
						</Button>
					</Space>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const timeSpentBySectionAndQuestion = {};
	const nonTimedOutQuestionsBySections = {};
	forEach(get(ownProps, ['test', 'sections']), (section, sectionIndex) =>
		forEach(get(section, 'questions'), (questionItem, questionIndex) => {
			const timeSpent = getTotalTimeSpentInQuestion(state, {
				questionIndex,
				sectionIndex,
			});
			set(timeSpentBySectionAndQuestion, [sectionIndex, questionIndex], timeSpent);
			let isTimeOver = false;
			const timeLimit = get(questionItem, 'timeLimit');
			if (!isNaN(parseInt(timeLimit, 10))) {
				if (timeSpent >= 1000 * timeLimit) {
					isTimeOver = true;
				}
			} else {
			}
			if (!isTimeOver) {
				if (!nonTimedOutQuestionsBySections[sectionIndex]) {
					nonTimedOutQuestionsBySections[sectionIndex] = [];
				}
				nonTimedOutQuestionsBySections[sectionIndex].push(questionIndex);
			}
		})
	);
	const hasCriticalInfoSyncPending =
		getCriticalSyncInfo(state) !==
		liveTestSelectors.lasySyncedCriticalInfoString(state);
	return {
		timeSpentBySectionAndQuestion,
		nonTimedOutQuestionsBySections,
		currentQuestionIndex: state.api.CurrQuestion,
		currentSectionIndex: parseInt(state.api.CurrSection, 10),
		hasCriticalInfoSyncPending,
		isSyncing: liveTestSelectors.isSyncing(state),
		lastSyncedAt: liveTestSelectors.lastSyncedAt(state),
		lastSyncFailedAt: liveTestSelectors.lastSyncFailedAt(state),
		syncFailCount: liveTestSelectors.syncFailCount(state),
	};
};

const mapDispatchToProps = { moveToQuestion, autoUpdateFlowAsync };

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(LiveTest)
);
