import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { URLS } from '../urls.js';
import TestLinksMobile from './TestLinksMobile.js';
import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import getwrappers from '../api/getwrappers';

import './Compete.css';

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

const titles = {
	default: 'Tests - Preparation Portal',
	cat: 'Tests - CAT',
	placement: 'Tests - Placement',
	jee: 'Tests - IIT-JEE',
};

function isProfileComplete(UserData, currentSupergroup, mode) {
	if (mode === 'demo') return true;
	if (!UserData.username) return false;
	let phaseFound = false;
	UserData.subscriptions.forEach(subscription => {
		if (subscription.group === currentSupergroup) {
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(ph => {
					if (ph.active) phaseFound = true;
				});
			});
		}
	});
	return phaseFound;
}

class Compete extends React.Component {
	constructor(props) {
		super(props);
		const {
			mode,
			activePhase: { fullMocks, liveTests },
		} = props;
		let key = 'tab0';
		const path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		if (fullMocks && liveTests) {
			key = 'tab1';
			if (path.indexOf(`${competes[key_]}/mocks`) >= 0) {
				key = 'tab2';
			}
		}

		this.state = {
			key,
		};
	}

	componentWillMount() {
		const {
			AssessmentWrappers,
			activePhase: { _id },
		} = this.props;
		if (AssessmentWrappers === null || AssessmentWrappers === undefined) {
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

	render() {
		const { UserData, Topics } = this.props;
		let { AssessmentWrappers, mode } = this.props;
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';

		const fullMocks = AssessmentWrappers
			? AssessmentWrappers.filter(aw => {
					if (aw.series) {
						return false;
					}
					return aw.type === 'FULL-MOCK';
			  })
			: [];

		return (
			<div className="content-wrapper compete-mobile-wrapper">
				<div
					className="content-and-rsb-container"
					style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
				>
					<Helmet>
						<title>{titles[key_]}</title>
					</Helmet>
					{isProfileComplete(UserData, currentSupergroup, mode) ? (
						<TestLinksMobile
							tab={1}
							allTests={fullMocks}
							Topics={Topics}
							mode={mode}
							increasedWidth={true}
							mobile={true}
							loading={!AssessmentWrappers}
							marginTop={-16}
						/>
					) : (
						<span>
							You need to choose username and {collegeText} before we fetch assessments
							for you.{' '}
							<Link to={URLS.profile} style={{ color: 'blue' }}>
								Click here to update your profile.
							</Link>
						</span>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		Assessments: state.api.Assessments,
		Topics: state.api.Topics,
		AssessmentWrappers: state.api.AssessmentWrappers,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Compete));
