/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import List from 'antd/es/list';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

import Ads from './Ads';
import { URLS } from '../urls';
import catimage from '../images/resources/cat.webp';
import iiftimage from '../images/resources/iift.jpg';
import './Resources.css';

import IIMA from '../images/resources/iima.jpg';

const data = [
	{
		title: 'IIFT Score Calculator',
		description:
			'Follow these steps to get your attempts html link- 1. Login to IIFT 2019 official website 2. Click on "Candidate Response" 3. You can see the text "Please click here to download Candidate Response for IIFT 2019." 4. Right Click (long press in mobiles) "here" on that page',
		date: 'December 03, 2019',
		thumbnail: iiftimage,
		url: 'iift-score-calculator',
	},
	{
		title: 'CAT Answers & Response Sheet 2019',
		description:
			'IIM Kozikhode has released the individual response sheet to questions that were asked for both the slots on November 29. All of the correct responses to the questions asked in the entrance examination are made available through the CAT 2019 answer key. Candidates can now access the CAT answer key 2019 in online mode after logging into their account using the required credentials. The correct responses are marked in green while the wrong options are marked red.',
		date: 'November 29, 2019',
		thumbnail: catimage,
		url: 'cat-answers-and-repoonse-sheet-2019',
	},
];

function truncate(text) {
	if (text.length > 180) {
		return text.slice(0, 177) + '...';
	}
	return text;
}

class AllResources extends Component {
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

	getResource = url => {
		this.props.history.push(`${URLS.resources}/${url}`);
	};

	render = () => {
		const path = window.location.pathname;
		let key = 'default';
		if (path.indexOf('cat') !== -1) key = 'cat';
		if (path.indexOf('placement') !== -1) key = 'placement';
		if (path.indexOf('jee') !== -1) key = 'jee';

		const courseDetails = this.catCourseDetails('#1265c7');

		return (
			<div>
				<Helmet>
					<title>{window.config.metaData.resources.title}</title>
					<meta
						name="description"
						content={window.config.metaData.resources.description}
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
							Notifications
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
							}}
						></div>
					</div>
				</div>
				<div
					style={{
						minHeight: 'calc(100vh - 92px)',
						display: 'flex',
						justifyContent: 'center',
						marginTop: 12,
					}}
					// className="all-resources-wrapper"
				>
					<div className="resource-outer-wrapper">
						<List
							itemLayout="horizontal"
							dataSource={data}
							renderItem={item => (
								<Card
									style={{
										margin: '24px 0px',
										minHeight: 160,
										overflow: 'hidden',
										cursor: 'pointer',
									}}
									bodyStyle={{ padding: 0, display: 'flex' }}
									onClick={this.getResource.bind(this, item.url)}
								>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											flex: 2,
											minHeight: 160,
											padding: '12px 18px',
										}}
									>
										<h2>{item.title}</h2>
										<div style={{ flex: 1 }}>{truncate(item.description)}</div>
										<div style={{ fontWeight: 'bold', fontSize: 11 }}>{item.date}</div>
									</div>
									<div
										style={{
											flex: 1,
											backgroundColor: 'red',
											height: 160,
											overflow: 'hidden',
										}}
										className="plus-700-only"
									>
										<img src={item.thumbnail} style={{ height: '100%', width: '100%' }} />
										<div
											style={{
												position: 'absolute',
												backgroundColor: 'rgba(0, 0, 0, 0.3)',
												width: '100%',
												height: '100%',
												top: 0,
											}}
										></div>
									</div>
								</Card>
							)}
						/>
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

export default withRouter(AllResources);
