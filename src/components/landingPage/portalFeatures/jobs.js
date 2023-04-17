/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import LazyLoadImage from 'components/LazyLoadImage';
import './PortalFeatures.css';

import img1 from '../../images/1.svg';
import img2 from '../../images/2.svg';
import img3 from '../../images/3.svg';

const logoBaseUrl = 'https://static.prepleaf.com/preparation-portal/logo';

const jpm = `${logoBaseUrl}/jpm.png`;
const icicilombard = `${logoBaseUrl}/icicilombard.jpg`;
const mrf = `${logoBaseUrl}/mrf.png`;
const png = `${logoBaseUrl}/png.png`;
const citibank = `${logoBaseUrl}/citibank.png`;
const creditsuisse = `${logoBaseUrl}/creditsuisse.png`;
const capgemini = `${logoBaseUrl}/capgemini.jpg`;
const affineanalytics = `${logoBaseUrl}/affineanalytics.jpg`;
const hcltech = `${logoBaseUrl}/hcltech.webp`;
const anzbank = `${logoBaseUrl}/anzbank.jpg`;
const cleducate = `${logoBaseUrl}/cleducate.jpg`;
const flipkart = `${logoBaseUrl}/flipkart.png`;

const icicibank = `${logoBaseUrl}/icicibank.png`;
const bajajfinserv = `${logoBaseUrl}/bajajfinserv.png`;
const brillio = `${logoBaseUrl}/brillio.png`;
const epsilon = `${logoBaseUrl}/epsilon.jpeg`;
const galaxysurfactants = `${logoBaseUrl}/galaxysurfactants.jpg`;
const honeywell = `${logoBaseUrl}/honeywell.jpg`;
const hsbc = `${logoBaseUrl}/hsbc.png`;
const indusinsights = `${logoBaseUrl}/indusinsights.png`;
const lti = `${logoBaseUrl}/lti.png`;
const mastercard = `${logoBaseUrl}/mastercard.png`;
const oracle = `${logoBaseUrl}/oracle.png`;
const toppr = `${logoBaseUrl}/toppr.png`;

const companies = [
	{
		logo: icicibank,
		alt: 'Icicibank Logo',
		url: 'https://www.icicibank.com/',
	},
	{
		logo: jpm,
		alt: 'JP Morgan Logo',
		url: 'https://www.jpmorgan.com/',
	},
	{
		logo: hsbc,
		alt: 'HSBC Bank Logo',
		url: 'https://www.hsbc.co.in/',
	},
	{
		logo: lti,
		alt: 'LTI Logo',
		url: 'https://www.lntinfotech.com/',
	},
	{
		logo: icicilombard,
		alt: 'ICICI Lombard Logo',
		url: 'https://www.icicilombard.com/',
	},
	{
		logo: oracle,
		alt: 'Oracle Logo',
		url: 'https://www.oracle.com/',
	},
	{
		logo: epsilon,
		alt: 'Epsilon Logo',
		url: 'https://india.epsilon.com/',
	},
	{
		logo: mrf,
		alt: 'MRF Logo',
		url: 'https://www.mrftyres.com/',
	},
	{
		logo: brillio,
		alt: 'Brillio Logo',
		url: 'https://www.brillio.com/',
	},
	{
		logo: honeywell,
		alt: 'Honeywell Logo',
		url: 'https://www.honeywell.com/',
	},
	{
		logo: png,
		alt: 'P&G Logo',
		url: 'https://us.pg.com',
	},
	{
		logo: mastercard,
		alt: 'MasterCard Logo',
		url: 'https://www.mastercard.us/',
	},
	{
		logo: indusinsights,
		alt: 'Indus Insights Logo',
		url: 'http://www.indusinsights.com/',
	},
	{
		logo: citibank,
		alt: 'Citibank Logo',
		url: 'https://www.online.citibank.co.in/',
	},
	{
		logo: bajajfinserv,
		alt: 'Bajaj Finance Logo',
		url: 'https://www.bajajfinserv.in/', //bg color black
	},
	{
		logo: creditsuisse,
		alt: 'Credit Suisse Logo',
		url: 'https://www.credit-suisse.com/',
	},
	{
		logo: capgemini,
		alt: 'Capgemini Logo',
		url: 'https://www.capgemini.com/',
	},
	{
		logo: galaxysurfactants,
		alt: 'Galaxy Surfactants Logo',
		url: 'https://www.galaxysurfactants.com/',
	},
	{
		logo: affineanalytics,
		alt: 'Affine Analytics Logo',
		url: 'https://www.affineanalytics.com/',
	},
	{
		logo: hcltech,
		alt: 'HCL Technologies Logo',
		url: 'https://www.hcltech.com/',
	},
	{
		logo: toppr,
		alt: 'Toppr Logo',
		url: 'https://www.toppr.com/',
	},
	{
		logo: anzbank,
		alt: 'ANZ Bank Logo',
		url: 'https://www.anz.com.au/',
	},
	{
		logo: cleducate,
		alt: 'CL Educate Logo',
		url: 'http://www.cleducate.com/',
	},
	{
		logo: flipkart,
		alt: 'Flipkart Logo',
		url: 'https://www.flipkart.com/',
	},
];

