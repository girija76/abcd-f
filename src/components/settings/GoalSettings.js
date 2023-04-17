import React from 'react';
import { connect } from 'react-redux';

import Button from 'antd/es/button';
import Radio from 'antd/es/radio';
import List from 'antd/es/list';
import { URLS } from '../urls.js';
import { updateUserData } from '../api/ApiAction.js';

class GoalSettings extends React.Component {
	constructor(props) {
		super(props);
		const {
			UserData: { settings },
		} = this.props;
		let speed = 0;
		if (settings && settings.goal && settings.goal.length) {
			speed = settings.goal[settings.goal.length - 1].goal;
		}
		this.state = {
			speed,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.UserData !== this.props.UserData) {
			const {
				UserData: { settings },
			} = nextProps;
			if (settings && settings.goal && settings.goal.length) {
				this.setState({ speed: settings.goal[settings.goal.length - 1].goal });
			}
		}
	}

	changeSpeed = speed => this.setState({ speed, success: false });

	updateGoal = () => {
		const { speed } = this.state;

		const { UserData, onGoalUpdate } = this.props;
		this.setState({ loading: true });
		fetch(`${URLS.backendUsers}/updateGoal`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ id: UserData._id, goal: speed }),
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateUserData(responseJson);
					this.setState({ loading: false, success: true });
					onGoalUpdate();
				});
			}
		});
	};

	render() {
		const { mode } = this.props;
		let { speed } = this.state;
		return (
			<div>
				<div>
					Select your goal to get bonus points when you maintain your streak. You
					must achieve your goal everyday to maintain your streak. You can change
					your goal at any time (though the streak would be reset to zero).
				</div>
				<List
					itemLayout="horizontal"
					dataSource={[
						{ goal: 'No Goal ( No streak bonus points )' },
						{
							goal: 'Casual- 5 questions each day ( 4 Months to master all topics )',
						},
						{
							goal: 'Serious- 10 questions each day ( 2 Months to master all topics )',
						},
						{
							goal:
								'Committed- 20 questions each day ( 1 Month to master all topics )',
						},
					]}
					renderItem={(item, id) => (
						<List.Item
							key={'goal-' + id}
							onClick={this.changeSpeed.bind(this, id)}
							style={{
								display: 'flex',
								alignItems: 'flex-end',
								padding: '15px 30px',
								borderBottom: '1px solid #c0c0c0',
								cursor: 'pointer',
							}}
						>
							<div>
								<Radio
									checked={speed === id}
									value="A"
									name="option"
									aria-label="A"
									classes={
										speed === id
											? {
													root: 'custom-radio-button-active',
											  }
											: {
													root: 'custom-radio-button-inactive',
											  }
									}
									color="primary"
								/>
							</div>
							<div className="question-option-content">{item.goal}</div>
						</List.Item>
					)}
					size="large"
					style={{
						border: '1px solid #c0c0c0',
						margin: '20px 0px',
						borderRadius: 4,
					}}
				/>
				<div style={{ display: 'flex', padding: '0px 20px' }}>
					{mode === 'demo' ? (
						<div style={{ color: 'red' }}>You need to sign in to use goals.</div>
					) : null}
					<div style={{ flex: 1 }}></div>
					<Button
						type="primary"
						disabled={mode === 'demo'}
						onClick={this.updateGoal}
					>
						Update
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({ UserData: state.api.UserData });

const mapDispatchToProps = dispatch => ({
	updateUserData: userData => dispatch(updateUserData(userData)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GoalSettings);
