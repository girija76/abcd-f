import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';

import TestSummary from './TestSummary.js';

import { removeRedundantFlow } from '../libs/lib';

import { updateFlowQuestionStartTime, moveToQuestion } from '../api/ApiAction';

class submitButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitting: false,
			confirmSubmit: false,
		};
	}

	componentWillMount() {
		const { timeEnded } = this.props;
		if (timeEnded) {
			console.log('check submitting answer1');
			this.submitAnswers();
		}
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.timeEnded && !this.props.timeEnded) {
			console.log('check submitting answer2');
			this.submitAnswers();
		}
	}

	submitAnswers = (force = false) => {
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
			// const { timer } = this.state;
			// clearInterval(timer);
			const { MyQuestions } = this.props;

			const verifiedFlow = this.verifiedFlowState();
			this.setState({ submitting: 1 });
			this.props.onSubmit(MyQuestions, verifiedFlow);
		} else {
			this.props.moveToQuestion({
				section: currSection,
				question: 0,
			});
		}
	};

	verifiedFlowState = () => {
		const {
			MyQuestions,
			Flow,
			CurrSection,
			CurrQuestion,
			QuestionStartTime,
		} = this.props;
		const FlowCopy = [...Flow];

		const lastFlowMap = {};
		FlowCopy.forEach(f => {
			if (lastFlowMap[`${f.section}-${f.question}`] === undefined) {
				lastFlowMap[`${f.section}-${f.question}`] = true;
				if (
					f.state !== MyQuestions.sections[f.section].questions[f.question].state
				) {
					f.state = MyQuestions.sections[f.section].questions[f.question].state;
				}
				if (
					f.response !== MyQuestions.sections[f.section].questions[f.question].answer
				) {
					f.response = MyQuestions.sections[f.section].questions[f.question].answer;
				}
			}
		});

		const questionEndTime = new Date().getTime();

		FlowCopy.push({
			id: new Date().getTime(),
			section: CurrSection,
			question: CurrQuestion,
			time: questionEndTime - QuestionStartTime,
			action: 0,
			state: MyQuestions.sections[CurrSection].questions[CurrQuestion].state,
			response: MyQuestions.sections[CurrSection].questions[CurrQuestion].answer,
		});

		const flow_ = removeRedundantFlow(FlowCopy);

		this.props.updateFlowQuestionStartTime({
			flow: flow_,
			questionStartTime: questionEndTime,
		});

		return flow_;
	};

	confirmSubmit = () => this.setState({ confirmSubmit: true });

	cancelSubmit = () => this.setState({ confirmSubmit: false });

	render() {
		const { size } = this.props;
		const { confirmSubmit, submitting } = this.state;

		if (size === 'large') {
			return (
				<div style={{ display: 'flex', height: 45, backgroundColor: '#eeeeee' }}>
					<Button type="primary" size="large" onClick={this.confirmSubmit}>
						Submit
					</Button>
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
		} else {
			return (
				<div>
					<div
						style={{
							display: 'flex',
							height: 40,
							lineHeight: '40px',
							margin: '5px 0px',
							padding: '0px 12px',
						}}
						onClick={this.confirmSubmit}
					>
						Submit
					</div>
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
}

const mapStateToProps = state => {
	return {
		MyQuestions: state.api.MyQuestions,
		Flow: state.api.Flow,
		CurrSection: state.api.CurrSection,
		CurrQuestion: state.api.CurrQuestion,
		QuestionStartTime: state.api.QuestionStartTime,
	};
};

const mapDispatchToProps = dispatch => ({
	updateFlowQuestionStartTime: data =>
		dispatch(updateFlowQuestionStartTime(data)),
	moveToQuestion: currQuestion => dispatch(moveToQuestion(currQuestion)),
});

export default connect(mapStateToProps, mapDispatchToProps)(submitButton);
