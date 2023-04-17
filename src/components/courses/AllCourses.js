/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import HowTo from './HowTo';
import Footer from '../landingPage/LandingPageFooter';

import { URLS } from '../urls.js';

import IIMA from '../images/resources/courses.jpg';

import './Course.css';

class AllCourses extends Component {
	render = () => {
		return (
			<div>
				<Helmet>
					<title>{window.config.metaData.courses.title}</title>
					<meta
						name="description"
						content={window.config.metaData.courses.description}
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
							Courses by Prepleaf
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
							}}
						>
							CAT, Placement, JEE
						</div>
					</div>
				</div>
				<div style={{ paddingTop: 96 }}>
					<div
						style={{
							display: 'flex',
							padding: '0px 48px',
							marginBottom: 36,
						}}
						className="course-cards-wrapper"
					>
						<CourseCard
							color="#1265c7"
							title="MBA Entrance Exams"
							features={[
								'Unlimited practice sessions',
								'50+ topic and sectional tests',
								'10+ mini and actual mocks',
								'Same day analysis available',
							]}
							url={`${URLS.courses}/cat`}
							demo={`https://cat.prepleaf.com${URLS.catDashboard}`}
						/>
						<CourseCard
							color="#2e6d50"
							title="Placement"
							features={[
								'Unlimited practice sessions',
								'15+ Live Assessments',
								'Puzzle of the Day',
								'Peer comparison and analysis',
							]}
							url={`${URLS.courses}/placement`}
							demo={`https://jobs.prepleaf.com${URLS.placementDashboard}`}
						/>
						<CourseCard
							color="#be3300"
							title="IIT JEE"
							features={[
								'Unlimited practice sessions',
								'50+ topic and sectional tests',
								'Same day analysis available',
								'Peer comparison and analysis',
							]}
							url={`${URLS.courses}/jee`}
							demo={`https://jee.prepleaf.com${URLS.jeeDashboard}`}
						/>
					</div>
				</div>
				<HowTo />
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
					<Link
						id="enroll-now-cta"
						data-ga-on="click"
						data-ga-event-action="Click Enroll Now"
						data-ga-event-category="CTA"
						data-ga-event-label="Enroll Now"
						style={{
							marginTop: 12,
							backgroundColor: '#0AABDC',
							cursor: 'pointer',
							color: 'white',
							borderRadius: 1000,
							padding: '8px 20px',
						}}
						to={URLS.landingPage}
					>
						Enroll Now
					</Link>
				</div>
				<div style={{ backgroundColor: 'white' }}>
					<Footer />
				</div>
			</div>
		);
	};
}

export default AllCourses;
