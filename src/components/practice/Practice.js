import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { Card, Col, Row, Space, Typography } from 'antd';
import { FiActivity } from 'react-icons/fi';
import {
	ArrowLeftOutlined,
	BookOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import PracticeTopics from './PracticeTopics.js';
import PracticeSubtopics from './PracticeSubtopics.js';
import Goal from '../goal/Goal';
import { URLS } from '../urls';

import { createLinkForSession } from 'utils/session';
import { getAllSubTopics } from 'components/libs/lib';

import './Practice.css';

import {
	getStreakData,
	getTarget,
	todaysDateFunc,
	yesterdaysDateFunc,
	nDayBackDateFunc,
} from '../libs/lib';
import CustomizedPractice from './CustomizedPractice';
import classnames from 'classnames';
import { clientId, isLite } from 'utils/config.js';

const { Text, Title } = Typography;
const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
};

const quickLinks = [
	{
		key: 'activity',
		title: 'My Activity',
		description: 'See how you have performed',
		icon: <FiActivity color="#439adc" />,
		href: URLS.activity,
	},
	{
		key: 'bookmarks',
		title: 'My Bookmarks',
		icon: <BookOutlined style={{ color: '#0b9e73' }} />,
		description: 'See what is important for you',
		href: URLS.profileBookmarks,
	},
	{
		key: 'practice_sessions',
		title: 'My Practice History',
		icon: <HistoryOutlined style={{ color: '#ff9800' }} />,
		description: 'Review your previous practice sessions',
		href: URLS.activitySession,
	},
];

const PropsRoute = ({ component, ...otherProps }) => {
	return (
		<Route
			{...otherProps}
			render={routeProps => {
				return renderMergedProps(component, routeProps, otherProps);
			}}
		/>
	);
};

const practices = {
	default: URLS.practice,
	cat: URLS.catPractice,
	placement: URLS.placementPractice,
	jee: URLS.jeePractice,
};

const MixedParcticeItem = ({
	href,
	label,
	disabled,
	percentComplete,
	level,
}) => {
	return (
		<Link
			to={href}
			data-ga-on="click"
			data-ga-event-action="Start Practice"
			data-ga-event-category="Mixed Practice"
			data-ga-event-label={`Mixed, ${label}`}
			style={{
				width: '100%',
				backgroundColor: '#fbfbfb',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				borderRadius: 8,
				border: 'solid 1px rgb(218, 220, 224)',
				padding: 8,
			}}
		>
			<div
				style={{
					backgroundImage:
						"url('https://static.prepleaf.com/icons/general/difficulty.jpg')",
					backgroundPosition: level === 1 ? -18 : level === 2 ? -218 : 182,
					width: 150,
					height: 100,
				}}
			></div>
			<Title level={5}>{label}</Title>
			<button
				disabled={disabled}
				className="ant-btn ant-btn-primary ant-btn-background-ghost"
			>
				Practice Now
			</button>
			<div style={{ marginTop: 8 }}>{percentComplete}% completed</div>
		</Link>
	);
};

