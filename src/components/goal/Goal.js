/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import {
	Button,
	Card,
	Col,
	Modal,
	Progress,
	Row,
	Space,
	Tooltip,
	Typography,
} from 'antd';
import { BiTargetLock } from 'react-icons/bi';
import GoalPlot from '../plots/GoalPlot';
import GoalSettings from '../settings/GoalSettings';
import { URLS } from '../urls';
import { COLORS } from '../colors';
import { fillData } from '../libs/lib';
import { updateUserData } from '../api/ApiAction';
import './Goal.css';

import { getRsbWidth } from '../libs/lib';
import { isLite } from 'utils/config';

const { Text, Title } = Typography;

export class Goal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: false,
			updateGoal: false,
			width: window.screen.width,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.screen.width });
	};

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	timeLeft = () => {
		const aT = new Date();
		const endOfDay = new Date(
			aT.getFullYear(),
			aT.getMonth(),
			aT.getDate() + 1,
			0,
			0,
			0
		);
		const timeRemaining = endOfDay.getTime() - aT.getTime();
		return Math.floor(timeRemaining / (60 * 60 * 1000));
	};

	fillGoals = dailyActivity => {
		const { goals } = this.props;
		let j = 0;
		// eslint-disable-next-line no-nested-ternary
		let lastGoal = goals.length
			? goals[0].goal === 1
				? 5
				: // eslint-disable-next-line no-nested-ternary
				goals[0].goal === 2
				? 10
				: goals[0].goal === 3
				? 20
				: 0
			: 0;
		// eslint-disable-next-line prefer-const
		let data = [];
		for (let i = 0; i < goals.length; i += 1) {
			const tempDate = new Date(goals[i].date);
			const nextDate = `${tempDate.getDate()}-${tempDate.getMonth()}-${tempDate.getFullYear()}`;
			while (j < dailyActivity.length - 1 && dailyActivity[j].date !== nextDate) {
				data.push({
					goal: lastGoal,
					date: dailyActivity[j].date,
					id: dailyActivity[j].id,
				});
				j += 1;
			}
			// eslint-disable-next-line no-nested-ternary
			lastGoal =
				goals[i].goal === 1
					? 5
					: // eslint-disable-next-line no-nested-ternary
					goals[i].goal === 2
					? 10
					: goals[i].goal === 3
					? 20
					: 0;
		}
		while (j < dailyActivity.length) {
			data.push({
				goal: lastGoal,
				date: dailyActivity[j].date,
				id: dailyActivity[j].id,
			});
			j += 1;
		}
		return data;
	};

	onGoalUpdate = () => {
		this.setState({ settings: false, updateGoal: false });
	};

	endDemo = () => {
		fetch(`${URLS.backendUsers}/endDemo/2`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response
					.json()
					.then(responseJson => this.props.updateUserData(responseJson.user));
			}
		});
	};

	render() {
		const { target, score, streak, goalUpdateRequest, mode } = this.props;
		const { width } = this.state;

		// eslint-disable-next-line prefer-const
		const dailyActivityTemp = this.props.dailyActivity;
		const dailyActivity = fillData(dailyActivityTemp);
		const goals = this.fillGoals(dailyActivity);
		// eslint-disable-next-line prefer-const
		let percentData = [];
		let count = 0;
		for (let i = 0, j = 0; i < dailyActivity.length; ) {
			if (dailyActivity[i].date === goals[j].date) {
				percentData.push({
					date: dailyActivity[i].date,
					id: count,
					percent: Math.min(
						100,
						Math.round((10000 * dailyActivity[i].todays_count) / goals[j].goal) / 100
					),
				});
				i += 1;
				j += 1;
				count += 1;
			} else if (
				this.dateToNumber(dailyActivity[i].date) > this.dateToNumber(goals[j].date)
			) {
				j += 1;
			} else {
				i += 1;
			}
		}

		const { settings, updateGoal } = this.state;
		const timeLeft = this.timeLeft();

		let rsbWidth = getRsbWidth() - 2;
		if (width < 900) {
			rsbWidth = Math.max(500, width) - 18;
		} else if (width < 960) {
			rsbWidth = 800;
		}

		let goalupdateconfirmation = '';
		if (goalUpdateRequest.active) {
			goalupdateconfirmation =
				'Your request to update goal will be completed by tomorrow.';
		}

		return (
			<Card
				size="small"
				bordered={!isLite}
				style={{ borderRadius: isLite ? 0 : undefined }}
				bodyStyle={{ padding: '1px 0 0' }}
				title={
					<Row justify="start" align="middle">
						<Col style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
							<BiTargetLock size={22} />
						</Col>
						<Col>My daily goal</Col>
					</Row>
				}
			>
				<div
					style={{
						backgroundColor: 'white',
						borderRadius: 10,
						padding: 8,
					}}
				>
					{target ? (
						<Space direction="vertical" style={{ display: 'flex' }}>
							<Space
								align="center"
								size="large"
								style={{ display: 'flex', justifyContent: 'center' }}
							>
								<Progress
									type="circle"
									width={100}
									strokeColor="#1990ff"
									percent={Math.min(Math.round(100 * score) / target, 100)}
									format={() => (
										<Text>
											{score}/{target}
										</Text>
									)}
								/>

								<div
									className="goal-data"
									style={{ display: 'flex', flexDirection: 'column' }}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<div
											className="number"
											style={{ fontSize: 36, lineHeight: '42px', color: COLORS.primary }}
										>
											{streak}
										</div>
										<div
											style={{
												fontSize: 12,
												color: COLORS.text,
												marginLeft: 5,
												marginTop: 5,
											}}
										>
											Day Streak
										</div>
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<div
											className="number"
											style={{ fontSize: 36, lineHeight: '42px', color: COLORS.primary }}
										>
											{timeLeft}
										</div>
										<div
											style={{
												fontSize: 12,
												color: COLORS.text,
												marginLeft: 5,
												marginTop: 5,
											}}
										>
											Hours Left
										</div>
									</div>
								</div>
							</Space>
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Tooltip title="Set your daily goal" placement="topRight">
									<Button
										type="primary"
										ghost
										onClick={() => {
											this.setState({ settings: true });
										}}
									>
										Update goal
									</Button>
								</Tooltip>
							</div>
							{false && goals.length > 1 ? (
								<div
									style={{
										height: Math.min(240, 0.618 * rsbWidth),
										borderRadius: '0 0 10px 10px',
										overflow: 'hidden',
									}}
								>
									<GoalPlot width={rsbWidth} data={percentData} />
								</div>
							) : null}
							{goalupdateconfirmation ? (
								<div
									style={{
										fontSize: 12,
										color: 'green',
										paddingLeft: 12,
										paddingRight: 12,
										paddingBottom: 8,
										textAlign: 'right',
									}}
								>
									{goalupdateconfirmation}
								</div>
							) : null}
						</Space>
					) : (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
								padding: 30,
							}}
						>
							<div style={{ marginBottom: 20 }}>
								Set goal to get bonus points when you maintain your streak
							</div>
							<Button
								type="primary"
								onClick={() => {
									this.setState({ settings: true });
								}}
							>
								Goal Settings
							</Button>
						</div>
					)}
					<Modal
						title="Goal Settings"
						visible={settings}
						// onOk={() => {
						// 	this.setState({ updateGoal: true });
						// }}
						onCancel={() => {
							this.setState({ settings: false });
						}}
						footer={null}
						className="goal-settings-modal"
					>
						<GoalSettings
							updateGoal={updateGoal}
							onGoalUpdate={this.onGoalUpdate}
							mode={mode}
						/>
					</Modal>
				</div>
			</Card>
		);
	}
}

export default connect(null, { updateUserData })(Goal);