export default class PortalFeatures extends Component {
	render = () => {
		return (
			<div>
				<div className="product-wrapper" className="portal-features-wrapper">
					<div style={{ margin: '64px 0px' }}>
						<div style={{ fontSize: 37, color: '#707070' }}>
							Guaranteed Success & Higher Percentile
						</div>
						<div style={{ fontSize: 37, color: 'black', fontWeight: 'bold' }}>
							Here's how...
						</div>
					</div>
					<div
						style={{ display: 'flex', margin: '8px 0px', alignItems: 'center' }}
						className="product-subwrapper"
					>
						<div style={{ flex: 1 }} className="product-subwrapper-text">
							<div style={{ fontSize: 32, color: '#2A2A2A' }}>
								Target Setting Program
							</div>
							<div style={{ fontSize: 24, color: '#707070' }}>Modelled around</div>
							<div style={{ fontSize: 24, color: '#0AABDC' }}>
								Placement tests 2015-2020
							</div>
							<div
								style={{
									fontSize: 18,
									color: '#707070',
									borderTop: '1px solid #707070',
									paddingTop: 8,
									marginTop: 12,
								}}
							>
								To master aptitude tests, one needs to prepare dynamically according to
								the changing needs. Hence, we analyze your current position based on the
								last five years of aptitude tests asked in placements to keep your
								preparation up to date with the current requirement of the exam.
							</div>
						</div>
						<div className="margin-left">
							<img alt="" src={img1} className="portal-features-image"></img>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							margin: '0px 0px',
							marginTop: 128,
							alignItems: 'center',
						}}
						className="product-subwrapper-reverse"
					>
						<div className="margin-right">
							<img alt="" src={img2} className="portal-features-image"></img>
						</div>
						<div style={{ flex: 1 }} className="margin-left">
							<div style={{ fontSize: 32, color: '#0AABDC' }}>AI-Generated</div>
							<div style={{ fontSize: 24, color: '#707070' }}>Customized</div>
							<div style={{ fontSize: 24, color: '#2A2A2A' }}>Improvement sets</div>
							<div
								style={{
									fontSize: 18,
									color: '#707070',
									borderTop: '1px solid #707070',
									paddingTop: 8,
									marginTop: 12,
								}}
							>
								Once we identify the weak areas, our AI model creates smart personalized
								improvement sessions targeting the focus areas. These sessions will help
								you with improving your accuracy, speed and different topics, as the
								need be.
							</div>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							margin: '0px 0px',
							marginBottom: 64,
							alignItems: 'center',
						}}
						className="product-subwrapper last-product"
					>
						<div style={{ flex: 1 }} className="margin-right">
							<div style={{ fontSize: 32, color: '#0AABDC' }}>
								Speedometer Monitored
							</div>
							<div style={{ fontSize: 24, color: '#2A2A2A' }}>Practice Sessions</div>
							<div
								style={{
									fontSize: 18,
									color: '#707070',
									borderTop: '1px solid #707070',
									paddingTop: 8,
									marginTop: 12,
								}}
							>
								To help you practice, we provide categorized practice questions where
								your speed and accuracy are timed precisely. This creates a behavioral
								pattern for you as you take a test and helps identify your weak areas.
							</div>
						</div>
						<div className="margin-left">
							<img alt="" src={img3} className="portal-features-image"></img>
						</div>
					</div>
				</div>
				<div
					style={{
						padding: '0px 48px',
						marginBottom: 24,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<h1>Where our students are working</h1>
					<div style={{ display: 'flex', flexWrap: 'wrap' }}>
						{companies.map(company => {
							return (
								<div
									style={{
										margin: '12px 24px',
										width: 100,
										height: 100,
										alignItems: 'center',
										display: 'flex',
									}}
								>
									<LazyLoadImage
										loading="lazy"
										src={company.logo}
										alt={company.alt}
										style={{ maxWidth: '100%', maxHeight: '100%' }}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};
}
