/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'antd/es/button';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

import { URLS } from '../urls';

import IIMA from '../images/resources/iima.jpg';

import './Resources.css';

class Ads extends Component {
	catCourseDetails = color => {
		return (
			<div
				style={{
					backgroundColor: color,
					padding: 24,
					flex: 1,
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

		const color = '#1c1f20';

		const courseDetails = this.catCourseDetails(color);

		const { target } = this.props;

		return (
			<div style={{ width: 380, margin: 24 }} className="plus-1200-only">
				<div>
					{courseDetails}
					<div style={{ textAlign: 'center', paddingTop: 36 }}>
						<Link to={URLS.courses}>
							<Button
								style={{
									fontSize: 16,
									height: 48,
									padding: '0px 24px',
									border: `1px solid ${color}`,
									color: color,
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
						<div style={{ textAlign: 'center', fontSize: 34, color }}>
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
		);
	};
}

export default Ads;
