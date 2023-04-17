/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import { withRouter } from 'react-router-dom';
import { URLS } from '../urls';

import { updateSubtopic } from '../api/ApiAction';

const monthNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	parseDate = dates => {
		const dateString = dates.map(d => {
			const date = new Date(d);
			return `${date.getDate()} ${monthNames[date.getMonth()]}`;
		});
		return dateString.join(' - ');
	};

	practiceQuestions = subtopic => {
		localStorage.setItem('subtopicId', subtopic);
		this.props.updateSubtopic(subtopic);
		this.props.history.push(URLS.practiceQuestions);
	};

	takeAction = () => {
		const { feed } = this.props;
		if (feed.action === 1) {
			this.props.history.push(URLS.compete);
		} else if (feed.action === 2) {
			this.props.history.push(URLS.analysis);
		} else if (feed.action === 3) {
			this.practiceQuestions(feed.key);
		}
	};

	render() {
		const { feed, Topics } = this.props;
		let topicName;
		let subtopicName;
		let percentComplete;
		Topics.forEach(topic => {
			topic.sub_topics.forEach(sub_topic => {
				if (feed.heading === 'Continue practice' && sub_topic._id === feed.key) {
					topicName = topic.name;
					subtopicName = sub_topic.name;
					percentComplete = `${Math.round(sub_topic.percent_complete)} %`;
				}
			});
		});

		return (
			<div>
				{feed.heading === 'Continue practice' ? (
					<div>
						<Card
							className="home-card"
							headStyle={{ fontSize: 18, fontWeight: 'bold', padding: '0 24px' }}
							title={feed.heading}
						>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ flex: 1 }}>
									<span
										style={{ fontWeight: 'bold', fontSize: 28 }}
									>{`${topicName} > ${subtopicName}`}</span>
									<span style={{ marginLeft: 10 }}>{percentComplete} complete</span>
								</div>
								<Button
									style={{
										borderRadius: '1000px',
										border: '1px solid #c8c8c8',
									}}
									onClick={this.takeAction}
								>
									Continue
								</Button>
							</div>
						</Card>
					</div>
				) : (
					<div style={{ display: 'flex', padding: '12px 16px' }}>
						<div
							style={{
								fontWeight: 'bold',
								lineHeight: '48px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<div
								style={
									feed.dates && feed.dates.length
										? feed.heading === 'Live test'
											? { lineHeight: '24px', color: 'red', fontWeight: 'bold' }
											: { lineHeight: '24px' }
										: {}
								}
							>
								{feed.heading === 'Live test' ? '[LIVE]' : feed.heading}
							</div>
							{feed.dates && feed.dates.length ? (
								<div style={{ lineHeight: '24px' }}>{this.parseDate(feed.dates)}</div>
							) : null}
						</div>
						<Divider
							type="vertical"
							style={{
								height: 48,
								backgroundColor: '#a0a0a0',
								width: 2,
								margin: '0 15px',
							}}
						/>
						<div style={{ display: 'flex', flex: 1 }}>
							<div style={{ flex: 1, lineHeight: '48px' }}>
								<span style={{ fontWeight: 'bolder' }}>{feed.details}</span>
							</div>
							{feed.action ? (
								<div style={{ lineHeight: '48px' }}>
									<Button
										style={{
											borderRadius: '1000px',
											border: '1px solid #c8c8c8',
										}}
										onClick={this.takeAction}
									>
										{feed.action === 1
											? 'Attempt'
											: feed.action === 2
											? 'View analysis'
											: 'idk'}
									</Button>
								</div>
							) : null}
						</div>
					</div>
				)}
			</div>
		);
	}
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
)(withRouter(Feed));
