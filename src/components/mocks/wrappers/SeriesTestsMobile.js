import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import List from 'antd/es/list';
import Button from 'antd/es/button';
import TestLinkWrapper from '../TestLinkWrapper.js';
import TopicTestLinksMobile from '../TopicTestLinksMobile.js';
import TopicTestLinksUpperLevelMobile from '../TopicTestLinksUpperLevelMobile.js';
import TestLinksMobile from '../TestLinksMobile.js';

import './../Mocks.css';

import { getTopicGroups } from '../../libs/lib';

import { updateAssessmentWrappersAndFeeds } from '../../api/ApiAction';
import getwrappers from '../../api/getwrappers';
import { URLS } from '../../urls';

const mocks = {
	default: URLS.mocks,
	cat: URLS.catMocks,
	placement: URLS.placementMocks,
};

const topics_ = {
	default: URLS.topicTests,
	cat: URLS.catTopicTests,
	placement: URLS.placementTopicTests,
	jee: URLS.jeeTopicTests,
};

function getTopics(validAssessments, topicGroupsReverse) {
	const tabListDetected = {};
	validAssessments.forEach(assessment => {
		if (topicGroupsReverse[assessment.topic]) {
			tabListDetected[topicGroupsReverse[assessment.topic]] = true;
		}
	});
	return Object.keys(tabListDetected);
}

