/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

import { GiftFilled, SketchOutlined } from '@ant-design/icons';

import Ads from './Ads';
import { URLS } from '../urls';

import IIMA from '../images/resources/iima.jpg';

import './Resources.css';

const column = [
	{
		title: 'Event',
		dataIndex: 'event',
		key: 'event',
	},
	{
		title: 'Date (Expected)',
		key: 'date',
		dataIndex: 'date',
	},
];

const data = [
	{
		key: '1',
		event: 'CAT 2020 Notification',
		date: 'Last week of July, 2020',
	},
	{
		key: '2',
		event: 'CAT 2020 Registration Starts',
		date: '2nd week of August, 2020',
	},
	{
		key: '3',
		event: 'CAT 2020 Application Last Date',
		date: '3rd week of September, 2020',
	},
	{
		key: '4',
		event: 'Release of Admit Card',
		date: '4th week of October, 2020',
	},
	{
		key: '5',
		event: 'CAT Exam Date',
		date: 'Last Sunday of November, 2020',
	},
	{
		key: '6',
		event: 'Results',
		date: '2nd week of Januray, 2021',
	},
];

const column2 = [
	{
		title: 'Section',
		dataIndex: 'section',
		key: 'section',
	},
	{
		title: 'Duration',
		key: 'duration',
		dataIndex: 'duration',
	},
	{
		title: 'Number of questions',
		key: 'questions',
		dataIndex: 'questions',
	},
];

const data2 = [
	{
		key: '1',
		section: 'Verbal Ability & Reading Comprehension',
		duration: '60 mins',
		questions: '34',
	},
	{
		key: '1',
		section: 'Logical Reasoning & Data Interpretation',
		duration: '60 mins',
		questions: '32',
	},
	{
		key: '1',
		section: 'Quantitative Aptitude',
		duration: '60 mins',
		questions: '34',
	},
	{
		key: '1',
		section: 'Overall',
		duration: '180 mins',
		questions: '100',
	},
];

class Resource extends Component {
	catCourseDetails = color => {
		return (
			<div
				style={{
					backgroundColor: color,
					padding: 24,
					flex: 1,
					margin: 24,
					color: 'white',
					borderRadius: 4,
				}}
			>
				<div style={{ fontSize: 24, fontWeight: 500 }}>CAT Course Details</div>
				<ul style={{ paddingLeft: 24 }}>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						Unlimited Practice Sessions
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						44 Topic Tests (15 mins each)
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						10 Sectional Tests (60 mins each)
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						5 Mini Mocks (60 mins each)
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						3 Full Mocks (180 mins each)
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						24x7 doubt clarification on our{' '}
						<a
							href="https://t.me/joinchat/MtofdhWBY_JfEUnTIiLC8w"
							target="_blank"
							style={{ color: 'white', textDecoration: 'underline' }}
						>
							Telegram Group
						</a>
					</li>
					<li style={{ margin: '8px 0px', fontSize: 16 }}>
						Concept videos on{' '}
						<a
							href="https://www.youtube.com/channel/UCg0AJl1CbDVzrjlJuk0c4AQ"
							target="_blank"
							style={{ color: 'white', textDecoration: 'underline' }}
						>
							Youtube
						</a>
					</li>
				</ul>
			</div>
		);
	};

