/* eslint-disable no-underscore-dangle */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Progress, Row, Space, Tooltip } from 'antd';
import RegistrationPrompt from 'components/login/Prompt';

import './Practice.css';
import { withRouter } from 'react-router-dom';

import { COLORS } from '../colors';
import { URLS } from '../urls';

import { Helmet } from 'react-helmet';
import { createLinkForSession } from 'utils/session';

import { topicColorImages } from '../extra';
import { isLite } from 'utils/config';
import { BsArrowRight, BsArrowRightShort } from 'react-icons/bs';

const subTopicsForReattemptSession = [
	'5d1f1bbbc144745ffcdcbac1',
	'5d5f02d3eaf5f804d9c7eb7f',
	'5da78ac3f0197223284a2761',
	'5da78acdf0197223284a2763',
	'5da78ad5f0197223284a2766',
	'5da78adbf0197223284a276a',
	'5da78ae2f0197223284a276c',
	'5d6e111e40f68a74e25d12c5',
	'5da78b30f0197223284a277b',
	'5da78b42f0197223284a277e',
	'5da78b50f0197223284a277f',
	'5da78b58f0197223284a2780',
	'5da78b5ef0197223284a2782',
];

const titles = {
	default: ' | Preparation Portal',
	cat: ' | CAT',
	placement: ' | Placement',
	jee: ' | IIT-JEE',
};

export class PracticeSubtopics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		};
	}

	showModal = () => this.setState({ showModal: true });

	getSubtopics = () => {
		const { mode } = this.props;
		const {
			location: { pathname },
		} = window;
		if (
			(mode !== 'demo' && pathname.split('/').length < 3) ||
			(mode === 'demo' && pathname.split('/').length < 4)
		) {
			this.props.history.push(URLS.practice);
			return { topicName: '', Subtopics: [], percent_complete: 0 };
		} else {
			const { Topics } = this.props;
			const topicId =
				mode === 'demo' ? pathname.split('/')[4] : pathname.split('/')[3];
			let topicName = '';
			let Subtopics = [];
			let percent_complete = 0;
			Topics.forEach(topic => {
				if (topic._id === topicId) {
					topicName = topic.name;
					topic.sub_topics.forEach(st => {
						if (!st.hide) Subtopics.push(st);
					});
					percent_complete = topic.percent_complete;
				}
			});
			Subtopics = Subtopics.map(topic => {
				const isDisabled =
					topic.percent_complete === 100 || topic.published_questions === 0;
				const link =
					mode !== 'demo' ? (
						<Link
							to={createLinkForSession({
								config: {
									allowReattempt: subTopicsForReattemptSession.indexOf(topic._id) > -1,
									selector: 'topicAdaptive',
								},
								filters: [{ subTopic: topic._id }],
								title: `Practice - ${topic.name}`,
							})}
							data-ga-on="click"
							data-ga-event-action="Start Practice"
							data-ga-event-category="Practice sub-topic"
							data-ga-event-label={topic.name}
							className="ant-btn ant-btn-link"
							disabled={isDisabled}
							style={{
								background: '#cde6f5',
								lineHeight: 'normal',
								height: 'auto',
								padding: 0,
								paddingLeft: 14,
								paddingRight: 14,
								borderRadius: '6px',
								textTransform: 'uppercase',
								fontWeight: 500,
								fontSize: '14px',
								display: 'inline-flex',
								alignItems: 'center',
								minHeight: 42,
							}}
						>
							<Space
								align="center"
								style={{ lineHeight: 'normal', marginTop: 2 }}
								size={2}
							>
								<span style={{ display: 'inline-block', paddingBottom: 4 }}>
									Practice Now
								</span>
								<BsArrowRightShort size={24} />
							</Space>
						</Link>
					) : (
						<div
							className="ant-btn ant-btn-lg"
							style={{
								borderRadius: '25px',
								width: 180,
								fontWeight: 500,
								fontSize: '1.2em',
								paddingTop: '3px',
								paddingBottom: '3px',
								height: 'auto',
								display: 'inline-flex',
								justifyContent: 'center',
								alignItems: 'center',
								lineHeight: '38px',
							}}
							onClick={this.showModal}
						>
							Practice now
						</div>
					);
				const percentComplete =
					mode === 'demo' ? 20 : Math.round(topic.percent_complete);
				return (
					<div
						key={topic._id}
						style={{
							backgroundColor: COLORS.background,
							borderRadius: 4,
							alignItems: 'center',
							padding: isLite ? '1rem 1rem .5rem' : '1rem 1rem .5rem',
							marginBottom: 12,
						}}
					>
						<Row gutter={[8, 8]} justify="space-between" align="middle">
							<Col flex="1">
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: '500', fontSize: 20, color: COLORS.text }}>
										{topic.name}
									</div>
									<div style={{ color: 'grey' }}>
										{percentComplete ? (
											<>
												<Progress
													percent={percentComplete}
													showInfo={false}
													trailColor="rgb(135 206 250 / 34%)"
												/>
												<div>{`${percentComplete}% completed`}</div>
											</>
										) : (
											<div>0% completed</div>
										)}
									</div>
								</div>
							</Col>
							<Col xs={24} md={undefined}>
								{isDisabled ? (
									<Tooltip
										title="You have practiced all questions of this topic"
										children={<span>{link}</span>}
									/>
								) : (
									link
								)}
							</Col>
						</Row>
					</div>
				);
			});
			return {
				topicName: topicName,
				Subtopics: Subtopics,
				percent_complete: percent_complete,
			};
		}
	};

	render() {
		const { Topics, mode } = this.props;
		const { showModal } = this.state;
		const { topicName, Subtopics, percent_complete } = this.getSubtopics();
		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		const topicId = mode === 'demo' ? path.split('/')[4] : path.split('/')[3];

		const subtopicnames = [];
		Topics.forEach(topic => {
			if (topic._id === topicId) {
				topic.sub_topics.forEach(st => {
					subtopicnames.push(st.name);
				});
			}
		});

		const description =
			topicName + ' has these subtopics- ' + subtopicnames.join(', ');
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					flexDirection: 'column',
				}}
			>
				<Helmet>
					<title>{'Prepare for ' + topicName + titles[key_]}</title>
					<meta name="description" content={description} />
				</Helmet>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>
						<img
							alt={`icon for ${topicName}`}
							src={topicColorImages[topicName]}
							style={{ width: 64, height: 64 }}
						/>
					</div>
					<div style={{ marginLeft: 12 }}>
						<div style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>
							{topicName}
						</div>
						<div style={{ fontSize: 11, color: COLORS.text }}>
							{mode === 'demo' ? 0 : Math.round(percent_complete)} % completed
						</div>
					</div>
				</div>
				<div style={{ width: '100%', padding: 12, paddingBottom: 0 }}>
					{Subtopics}
				</div>
				<RegistrationPrompt
					visible={showModal}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	Topics: state.api.Topics,
});

export default connect(mapStateToProps)(withRouter(PracticeSubtopics));
