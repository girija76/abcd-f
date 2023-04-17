/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import { updateSubtopic } from '../api/ApiAction';
import { COLORS } from '../colors';
import { URLS } from '../urls';

import quant from '../images/topics/quant_color.svg'; // use admin panel to manage svgs
import './lastActivity.css';

const topicImages = {
	Quant: quant,
};

class LastActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	takeAction = () => {
		const { feed } = this.props;
		localStorage.setItem('subtopicId', feed.key);
		this.props.updateSubtopic(feed.key);
		this.props.history.push(URLS.practiceQuestions);
	};

	startPractice = () => {
		this.props.history.push(URLS.practice);
	};

	render = () => {
		let { feed, Topics } = this.props;
		let topicName;
		let subtopicName;
		let percentComplete;
		Topics.forEach(topic => {
			topic.sub_topics.forEach(sub_topic => {
				if (feed && sub_topic._id === feed.key) {
					topicName = topic.name;
					subtopicName = sub_topic.name;
					percentComplete = `${Math.round(sub_topic.percent_complete)} % complete`;
				}
			});
		});

		if (topicName === undefined) feed = null; // handle this in backend!!!!

		return (
			<Card
				headStyle={{
					fontSize: 18,
					fontWeight: 'bold',
					padding: '0 24px',
					borderBottom: 0,
					color: COLORS.text,
				}}
				bodyStyle={{
					backgroundColor: COLORS.background,
					margin: '0px 24px 18px 24px',
					borderRadius: 4,
				}}
				style={{ marginBottom: 24 }}
				title="Last Activity"
			>
				{feed ? (
					<div className="home-last-activity-container">
						<div>
							<img src={topicImages[topicName]} style={{ width: 64, height: 64 }} />
						</div>
						<div className="text-container">
							<div style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.text }}>
								{subtopicName}
							</div>
							<div style={{ color: COLORS.text }}>{percentComplete}</div>
						</div>
						<Button
							style={{
								borderRadius: '1000px',
								width: 160,
								height: 45,
								fontWeight: 'bold',
							}}
							className="continue-button"
							onClick={this.takeAction}
							size="large"
						>
							Continue
						</Button>
					</div>
				) : (
					<div className="home-last-activity-container">
						<div className="text-container less-padding">
							<div style={{ color: COLORS.text }}>
								You havn't started practicing yet.
							</div>
							<div style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.text }}>
								Get started now!
							</div>
						</div>
						<Button
							className="continue-button"
							style={{
								borderRadius: '1000px',
								width: 160,
								height: 45,
								fontWeight: 'bold',
							}}
							onClick={this.startPractice}
							size="large"
						>
							Start
						</Button>
					</div>
				)}
			</Card>
		);
	};
}

const mapStateToProps = state => ({ Topics: state.api.Topics });

const mapDispatchToProps = dispatch => ({
	updateSubtopic: topic => {
		dispatch(updateSubtopic(topic));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(LastActivity));
