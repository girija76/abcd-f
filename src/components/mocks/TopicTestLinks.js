import React from 'react';
import { Skeleton } from 'antd';
import Collapse from 'antd/es/collapse';
import Button from 'antd/es/button';

import TestLink from './TestLink';

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

class TestLinks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { allTests, Topics } = props;

		const width = window.screen.width;
		let n = 5;
		if (width <= 1024) {
			n = 3;
		} else if (width <= 1440) {
			n = 4;
		}

		const tpMap = getTopicParentNameMapping(Topics);
		const topicsFound = {};
		allTests.forEach(t => {
			if (tpMap[t.topic]) {
				if (topicsFound[tpMap[t.topic].pid] === undefined) {
					topicsFound[tpMap[t.topic].pid] = {
						name: tpMap[t.topic].parent,
						subTopics: {},
					};
				}
				if (topicsFound[tpMap[t.topic].pid].subTopics[t.topic] === undefined) {
					topicsFound[tpMap[t.topic].pid].subTopics[t.topic] = { nV: n, tests: [] };
				}
				topicsFound[tpMap[t.topic].pid].subTopics[t.topic].tests.push(t);
			}
		});

		Object.keys(topicsFound).forEach(k => {
			Object.keys(topicsFound[k].subTopics).forEach(kk => {
				topicsFound[k].subTopics[kk].tests.sort((a, b) => {
					if (a.slang && b.slang) {
						if (a.slang < b.slang) return -1;
						return a.slang > b.slang ? 1 : 0;
					} else if (a.slang) {
						if (a.slang < b.name) return -1;
						return a.slang > b.name ? 1 : 0;
					} else if (b.slang) {
						if (a.name < b.slang) return -1;
						return a.name > b.slang ? 1 : 0;
					} else {
						if (a.name < b.name) return -1;
						return a.name > b.name ? 1 : 0;
					}
				});
			});
		});

		this.state = {
			topicsFound,
		};
	}

	shouldComponentUpdate() {
		// handle deep nesting
		return true;
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.allTests !== this.props.allTests) {
			const { allTests, Topics } = nextProps;

			const width = window.screen.width;
			let n = 5;
			if (width <= 1024) {
				n = 3;
			} else if (width <= 1440) {
				n = 4;
			}

			const tpMap = getTopicParentNameMapping(Topics);
			const topicsFound = {};
			allTests.forEach(t => {
				if (tpMap[t.topic]) {
					if (topicsFound[tpMap[t.topic].pid] === undefined) {
						topicsFound[tpMap[t.topic].pid] = {
							name: tpMap[t.topic].parent,
							subTopics: {},
						};
					}
					if (topicsFound[tpMap[t.topic].pid].subTopics[t.topic] === undefined) {
						topicsFound[tpMap[t.topic].pid].subTopics[t.topic] = { nV: n, tests: [] };
					}
					topicsFound[tpMap[t.topic].pid].subTopics[t.topic].tests.push(t);
				}
			});

			Object.keys(topicsFound).forEach(k => {
				Object.keys(topicsFound[k].subTopics).forEach(kk => {
					topicsFound[k].subTopics[kk].tests.sort((a, b) => {
						if (a.slang && b.slang) {
							if (a.slang < b.slang) return -1;
							return a.slang > b.slang ? 1 : 0;
						} else if (a.slang) {
							if (a.slang < b.name) return -1;
							return a.slang > b.name ? 1 : 0;
						} else if (b.slang) {
							if (a.name < b.slang) return -1;
							return a.name > b.slang ? 1 : 0;
						} else {
							if (a.name < b.name) return -1;
							return a.name > b.name ? 1 : 0;
						}
					});
				});
			});

			this.setState({ topicsFound });
		}
	}

	showMore = (k1, k) => {
		const { topicsFound } = this.state;
		topicsFound[k1].subTopics[k].nV = topicsFound[k1].subTopics[k].tests.length;
		this.setState({ topicsFound });
	};

	render() {
		const { Topics, mode, loading } = this.props;
		const { topicsFound } = this.state;
		const tpMap = getTopicParentNameMapping(Topics);
		const totalTests = Object.keys(topicsFound).length;

		return (
			<div className="content-and-rsb-container">
				<Skeleton loading={loading}>
					{totalTests
						? Object.keys(topicsFound).map((k1, i1) => {
								const data = topicsFound[k1];
								return (
									<div style={i1 ? { marginTop: 24 } : {}}>
										<div style={{ fontWeight: 'bold', fontSize: 18 }}>{data.name}</div>
										{Object.keys(data.subTopics).map((k, i) => {
											const count = getTotalAttempted(data.subTopics[k].tests);
											return (
												<Collapse defaultActiveKey={['1']} style={{ margin: '8px 0px' }}>
													<Panel
														key={`panel-${i}`}
														header={
															<div style={{ display: 'flex' }}>
																<div style={{ fontWeight: 'bold' }}>{tpMap[k].name}</div>
																<div style={{ flex: 1 }}></div>
																<div style={{ fontSize: 13, marginRight: 12 }}>
																	{count} / {data.subTopics[k].tests.length} tests attempted
																</div>
															</div>
														}
														className={`panel-link-${Math.round(
															(10 * count) / data.subTopics[k].tests.length
														)}`}
													>
														<div
															style={{
																display: 'flex',
																justifyContent: 'center',
															}}
														>
															<div
																style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}
															>
																{data.subTopics[k].tests
																	.slice(0, data.subTopics[k].nV)
																	.map(test => {
																		return (
																			<TestLink test={test} sid={test.submission} mode={mode} />
																		);
																	})}
																{data.subTopics[k].tests.length > data.subTopics[k].nV ? (
																	<div
																		style={{
																			width: '100%',
																			display: 'flex',
																			justifyContent: 'center',
																		}}
																	>
																		<Button onClick={this.showMore.bind(this, k1, k)}>
																			Show more
																		</Button>
																	</div>
																) : null}
															</div>
														</div>
													</Panel>
												</Collapse>
											);
										})}
									</div>
								);
						  })
						: 'No test available yet.'}
				</Skeleton>
			</div>
		);
	}
}

export default TestLinks;
