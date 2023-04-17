import React from 'react';
import Card from 'antd/es/card';

import Select from 'antd/es/select';

import TestLink from './TestLink.js';

import quant from '../images/topics/quant.svg';
import verbal from '../images/topics/verbal.svg';
import di from '../images/topics/di.svg';
import lr from '../images/topics/lr.svg';
import quant_color from '../images/topics/quant_color.svg';
import verbal_color from '../images/topics/verbal_color.svg';
import di_color from '../images/topics/di_color.svg';
import lr_color from '../images/topics/lr_color.svg';

const { Option, OptGroup } = Select;

const topicImages = {
	Algebra: quant,
	Geometry: quant,
	'Probability & Combinatorics': quant,
	'Profit, Loss, Percentage & Interest': quant,
	'Time, Distance & Work': quant,
	'Average, Ratio & Proportion': quant,
	'Progression & Series': quant,
	Numbers: quant,
	'Logical Reasoning': lr,
	'Data Interpretation': di,
	'Verbal Reasoning': verbal,
	'Reading Comprehension': verbal,
};

const topicImagesColor = {
	Algebra: quant_color,
	Geometry: quant_color,
	'Probability & Combinatorics': quant_color,
	'Profit, Loss, Percentage & Interest': quant_color,
	'Time, Distance & Work': quant_color,
	'Average, Ratio & Proportion': quant_color,
	'Progression & Series': quant_color,
	Numbers: quant_color,
	'Logical Reasoning': lr_color,
	'Data Interpretation': di_color,
	'Verbal Reasoning': verbal_color,
	'Reading Comprehension': verbal_color,
};

const topicColors = {
	Algebra: '#066D4F',
	Geometry: '#066D4F',
	'Probability & Combinatorics': '#066D4F',
	'Profit, Loss, Percentage & Interest': '#066D4F',
	'Time, Distance & Work': '#066D4F',
	'Average, Ratio & Proportion': '#066D4F',
	'Progression & Series': '#066D4F',
	Numbers: '#066D4F',
	'Logical Reasoning': '#b36810',
	'Data Interpretation': '#BE3300',
	'Verbal Reasoning': '#1265C7',
	'Reading Comprehension': '#1265C7',
};

export class TestLinkWrapper extends React.Component {
	//check upcoming too
	constructor(props) {
		super(props);
		this.state = {
			topicSelected: '',
			visible: false,
		};
	}

	checkStatus = (test, attemptedTests) => {
		//check first if attempted!!

		const attempted = this.checkAttempted(test, attemptedTests);

		if (test.autoGrade && attempted) return 'AutoGrade-attempted';
		if (test.autoGrade) return 'AutoGrade';
		if (this.checkAttempted(test, attemptedTests)) {
			return 'Attempted';
		}
		let timeNow = new Date().getTime();
		let availableTill = new Date(test.availableTill).getTime();
		let availableFrom = new Date(test.availableFrom).getTime();
		if (availableFrom > timeNow) return 'Upcoming';
		if (availableTill > timeNow) return 'Live';
		return 'Unattempted';
	};

	checkAttempted = (test, attemptedTests) => {
		let found = false;
		attemptedTests.map(atest => {
			//handle possible error here. if atest does not have assignment, ignore
			if (atest.assessment._id === test._id) {
				found = true;
			}
		});
		return found;
	};

	getSubmissionId = test => {
		let { attemptedTests } = this.props;
		let sid = '';
		attemptedTests.map(atest => {
			if (atest.assessment._id === test._id) {
				sid = atest._id;
			}
		});
		return sid;
	};

	checkTopic = test => {
		if (test.autoGrade && test.topic) return true;
		return false;
	};

	checkSection = test => {
		if (test.autoGrade && !test.topic) return true;
		return false;
	};

