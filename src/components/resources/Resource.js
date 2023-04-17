/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'antd/es/button';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

import { URLS } from '../urls';

import IIMA from '../images/resources/iima.jpg';
import Ads from './Ads';

import './Resources.css';

const column = [
	{
		title: 'Institutes',
		dataIndex: 'institute',
		key: 'institute',
	},
	{
		title: 'Overall',
		key: 'overall',
		dataIndex: 'overall',
	},
	{
		title: 'Quant',
		dataIndex: 'quant',
		key: 'quant',
	},
	{
		title: 'VARC',
		dataIndex: 'varc',
		key: 'varc',
	},
	{
		title: 'LR/DI',
		dataIndex: 'lrdi',
		key: 'lrdi',
	},
];

const data = [
	{
		key: '1',
		institute: 'IIM Ahmedabad',
		overall: 80,
		quant: 70,
		varc: 70,
		lrdi: 70,
	},
	{
		key: '2',
		institute: 'IIM Calcutta',
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '3',
		institute: 'IIM Bangalore',
		overall: 70,
		quant: 80,
		lrdi: '85/80',
		varc: 85,
	},
	{
		key: '4',
		institute: 'IIM Bodh Gaya',
		questions: 30,
		overall: 80,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '5',
		institute: 'IIM Nagpur',
		questions: 30,
		overall: 90,
		quant: 72,
		lrdi: 72,
		varc: 72,
	},
	{
		key: '6',
		institute: 'IIM Amritsar',
		questions: 30,
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '7',
		institute: 'IIM Indore',
		questions: 30,
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '8',
		institute: 'IIM Udaipur',
		questions: 30,
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '9',
		institute: 'IIM Trichy',
		questions: 30,
		overall: 95,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '10',
		institute: 'IIM Lucknow',
		overall: 90,
		quant: 85,
		lrdi: 85,
		varc: 85,
	},
	{
		key: '11',
		institute: 'IIM Ranchi',
		overall: 95,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '12',
		institute: 'IIM Sirmaur',
		overall: 95,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '13',
		institute: 'IIM Kozhikode',
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '14',
		institute: 'IIM Kashipur',
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '15',
		institute: 'IIM Raipur',
		overall: 95,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '16',
		institute: 'IIM Rohtak',
		overall: 95,
		quant: 80,
		lrdi: 80,
		varc: 80,
	},
	{
		key: '17',
		institute: 'IIM Visakhapatnam',
		overall: 90,
		quant: 80,
		lrdi: 80,
		varc: 85,
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
					<title>
						CAT 2019 Answers | CAT 2019 Response Sheet | CAT 2018 Cut Off
					</title>
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
							CAT Answers - 2019
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
								padding: '0px 24px',
								textAlign: 'center',
							}}
						>
							CAT 2019 Answers | CAT 2019 Response Sheet | CAT 2018 Cut Off
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
								margin: '0px 48px',
								paddingTop: 28,
								display: 'none',
							}}
						>
							CAT 2019 Answers | CAT 2019 Response Sheet | CAT 2018 Cut Off - [November
							29, 2019]
						</div>
						<div
							style={{
								display: 'flex',
								padding: 0,
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
								<h1>CAT Answers & Response Sheet 2019</h1>

								<p>
									<b>CAT Answer Key 2019</b> - IIM Kozikhode has released the individual
									response sheet to questions that were asked for both the slots on
									November 29. All of the correct responses to the questions asked in the
									entrance examination are made available through the CAT 2019 answer
									key. Candidates can now access the CAT answer key 2019 in online mode
									after logging into their account using the required credentials. The
									correct responses are marked in green while the wrong options are
									marked red. The candidates will also be able to raise objections
									against the released answer key of CAT 2019, if any, tentatively till
									the second week of December. For every objection, the candidates will
									have to pay Rs. 1200. If any objection is found correct, then the
									necessary changes will be done by CAT authorities. However, before the
									release of official answer key, candidates will be able to check the
									answer key provided by the coaching institutes. This will help them get
									an idea about how many marks they are likely to score. Along with CAT
									2019 answer key, the response sheet will also be released by the
									authorities on November 30. Read the full article to know more about
									CAT Answer Key 2019.
								</p>
								<a
									href="https://cdn.digialm.com/EForms/configuredHtml/756/62128/login.html"
									target="_blank"
								>
									Check CAT Individual Responses along with CAT Answer Key Here!
								</a>
								<div style={{ height: 18 }}></div>
								<h1>Category and Section-wise CAT cut off 2018</h1>
								<p>
									Below are the 2018 cut off percentile (general) of different institues-
								</p>
								<div
									style={{ border: '1px solid #dadada', borderRadius: 2, marginTop: 12 }}
								>
									<Table
										columns={column}
										dataSource={data}
										style={{ backgroundColor: 'white' }}
										pagination={false}
									/>
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
