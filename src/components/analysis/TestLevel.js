import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { get, map } from 'lodash';
import { message, Button, Card, Row, Col, Divider } from 'antd';
import Leaderboard from './utils/Leaderboard';
import AnalysisPartOne from './AnalysisPartOne';
import AnalysisPartTwo from './AnalysisPartTwo';
import AnalysisPartThree from './AnalysisPartThree';
import AnalysisPartFour from './AnalysisPartFour';
import AnalysisPartFive from './AnalysisPartFive';
import sizeMe from 'react-sizeme';
import { getTopicNameMapping } from '../libs/lib';

import { URLS } from '../urls';
import './TestLevel.scss';
import { isAtLeastMentor } from 'utils/auth';
import axios from 'axios';
import dayjs from 'dayjs';
import Title from 'antd/lib/typography/Title';

class TestLevel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			key: 'tab1',
			pie: 'q',
			lKey: 'ltab1',
			filter: 'all',
			submissionDetails: null,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			const { height } = this.props.size;
			this.props.updateHeight(height);
		}, 10);

		const {
			assessmentWrapper: { messages },
			UserData,
			wid,
		} = this.props;
		if (messages) {
			messages.forEach(message => {
				if (message.type === 'warning') this.showWarning(message.message);
			});
		}
		axios
			.post(
				`${URLS.backendAssessment}/getSubmissionDetails`,
				{
					wrapperId: new URLSearchParams(window.location.search).get('wid')
						? new URLSearchParams(window.location.search).get('wid')
						: wid,
					userId: isAtLeastMentor(UserData.role)
						? new URLSearchParams(window.location.search).get('uid')
						: UserData._id,
				},
				{
					withCredentials: true,
					headers: {
						Authorization: `Token ${window.localStorage.getItem('token')}`,
					},
				}
			)
			.then(res => {
				const { data } = res;
				if (data.success) {
					const from = dayjs(data.from)
						.format('DD-MM-YYYY')
						.toString();
					let to = dayjs(data.to)
						.format('DD-MM-YYYY')
						.toString();
					if (from === to) {
						to = null;
					}
					const submittedOn = dayjs(data.submittedOn)
						.format('DD-MM-YYYY')
						.toString();
					this.setState({
						...this.state,
						submissionDetails: {
							from,
							to,
							submittedOn,
						},
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	componentWillUnmount() {
		message.destroy();
	}

	showWarning = warning => {
		message.warning(warning, 10000);
	};

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
	};

	togglePie = pie => this.setState({ pie: pie.target.value });

	goBack = () => {
		if (
			window.previousPreviousLocation &&
			window.previousPreviousLocation.indexOf('/dashboard') !== -1
		) {
			this.props.history.push(window.previousPreviousLocation);
		} else {
			this.props.history.push(URLS.analysisTest);
		}
	};

	render() {
		const {
			assessmentCore,
			assessmentCore: { duration, sections: sectionsCore, preAnalysis },
			assessmentWrapper: { name, type, _id },
			coreAnalysis: {
				maxMarks,
				sumPickingAbility,
				sumSqPickingAbility,
				totalAttempts,
				hist: coreHist,
				difficulty: difficultyStats,
			},
			wrapperAnalysis: { liveAttempts, hist, nintypercentile },
			id,
			bestQuestionGroupChoices,
		} = this.props;

		let {
			answerSheet,
			answerSheet: {
				meta: {
					rank,
					// percent,
					percentile,
					questionsAttempted,
					correctQuestions,
					incorrectQuestions,
					precision,
					marks,
					difficulty,
				},
				meta,
				live,
				roadmap,
			},
			SuperGroups,
			UserData: {
				stats: { topics },
				category,
				role,
			},
		} = this.props;

		console.log({ answerSheet });

		let userToSearch;

		if (isAtLeastMentor(role)) {
			userToSearch = new URLSearchParams(window.location.search).get('uid');
		}

		const percent = Math.round((10000.0 * marks) / maxMarks) / 100.0;

		const { lKey } = this.state;

		let global_toppers = [];
		let college_toppers = [];

		const recommendations = { topics: [] };

		const { Topics } = this.props;
		const TopicNameMapping = getTopicNameMapping(Topics);

		const reco = [];

		let max1 = 0;
		let max2 = 0;

		Object.keys(recommendations.topics).forEach(key => {
			// send only two from backend!!

			if (!reco.length && Math.abs(recommendations.topics[key].accuracy)) {
				reco.push({
					id: key,
					text: `You have very low accuracy in ${TopicNameMapping[key]} questions!!`,
				});
				max1 = Math.abs(recommendations.topics[key].accuracy);
			} else if (
				reco.length === 1 &&
				Math.abs(recommendations.topics[key].accuracy)
			) {
				reco.push({
					id: key,
					text: `You have very low accuracy in ${TopicNameMapping[key]} questions!!`,
				});
				max2 = Math.abs(recommendations.topics[key].accuracy);
			} else if (Math.abs(recommendations.topics[key].accuracy) > max1) {
				reco[1] = reco[0];
				max2 = max1;
				reco[0] = {
					id: key,
					text: `You have very low accuracy in ${TopicNameMapping[key]} questions!!`,
				};
				max1 = Math.abs(recommendations.topics[key].accuracy);
			} else if (Math.abs(recommendations.topics[key].accuracy) > max2) {
				reco[1] = {
					id: key,
					text: `You have very low accuracy in ${TopicNameMapping[key]} questions!!`,
				};
				max2 = Math.abs(recommendations.topics[key].accuracy);
			}
		});

		const ltabList = [{ key: 'ltab1', tab: 'Global' }];
		const leaderboards = { ltab1: global_toppers };
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		let found = false;
		SuperGroups.forEach(sg => {
			if (!found) {
				if (!currentSupergroup || sg._id === currentSupergroup) {
					if (
						college_toppers.length >= 20 &&
						sg.subgroups[0].subgroup.name !== sg.name
					) {
						ltabList.push({
							key: 'ltab2',
							tab: sg.subgroups[0].subgroup.name,
						});
						leaderboards.ltab2 = college_toppers;
					}
					found = true;
				}
			}
		});

		if (roadmap === undefined) roadmap = [];

		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						display: 'flex',
						width: '100%',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
					className="test-name-wrapper"
				>
					<div style={{ fontWeight: 'bold' }} className="test-name-text">
						{name}
					</div>
					<Link
						data-ga-on="click"
						data-ga-event-action="click"
						data-ga-event-category="Review Questions"
						data-ga-event-label="Page: Analysis, Position: Top"
						to={`${URLS.analysisQuestion}?id=${id}${
							userToSearch ? `&user=${userToSearch}` : ''
						}`}
						className="review-question-link-top"
					>
						<Button type="primary" style={{ marginLeft: 12 }}>
							Review Questions
						</Button>
					</Link>
					<div style={{ flex: 1 }}></div>
					<Button onClick={this.goBack}>Back</Button>
				</div>

				{window.config._id === 'cat' ? (
					<div style={{ width: '100%', marginBottom: 24 }}>
						<a
							href="https://www.facebook.com/groups/MBAPrepZone/"
							target="_blank"
							rel="noopener noreferrer"
							style={{ textDecoration: 'underline' }}
						>
							Join Hustle 30 - Powered by PrepZone
						</a>
					</div>
				) : null}

				<div
					style={{
						marginBottom: 5,
						fontSize: 20,
						fontWeight: '600',
						width: '100%',
					}}
				>
					Scorecard
				</div>
				{this.state.submissionDetails && (
					<Card
						style={{
							margin: '1rem 0',
							width: '100%',
						}}
					>
						<Row>
							<Col
								xs={24}
								sm={24}
								md={15}
								lg={15}
								xl={15}
								xxl={15}
								style={{ textAlign: 'center' }}
							>
								<Title level={3}>Test Held On</Title>
								<Title level={5}>
									{this.state.submissionDetails.from}
									{this.state.submissionDetails.to && (
										<> - {this.state.submissionDetails.to}</>
									)}
								</Title>
							</Col>
							<Col xs={24} sm={24} md={1} lg={1} xl={1} xxl={1}>
								<Divider
									type={window.innerWidth <= 576 ? 'horizontal' : 'vertical'}
									style={{
										height: window.innerWidth <= 576 ? 'auto' : '100%',
										backgroundColor: '#dcdae0',
										width: 2,
									}}
								/>
							</Col>
							<Col
								xs={24}
								sm={24}
								md={8}
								lg={8}
								xl={8}
								xxl={8}
								style={{ textAlign: 'center' }}
							>
								<Title level={3}>Test Submitted On</Title>
								<Title level={5}>{this.state.submissionDetails.submittedOn}</Title>
							</Col>
						</Row>
					</Card>
				)}
				<AnalysisPartOne
					maxMarks={maxMarks}
					marks={marks}
					live={live}
					rank={rank}
					percentile={percentile}
					precision={precision}
					questionsAttempted={questionsAttempted}
					correctQuestions={correctQuestions}
					incorrectQuestions={incorrectQuestions}
					autoGrade={type !== 'LIVE-TEST'}
					liveAttempts={liveAttempts}
					type={type}
					sections={map(sectionsCore, ({ name }, index) => ({
						name,
						...get(meta, ['sections', index]),
					}))}
				/>

				<div
					style={{
						marginTop: 20,
						marginBottom: 5,
						fontSize: 20,
						fontWeight: '600',
						width: '100%',
					}}
				>
					Know where you stand
				</div>
				<AnalysisPartTwo
					hist={hist}
					coreHist={coreHist}
					percent={percent}
					percentile={percentile}
					maxMarks={maxMarks}
					nintypercentile={nintypercentile}
					isGraphReady={this.props.isGraphReady}
					autoGrade={type !== 'LIVE-TEST'}
					id={id}
				/>

				{1 || type !== 'TOPIC-MOCK' ? (
					<div
						style={{
							marginTop: 20,
							marginBottom: 5,
							fontSize: 20,
							fontWeight: 'bold',
							width: '100%',
						}}
					>
						Recommendations
					</div>
				) : null}
				{1 || type !== 'TOPIC-MOCK' ? (
					<AnalysisPartFive
						assessmentId={_id}
						category={category}
						TopicNameMapping={TopicNameMapping}
						reco={reco}
						sections={sectionsCore}
						sumPickingAbility={sumPickingAbility}
						sumSqPickingAbility={sumSqPickingAbility}
						nAttempts={totalAttempts}
						duration={duration}
						preAnalysis={preAnalysis}
						type={type}
					/>
				) : null}

				<div
					style={{
						marginTop: 20,
						marginBottom: 5,
						fontSize: 20,
						fontWeight: '600',
						width: '100%',
					}}
				>
					Behaviour Analysis
				</div>
				<AnalysisPartThree
					roadmap={roadmap}
					duration={duration}
					meta={meta}
					sections={sectionsCore}
					difficulty={difficulty}
					difficultyStats={difficultyStats}
					maxMarks={maxMarks}
					category={category}
					assessmentId={_id}
					TopicNameMapping={TopicNameMapping}
					isGraphReady={this.props.isGraphReady}
					bestQuestionGroupChoices={bestQuestionGroupChoices}
					assessmentCore={assessmentCore}
					submission={answerSheet}
				/>

				<div
					style={{
						marginTop: 20,
						marginBottom: 5,
						fontSize: 20,
						fontWeight: '600',
						width: '100%',
					}}
				>
					Academic Knowledge
				</div>
				<AnalysisPartFour
					assessmentId={_id}
					topics={topics}
					difficulty={difficulty}
					difficultyStats={difficultyStats}
					TopicNameMapping={TopicNameMapping}
				/>

				<Leaderboard wrapperId={_id} />

				{0 && type === 'LIVE-TEST' ? (
					<div
						style={{
							marginTop: 20,
							marginBottom: 5,
							fontSize: 20,
							fontWeight: '600',
							width: '100%',
						}}
					>
						Leaderboard
					</div>
				) : null}
				{0 && type === 'LIVE-TEST' ? (
					<Card
						style={{ width: '100%' }}
						bodyStyle={{ display: 'flex' }}
						tabList={ltabList}
						activeTabKey={lKey}
						onTabChange={key => {
							this.onTabChange(key, 'lKey');
						}}
					>
						<Leaderboard leaderboard={leaderboards[lKey]} mode="assessment" />
					</Card>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	Topics: state.api.Topics,
	SuperGroups: state.api.SuperGroups,
	UserData: state.api.UserData,
});

export default connect(mapStateToProps)(
	sizeMe({ monitorHeight: true })(withRouter(TestLevel))
);
