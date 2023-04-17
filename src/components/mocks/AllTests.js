import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import Mocks from '../mocks/Mocks.js'; //this is for mobile only!
import SeriesTests from './wrappers/SeriesTests';
import TopicTests from '../mocks/TopicTests.js';
import SectionalTests from '../mocks/SectionalTests.js';
import Compete from '../mocks/Compete.js';
import CompeteMobile from '../mocks/CompeteMobile.js';
import { hideNavigation, topicTestsShortTitle } from 'utils/config';

import { URLS } from '../urls.js';

import './Compete.css';

const topics = {
	default: URLS.topicTests,
	cat: URLS.catTopicTests,
	placement: URLS.placementTopicTests,
	jee: URLS.jeeTopicTests,
};

const sections = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

const seriesUrls = {
	default: URLS.series,
	cat: URLS.catSeries,
	placement: URLS.placementSeries,
	jee: URLS.jeeSeries,
};

const mocks = {
	default: URLS.mocks2,
	cat: URLS.catMocks2,
	placement: URLS.placementMocks2,
	jee: URLS.jeeMocks2,
};

function getKey(mode, path) {
	let key_ = 'default';
	if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
	if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
	if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
	return key_;
}

class AllTests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	gotoTopic = () => {
		const { mode } = this.props;
		const key_ = getKey(mode, window.location.pathname);
		if (window.location.pathname !== topics[key_]) {
			this.props.history.push(topics[key_]);
		}
	};

	gotoSectional = () => {
		const { mode } = this.props;
		const key_ = getKey(mode, window.location.pathname);
		if (window.location.pathname !== sections[key_]) {
			this.props.history.push(sections[key_]);
		}
	};

	gotoFull = () => {
		const { mode } = this.props;
		const key_ = getKey(mode, window.location.pathname);
		if (window.location.pathname !== mocks[key_]) {
			this.props.history.push(mocks[key_]);
		}
	};

	gotoLive = () => {
		const { mode } = this.props;
		const key_ = getKey(mode, window.location.pathname);
		if (window.location.pathname !== competes[key_]) {
			this.props.history.push(competes[key_]);
		}
	};

	render() {
		const {
			activePhase: { topicMocks, sectionalMocks, fullMocks, liveTests, series },
			activePhase,
		} = this.props;
		const path = window.location.pathname;

		const { mode } = this.props;
		const key_ = getKey(mode, window.location.pathname);

		let topicActive = false;
		let sectionalActive = false;
		let fullActive = false;
		let liveActive = false;
		let seriesActive = false;
		if (path.indexOf(topics[key_]) !== -1) {
			topicActive = true;
		} else if (path.indexOf(sections[key_]) !== -1) {
			sectionalActive = true;
		} else if (path.indexOf(mocks[key_]) !== -1) {
			fullActive = true;
		} else if (path.indexOf(competes[key_]) !== -1) {
			liveActive = true;
		} else if (path.indexOf('/series-') !== 1) {
			seriesActive = true;
		}

		return (
			<div style={{ width: '100%' }}>
				{hideNavigation ? null : (
					<div
						style={{
							backgroundColor: 'white',
							borderBottom: '2px solid #dadce0',
						}}
						className="analysis-activity-session-navigator"
					>
						{topicMocks ? (
							<div
								style={
									topicActive
										? {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												color: '#429add',
												fontWeight: 'bold',
										  }
										: {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
										  }
								}
								onClick={this.gotoTopic}
							>
								<div style={{ fontSize: 16 }}>{topicTestsShortTitle}</div>
							</div>
						) : null}
						{sectionalMocks ? (
							<div
								style={
									sectionalActive
										? {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												color: '#429add',
												fontWeight: 'bold',
										  }
										: {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
										  }
								}
								onClick={this.gotoSectional}
							>
								<div style={{ fontSize: 16 }}>Sectional</div>
							</div>
						) : null}
						{fullMocks ? (
							<div
								style={
									fullActive
										? {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												color: '#429add',
												fontWeight: 'bold',
										  }
										: {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
										  }
								}
								onClick={this.gotoFull}
							>
								<div style={{ fontSize: 16 }}>Full Mocks</div>
							</div>
						) : null}
						{liveTests ? (
							<div
								style={
									liveActive
										? {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												color: '#429add',
												fontWeight: 'bold',
										  }
										: {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
										  }
								}
								onClick={this.gotoLive}
							>
								<div style={{ fontSize: 16 }}>
									{window.config.liveTestsText
										? window.config.liveTestsText
										: 'Live Tests'}
								</div>
							</div>
						) : null}
						{series && series.length ? (
							<Link
								to={
									seriesUrls[key_] +
									'-' +
									series[0]
										.split(' ')
										.join('')
										.toLowerCase()
								}
								style={
									seriesActive
										? {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												color: '#429add',
												fontWeight: 'bold',
												position: 'relative',
										  }
										: {
												flex: 1,
												display: 'flex',
												justifyContent: 'center',
												borderLeft: '1px solid #dadce0',
												borderRight: '1px solid #dadce0',
												padding: '16px 12px',
												position: 'relative',
										  }
								}
							>
								<div style={{ fontSize: 16 }}>{series[0]}</div>
								<div
									style={{
										position: 'absolute',
										width: 6,
										height: 6,
										backgroundColor: 'red',
										borderRadius: 100,
										top: 12,
										right: 12,
									}}
								></div>
							</Link>
						) : null}
					</div>
				)}
				{topicActive ? (
					<TopicTests
						match={this.props.match}
						mode={mode}
						activePhase={activePhase}
					/>
				) : null}
				{seriesActive ? (
					<SeriesTests
						mode={mode}
						activePhase={activePhase}
						series={series && series.length ? series[0] : ''}
					/>
				) : null}
				{sectionalActive ? (
					<SectionalTests mode={mode} activePhase={activePhase} />
				) : null}
				{fullActive ? <Mocks mode={mode} activePhase={activePhase} /> : null}
				{liveActive ? (
					<CompeteMobile mode={mode} activePhase={activePhase} />
				) : null}
				{liveActive || fullActive ? (
					<Compete mode={mode} activePhase={activePhase} />
				) : null}
			</div>
		);
	}
}

export default withRouter(AllTests);
