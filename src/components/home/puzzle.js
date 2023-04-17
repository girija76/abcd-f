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

import { BuildFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { isLite } from 'utils/config';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

class Puzzle extends React.Component {
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
				body: JSON.stringify({ id: _id, answer: parseInt(userAnswer, 10) }),
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						this.setState({ success: true, userAnswer: parseInt(userAnswer, 10) });
						const puzzleResponse = responseJson.puzzle;
						puzzleResponse.response = userAnswer;
						this.props.updatePuzzle(puzzleResponse);
					}
					this.setState({ isSubmitting: false });
				});
		}
	};

	render() {
		const {
			puzzle: { title, content, answer, response, solution },
		} = this.props;

		const { viewPuzzle, userAnswer, answerError, isSubmitting } = this.state;
		// eslint-disable-next-line eqeqeq
		const isCorrect = answer == response;

		return (
			<Card
				bordered={!isLite}
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				size={isLite ? 'small' : 'default'}
				bodyStyle={{ paddingTop: 0 }}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Puzzle of the Day"
			>
				<div
					style={{
						backgroundColor: COLORS.background,
						borderRadius: 4,
						display: 'flex',
						alignItems: 'center',
						padding: 24,
					}}
				>
					<div>
						<BuildFilled
							fill={'rgb(24, 144, 255)'}
							style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }}
						/>
					</div>
					<div style={{ flex: 1, paddingLeft: 24 }}>
						<div style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.text }}>
							{title ? title : 'Puzzle'}
						</div>
					</div>
					{solution ? (
						<Button
							style={{
								borderRadius: '1000px',
								width: 160,
								height: 45,
								fontWeight: 'bold',
							}}
							onClick={this.viewPuzzle}
							size="large"
							data-ga-on="click"
							data-ga-event-category="Puzzle"
							data-ga-event-label="View"
							data-ga-event-action="click"
						>
							View
						</Button>
					) : (
						<Button
							data-ga-on="click"
							data-ga-event-category="Puzzle"
							data-ga-event-label="Attempt"
							data-ga-event-action="click"
							style={{
								borderRadius: '1000px',
								width: 160,
								height: 45,
								fontWeight: 'bold',
							}}
							onClick={this.viewPuzzle}
							size="large"
						>
							Attempt
						</Button>
					)}
				</div>

				<Modal
					title={title ? title : 'Puzzle of the Day'}
					visible={viewPuzzle}
					onCancel={() => {
						this.setState({ viewPuzzle: false });
					}}
					footer={
						<>
							<Button onClick={() => this.setState({ viewPuzzle: false })}>
								Ok, close
							</Button>
						</>
					}
					style={{ width: 840, fontSize: '16px' }}
					bodyStyle={{ fontSize: '16px' }}
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
								type="number"
								style={{ width: 140 }}
							/>
							<Button
								data-ga-on="click"
								data-ga-event-category="Puzzle"
								data-ga-event-label="Submit"
								data-ga-event-action="click"
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
					{answer ? (
						<div>
							<div style={{ display: 'flex', marginTop: 12 }}>
								<label style={{ marginRight: 10 }}>Answer: </label>
								<div style={{ fontWeight: 'bold' }}>{answer}</div>
							</div>
							<div style={{ display: 'flex' }}>
								<label style={{ marginRight: 10 }}>Your response: </label>
								<div style={{ fontWeight: 'bold' }}>{response}</div>
								<div
									style={
										isCorrect
											? {
													marginLeft: 12,
													marginRight: 12,
													color: 'green',
											  }
											: {
													marginLeft: 12,
													marginRight: 12,
													color: 'red',
											  }
									}
								>
									{isCorrect ? (
										<span>
											<CheckOutlined />
											<span style={{ marginLeft: 5 }}>Correct</span>
										</span>
									) : (
										<span>
											<CloseOutlined />
											<span style={{ marginLeft: 5 }}>Incorrect</span>
										</span>
									)}
								</div>
							</div>
						</div>
					) : null}
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
			</Card>
		);
	}
}

/* <GoalSettings updateGoal={updateGoal} onGoalUpdate={this.onGoalUpdate} /> */

const mapDispatchToProps = dispatch => ({
	updatePuzzle: puzzle => dispatch(updatePuzzle(puzzle)),
});

export default connect(() => ({}), mapDispatchToProps)(Puzzle);
