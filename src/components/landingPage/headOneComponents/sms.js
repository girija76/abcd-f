import React, { Component } from 'react';
import EventCountdown from '../EventCountdown';
import ProductIcon from '../../images/product.svg.js';
import { productMap } from './smsdata';
import Chemica from '../coaching/Chemica';
import PrinceSir from '../coaching/PrinceSir';
import VyasFaculty from '../coaching/VyasFaculty';
import { clientAlias } from 'utils/config';

import '../HeadOne.scss';

const custumHeaders = {
	chemica: Chemica,
	princesir: PrinceSir,
	vyasfaculty: VyasFaculty,
};

class HeadOne extends Component {
	constructor(props) {
		super(props);
		const searchParams = new URLSearchParams(window.location.search);
		let isOnCoursePage = true;
		const courseFromPage = ''; //props.match.params.identifier;
		let course = courseFromPage;
		if (!course) {
			course = searchParams.get('course');
		}
		if (!course) {
			isOnCoursePage = false;
			course = 'iitjee';
		}

		const products = productMap[clientAlias];

		let currentProduct = Math.floor(products.length / 2);
		products.forEach((product, index) => {
			if (product.identifier === course) {
				currentProduct = index;
			}
		});

		this.state = {
			isOnCoursePage,
			currentProduct,
		};
	}

	changeProduct = currentProduct => {
		this.setState({ currentProduct });
	};

	render = () => {
		const { currentProduct } = this.state;

		const {
			name: clientName,
			logoDark,
			logoDarkHeight,
			url,
			hideLogoOnHeadOne,
			customHeaderComponent,
		} = window.config;
		const altText = `${clientName} logo`; //default is 48

		// const logoDark = logoSrc;

		const products = productMap[clientAlias];
		const activeProduct = products[currentProduct];

		const { name, course, detail, shortName, demo } = activeProduct;
		const ExtraHeadComponent = custumHeaders[customHeaderComponent];
		const coachingSpecificComponent = ExtraHeadComponent ? (
			<ExtraHeadComponent />
		) : null;

		const { hideDemo } = window.config;

		return (
			<>
				{coachingSpecificComponent}
				<div className="sub-head-wrapper1">
					{hideLogoOnHeadOne ? null : (
						<div style={{ marginLeft: 78, marginTop: 32 }}>
							<a
								href={url}
								style={{ display: 'inline-block' }}
								className={`prepleaf-logo`}
							>
								<img alt={altText} src={logoDark} height={logoDarkHeight}></img>
							</a>
						</div>
					)}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							flexDirection: 'column',
							height: `calc(100% - 80px)`,
							position: 'relative',
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								marginBottom: 16,
							}}
							className={`home-product-wrapper`}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								className={`home-product-subwrapper`}
							>
								<div style={{ minWidth: 210 }}>
									<ProductIcon name={shortName} />
								</div>
								<div
									style={{ margin: '24px 0px' }}
									className={`product-wrapper home-product-subsubwrapper`}
								>
									<h1>
										{clientAlias === 'coaching' ? (
											<span className="product-heading">{clientName + ' '}</span>
										) : null}
										<span style={{ color: '#0AABDC' }} className="product-heading">
											{name}
										</span>{' '}
										<span className="product-heading">{course}</span>
									</h1>
									<div>{detail}</div>
									{demo && !hideDemo ? (
										<div style={{ display: 'flex', justifyContent: 'center' }}>
											<a
												style={{
													padding: '6px 24px',
													borderRadius: 100,
													backgroundColor: 'transparent',
													color: '#0aabdc',
													border: 'solid 2px',
													fontWeight: 'bold',
													cursor: 'poiner',
													marginTop: 12,
												}}
												href={demo}
											>
												Get Demo
											</a>
										</div>
									) : null}
								</div>
							</div>
						</div>

						{activeProduct.hasEventCountDown ? <EventCountdown /> : null}
						{products && products.length > 1 ? (
							<div className="home-product-tabs">
								{products.map((product, index) => {
									return (
										<button
											className={`home-product-tabs-item ${
												currentProduct === index ? 'active' : ''
											}`}
											onClick={() => {
												this.changeProduct(index);
											}}
											key={index}
										>
											{product.name}
										</button>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
			</>
		);
	};
}

export default HeadOne;
