import React from 'react';
import { Skeleton } from 'antd';
import Collapse from 'antd/es/collapse';
import { connect } from 'react-redux';
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
						nV: n,
						tests: [],
					};
				}
				topicsFound[tpMap[t.topic].pid].tests.push(t);
			}
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
		const { topicsFound } = this.state;
		topicsFound[k1].nV = topicsFound[k1].tests.length;
		this.setState({ topicsFound });
	};

	//const count = getTotalAttempted(data.subTopics[k].tests);

	render() {
		const { mode, loading, label } = this.props;
		const { topicsFound } = this.state;
		const totalTests = Object.keys(topicsFound).length;

		return (
			<div className="content-and-rsb-container">
				<Skeleton loading={loading}>
					{totalTests
						? Object.keys(topicsFound).map((k1, i1) => {
								const data = topicsFound[k1];
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
													<div style={{ fontWeight: 'bold' }}>{label || data.name}</div>
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
														return <TestLink test={test} sid={test.submission} mode={mode} />;
													})}
													{data.tests.length > data.nV ? (
														<div
															style={{
																width: '100%',
																display: 'flex',
																justifyContent: 'center',
															}}
														>
															<Button onClick={this.showMore.bind(this, k1)}>Show more</Button>
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

const mapStateToProps = state => ({ Topics: state.api.Topics });
export default connect(mapStateToProps)(TestLinks);
