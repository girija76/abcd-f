/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import Modal from 'antd/es/modal';

import './PortalFeatures.css';

import img1 from '../../images/1.svg';
import img2 from '../../images/2.svg';
import img3 from '../../images/3.svg';

import prepzone from '../../images/Prep_800_800.jpg';

export default class PortalFeatures extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showPrepzone: false,
		};
		// this.prepzoneBanner = null;
	}

	// componentDidMount() {
	// 	new Image().src = prepzone;
	// 	setTimeout(() => {
	// 		this.setState({ showPrepzone: true });
	// 	}, 1000);
	// }

	render = () => {
		const { showPrepzone } = this.state;

		return (
			<div className="product-wrapper portal-features-wrapper">
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
						<div style={{ fontSize: 24, color: '#0AABDC' }}>CAT 2015-2019</div>
						<div
							style={{
								fontSize: 18,
								color: '#707070',
								borderTop: '1px solid #707070',
								paddingTop: 8,
								marginTop: 12,
							}}
						>
							To ace CAT examination, one needs to prepare dynamically according to the
							changing needs. Hence, we analyze your current position based on the 2019
							edition of CAT to keep your preparation up to date with the current
							requirement of the exam.
						</div>
					</div>
					<div className="margin-left">
						<img src={img1} className="portal-features-image"></img>
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
						<img src={img2} className="portal-features-image"></img>
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
							you with improving your accuracy, speed and different topics, as the need
							be.
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
						<img src={img3} className="portal-features-image"></img>
					</div>
				</div>
				<Modal
					visible={showPrepzone}
					footer={null}
					onCancel={() => {
						this.setState({ showPrepzone: false });
					}}
					bodyStyle={{}}
					className="prepzone-banner"
				>
					<img src={prepzone} width="100%" />
				</Modal>
			</div>
		);
	};
}