class Practice extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			category: '',
			key: '',
			difficulty: '',
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.UserData !== this.props.UserData) return true;
		if (nextProps.Difficulty !== this.props.Difficulty) return true;
		if (nextProps.location !== this.props.location) return true;
		if (nextState !== this.state) return true;
		return false;
	}

	goBack = () => {
		const { mode } = this.props;
		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		this.props.history.push(practices[key_]);
	};

	practiceQuestions = difficulty => {
		const self = this;
		fetch(`${URLS.backendUsers}/startSession`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				category: 'difficulty',
				key: difficulty,
				force: false,
			}),
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.history.push(
						`${URLS.practiceQuestions}/${responseJson.sessionId}`
					);
				});
			} else {
				response.json().then(responseJson => {
					const e = responseJson.error.code.split('/');
					if (e[0] === 'session-live') {
						self.setState({
							confirmation: true,
							category: e[1].split('-')[0],
							key: e[1].split('-')[1],
							difficulty,
						});
					}
				});
			}
		});
	};

	render() {
		const {
			UserData: { xp, settings, stats },
			Difficulty,
			topics,
			mode,
		} = this.props;

		const streak =
			mode === 'demo'
				? {
						date: todaysDateFunc(new Date()),
						day: 2,
						todays_count: 7,
				  }
				: xp.streak;

		const goal = mode === 'demo' ? [{ goal: 2 }] : settings.goal;
		const goalUpdateRequest = mode === 'demo' ? {} : settings.goalUpdateRequest;
		const difficulty = stats ? stats.difficulty : {};
		const daily_activity =
			mode === 'demo'
				? [
						{
							date: nDayBackDateFunc(new Date(), 6),
							todays_count: 7,
							todays_correct: 6,
						},
						{
							date: nDayBackDateFunc(new Date(), 5),
							todays_count: 17,
							todays_correct: 12,
						},
						{
							date: nDayBackDateFunc(new Date(), 4),
							todays_count: 0,
							todays_correct: 0,
						},
						{
							date: nDayBackDateFunc(new Date(), 3),
							todays_count: 0,
							todays_correct: 0,
						},
						{
							date: nDayBackDateFunc(new Date(), 2),
							todays_count: 12,
							todays_correct: 8,
						},
						{
							date: yesterdaysDateFunc(new Date()),
							todays_count: 14,
							todays_correct: 11,
						},
						{ date: todaysDateFunc(new Date()), todays_count: 7, todays_correct: 5 },
				  ]
				: stats.daily_activity;

		const { day, score } = getStreakData(
			streak.date,
			streak.day,
			streak.todays_count
		);

		const target = getTarget(goal);
		const url = window.location.pathname;
		const allSubTopics = getAllSubTopics(topics);

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		return (
			<div className={classnames('content-wrapper', { 'no-margin': isLite })}>
				<div
					className="content-and-rsb-container"
					style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
				>
					<Helmet>
						{mode === 'demo' ? (
							<link
								rel="canonical"
								href={`https://${subDomain}.prepleaf.com/demo/${key_}/practice`}
							/>
						) : null}
						<title>{window.config.metaData.demoPractice.title}</title>
						<meta
							name="description"
							content={window.config.metaData.demoPractice.description}
						/>
					</Helmet>
					<div className="practice-card lsb">
						<Card
							bordered={!isLite}
							style={{
								width: '100%',
								margin: 0,
								marginBottom: 12,
								borderRadius: isLite ? 0 : undefined,
							}}
							title={
								url === practices[key_] ? (
									<div>Topics</div>
								) : (
									<div style={{ cursor: 'pointer' }} onClick={this.goBack}>
										<ArrowLeftOutlined /> Topics
									</div>
								)
							}
							extra={<CustomizedPractice />}
							bodyStyle={{
								paddingLeft: 0,
								paddingRight: 0,
							}}
							headStyle={{
								fontSize: 18,
								fontWeight: 'bold',
							}}
						>
							<Switch>
								<PropsRoute
									exact
									path={practices[key_]}
									component={PracticeTopics}
									mode={mode}
								/>
								<PropsRoute
									path={practices[key_]}
									component={PracticeSubtopics}
									mode={mode}
								/>
							</Switch>
						</Card>
						{mode !== 'demo' ? (
							<Route
								exact
								path={practices[key_]}
								render={() => (
									<Card
										bordered={!isLite}
										style={{
											width: '100%',
											margin: isLite ? 0 : '12px 0px',
											borderRadius: isLite ? 0 : undefined,
										}}
										title="Practice Mixed Topics"
										headStyle={{ fontSize: 18, fontWeight: 'bold' }}
									>
										<Row gutter={[8, 8]}>
											{[
												{ level: 1, backgroundColor: 'green' },
												{ level: 2, backgroundColor: 'yellow' },
												{ level: 3, backgroundColor: 'red' },
											].map(({ level, backgroundColor }) => {
												const levelName =
													level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard';
												return (
													<Col xs={24} md={12} lg={8} xl={8}>
														<MixedParcticeItem
															href={createLinkForSession({
																filters: allSubTopics.map(id => ({ subTopic: id, level: 1 })),
																title: `Practice - Mixed, ${levelName}`,
															})}
															backgroundColor={backgroundColor}
															percentComplete={Math.round(
																(100 * difficulty[levelName]) / Difficulty[levelName]
															)}
															disabled={
																difficulty[levelName] === Difficulty[levelName] ||
																Difficulty[levelName] === 0
															}
															label={levelName}
															level={level}
														/>
													</Col>
												);
											})}
										</Row>
										{(['', 'staging'].indexOf(process.env.REACT_APP_ENV) > -1 ||
											clientId === '609ec3ba459d460d6cb15ef9') && (
											<div style={{ marginTop: 10, textAlign: 'center' }}>
												<Space>
													<Link
														to={createLinkForSession({
															filters: allSubTopics
																.slice(0, 100)
																.map(id => ({ subTopic: id, level: 2 })),
															config: {
																allowReattempt: '1',
																// preventTooSlow: '1',
																// preventTooFast: '1',
																// tooFastMultiplier: 2,
																clockType: 'stopwatch',
																canSkip: '1',
																disableBack: '0',
																totalQuestions: 5,
																shouldSelect: 4,
																timeLimit: 600,
																questionSelectionTimeLimit: 60,
																// tooSlowDetector: 'puq',
																// alertBeforeTooSlow: 15,
															},
															title: 'Selectivity improvement practice session',
														})}
														className="ant-btn ant-btn-primary"
													>
														Improve Selectivity
													</Link>
													<Link
														to={createLinkForSession({
															filters: allSubTopics
																.slice(0, 100)
																.map(id => ({ subTopic: id, level: 2 })),
															config: {
																allowReattempt: '1',
																// preventTooSlow: '1',
																// preventTooFast: '1',
																// tooFastMultiplier: 2,
																// clockType: 'stopwatch',
																canSkip: '1',
																disableBack: '0',
																// totalQuestions: 5,
																// shouldSelect: 4,
																// timeLimit: 600,
																// questionSelectionTimeLimit: 60,
																// tooSlowDetector: 'puq',
																alertBeforeTooSlow: 15,
															},
															title: 'Agility improvement practice session',
														})}
														className="ant-btn ant-btn-primary"
													>
														Improve Agility
													</Link>
													<Link
														to={createLinkForSession({
															filters: allSubTopics
																.slice(0, 100)
																.map(id => ({ subTopic: id, level: 2 })),
															config: {
																allowReattempt: '1',
																// preventTooSlow: '1',
																preventTooFast: '1',
																// tooFastMultiplier: 2,
																// clockType: 'stopwatch',
																canSkip: '1',
																disableBack: '0',
																// totalQuestions: 5,
																// shouldSelect: 4,
																// timeLimit: 600,
																// questionSelectionTimeLimit: 60,
																// tooSlowDetector: 'puq',
																// alertBeforeTooSlow: 15,
															},
															title: 'Intent improvement practice session',
														})}
														className="ant-btn ant-btn-primary"
													>
														Improve Intent
													</Link>
													<Link
														to={createLinkForSession({
															filters: allSubTopics
																.slice(0, 100)
																.map(id => ({ subTopic: id, level: 2 })),
															config: {
																allowReattempt: '1',
																// preventTooSlow: '1',
																// preventTooFast: '1',
																// tooFastMultiplier: 2,
																// clockType: 'stopwatch',
																canSkip: '1',
																disableBack: '0',
																// totalQuestions: 5,
																// shouldSelect: 4,
																timeLimit: 600,
																// questionSelectionTimeLimit: 60,
																// tooSlowDetector: 'puq',
																alertBeforeTooSlow: 15,
															},
															title: 'Stamina impovement practice session',
														})}
														className="ant-btn ant-btn-primary"
													>
														Improve Stamina
													</Link>
													<Link
														to={createLinkForSession({
															filters: allSubTopics
																.slice(0, 100)
																.map(id => ({ subTopic: id, level: 2 })),
															config: {
																allowReattempt: '1',
																preventTooSlow: '1',
																// preventTooFast: '1',
																// tooFastMultiplier: 2,
																// clockType: 'stopwatch',
																canSkip: '1',
																disableBack: '0',
																// totalQuestions: 5,
																// shouldSelect: 4,
																// timeLimit: 600,
																// questionSelectionTimeLimit: 60,
																// tooSlowDetector: 'puq',
																alertBeforeTooSlow: 15,
															},
															title: 'Endurance impovement practice session',
														})}
														className="ant-btn ant-btn-primary"
													>
														Improve Endurance
													</Link>
												</Space>
											</div>
										)}
									</Card>
								)}
							/>
						) : null}
					</div>
					<div className="rsb">
						<Space
							direction="vertical"
							style={{ maxWidth: '100%', width: '100%', display: 'flex' }}
						>
							<Card
								size="small"
								bordered={!isLite}
								style={{ borderRadius: isLite ? 0 : undefined }}
							>
								<Space direction="vertical">
									{quickLinks.map(item => (
										<Link
											data-ga-on="click"
											data-ga-event-action="click"
											data-ga-event-category="Right Sidebar Link ListItem"
											data-ga-event-label={item.title}
											key={item.key}
											to={item.href}
										>
											<Space style={{ display: 'flex' }} size={12} align="start">
												<span style={{ fontSize: 20 }}>{item.icon}</span>
												<Space direction="vertical" size={4}>
													<Title level={5} style={{ marginBottom: 0, fontWeight: 500 }}>
														{item.title}
													</Title>
													<Text type="secondary">{item.description}</Text>
												</Space>
											</Space>
										</Link>
									))}
								</Space>
							</Card>
							<Goal
								streak={day}
								target={target}
								score={score}
								goals={goal}
								goalUpdateRequest={goalUpdateRequest}
								dailyActivity={daily_activity}
								mode={mode}
							/>
						</Space>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Difficulty: state.api.Difficulty,
	topics: state.api.Topics,
});

export default connect(mapStateToProps)(Practice);