	combineTests = () => {
		//Use list, antd
		let { attemptedTests, allTests, tab, Topics, mode } = this.props;
		const { topicSelected } = this.state;
		const allTestsCopy = [...allTests];

		const combinedTests = [];
		allTests.forEach(test => {
			let testStatus = this.checkStatus(test, attemptedTests);
			if (tab === 1 && this.checkTopic(test)) {
				combinedTests.push(test);
			} else if (tab === 2 && this.checkSection(test) && test.label === '') {
				combinedTests.push(test);
			} else if (tab === 3 && this.checkSection(test) && test.label !== '') {
				combinedTests.push(test);
			}
		});

		const subTopicsMap = {};
		Topics.forEach(topic => {
			subTopicsMap[topic._id] = topic.name;
			topic.sub_topics.forEach(sub_topic => {
				subTopicsMap[sub_topic._id] = sub_topic.name;
			});
		});

		const subTopicsFound = {};
		combinedTests.forEach(t => {
			subTopicsFound[t.topic] = true;
		});

		combinedTests.sort(function(a, b) {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});

		if (tab === 3) {
			const labels = {};
			combinedTests.forEach(t => {
				labels[t.label] = true;
			});

			const renderedData = Object.keys(labels).map(k => {
				const tests = [];
				combinedTests.forEach(test => {
					if (test.label === k) {
						let testStatus = this.checkStatus(test, attemptedTests);
						if (testStatus === 'AutoGrade') {
							if (tests.length) {
								tests.push(
									<TestLink key={test._id} test={test} status="AutoGrade" mode={mode} />
								);
							} else {
								tests.push(
									<TestLink
										key={test._id}
										test={test}
										status="AutoGrade"
										reduceMarginTop={true}
										mode={mode}
									/>
								);
							}
						} else if (testStatus === 'AutoGrade-attempted') {
							let sid = this.getSubmissionId(test);
							if (tests.length) {
								tests.push(
									<TestLink
										key={test._id}
										test={test}
										status="AutoGrade-attempted"
										sid={sid}
										mode={mode}
									/>
								);
							} else {
								tests.push(
									<TestLink
										key={test._id}
										test={test}
										status="AutoGrade-attempted"
										sid={sid}
										reduceMarginTop={true}
										mode={mode}
									/>
								);
							}
						}
					}
				});
				return (
					<div>
						<span style={{ fontWeight: 'bold', fontSize: 16 }}>{k}</span>
						{tests}
					</div>
				);
			});
			if (!renderedData || !renderedData.length) {
				return <div>No section tests</div>;
			} else {
				return renderedData;
			}
		} else if (tab === 2) {
			const renderedData = combinedTests
				.map(test => {
					let testStatus = this.checkStatus(test, attemptedTests);
					if (testStatus === 'AutoGrade') {
						return (
							<TestLink key={test._id} test={test} status="AutoGrade" mode={mode} />
						);
					} else if (testStatus === 'AutoGrade-attempted') {
						let sid = this.getSubmissionId(test);
						return (
							<TestLink
								key={test._id}
								test={test}
								status="AutoGrade-attempted"
								sid={sid}
								mode={mode}
							/>
						);
					}
				})
				.filter(e => !!e);
			if (!renderedData || !renderedData.length) {
				return <div>No section tests</div>;
			} else {
				return renderedData;
			}
		} else {
			if (Object.keys(subTopicsFound).length) {
				if (!topicSelected) {
					return (
						<div style={{ display: 'flex', flexWrap: 'wrap' }}>
							{Object.keys(subTopicsFound).map(k => {
								return (
									<Card
										style={{
											width: 240,
											height: 148,
											backgroundColor: topicColors[subTopicsMap[k]],
											border: 0,
											borderRadius: 6,
											margin: 8,
										}}
										bodyStyle={{
											display: 'flex',
											alignItems: 'center',
											flexDirection: 'column',
											padding: 8,
											height: '100%',
											cursor: 'pointer',
										}}
										onClick={() => {
											this.setState({ topicSelected: k });
										}}
									>
										<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
											<img
												src={topicImages[subTopicsMap[k]]}
												style={{ width: 72, height: 72 }}
											></img>
										</div>
										<div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
											<div style={{ flex: 1 }}>
												<div
													style={{
														fontSize: 14,
														color: 'white',
														fontWeight: 'bold',
														textAlign: 'center',
													}}
												>
													{subTopicsMap[k]}
												</div>
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					);
				} else {
					const subTopicCombinedTests = [];
					combinedTests.forEach(t => {
						if (t.topic === topicSelected) subTopicCombinedTests.push(t);
					});
					let totalAttemptedTests = 0;
					let totalTests = 0;
					const renderedData = subTopicCombinedTests
						.map(test => {
							let testStatus = this.checkStatus(test, attemptedTests);
							if (testStatus === 'AutoGrade') {
								totalTests += 1;
								return (
									<TestLink key={test._id} test={test} status="AutoGrade" mode={mode} />
								);
							} else if (testStatus === 'AutoGrade-attempted') {
								totalAttemptedTests += 1;
								totalTests += 1;
								let sid = this.getSubmissionId(test);
								return (
									<TestLink
										key={test._id}
										test={test}
										status="AutoGrade-attempted"
										sid={sid}
										mode={mode}
									/>
								);
							}
						})
						.filter(e => !!e);
					return (
						<div>
							<div style={{ display: 'flex' }}>
								<div
									onClick={() => {
										this.setState({ topicSelected: '' });
									}}
									style={{ fontWeight: 'bold', cursor: 'pointer', flex: 1 }}
								>
									{'<'} Topics
								</div>
								<div
									style={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div>
										<img
											src={topicImagesColor[subTopicsMap[topicSelected]]}
											style={{ width: 64, height: 64 }}
										/>
									</div>
									<div style={{ marginLeft: 12 }}>
										<div style={{ fontSize: 18, fontWeight: 'bold' }}>
											{subTopicsMap[topicSelected]}
										</div>
										<div style={{ fontSize: 11 }}>
											{totalAttemptedTests} / {totalTests} tests attempted
										</div>
									</div>
								</div>
								<div style={{ flex: 1 }}></div>
							</div>
							{renderedData}
						</div>
					);
				}
			} else {
				return <div>No topic tests available</div>;
			}
		}
	};

	handleChange = () => {};

	renderSelect = () => {
		return (
			<Select
				defaultValue="lucy"
				style={{ width: 200 }}
				onChange={this.handleChange}
			>
				<OptGroup label="Manager">
					<Option value="jack">Jack</Option>
					<Option value="lucy">Lucy</Option>
				</OptGroup>
				<OptGroup label="Engineer">
					<Option value="Yiminghe">yiminghe</Option>
				</OptGroup>
			</Select>
		);
	};

	render() {
		return (
			<div style={{ marginBottom: 15 }}>
				{0 ? (
					<div style={{ display: 'flex' }}>
						<div style={{ flex: 1 }}></div>
						{this.renderSelect()}
					</div>
				) : null}
				{this.combineTests()}
			</div>
		);
	}
}

export default TestLinkWrapper;
