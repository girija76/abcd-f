import React from 'react';
import { Skeleton } from 'antd';
import Collapse from 'antd/es/collapse';
import Button from 'antd/es/button';
import { withRouter } from 'react-router-dom';
import TestLink from './TestLink';

import { ProfileTwoTone } from '@ant-design/icons';

import './TestLinks.css';
import './TestLink.css';

const { Panel } = Collapse;

class TestLinks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { allTests } = props;

		const labelsFound = {};
		let showLabels = false;
		allTests.forEach(t => {
			if (t.label) {
				if (labelsFound[t.label] === undefined)
					labelsFound[t.label] = { nV: 3, tests: [] };
				labelsFound[t.label].tests.push(t);
				showLabels = true;
			} else {
				if (labelsFound['Other'] === undefined)
					labelsFound['Other'] = { nV: 100, tests: [] };
				labelsFound['Other'].tests.push(t);
			}
		});

		this.state = {
			showLabels,
			labelsFound,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { allTests } = nextProps;

		const labelsFound = {};
		let showLabels = false;
		allTests.forEach(t => {
			if (t.label) {
				if (labelsFound[t.label] === undefined)
					labelsFound[t.label] = { nV: 3, tests: [] };
				labelsFound[t.label].tests.push(t);
				showLabels = true;
			} else {
				if (labelsFound['Other'] === undefined)
					labelsFound['Other'] = { nV: 100, tests: [] };
				labelsFound['Other'].tests.push(t);
			}
		});

		this.setState({
			showLabels,
			labelsFound,
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	showMore = k => {
		const { labelsFound } = this.state;
		labelsFound[k].nV = labelsFound[k].tests.length;
		this.setState({ labelsFound });
	};

	render() {
		const {
			increasedWidth,
			loading,
			mode,
			classname,
			location: { pathname },
			footerText,
		} = this.props;
		const { showLabels, labelsFound } = this.state;
		const isHustle = pathname.indexOf('series-hustle30') > -1;

		const totalTests = Object.keys(labelsFound).length;

		const sortedLabel = Object.keys(labelsFound).sort((a, b) => {
			if (a === 'AIOT' && b === 'JEE Mains - Revision') {
				return 1;
			} else if (b === 'AIOT' && a === 'JEE Mains - Revision') {
				return -1;
			} else {
				return 1;
			}
		});

		return (
			<div className="content-and-rsb-container" style={{ width: '100%' }}>
				<Skeleton loading={loading}>
					{showLabels
						? totalTests
							? sortedLabel.map((k, i) => {
									return (
										<Collapse
											key={i}
											defaultActiveKey={['1']}
											style={{ margin: '8px 0px' }}
										>
											<Panel
												key={`panel-${i}`}
												header={<div style={{ fontWeight: 'bold' }}>{k}</div>}
											>
												<div
													style={{
														display: 'flex',
														justifyContent: 'center',
													}}
												>
													<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
														{labelsFound[k].tests.slice(0, labelsFound[k].nV).map(test => {
															return (
																<TestLink
																	test={test}
																	increasedWidth={increasedWidth}
																	mode={mode}
																	classname={classname}
																/>
															);
														})}
														{labelsFound[k].tests.length > labelsFound[k].nV ? (
															<div
																style={{
																	width: '100%',
																	display: 'flex',
																	justifyContent: 'center',
																}}
															>
																<Button onClick={this.showMore.bind(this, k)}>Show more</Button>
															</div>
														) : null}
													</div>
												</div>
											</Panel>
										</Collapse>
									);
							  })
							: 'No test available yet.'
						: totalTests
						? Object.keys(labelsFound).map((k, i) => {
								return (
									<div key={k} style={i ? { marginTop: 24 } : {}}>
										{showLabels ? (
											<div style={{ fontWeight: 'bold', fontSize: 18 }}>{k}</div>
										) : null}

										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
												{labelsFound[k].tests.map(test => {
													return (
														(!test.onlyCBT || test.submission) && (
															<TestLink
																key={test._id}
																test={test}
																increasedWidth={increasedWidth}
																mode={mode}
																classname={classname}
															/>
														)
													);
												})}
											</div>
										</div>
									</div>
								);
						  })
						: 'No test available yet.'}
					{isHustle ? (
						<div>
							<ul style={{ margin: 0 }}>
								<li>
									Join the largest MBA-Peer group to discuss your doubts with the mentors{' '}
									<a
										target="_blank"
										rel="noreferrer noopener"
										style={{ color: '#1a8fff' }}
										className="link"
										href="https://www.facebook.com/groups/MBAPrepZone/"
									>
										here
									</a>
								</li>
								<li>
									Watch Analysis and learnings from Hustle 30{' '}
									<a
										rel="noreferrer noopener"
										target="_blank"
										style={{ color: '#1a8fff' }}
										className="link"
										href="https://youtu.be/_egWje-wa0U"
									>
										here
									</a>
								</li>
							</ul>
						</div>
					) : null}
					{!isHustle && totalTests ? (
						footerText === 'LIVE-TEST' ? (
							<div style={{ marginTop: 16 }}>
								*You can click on <ProfileTwoTone style={{ fontSize: 18 }} /> icon to
								view instructions, syllabus and other details of upcoming assessments.
							</div>
						) : (
							<div style={{ marginTop: 16 }}>*You can attempt a test only once.</div>
						)
					) : null}
				</Skeleton>
			</div>
		);
	}
}

export default withRouter(TestLinks);