	render = () => {
		const { url } = this.props;
		const path = window.location.pathname;
		let key = 'default';
		if (path.indexOf('cat') !== -1) key = 'cat';
		if (path.indexOf('placement') !== -1) key = 'placement';
		if (path.indexOf('jee') !== -1) key = 'jee';

		const courseDetails = this.catCourseDetails('#1265c7');

		return (
			<div>
				<Helmet>
					<title>CAT 2020 - Free Tests - Pricing</title>
					<meta
						name="description"
						content="Enroll to best and cheapest CAT test series, with 14 free CAT mock tests and unlimited practice sessions."
					/>
				</Helmet>
				<div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
					<img src={IIMA} />
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: 280,
							zIndex: 10,
							backgroundColor: 'rgba(0, 0, 0, 0.55)',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								fontSize: 40,
								// lineHeight: '52px',
								color: 'white',
							}}
						>
							CAT Test Series - 2020
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
								textAlign: 'center',
								padding: '0px 24px',
							}}
						>
							Trusted by thousands of students
						</div>
					</div>
				</div>
				<div
					style={{
						minHeight: 'calc(100vh - 92px)',
						display: 'flex',
						justifyContent: 'center',
						marginTop: 12,
					}}
				>
					<div className="resource-outer-wrapper">
						<div
							style={{
								display: 'flex',
								paddingTop: 0,
								justifyContent: 'space-evenly',
							}}
							className="course-structure-wrapper"
						>
							<div
								style={{
									flex: 2,
									backgroundColor: 'white',
									border: '1px solid #dadada',
									borderRadius: 4,
								}}
								className="resource-inner-wrapper"
							>
								<h2>Crack CAT with Prepleaf Test Series!</h2>
								<p>
									One has to be in top 1% to get a seat in top MBA college - thats what
									make CAT extremely difficult. CAT is a test of your managerial skills -
									it tests your ability to manage time and ego. Any improvement process
									is incomplete without proper periodic assessment of yourself and
									feedback of your progress. The best way to prepare for CAT is-
								</p>
								<ol style={{ marginTop: -12 }}>
									<li>
										Know where you stand - through Prepleaf's free Diagnostic Tests
									</li>
									<li>
										Fill Gaps - through Prepleaf's unlimited free practice sessions
									</li>
									<li>Compete - using topics tests, sectional tests and full mocks</li>
									<li>Analysis - innovative yet robust analysis tools by Prepleaf</li>
									<li>Repeat steps 2-4</li>
								</ol>
								<p>
									CAT 2020 is expected to be conducted on November end. With not long to
									go for CAT 2020, start your preparation by taking free assessments by
									Prepleaf.
								</p>

								<div style={{ display: 'flex', flexWrap: 'wrap' }}>
									<Card
										style={{ margin: 12, flex: 1 }}
										bodyStyle={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}
									>
										<div>
											<GiftFilled style={{ fontSize: 64, color: '#0aabdc' }} />
										</div>
										<div
											style={{
												color: '#0aabdc',
												fontSize: 32,
												marginTop: 12,
												letterSpacing: '1.2px',
											}}
										>
											FREE
										</div>
										<div
											style={{
												marginTop: 12,
												fontSize: 14,
												fontWeight: 'bold',
												textAlign: 'center',
											}}
										>
											14 Free Mocks + Practice Sessions for CAT 2020
										</div>
										<div
											style={{
												marginTop: 12,
												fontSize: 14,
												textAlign: 'center',
											}}
										>
											10 Topic Tests, 3 Sectional Tests, 1 Mock, Detailed Solution &
											Analysis, Recommendation Engine
										</div>
										<Link to={URLS.landingPage}>
											<Button
												type="primary"
												size="large"
												style={{
													marginTop: 16,
													backgroundColor: '#0aabdc',
													letterSpacing: '1.2px',
												}}
											>
												Start Now
											</Button>
										</Link>
									</Card>
									<Card
										style={{ margin: 12, flex: 1 }}
										bodyStyle={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											backgroundColor: '#0aabdc',
											borderRadius: 10,
										}}
									>
										<div>
											<SketchOutlined style={{ fontSize: 64, color: 'white' }} />
										</div>
										<div
											style={{
												color: 'white',
												fontSize: 32,
												marginTop: 12,
												letterSpacing: '1.2px',
											}}
										>
											&#8377; 2499
										</div>
										<div
											style={{
												marginTop: 12,
												fontSize: 14,
												fontWeight: 'bold',
												textAlign: 'center',
												color: 'white',
											}}
										>
											All Tests + Practice Sessions for CAT 2020
										</div>
										<div
											style={{
												marginTop: 12,
												fontSize: 14,

												textAlign: 'center',
												color: 'white',
											}}
										>
											44+ Topic Tests, 10+ Sectional Tests, 8+ Mock, Detailed Solution &
											Analysis, Recommendation Engine
										</div>
										<Link to={URLS.landingPage}>
											<Button
												// type="primary"
												size="large"
												style={{
													marginTop: 16,
													color: '#0aabdc',
													fontWeight: 'bold',
													letterSpacing: '1.2px',
												}}
											>
												Enroll Now
											</Button>
										</Link>
									</Card>
								</div>
							</div>
						</div>
					</div>
					<Ads target="cat" />
				</div>

				<div style={{ backgroundColor: 'white' }}>
					<Footer />
				</div>
			</div>
		);
	};
}

export default Resource;
