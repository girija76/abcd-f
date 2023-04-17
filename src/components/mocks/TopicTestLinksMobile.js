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
				if (topicsFound[t.topic] === undefined) {
					topicsFound[t.topic] = {
						name: tpMap[t.topic].name,
						nV: 2,
						tests: [],
					};
				}
				topicsFound[t.topic].tests.push(t);
			}
		});

		Object.keys(topicsFound).forEach(k => {
			topicsFound[k].tests.sort((a, b) => {
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
					if (topicsFound[t.topic] === undefined) {
						topicsFound[t.topic] = {
							name: tpMap[t.topic].name,
							nV: 2,
							tests: [],
						};
					}
					topicsFound[t.topic].tests.push(t);
				}
			});

			Object.keys(topicsFound).forEach(k => {
				topicsFound[k].tests.sort((a, b) => {
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

			this.setState({ topicsFound });
		}
	}

	showMore = k1 => {
		const { topicsFound } = this.state;
		topicsFound[k1].nV = topicsFound[k1].tests.length;
		this.setState({ topicsFound });
	};

	render() {
		const { mode, loading } = this.props;
		const { topicsFound } = this.state;
		const totalTests = loading ? 1 : Object.keys(topicsFound).length;
		return (
			<div style={{ width: '100%', marginTop: 16 }}>
				{totalTests ? (
					<List
						loading={loading}
						dataSource={Object.keys(topicsFound)}
						renderItem={(k1, i1) => {
							const data = topicsFound[k1];
							const count = getTotalAttempted(data.tests);
							return (
								<Collapse
									key={'tt-' + i1}
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
		);
	}
}

export default TestLinks;
