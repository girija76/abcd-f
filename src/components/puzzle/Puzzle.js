/* eslint-disable no-unused-vars */
import React from 'react';
import Editor from '../Editor';
import { connect } from 'react-redux';
import Card from 'antd/es/card';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import Input from 'antd/es/input';
import { URLS } from '../urls';
import { COLORS } from '../colors';
import { fillData } from '../libs/lib';
import { updatePuzzle } from '../api/ApiAction';
import GoalPie from '../plots/goalPie';
// import './Goal.css';

import { getRsbWidth } from '../libs/lib';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

export class Goal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: false,
			viewPuzzle: false,
			userAnswer: '',
			answerError: false,
			isSubmitting: false,
		};
	}

	viewPuzzle = () => {
		this.setState({ viewPuzzle: true });
	};

	handleAnswer = answer => {
		if (answer.target.value === '-') {
			this.setState({ userAnswer: answer.target.value, answerError: false });
		} else if (isNaN(answer.target.value)) {
		} else if (answer.target.value.indexOf('.') !== -1) {
		} else if (answer.target.value.indexOf('e') !== -1) {
		} else {
			this.setState({ userAnswer: answer.target.value, answerError: false });
		}
	};

	submitAnswer = () => {
		const {
			puzzle: { _id },
		} = this.props;
		const { userAnswer } = this.state;
		if (userAnswer === '' || userAnswer === '-') {
			this.setState({ answerError: true });
		} else {
			this.setState({ isSubmitting: true });
			fetch(`${URLS.backendPuzzles}/attempt`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ id: _id, answer: userAnswer }),
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						this.setState({ success: true });
						this.props.updatePuzzle(responseJson.puzzle);
						this.props.onUpdate();
					}
					this.setState({ isSubmitting: false });
				})
				.catch(error => {});
		}
	};

	render() {
		const {
			puzzle: { content, solution },
		} = this.props;

		const { viewPuzzle, userAnswer, answerError, isSubmitting } = this.state;

		return (
			<div style={{ backgroundColor: 'white', paddingBottom: 12 }}>
				<div
					style={{
						display: 'flex',
						padding: 7,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div style={{ flex: 1, color: COLORS.text }} className="goal-header">
						Puzzle of the Day
					</div>
				</div>
				<div style={{ padding: '0px 16px' }}>
					<Editor
						key={content._id + Math.random()}
						rawContent={content.rawContent}
						customStyleMap={customStyleMap}
					/>
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
					}}
				>
					{solution ? (
						<Button size="large" type="primary" onClick={this.viewPuzzle}>
							View
						</Button>
					) : (
						<Button size="large" type="primary" onClick={this.viewPuzzle}>
							Attempt
						</Button>
					)}
				</div>
				<Modal
					title="Puzzle of the Day"
					visible={viewPuzzle}
					onCancel={() => {
						this.setState({ viewPuzzle: false });
					}}
					footer={null}
					style={{ width: 840 }}
					className="goal-settings-modal"
				>
					<div>
						<div style={{ fontWeight: 'bold' }}>Puzzle</div>
						<Editor
							key={content._id + Math.random()}
							rawContent={content.rawContent}
							customStyleMap={customStyleMap}
						/>
					</div>
					{solution ? null : (
						<div style={{ display: 'flex', marginTop: 12, alignItems: 'center' }}>
							<Input
								placeholder="Enter integer only"
								onChange={this.handleAnswer}
								value={userAnswer}
								style={{ width: 140 }}
							/>
							<Button
								style={{ marginLeft: 16 }}
								type="primary"
								onClick={this.submitAnswer}
								loading={isSubmitting}
							>
								Submit
							</Button>
							{answerError ? (
								<span style={{ color: 'red', marginLeft: 12 }}>Enter an answer</span>
							) : null}
						</div>
					)}
					{solution ? (
						<div>
							<div style={{ fontWeight: 'bold', marginTop: 12 }}>Solution</div>
							<Editor
								key={solution._id + Math.random()}
								rawContent={solution.rawContent}
								customStyleMap={customStyleMap}
							/>
						</div>
					) : null}
				</Modal>
			</div>
		);
	}
}

/* <GoalSettings updateGoal={updateGoal} onGoalUpdate={this.onGoalUpdate} /> */

const mapDispatchToProps = dispatch => ({
	updatePuzzle: puzzle => dispatch(updatePuzzle(puzzle)),
});

export default connect(() => ({}), mapDispatchToProps)(Goal);
