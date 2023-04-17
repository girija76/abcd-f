import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, List } from 'antd';
import SectionTestLinksMobile from './SectionTestLinksMobile.js';

import './Mocks.css';

import { filterAssessmentsByLabel } from '../libs/lib';

import { URLS } from '../urls';

import { updateAssessmentWrappersAndFeeds } from '../api/ApiAction';
import getwrappers from '../api/getwrappers';

import 'antd/lib/skeleton/style/index.css';

const sections_ = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

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

		const { AssessmentWrappers } = props;
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
		if (nextProps.AssessmentWrappers !== this.props.AssessmentWrappers) {
			const { AssessmentWrappers } = nextProps;
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

		return (
			<SectionTestLinksMobile
				tab={1}
				allTests={filteredAssessments}
				Topics={Topics}
				mode={mode}
				loading={!AssessmentWrappers}
			/>
		);
	};

	handleLabelChange = selectedLabel => {
		// key is not used anymore
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
		const { AssessmentWrappers } = this.props;
		let { labels, selectedLabel } = this.state;
		const contentList = this.renderTabContent();

		return (
			<div
				className="content-and-rsb-container"
				style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
			>
				<div style={{ marginBottom: 12, width: '100%' }}>
					{labels.length ? (
						<List
							loading={!AssessmentWrappers}
							dataSource={labels}
							renderItem={label => (
								<Button
									style={
										selectedLabel === label
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
									onClick={this.handleLabelChange.bind(this, label)}
								>
									{label}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Mocks));
