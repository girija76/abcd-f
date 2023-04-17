import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Modal, Tabs, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import relativePlugin from 'dayjs/plugin/relativeTime';

import { EyeOutlined } from '@ant-design/icons';
import { get, includes } from 'lodash';

import Clock from 'widgets/Clock';
import QuestionLink from './QuestionLink';
import TestSummary from '../tests/TestSummary';
import './Sidebar.css';

import { moveToQuestion } from '../api/ApiAction';
import { actions } from 'reducers/liveTest';

import { getVerifiedFlowState } from 'utils/flow';
import Progress from './Progress';
import {
	createHasStartedExtraSections,
	createCanStartExtraSections,
} from 'utils/assessment';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import UserInfo from './UserInfo';
import { features } from 'utils/config';

const TabPane = Tabs.TabPane;
dayjs.extend(relativePlugin);

export class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isRunning: true,
			confirmSubmit: false,
			timer: null,
			showingUserInfo: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		const elem = document.getElementById('question-links-container');

		const sW = window.screen.width;
		if (this.props.CurrQuestion !== nextProps.CurrQuestion && elem) {
			if (elem) {
				elem.scrollLeft = 82 * nextProps.CurrQuestion + 72 - 10 - 0.5 * sW;
			}
		}
	}

	componentDidMount() {
		const sW = window.screen.width;

		setTimeout(() => {
			const elem = document.getElementById('question-links-container');
			const { CurrQuestion } = this.props;
			if (elem) {
				elem.scrollLeft = 82 * CurrQuestion + 72 - 10 - 0.5 * sW;
			}
		}, 200);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.CurrSection !== this.props.CurrSection) return true;
		if (nextProps.submitting !== this.props.submitting) return true;
		if (nextState.isRunning !== this.state.isRunning) return true;
		if (nextState.confirmSubmit !== this.state.confirmSubmit) return true;
		if (nextState.showingUserInfo !== this.state.showingUserInfo) return true;

		if (
			nextProps.nonTimedOutQuestionsBySections !==
			this.props.nonTimedOutQuestionsBySections
		) {
			return true;
		}
		return false;
	}

	confirmSubmit = () => this.setState({ confirmSubmit: true });

	cancelSubmit = () => this.setState({ confirmSubmit: false });

	submitAnswers = (force = false) => {
		const sEvent = force ? 'user' : 'clock';
		let { sidebarLinks, duration, startTime } = this.props;

		let lastTime = 0;
		const startTimes = sidebarLinks.map(section => {
			const startTime_ = lastTime;
			lastTime += section.duration !== -1 ? section.duration : 0;
			return startTime_;
		});

		lastTime = 0;
		const endTimes = sidebarLinks.map(section => {
			lastTime += section.duration !== -1 ? section.duration : 0;
			return lastTime;
		});

		const timeNow = new Date().getTime();

		let totalDuration = 0;
		let currSection = 0;

		startTimes.forEach((st, idx) => {
			if (timeNow - startTime > 1000 * totalDuration) {
				totalDuration = endTimes[idx];
				currSection = idx;
			}
		});

		if (force || timeNow - startTime > 1000 * duration) {
			const { timer } = this.state;
			clearInterval(timer);
			const { MyQuestions } = this.props;

			const verifiedFlow = this.props.getVerifiedFlowState(); // we call it before we want to update flow!!
			this.props.onSubmit(MyQuestions, verifiedFlow, sEvent);
		} else {
			this.moveToQuestion({
				section: currSection,
				question: 0,
			});
		}
	};

	handleTabChange = key => {
		const { config, hasStartedExtra } = this.props;
		const extraSections = get(config, ['extraSections'], []);
		const sectionIndex = parseInt(key.split('-')[1]);
		if (!hasStartedExtra && extraSections.includes(sectionIndex)) {
			Modal.confirm({
				title: 'Are you sure you want to start Extra Question?',
				centered: true,
				content: (
					<div>
						You can not attempt previous sections if you start attempting Extra
						Questions.
					</div>
				),
				onOk: () => {
					this.moveToQuestion({
						section: sectionIndex,
						question: 0,
					});
				},
				okText: 'Yes, Start Extra Questions',
				cancelText: 'No, cancel',
			});
		} else {
			this.moveToQuestion({
				section: sectionIndex,
				question: 0,
			});
		}
	};

	moveToQuestion = ({ section, question }) => {
		this.props.moveToQuestion({ section, question });
		this.props.requestFlowSync();
	};

	openUserInfo = () => {
		this.setState({ showingUserInfo: true });
	};

	closeUserInfo = () => {
		this.setState({ showingUserInfo: false });
	};

	render() {
		let {
			sidebarLinks,
			CurrSection,
			submitting,
			startTime,
			duration,
			nonTimedOutQuestionsBySections,
			openScrollViewMode,
			onClickTrySync,
			questionNumberingConfig,
			config,
			wrapper,
			hasStartedExtra,
			canStartExtra,
		} = this.props;

		const extraSections = get(config, ['extraSections'], []);

		let lastTime = 0;
		const startTimes = sidebarLinks.map(section => {
			const startTime_ = lastTime;
			lastTime += section.duration !== -1 ? section.duration : 0;
			return startTime_;
		});

		lastTime = 0;
		const endTimes = sidebarLinks.map(section => {
			lastTime += section.duration !== -1 ? section.duration : 0;
			return lastTime;
		});

		const timeNow = new Date().getTime();

		let totalDuration = 0;
		startTimes.forEach((st, idx) => {
			if (timeNow - startTime > 1000 * totalDuration) {
				totalDuration = endTimes[idx];
			}
		});

		const disableSubmit = timeNow - startTime < 1000 * duration ? true : false;

		let timeLimitFound = true;
		let sectionLinks = sidebarLinks.map((section, id) => {
			let disabled = false;
			if (section.duration !== -1) {
				const { startTime } = this.props;
				if (
					timeNow - startTime < 1000 * startTimes[id] ||
					timeNow - startTime > 1000 * endTimes[id]
				)
					disabled = true;
			} else {
				timeLimitFound = false;
			}
			if (extraSections.length) {
				if (hasStartedExtra) {
					if (!extraSections.includes(id)) {
						disabled = true;
					}
				} else {
					if (!canStartExtra && extraSections.includes(id)) {
						disabled = true;
					}
				}
			}

			return (
				<TabPane key={'section-' + id} tab={section.name} disabled={disabled}>
					<div className="question-links-container" id="question-links-container">
						{section.questions.map(qid => {
							const isDisabled = !includes(
								get(nonTimedOutQuestionsBySections, id),
								qid
							);
							const disableReason = isDisabled
								? 'You have exceeded the time limit of this question'
								: null;
							return (
								<QuestionLink
									disabled={isDisabled}
									disableReason={disableReason}
									key={'question-' + CurrSection + '-' + qid}
									CurrSection={CurrSection}
									questionNo={qid}
									sectionNo={id}
									questionOffsets={sidebarLinks}
									questionNumberingConfig={questionNumberingConfig}
									moveToQuestion={this.moveToQuestion}
								/>
							);
						})}
					</div>
				</TabPane>
			);
		});

		let { confirmSubmit, isRunning, showingUserInfo } = this.state;

		const clockOnEndFn = submitting === 0 ? this.submitAnswers : function() {};

		return (
			<div
				style={{
					backgroundColor: 'white',
				}}
				className="sidebar-head"
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
					className="sidebar-timer-container"
				>
					<div className="timer-header">Time Left</div>
					<div className="clock-wrapper">
						<Clock
							key={'section-' + CurrSection}
							isRunning={isRunning}
							startTime={startTime}
							endTime={null}
							type="timer"
							timerLimit={totalDuration ? totalDuration : duration}
							onEnd={clockOnEndFn}
							style={{
								fontSize: 26,
								color: '#809090',
								fontWeight: 'bolder',
							}}
						/>
						<div className="progress-container">
							<Progress onClickTrySync={onClickTrySync} />
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{features.TEST_SHOW_USER_INFO ||
						(Array.isArray(config.extraSections) &&
							config.extraSections.length) ? null : (
							<Tooltip title="Enter Scroll View Mode">
								<Button icon={<EyeOutlined />} onClick={openScrollViewMode} />
							</Tooltip>
						)}

						{features.TEST_SHOW_USER_INFO ? (
							<Button
								className="mobile-user-info"
								icon={<AiOutlineInfoCircle />}
								onClick={this.openUserInfo}
							/>
						) : null}

						<Modal
							width="100%"
							visible={showingUserInfo}
							closable={false}
							title="User and test information"
							onCancel={this.closeUserInfo}
							footer={
								<Button type="primary" onClick={this.closeUserInfo}>
									Ok
								</Button>
							}
							centered
							bodyStyle={{ padding: '.5rem 0 0' }}
						>
							<UserInfo wrapper={wrapper} />
						</Modal>
						<Button
							className="finish-mini-button"
							type="primary"
							onClick={this.confirmSubmit}
							disabled={timeLimitFound && disableSubmit}
						>
							Finish Test
						</Button>
					</div>
				</div>
				<Tabs
					centered
					defaultActiveKey={'section-' + CurrSection}
					activeKey={'section-' + CurrSection}
					className="sidebar-tabs"
					onChange={this.handleTabChange}
				>
					{sectionLinks}
				</Tabs>
				<div
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						marginBottom: 12,
					}}
					className="instruction-link-wrapper"
				>
					<Progress onClickTrySync={onClickTrySync} />
					<Button
						type="link"
						onClick={this.props.toggleInstructions}
						style={{ marginTop: 4, marginBottom: 4 }}
					>
						View Instructions
					</Button>

					<Button
						className="finish-button"
						type="primary"
						onClick={this.confirmSubmit}
						size="large"
						style={{ width: `calc(100% - ${40}px)` }}
						disabled={timeLimitFound && disableSubmit}
					>
						Finish Test
					</Button>
				</div>

				{features.TEST_SHOW_USER_INFO ? (
					<div className="sidebar-user-details">
						<UserInfo wrapper={wrapper} />
					</div>
				) : null}
				<Modal
					title="Test Summary"
					visible={confirmSubmit && submitting !== 2}
					footer={null}
					onCancel={this.cancelSubmit}
					bodyStyle={{ padding: 0 }}
					headStyle={{ borderBottom: '0px' }}
					style={{ color: 'blue' }}
					centered={true}
					width={720}
				>
					<TestSummary
						submitAnswers={this.submitAnswers}
						cancelSubmit={this.cancelSubmit}
						submitting={submitting}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	MyQuestions: state.api.MyQuestions,
	Flow: state.api.Flow,
	CurrSection: state.api.CurrSection,
	CurrQuestion: state.api.CurrQuestion,
	QuestionStartTime: state.api.QuestionStartTime,
	getVerifiedFlowState: () => getVerifiedFlowState(state),
	hasStartedExtra: createHasStartedExtraSections(ownProps.config)(state),
	canStartExtra: createCanStartExtraSections(ownProps.config)(state),
});

const mapDispatchToProps = dispatch => {
	return {
		moveToQuestion: currQuestion => dispatch(moveToQuestion(currQuestion)),
		setTimeSpentInQuestionsByKey: (...args) =>
			dispatch(actions.setTimeSpentInQuestionsByKey(...args)),
		requestFlowSync: () => dispatch(actions.requestFlowSync()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
