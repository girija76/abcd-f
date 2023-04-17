import React, { Component } from 'react';
import { filter, size } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Col, Progress, Row, Spin } from 'antd';

import OverallRecommendations from '../analysis/OverallRecommendations';

import { COLORS } from '../colors';

import { URLS } from '../urls';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import {
	testsDefaultUrl,
	hidePractice,
	isLite,
	showELearning,
} from 'utils/config';

import getwrappers from '../api/getwrappers';
import MyVideoProgress from 'components/playlist/MyProgress';

import './Home.css';
import './goal.css';

const practices = {
	default: URLS.practice,
	cat: URLS.catPractice,
	placement: URLS.placementPractice,
	jee: URLS.jeePractice,
};

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

const competesDefault = {
	default: URLS.dashboard,
	cat: URLS.catDashboard,
	placement: URLS.placementDashboard,
	jee: URLS.jeeDashboard,
};

class PortalStats extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		const {
			AssessmentWrappers,
			activePhase: { _id },
			mode,
		} = this.props;
		if (
			mode !== 'demo' &&
			(AssessmentWrappers === null || AssessmentWrappers === undefined)
		) {
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

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.mode !== 'demo' &&
			(nextProps.AssessmentWrappers === null ||
				nextProps.AssessmentWrappers === undefined) &&
			this.props.activePhase !== nextProps.activePhase
		) {
			const {
				activePhase: { _id },
			} = nextProps;

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
		const { PercentComplete, AssessmentWrappers, activePhase, mode } = this.props;
		const screenWidth = window.screen.width;
		let marginLeft = 12;
		let fontSize = 14;
		if (screenWidth <= 1280) {
			marginLeft = 8;
			fontSize = 13;
		}

		let totalTest = 0;
		let totalAttempted = 0;
		if (AssessmentWrappers && AssessmentWrappers !== undefined) {
			totalTest = AssessmentWrappers.length;
			totalAttempted =
				mode !== 'demo'
					? AssessmentWrappers.filter(aW => {
							return aW.submission !== null;
					  }).length
					: Math.round(0.41 * totalTest);
		}

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		const progressColSize =
			24 /
			(size(
				filter([hidePractice ? null : 1, showELearning ? 1 : null], i => !!i)
			) +
				1);

		return (
			<Card
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				bordered={!isLite}
				size={isLite ? 'small' : 'default'}
				bodyStyle={{
					paddingTop: 0,
				}}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Your Progress"
			>
				<div>
					<Row gutter={[8, 8]}>
						{hidePractice ? null : (
							<Col xs={24} md={progressColSize}>
								<Link
									data-ga-on="click"
									data-ga-event-category="Practice Now"
									data-ga-event-action="click"
									data-ga-event-label="Low XP:Practice Now"
									to={practices[key_]}
									style={{
										backgroundColor: COLORS.background,
										padding: 18,
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: 4,
									}}
								>
									<Progress
										type="circle"
										percent={PercentComplete}
										width={80}
										format={() => `${Math.round(PercentComplete)}%`}
									/>
									<div
										style={{
											color: COLORS.text,
											fontWeight: 'bolder',
											fontSize,
											marginLeft,
										}}
									>
										Questions Practiced
									</div>
								</Link>
							</Col>
						)}
						<Col xs={24} md={progressColSize}>
							<Link
								data-ga-on="click"
								data-ga-event-category="Practice Now"
								data-ga-event-action="click"
								data-ga-event-label="Low XP:Practice Now"
								to={
									testsDefaultUrl
										? competesDefault[key_] + '/' + testsDefaultUrl
										: competes[key_]
								}
								style={{
									backgroundColor: COLORS.background,
									padding: 18,
									flex: 1,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 4,
								}}
							>
								{AssessmentWrappers &&
								AssessmentWrappers !== undefined &&
								activePhase ? (
									<Progress
										type="circle"
										percent={
											totalTest && activePhase ? (100.0 * totalAttempted) / totalTest : 0
										}
										width={80}
										format={percent =>
											`${Math.round((percent * totalTest) / 100)}/${totalTest}`
										}
									/>
								) : (
									<Spin style={{ margin: 18, marginTop: 26 }} />
								)}
								<div
									style={{
										color: COLORS.text,
										fontWeight: 'bolder',
										fontSize,
										marginLeft,
									}}
								>
									Tests Taken
								</div>
							</Link>
						</Col>
						{showELearning ? (
							<Col xs={24} md={progressColSize}>
								<MyVideoProgress
									rootStyle={{
										backgroundColor: COLORS.background,
										padding: 18,
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: 4,
									}}
									textStyle={{
										color: COLORS.text,
										fontWeight: 'bolder',
										fontSize,
										marginLeft,
									}}
								/>
							</Col>
						) : null}
					</Row>
				</div>
				<OverallRecommendations titleFontSize={18} mode={mode} />
			</Card>
		);
	};
}

const mapStateToProps = state => ({
	AssessmentWrappers: state.api.AssessmentWrappers,
	PercentComplete: state.api.PercentComplete,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalStats);