class Mocks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { AssessmentWrappers, Topics } = props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'TOPIC-MOCK';
			  })
			: [];

		const { topicGroupsReverse } = getTopicGroups(Topics);

		let key = 'tab0';
		const defaultKeys = {};
		validAssessments.forEach(assessment => {
			if (
				assessment.topic &&
				defaultKeys[topicGroupsReverse[assessment.topic]] === undefined
			) {
				defaultKeys[topicGroupsReverse[assessment.topic]] = `tab-${
					topicGroupsReverse[assessment.topic]
				}`;
			}
		});

		const topics = getTopics(validAssessments, topicGroupsReverse);

		let selectedSubject = topics.length ? topics[0] : '';
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get('subject')) {
			topics.forEach(l => {
				if (l === searchParams.get('subject'))
					selectedSubject = searchParams.get('subject');
			});
		}

		key = defaultKeys[selectedSubject] ? defaultKeys[selectedSubject] : 'tab0';

		this.state = {
			key,
			topics,
			selectedSubject,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	componentWillMount() {
		const {
			AssessmentWrappers,
			activePhase: { _id },
		} = this.props;
		if (AssessmentWrappers === null || AssessmentWrappers === undefined) {
			const {
				UserData: { subscriptions },
			} = this.props;
			getwrappers(_id)
				.then(responseJson => {
					this.props.updateAssessmentWrappersAndFeeds(responseJson);
				})
				.catch(err => {
					if (err === 'already-fetched') {
						//
					} else {
						console.log('check error in fetching topic tests', err);
					}
				});
		}
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (
			(!this.props.AssessmentWrappers || !this.props.Topics) &&
			nextProps.AssessmentWrappers &&
			nextProps.Topics &&
			(nextProps.AssessmentWrappers !== this.props.AssessmentWrappers ||
				nextProps.Topics !== this.props.Topics)
		) {
			const { AssessmentWrappers, Topics } = nextProps;
			const validAssessments = AssessmentWrappers
				? AssessmentWrappers.filter(assessment => {
						return assessment.type === 'TOPIC-MOCK';
				  })
				: [];

			const { topicGroupsReverse } = getTopicGroups(Topics);

			let key = 'tab0';
			const defaultKeys = {};
			validAssessments.forEach(assessment => {
				if (
					assessment.topic &&
					defaultKeys[topicGroupsReverse[assessment.topic]] === undefined
				) {
					defaultKeys[topicGroupsReverse[assessment.topic]] = `tab-${
						topicGroupsReverse[assessment.topic]
					}`;
				}
			});

			const topics = getTopics(validAssessments, topicGroupsReverse);

			let selectedSubject = topics.length ? topics[0] : '';
			const searchParams = new URLSearchParams(window.location.search);
			if (searchParams.get('subject')) {
				topics.forEach(l => {
					if (l === searchParams.get('subject'))
						selectedSubject = searchParams.get('subject');
				});
			}

			key = defaultKeys[selectedSubject] ? defaultKeys[selectedSubject] : 'tab0';

			this.setState({
				key,
				topics,
				selectedSubject,
			});
		}
	}

	onTabChange = (key, type) => {
		const { mode } = this.props;
		this.setState({ [type]: key });
		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (key === 'tab1') {
			this.props.history.push(mocks[key_]);
		} else if (key === 'tab2') {
			this.props.history.push(`${mocks[key_]}/sectional`);
		} else if (key === 'tab3') {
			this.props.history.push(`${mocks[key_]}/sectional2`);
		}
	};

	renderTabContent = () => {
		const { AssessmentWrappers, Topics, series, mode } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.series === series;
			  })
			: [];

		const { topicGroupsReverse } = getTopicGroups(Topics);

		const tabListDetected = {};
		validAssessments.forEach(assessment => {
			if (topicGroupsReverse[assessment.topic]) {
				tabListDetected[topicGroupsReverse[assessment.topic]] = true;
			}
		});

		const { selectedSubject } = this.state;

		if (Object.keys(tabListDetected).length) {
			return (
				<TopicTestLinksUpperLevelMobile
					tab={1}
					allTests={validAssessments.filter(vA => {
						return topicGroupsReverse[vA.topic] === selectedSubject;
					})}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			);
		} else {
			return (
				<TestLinksMobile
					tab={1}
					allTests={validAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			);
		}

		return {
			tab0: (
				<TopicTestLinksMobile
					tab={1}
					allTests={validAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			),
			tab1: (
				<TestLinkWrapper
					tab={1}
					allTests={validAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			),
			tab2: (
				<TestLinkWrapper
					tab={2}
					allTests={validAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			),
			tab3: (
				<TestLinkWrapper
					tab={3}
					allTests={validAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			),
		};
	};

	getTabList = () => {
		const { AssessmentWrappers, Topics, series } = this.props;

		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.series === series;
			  })
			: [];

		const { topicGroupsReverse } = getTopicGroups(Topics);

		const tabListDetected = {};
		validAssessments.forEach(assessment => {
			if (topicGroupsReverse[assessment.topic]) {
				tabListDetected[topicGroupsReverse[assessment.topic]] = true;
			}
		});
		if (Object.keys(tabListDetected).length) {
			Object.keys(tabListDetected).map((k, i) => {
				return { key: `tab-${k}`, tab: k };
			});
		} else {
			return null;
		}
	};

	handleSubjectChange = selectedSubject => {
		const { AssessmentWrappers, mode } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'TOPIC-MOCK';
			  })
			: [];
		this.setState({ selectedSubject });
		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		this.props.history.push(`${topics_[key_]}/?subject=${selectedSubject}`);
	};

	render() {
		const { AssessmentWrappers, mode, UserData } = this.props;
		const { key, topics, selectedSubject } = this.state;
		const tabList = this.getTabList();

		const contentList = this.renderTabContent();
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';

		return (
			<div
				className="content-and-rsb-container"
				style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
			>
				<div style={{ marginBottom: 12, width: '100%' }}>
					{topics.length ? (
						<List
							loading={!AssessmentWrappers}
							dataSource={topics}
							renderItem={subject => (
								<Button
									style={
										selectedSubject === subject
											? {
													borderRadius: 100,
													backgroundColor: '#429add',
													color: 'white',
													border: '1px solid #429add',
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
											: {
													borderRadius: 100,
													padding: '0px 24px',
													margin: '0px 12px',
													fontWeight: 'bold',
											  }
									}
									onClick={this.handleSubjectChange.bind(this, subject)}
								>
									{subject}
								</Button>
							)}
						/>
					) : null}
					{contentList}
				</div>
			</div>
		);
	}
}
//{contentList}
const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Difficulty: state.api.Difficulty,
	Topics: state.api.Topics,
	AssessmentWrappers: state.api.AssessmentWrappers,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mocks));
