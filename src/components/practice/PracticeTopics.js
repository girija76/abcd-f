import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Col, List, Row, Space, Typography } from 'antd';
import { map } from 'lodash';

import RegistrationPrompt from 'components/login/Prompt';
import TopicCard from './TopicCard';
import { URLS } from '../urls';
import './Practice.css';

import { createLinkForSession } from 'utils/session';

import { getTopicGroups } from '../libs/lib';

import { groupColors } from '../colors';

import { topicImages } from '../extra';

const topicsForReattemptSession = {
	'5d6e10b840f68a74e25d12c2': true,
	'5d5e4c0beaf5f804d9c7d8db': true,
};

const { Title } = Typography;

const practices = {
	default: URLS.practice,
	cat: URLS.catPractice,
	placement: URLS.placementPractice,
	jee: URLS.jeePractice,
};

export class PracticeTopics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}

	getTopicLink = topic => {
		const filters = topic.sub_topics.map(subTopic => {
			return { subTopic: subTopic._id };
		});

		const link = createLinkForSession({
			config: {
				allowReattempt: true,
			},
			filters,
			title: `Practice - ${topic.name}`,
		});
		return link;
	};

	truncate = text => {
		if (text === undefined) return '';
		if (text.length > 19) {
			return `${text.substring(0, 17)}...`;
		}
		return text;
	};

	showModal = () => this.setState({ showModal: true });

	render = () => {
		const { Topics, mode } = this.props;
		const { showModal } = this.state;

		const { topics, topicGroups } = getTopicGroups(Topics);

		const topicMap = {};
		Topics.forEach(t => {
			t.sub_topics.forEach(st => {
				topicMap[st._id] = st.name;
			});
		});

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		return (
			<div>
				{topics.length ? (
					<List
						itemLayout="horizontal"
						dataSource={topics}
						renderItem={item => (
							<List.Item
								style={{ padding: 4, border: '0px' }}
								className="topic-card-wrapper-1"
							>
								{!topicsForReattemptSession[item._id] ? (
									<Link
										to={`${practices[key_]}/${item._id}`}
										className="change-topic-container"
									>
										<TopicCard key={item._id} item={item} mode={mode} />
									</Link>
								) : mode === 'demo' ? (
									<div onClick={this.showModal}>
										<TopicCard key={item._id} item={item} mode={mode} clickable={true} />
									</div>
								) : (
									<Link to={this.getTopicLink(item)}>
										<TopicCard key={item._id} item={item} mode={mode} clickable={true} />
									</Link>
								)}
							</List.Item>
						)}
						style={{ flex: 1, margin: 8, marginTop: 0 }}
						className="topic-list"
					/>
				) : null}
				<Space direction="vertical" style={{ width: '100%', padding: '0 1rem' }}>
					{map(topicGroups, (group, key) => {
						return (
							<div key={key}>
								<Title level={4}>{key}</Title>
								<Row gutter={[8, 8]} justify="flex-start">
									{map(group, item => {
										return (
											<Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
												<Link to={`${practices[key_]}/${item._id}`}>
													<Card
														key={item._id}
														style={{
															backgroundColor: groupColors[key],
															border: 0,
															borderRadius: 6,
														}}
														bodyStyle={{
															display: 'flex',
															alignItems: 'center',
															flexDirection: 'column',
															padding: 8,
															height: '100%',
														}}
													>
														<div style={{ display: 'flex', width: '100%' }}>
															<div style={{ flex: 1 }}></div>
															<div
																style={{ fontSize: 11, fontWeight: 'lighter', color: 'white' }}
															>
																{mode === 'demo' ? 0 : Math.round(item.percent_complete)} %
																completed
															</div>
														</div>
														<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
															<img
																alt={`icon for ${item.name}`}
																src={topicImages[item.name]}
																className="topic-card-image-2"
															></img>
														</div>
														<div
															style={{ display: 'flex', width: '100%', alignItems: 'center' }}
														>
															<div style={{ flex: 1 }}>
																<div
																	style={{
																		color: 'white',
																		fontWeight: 'bold',
																		textAlign: 'center',
																	}}
																	className="topic-card-title"
																>
																	{this.truncate(item.name.replace('and', '&'))}
																</div>
															</div>
														</div>
													</Card>
												</Link>
											</Col>
										);
									})}
								</Row>
							</div>
						);
					})}
				</Space>
				<RegistrationPrompt
					visible={showModal}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
				/>
			</div>
		);
	};
}

const mapStateToProps = state => {
	return {
		Topics: state.api.Topics,
	};
};

export default connect(mapStateToProps)(PracticeTopics);
