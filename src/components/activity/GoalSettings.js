/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';

import Button from 'antd/es/button';
import Radio from 'antd/es/radio';
import List from 'antd/es/list';

import { URLS } from '../urls';

import { updateUserData } from '../api/ApiAction';

export class GoalSettings extends React.Component {
	constructor(props) {
		super(props);
		const { settings } = this.props.UserData;
		let speed = 0;
		if (settings && settings.goal && settings.goal.length) {
			speed = settings.goal[settings.goal.length - 1].goal;
		}
		this.state = {
			speed,
			loading: false,
			success: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.UserData !== this.props.UserData) {
			const { settings } = nextProps.UserData;
			if (settings && settings.goal && settings.goal.length) {
				this.setState({ speed: settings.goal[settings.goal.length - 1].goal });
			}
		}
	}

	changeSpeed = speed => this.setState({ speed, success: false });

	update = () => {
		const { speed } = this.state;
		const { UserData } = this.props;
		this.setState({ loading: true });
		fetch(`${URLS.backendUsers}/updateGoal`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			// eslint-disable-next-line no-underscore-dangle
			body: JSON.stringify({ id: UserData._id, goal: speed }),
		})
			.then(res => res.json())
			.then(result => {
				this.props.updateUserData(result);
				this.setState({ loading: false, success: true });
			});
	};

	render() {
		const { loading, success, speed } = this.state;
		return (
			<div>
				<div>
					Select your goal to get bonus points when you maintain your streak. You
					must achieve your goal everyday to maintain your streak. You can change
					your goal at any time (though the streak would be reset to zero). Bonus
					factor for 'Casual', 'Serious' and 'Committed' mode are 0.5, 0.9 and 1.5
					respectively. Bonus points are calculated as: bonus-factor * log(1 +
					streak-day).
				</div>
				<List
					itemLayout="horizontal"
					dataSource={[
						{
							goal:
								'Casual- 5 correct Questions each day, with accuracy > 30% ( 4 Months to master all topics )',
						},
						{
							goal:
								'Serious- 10 correct Questions each day, with accuracy > 30% ( 2 Months to master all topics )',
						},
						{
							goal:
								'Committed- 20 correct Questions each day, with accuracy > 30% ( 1 Month to master all topics )',
						},
					]}
					renderItem={(item, id) => (
						<List.Item
							key={`goal-${id + 1}`}
							onClick={this.changeSpeed.bind(this, id + 1)}
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
									checked={speed === id + 1}
									value="A"
									name="option"
									aria-label="A"
									classes={
										speed === id + 1
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
					style={{ border: '1px solid #c0c0c0', margin: 20, borderRadius: 4 }}
				/>
				<Button
					type="primary"
					loading={loading}
					size="large"
					onClick={this.update}
					disabled={loading || success}
					style={{ width: 120 }}
				>
					{loading ? 'Updating...' : success ? 'Updated!' : 'Update'}
				</Button>
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
