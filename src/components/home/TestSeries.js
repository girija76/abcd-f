import React, { Component } from 'react';
import './TestSeries.css';

import img1 from '../images/1.svg';
import img2 from '../images/2.svg';
import img3 from '../images/3.svg';

export default class TestSeriesFeatures extends Component {
	render = () => {
		return (
			<div className="series-features-wrapper">
				<div style={{ display: 'flex', margin: '8px 0px', alignItems: 'center' }}>
					<div style={{ flex: 1, marginRight: 18 }}>
						<div style={{ fontSize: 20, color: '#2A2A2A' }}>
							Target Setting Program
						</div>
						<div>
							<span style={{ fontSize: 16, color: '#707070' }}>Modelled around </span>
							<span style={{ fontSize: 16, color: '#0AABDC' }}>CAT 2015-2018</span>
						</div>
						<div
							style={{
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							To ace the exam, one needs to prepare dynamically according to the
							changing needs. Hence, we analyze your current position based on the 2018
							edition of CAT to keep your preparation up to date with the current
							requirement of the exam.
						</div>
					</div>
					<div style={{ marginLeft: 12 }}>
						<img alt="" src={img1} className="series-features-image"></img>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						margin: '0px 0px',
						marginTop: 48,
						alignItems: 'center',
					}}
				>
					<div style={{ marginRight: 12 }}>
						<img alt="" src={img2} className="series-features-image"></img>
					</div>
					<div style={{ flex: 1, marginLeft: 18 }}>
						<div style={{ fontSize: 20, color: '#0AABDC' }}>AI-Generated</div>
						<div>
							<span style={{ fontSize: 16, color: '#707070' }}>Customized </span>
							<span style={{ fontSize: 16, color: '#2A2A2A' }}>Improvement sets</span>
						</div>
						<div
							style={{
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							Once we identify the weak areas, our AI model creates smart personalized
							improvement sessions targeting the focus areas. These sessions will help
							you with improving your accuracy, speed and different topics, as the need
							be.
						</div>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						margin: '0px 0px',
						marginTop: 48,
						alignItems: 'center',
					}}
				>
					<div style={{ flex: 1, marginRight: 18 }}>
						<div style={{ fontSize: 20, color: '#0AABDC' }}>
							Speedometer Monitored
						</div>
						<div style={{ fontSize: 16, color: '#2A2A2A' }}>Practice Sessions</div>
						<div
							style={{
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
					<div style={{ marginLeft: 12 }}>
						<img alt="" src={img3} className="series-features-image"></img>
					</div>
				</div>
			</div>
		);
	};
}
