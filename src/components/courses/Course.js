/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Button, Table } from 'antd';
import Footer from '../landingPage/LandingPageFooter';

import { URLS } from '../urls';
import {
	catColumns,
	catData,
	placementColumns,
	placementData,
	jeeColumns,
	jeeData,
} from './Data';

import IIMA from '../images/resources/courses.jpg';

import './Course.css';

const courses = {
	cat: 'coursesCat',
	placement: 'coursesPlacement',
	jee: 'coursesJee',
};

const columns = {
	cat: catColumns,
	placement: placementColumns,
	jee: jeeColumns,
	default: catColumns,
};

const datas = {
	cat: catData,
	placement: placementData,
	jee: jeeData,
	default: catData,
};

const colors = {
	cat: '#1265c7',
	placement: '#2e6d50',
	jee: '#be3300',
	default: '#000000',
};

const classNames = {
	cat: 'course-table-cat',
	placement: 'course-table-placement',
	jee: 'course-table-jee',
	default: 'course-table-default',
};

class Course extends Component {
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
				<div style={{ fontSize: 24, fontWeight: 500 }}>Course Details</div>
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
						rel="noreferrer"
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Telegram Group
					</a>
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Concept videos on{' '}
					<a
						rel="noreferrer"
						href="https://www.youtube.com/channel/UCg0AJl1CbDVzrjlJuk0c4AQ"
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Youtube
					</a>
				</li>
			</div>
		);
	};

	placementCourseDetails = color => {
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
				<div style={{ fontSize: 24, fontWeight: 500 }}>Course Details</div>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Unlimited Practice Sessions
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>15+ Live Assessments</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Puzzle of the Day (daily)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					<a
						rel="noreferrer"
						href={URLS.mentorshipPortal}
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Personalized mentorship portal
					</a>
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					<a
						rel="noreferrer"
						href={`${URLS.prepleaf}/workshops`}
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Sector specific workshops
					</a>
				</li>
			</div>
		);
	};

	jeeCourseDetails = color => {
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
				<div style={{ fontSize: 24, fontWeight: 500 }}>Course Details</div>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Unlimited Practice Sessions
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					200+ Topic Tests (15 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					30+ Sectional Tests (60 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					10 Mini Mocks (60 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					5 Full Mocks (180 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					24x7 doubt clarification on our{' '}
					<a
						rel="noreferrer"
						href="https://t.me/joinchat/NShoSBRn6z6jyBKs2vUhBw"
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Telegram Group
					</a>
				</li>
			</div>
		);
	};

	render = () => {
		const { url, name, description } = this.props;
		const path = window.location.pathname;
		let key = 'default';
		if (path.indexOf('cat') !== -1) key = 'cat';
		if (path.indexOf('placement') !== -1) key = 'placement';
		if (path.indexOf('jee') !== -1) key = 'jee';

		const color = colors[key];
		const cl = classNames[key];
		const column = columns[key];
		const data = datas[key];

		const courseDetails = {
			cat: this.catCourseDetails(color),
			placement: this.placementCourseDetails(color),
			jee: this.jeeCourseDetails(color),
			default: this.catCourseDetails(color),
		};
		// if()

		return (
			<div>
				<Helmet>
					<title>{window.config.metaData[courses[key]].title}</title>
					<meta
						name="description"
						content={window.config.metaData[courses[key]].description}
					/>
				</Helmet>
				<div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
					<img alt="" src={IIMA} />
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: 280,
							zIndex: 10,
							backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
							{name}
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
							}}
						>
							{description}
						</div>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						padding: 24,
						paddingTop: 24,
						justifyContent: 'space-evenly',
					}}
					className="course-structure-wrapper"
				>
					<div
						style={{
							flex: 2,
							margin: 24,
						}}
					>
						{0 ? (
							<div style={{ fontSize: 24, fontWeight: 500 }}>
								Course structure of {courses[key]}
							</div>
						) : null}
						<div style={{ border: '1px solid black', borderRadius: 5 }}>
							<Table
								columns={column}
								dataSource={data}
								style={{ backgroundColor: 'white' }}
								pagination={false}
								className={cl}
							/>
						</div>
					</div>
					<div>
						{courseDetails[key]}
						<div style={{ textAlign: 'center', paddingTop: 36 }}>
							<Link to={URLS.courses}>
								<Button
									style={{
										fontSize: 16,
										height: 48,
										padding: '0px 24px',
										border: `1px solid ${color}`,
										color,
										borderRadius: 100,
									}}
								>
									View All Courses
								</Button>
							</Link>
						</div>
						<div
							style={{
								backgroundColor: '#FAFAFA',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '40px 0px',
							}}
							className="product-wrapper"
						>
							<div style={{ fontSize: 34, color: '#2A2A2A' }}>
								What are you waiting for?
							</div>
							<a
								id="enroll-now-cta"
								data-ga-on="click"
								data-ga-event-action="Click Enroll Now"
								data-ga-event-category="CTA"
								data-ga-event-label="Enroll Now"
								style={{
									marginTop: 12,
									backgroundColor: color,
									cursor: 'pointer',
									color: 'white',
									borderRadius: 1000,
									padding: '8px 20px',
								}}
								href={url}
							>
								Enroll Now
							</a>
						</div>
					</div>
				</div>

				<div style={{ backgroundColor: 'white' }}>
					<Footer />
				</div>
			</div>
		);
	};
}

export default Course;
