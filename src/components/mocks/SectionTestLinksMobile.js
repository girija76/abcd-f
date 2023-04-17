import React from 'react';
import { Skeleton } from 'antd';
import Collapse from 'antd/es/collapse';
import Button from 'antd/es/button';

import TestLinkMobile from './TestLinkMobile';

import { getTopicParentNameMapping } from '../libs/lib';

import './TestLink.css';
import './TestLink.css';

const { Panel } = Collapse;

function getTotalAttempted(allTests) {
	let count = 0;
	allTests.forEach(at => {
		if (at.submission) count += 1;
	});
	return count;
}

function getSections(assessments) {
	const tabListDetected = {};
	assessments.forEach(assessment => {
		if (assessment.section) {
			if (tabListDetected[assessment.section] === undefined)
				tabListDetected[assessment.section] = { nV: 2, tests: [] };
			tabListDetected[assessment.section].tests.push(assessment);
		}
	});
	return tabListDetected;
}

class SectionTestLinks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { allTests } = props;
		const sections = getSections(allTests);
		this.state = {
			sections,
		};
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.allTests !== this.props.allTests) {
			const { allTests } = nextProps;
			const sections = getSections(allTests);
			this.setState({ sections });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		//optimize this - was done for show more - deep props
		return true;
	}

	showMore = k1 => {
		const { sections } = this.state;
		sections[k1].nV = sections[k1].tests.length;
		this.setState({ sections });
	};

	render() {
		const { allTests, Topics, attemptedTests, mode, loading } = this.props;
		const { sections } = this.state;
		const totalTests = Object.keys(sections).length;

		return (
			<div
				className="content-and-rsb-container"
				style={{ display: 'flex', flexWrap: 'wrap' }}
			>
				<div style={{ width: '100%', padding: '0px 12px', marginTop: 8 }}>
					{totalTests
						? Object.keys(sections).map((k1, i) => {
								const data = sections[k1];
								const count = getTotalAttempted(data.tests);
								return (
									<Collapse
										key={k1}
										defaultActiveKey={['1']}
										style={{ margin: '8px 0px' }}
									>
										<Panel
											key={`panel-${i}`}
											header={
												<div style={{ display: 'flex' }}>
													<div style={{ fontWeight: 'bold' }}>{k1}</div>
													<div style={{ flex: 1 }}></div>
													<div style={{ fontSize: 13, marginRight: 12 }}>
														{count} / {data.tests.length} tests attempted
													</div>
												</div>
											}
											className={`panel-link-${Math.round(
												(10 * count) / data.tests.length
											)} panel-mobile`}
										>
											<div
												style={{
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
													{data.tests.slice(0, data.nV).map(test => {
														return (
															<TestLinkMobile test={test} sid={test.submission} mode={mode} />
														);
													})}
													{data.tests.length > data.nV ? (
														<div
															style={{
																width: '100%',
																display: 'flex',
																justifyContent: 'center',
															}}
														>
															<Button
																type="link"
																style={{ padding: '6px 15px', height: 40 }}
																onClick={this.showMore.bind(this, k1)}
															>
																Show more
															</Button>
														</div>
													) : null}
												</div>
											</div>
										</Panel>
									</Collapse>
								);
						  })
						: 'No test available yet.'}
				</div>
			</div>
		);
	}
}

export default SectionTestLinks;
