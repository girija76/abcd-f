import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import GoalPie from '../plots/goalPie';
import { COLORS } from '../colors';

import { URLS } from '../urls';

import { ExclamationCircleFilled } from '@ant-design/icons';

import './Home.css';
import './goal.css';
import { isLite } from 'utils/config';

export default class Goal extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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

	takeAction = () => {};

	render = () => {
		const { xp, day, todays_correct, target } = this.props;
		const xpLimit = 100;
		const timeLeft = this.timeLeft();
		const screenWidth = window.screen.width;
		let sidePadding = 24;
		let sideMargin = 16;
		let marginLeft = 12;
		let fontSize = 14;
		let largeFontSize = '72px';
		if (screenWidth <= 1280) {
			sidePadding = 18;
			sideMargin = 12;
			marginLeft = 8;
			fontSize = 13;
			largeFontSize = '64px';
		}
		if (screenWidth < 1200) {
			sidePadding = 16;
		}
		return (
			<Card
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				size={isLite ? 'small' : 'default'}
				bordered={!isLite}
				bodyStyle={{ paddingTop: 0 }}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Daily Goal"
			>
				<div className="goal-container">
					<div
						className="goal-item largest"
						style={{
							backgroundColor: COLORS.background,
							padding: `5px ${sidePadding}px`,
						}}
					>
						<GoalPie todays_correct={todays_correct} target={target} color="light" />
						<div
							style={{
								color: COLORS.text,
								fontWeight: 'bolder',
								fontSize,
								marginLeft,
							}}
						>
							Questions Solved
						</div>
					</div>
					<div
						className="goal-item normal"
						style={{
							borderRadius: 4,
							backgroundColor: COLORS.background,
							padding: sidePadding,
							margin: `0px ${sideMargin}px`,
						}}
					>
						<div
							style={{
								color: COLORS.primaryDark,
								fontSize: largeFontSize,
								lineHeight: largeFontSize,
								fontWeight: 'bold',
							}}
							className="number"
						>
							{day}
						</div>
						<div
							style={{
								color: COLORS.text,
								fontWeight: 'bolder',
								fontSize,
								marginLeft,
							}}
						>
							Day Streak
						</div>
					</div>
					<div
						className="goal-item normal"
						style={{
							backgroundColor: COLORS.background,
							padding: sidePadding,
						}}
					>
						<div
							style={{
								color: COLORS.primaryDark,
								fontSize: largeFontSize,
								lineHeight: largeFontSize,
								fontWeight: 'bold',
							}}
							className="number"
						>
							{timeLeft}
						</div>
						<div
							style={{
								color: COLORS.text,
								fontWeight: 'bolder',
								fontSize,
								marginLeft,
							}}
						>
							Hours Left
						</div>
					</div>
				</div>
				{xp < xpLimit ? (
					<div
						style={{
							backgroundColor: COLORS.background,
							borderRadius: 4,
							display: 'flex',
							alignItems: 'center',
							padding: 24,
							marginTop: 24,
						}}
					>
						<div>
							<ExclamationCircleFilled
								fill={COLORS.danger}
								style={{ fontSize: 48, color: COLORS.danger }}
							/>
						</div>
						<div style={{ flex: 1, paddingLeft: 24 }}>
							<div
								style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.danger }}
							>
								Low XP : {xp} XP
							</div>
							<div style={{ color: COLORS.text }}>
								Practice to earn XP and unlock exciting features
							</div>
						</div>
						<Link
							data-ga-on="click"
							data-ga-event-category="Practice Now"
							data-ga-event-action="click"
							data-ga-event-label="Low XP:Practice Now"
							to={URLS.practice}
						>
							<Button
								style={{
									borderRadius: '1000px',
									width: 160,
									height: 45,
									fontWeight: 'bold',
								}}
								onClick={this.takeAction}
								size="large"
							>
								Practice Now
							</Button>
						</Link>
					</div>
				) : null}
			</Card>
		);
	};
}
