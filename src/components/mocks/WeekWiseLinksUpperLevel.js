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

		let minTime = 1e16;

		allTests.forEach(t => {
			const af = new Date(t.availableFrom).getTime();
			minTime = Math.min(minTime, af);
		});

		const weekMap = {};
		allTests.forEach(t => {
			const af = new Date(t.availableFrom).getTime();
			const weekNo = Math.floor((af - minTime) / (7 * 24 * 60 * 60 * 1000));

			if (!weekMap[weekNo])
				weekMap[weekNo] = { name: `Week ${weekNo + 1}`, nV: n, tests: [] };
			weekMap[weekNo].tests.push(t);
		});

		this.state = {
			weekMap,
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
							nV: n,
							tests: [],
						};
					}
					topicsFound[tpMap[t.topic].pid].tests.push(t);
				}
			});

			this.setState({ topicsFound });
		}
	}

	showMore = k1 => {
		const { weekMap } = this.state;
		weekMap[k1].nV = weekMap[k1].tests.length;
		this.setState({ weekMap });
	};

	render() {
		const { mode, loading } = this.props;
		const { weekMap } = this.state;
		const totalTests = Object.keys(weekMap).length;

		return (
			<div className="content-and-rsb-container">
				<Skeleton loading={loading}>
					{totalTests
						? Object.keys(weekMap)
								.sort((a, b) => {
									if (a > b) return -1;
									else if (a < b) return 1;
									else return 0;
								})
								.map((k1, i1) => {
									const data = weekMap[k1];
									const count = getTotalAttempted(data.tests);
									return (
										<Collapse
											key={data.name}
											defaultActiveKey={['1']}
											style={{ margin: '8px 0px' }}
										>
											<Panel
												key={`panel-${i1}`}
												header={
													<div style={{ display: 'flex' }}>
														<div style={{ fontWeight: 'bold' }}>{data.name}</div>
														<div style={{ flex: 1 }}></div>
														<div style={{ fontSize: 13, marginRight: 12 }}>
															{count} / {data.tests.length} tests attempted
														</div>
													</div>
												}
												className={`panel-link-${Math.round(
													(10 * count) / data.tests.length
												)}`}
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
																<TestLink test={test} sid={test.submission} mode={mode} />
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
																<Button onClick={this.showMore.bind(this, k1)}>
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
				</Skeleton>
			</div>
		);
	}
}

export default TestLinks;
