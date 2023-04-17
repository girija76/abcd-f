import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import Select from 'antd/es/select';
import SectionTestLinks from './SectionTestLinks.js';

import './Mocks.css';

import { filterAssessmentsByLabel } from '../libs/lib';

import { URLS } from '../urls';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import getwrappers from '../api/getwrappers';
import { sectionalTestTabName } from 'utils/config.js';

const { Option } = Select;

const extraTabNames = {
	'5d10e43944c6e111d0a17d0c': 'Section Tests (Non-CAT)',
};

const titles = {
	default: 'Sectional Tests - Preparation Portal',
	cat: 'Sectional Tests - CAT',
	placement: 'Sectional Tests - Placement',
	jee: 'Sectional Tests - IIT-JEE',
};

const mocks = {
	default: URLS.mocks,
	cat: URLS.catMocks,
	placement: URLS.placementMocks,
};

const sections_ = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

function getSections(assessments) {
	const tabListDetected = {};
	assessments.forEach(assessment => {
		if (assessment.section && assessment.label !== 'IIFT') {
			if (tabListDetected[assessment.section] === undefined)
				tabListDetected[assessment.section] = [];
			tabListDetected[assessment.section].push(assessment);
		}
	});
	return tabListDetected;
}

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

function getLabels(assessments) {
	const labels = {};
	assessments.forEach(assessment => {
		if (assessment.label) labels[assessment.label] = true;
	});
	return Object.keys(labels);
}

