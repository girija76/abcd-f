/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'antd/es/button';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

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
					<title>CAT 2020 - Dates, Eligibility, Pattern, Syllabus</title>
					<meta
						name="description"
						content="Common Admission Test or CAT is a computer-based MBA entrance test for admissions into the IIMs and over 1200 B-schools in India. Check out CAT eligibility, CAT exam pattern, CAT syllabus here."
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
								// lineHeight: '48px',
								color: 'white',
							}}
						>
							CAT 2020
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
								textAlign: 'center',
								padding: '0px 24px',
							}}
						>
							CAT Exam Date: Last Week of November 2020 (Expected)
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
								<h2>What is CAT?</h2>
								<p>
									Common Admission Test or CAT is a computer-based MBA entrance test for
									admissions into the IIMs and over 1200 B-schools in India. CAT is
									conducted in the month of November by the IIMs on a rotational basis
									and CAT exam 2019 was conducted by IIM Kozhikode. The exam is held in
									two slots and the question paper comprises 100 MCQs from Verbal Ability
									& Reading Comprehension, Data Interpretation & Logical Reasoning and
									Quantitative Ability. Over 2 lakh candidates appear in CAT every year.
									In 2019, the number of candidates who appeared in the exam was
									2,09,926. CAT 2020 notification will be released in May and
									registrations will begin in the first week of August.
								</p>
								<p>
									CAT is usually the first stage in the selection process. The institutes
									prepare a shortlist of candidates based on the CAT score and several
									other criteria like 10th class percentage, 12th class percentage,
									graduation percentage, work experience, etc. This selection criteria
									varies from institute to institute.
								</p>

								<h2 style={{ marginTop: 18 }}>CAT Important Dates</h2>
								<div
									style={{
										border: '1px solid #dadada',
										borderRadius: 2,
										marginTop: 12,
										marginBottom: 8,
									}}
								>
									<Table
										columns={column}
										dataSource={data}
										style={{ backgroundColor: 'white' }}
										pagination={false}
									/>
								</div>

								<h2 style={{ marginTop: 18 }}>CAT Eligibility</h2>
								<p>The applicant must satisfy the following requirements:</p>
								<ol style={{ marginTop: -12 }}>
									<li>
										The applicant should be a graduate or must be in the final year of
										graduation.
									</li>
									<li>
										The applicant must have a minimum of 50% in graduation (45% for
										SC/ST/PWD categories) or an equivalent CGPA.
									</li>
								</ol>

								<h2 style={{ marginTop: 18 }}>CAT Exam Pattern</h2>
								<p>
									The paper pattern for the CAT exam has changed several times in the
									past. For the last 2 years, the pattern has remained the same with
									respect to the total marks and number of sections.
								</p>
								<div
									style={{
										border: '1px solid #dadada',
										borderRadius: 2,
										marginTop: 12,
										marginBottom: 8,
									}}
								>
									<Table
										columns={column2}
										dataSource={data2}
										style={{ backgroundColor: 'white' }}
										pagination={false}
									/>
								</div>
								<p>
									Each correct answer is awarded 3 marks and each wrong answer carries a
									penatly of -1 marks. Some questions are Type-In-The-Answer (TITA)
									questions. There are no negative marks for TITA questions.{' '}
									<span style={{ fontWeight: 'bold' }}>
										There is a sectional time limit of 60 minutes for each section and
										candidates are not allowed to switch between the sections.{' '}
									</span>
									Candidates are expected to perform well in all the sections and most of
									the institutes accepting CAT score for admission have sectional
									cut-offs in additional to overall cut-off.
								</p>

								<h2 style={{ marginTop: 18 }}>CAT Exam Syllabus</h2>
								<p>
									CAT does not have a defined syllabus. The syllabus is mainly from the
									middle school topics of Maths, and English with some generic logical
									reasoning questions.
								</p>
								<h3>Quantitative Ability</h3>
								<p>This section can be broadly divided into the following topics:</p>
								<ol style={{ marginTop: -12 }}>
									<li>Numbers</li>
									<li>Algebra</li>
									<li>Average, Ratio & Proportion</li>
									<li>Time, Distance & Work</li>
									<li>Profit, Loss, Percentage & Interest</li>
									<li>Probability & Combinatorics</li>
									<li>Function & Set Theory</li>
									<li>Geometry</li>
								</ol>

								<h3>Verbal Ability & Reading Comprehension</h3>
								<p>This section can be broadly divided into the following topics:</p>
								<ol style={{ marginTop: -12 }}>
									<li>Reading Comprehension</li>
									<li>Para Jumbles</li>
									<li>Para Completion & Summary</li>
									<li>Odd Sentence Out</li>
								</ol>

								<h3>Logical Reasoning & Data Interpretation</h3>
								<p>This section can be broadly divided into the following topics:</p>
								<ol style={{ marginTop: -12 }}>
									<li>Logical Reasoning</li>
									<li>Data Interpretation</li>
								</ol>
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
