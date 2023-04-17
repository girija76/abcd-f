import React from 'react';
import { Button, Collapse, List } from 'antd';
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

class TestLinks extends React.PureComponent {
	constructor(props) {
		super(props);
		const { allTests, Topics } = props;
		const tpMap = getTopicParentNameMapping(Topics);
		const topicsFound = {};
		allTests.forEach(t => {
			if (tpMap[t.topic]) {
				if (topicsFound[tpMap[t.topic].pid] === undefined) {
					topicsFound[tpMap[t.topic].pid] = {
						name: tpMap[t.topic].parent,
						nV: 2,
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

	shouldComponentUpdate(nextProps, nextState) {
		//optimize this - was done for show more - deep props
		return true;
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.allTests !== this.props.allTests) {
			const { allTests, Topics } = nextProps;
			const tpMap = getTopicParentNameMapping(Topics);
			const topicsFound = {};
			allTests.forEach(t => {
				if (tpMap[t.topic]) {
					if (topicsFound[tpMap[t.topic].pid] === undefined) {
						topicsFound[tpMap[t.topic].pid] = {
							name: tpMap[t.topic].parent,
							nV: 2,
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

	render() {
		const { Topics, mode, loading } = this.props;
		const { topicsFound } = this.state;
		const tpMap = getTopicParentNameMapping(Topics);
		const totalTests = loading ? 1 : Object.keys(topicsFound).length;

		return (
			<div
				className="content-and-rsb-container"
				style={{ display: 'flex', flexWrap: 'wrap' }}
			>
				<div style={{ width: '100%', marginTop: 8 }}>
					{totalTests ? (
						<List
							loading={loading}
							dataSource={Object.keys(topicsFound)}
							renderItem={(k1, i1) => {
								const data = topicsFound[k1];
								const count = getTotalAttempted(data.tests);
								return (
									<Collapse
										key={Math.random() + ''}
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
							}}
						/>
					) : (
						'No test available yet.'
					)}
				</div>
			</div>
		);
	}
}

export default TestLinks;