class Mocks extends React.PureComponent {
	constructor(props) {
		super(props);

		const { AssessmentWrappers, assessments, mode } = props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'SECTIONAL-MOCK';
			  })
			: [];

		let key = 'tab0';
		const defaultKeys = {};
		validAssessments.forEach(assessment => {
			if (assessment.label && defaultKeys[assessment.label] === undefined) {
				defaultKeys[assessment.label] = `tab-${assessment.section}`;
			}
		});

		defaultKeys['IIFT'] = 'tab0';
		const labels = getLabels(validAssessments);

		let selectedLabel = labels.length ? labels[0] : '';
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get('label')) {
			labels.forEach(l => {
				if (l === searchParams.get('label'))
					selectedLabel = searchParams.get('label');
			});
		}

		if (labels.length) {
			key = defaultKeys[selectedLabel] ? defaultKeys[selectedLabel] : 'tab0';
		} else {
			const tabListDetected = getSections(validAssessments);
			if (Object.keys(tabListDetected).length) {
				key = 'tab-' + Object.keys(tabListDetected)[0];
			}
		}

		this.state = {
			key,
			labels,
			selectedLabel,
		};
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
		if (nextProps.AssessmentWrappers !== this.props.AssessmentWrappers) {
			const { AssessmentWrappers, assessments, mode } = nextProps;
			const validAssessments = AssessmentWrappers
				? AssessmentWrappers.filter(assessment => {
						return assessment.type === 'SECTIONAL-MOCK';
				  })
				: [];

			let key = 'tab0';
			const defaultKeys = {};
			validAssessments.forEach(assessment => {
				if (assessment.label && defaultKeys[assessment.label] === undefined) {
					defaultKeys[assessment.label] = `tab-${assessment.section}`;
				}
			});

			defaultKeys['IIFT'] = 'tab0';
			const labels = getLabels(validAssessments);

			let selectedLabel = labels.length ? labels[0] : '';
			const searchParams = new URLSearchParams(window.location.search);
			if (searchParams.get('label')) {
				labels.forEach(l => {
					if (l === searchParams.get('label'))
						selectedLabel = searchParams.get('label');
				});
			}

			key = defaultKeys[selectedLabel] ? defaultKeys[selectedLabel] : 'tab0';

			this.setState({
				key,
				labels,
				selectedLabel,
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
		const { AssessmentWrappers, Topics, mode } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'SECTIONAL-MOCK';
			  })
			: [];

		const { selectedLabel } = this.state;
		const filteredAssessments = filterAssessmentsByLabel(
			validAssessments,
			selectedLabel
		);

		const sections = getSections(filteredAssessments);

		const tabs = {
			tab0: (
				<SectionTestLinks
					tab={1}
					allTests={filteredAssessments}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			),
		};
		Object.keys(sections).forEach(k => {
			tabs[`tab-${k}`] = (
				<SectionTestLinks
					tab={1}
					allTests={sections[k]}
					Topics={Topics}
					mode={mode}
					loading={!AssessmentWrappers}
				/>
			);
		});
		return tabs;
	};

	getTabList = () => {
		const { AssessmentWrappers, Topics } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'SECTIONAL-MOCK';
			  })
			: [];

		const { selectedLabel } = this.state;
		const filteredAssessments = filterAssessmentsByLabel(
			validAssessments,
			selectedLabel
		);

		const tabListDetected = getSections(filteredAssessments);

		if (Object.keys(tabListDetected).length) {
			return Object.keys(tabListDetected).map((k, i) => {
				return { key: `tab-${k}`, tab: k };
			});
		} else {
			return null;
		}
	};

	handleLabelChange = selectedLabel => {
		const { AssessmentWrappers, mode } = this.props;
		const validAssessments = AssessmentWrappers
			? AssessmentWrappers.filter(assessment => {
					return assessment.type === 'SECTIONAL-MOCK';
			  })
			: [];

		const filteredAssessments = filterAssessmentsByLabel(
			validAssessments,
			selectedLabel
		);
		let key = 'tab0';
		filteredAssessments.forEach(assessment => {
			if (assessment.section && key === 'tab0') {
				key = `tab-${assessment.section}`;
			}
		});

		key = selectedLabel !== 'IIFT' ? key : 'tab0';

		this.setState({ selectedLabel, key });

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';

		this.props.history.push(`${sections_[key_]}/?label=${selectedLabel}`);
	};

	render() {
		const { mode, UserData } = this.props;
		let { key, labels, selectedLabel } = this.state;
		const tabList = this.getTabList();

		const contentList = this.renderTabContent();
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		return (
			<div
				className="content-and-rsb-container"
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				<Helmet>
					<title>{window.config.metaData.demoSectionalTests.title}</title>
					<meta
						name="description"
						content={window.config.metaData.demoSectionalTests.description}
					/>
					{mode === 'demo' ? (
						<link
							rel="canonical"
							href={`https://${subDomain}.prepleaf.com/demo/${key_}/sectional-tests`}
						/>
					) : null}
				</Helmet>
				<Card
					// className="compete-card lsb"
					style={{ width: '100%' }}
					headStyle={{ fontSize: 18, fontWeight: 'bold' }}
					bodyStyle={{ padding: '24px 20px' }}
					title={
						labels.length ? (
							<div style={{ display: 'flex' }}>
								<div>Sectional Tests</div>
								<div style={{ flex: 1 }}></div>
								<Select
									defaultValue={selectedLabel}
									style={{ width: 120 }}
									onChange={this.handleLabelChange}
								>
									{labels.map(label => {
										return <Option value={label}>{label}</Option>;
									})}
								</Select>
							</div>
						) : (
							sectionalTestTabName
						)
					}
					tabList={tabList}
					activeTabKey={key}
					onTabChange={key => {
						this.onTabChange(key, 'key');
					}}
				>
					{isProfileComplete(UserData, currentSupergroup, mode) ? (
						contentList[key]
					) : (
						<span>
							You need to choose username and {collegeText} before we fetch assessments
							for you.{' '}
							<Link to={URLS.profile} style={{ color: 'blue' }}>
								Click here to update your profile.
							</Link>
						</span>
					)}
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Difficulty: state.api.Difficulty,
	Topics: state.api.Topics,
	Assessments: state.api.Assessments,
	AssessmentWrappers: state.api.AssessmentWrappers,
});

const mapDispatchToProps = dispatch => {
	return {
		updateAssessmentWrappersAndFeeds: data =>
			dispatch(updateAssessmentWrappersAndFeeds(data)),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mocks));
