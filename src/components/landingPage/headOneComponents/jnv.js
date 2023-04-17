/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Carousel } from 'antd';
import { clientAlias } from 'utils/config';
import { productMap } from '../data';
import '../HeadOne.scss';
import './style.css';

class HeadOne extends Component {
	constructor(props) {
		super(props);
		const searchParams = new URLSearchParams(window.location.search);
		let isOnCoursePage = true;
		const courseFromPage = 'jnv'; //props.match.params.identifier;
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
		const {
			name: clientName,
			logoDark,
			logoDarkHeight,
			url,
			hideLogoOnHeadOne,
		} = window.config;
		const altText = `${clientName} logo`; //default is 48

		// const logoDark = logoSrc;

		const detail =
			"Jawahar Navodaya Vidhyalaya's portal is the most insightful and robust, equipped with newest tools like - behaviour analysis, personalized recommendations. You just need to follow the schedule, leave the rest on Jawahar Navodaya Vidhyalaya Portal powered by Prepseed.";
		return (
			<>
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
									width: '100%',
									height: '100%',
								}}
								className={`home-product-subwrapper`}
							>
								<div
									style={{
										margin: '24px 0px',
										width: '100%',
										height: '100%',
									}}
									className={`product-wrapper`}
								>
									<div className="course-heading-wrapper">
										<div
											className="title-line-wrapper"
											style={{ opacity: 1, transform: 'translate(0px, 0px)' }}
										>
											<div
												className="title-line"
												style={{ transform: 'translateX(-64px)' }}
											></div>
										</div>
										<h1 className="course-heading" style={{ fontSize: 30 }}>
											<span style={{ color: '#0AABDC' }}>
												Jawahar Navodaya Vidhyalaya Portal
											</span>
										</h1>
									</div>
									<div style={{ fontSize: 16, fontWeight: 600 }}>{detail}</div>
									<div
										style={{
											width: '100%',
											height: '100%',
											margin: '1rem 0',
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										<div style={{ width: window.innerWidth > 1400 ? '100%' : '70%' }}>
											<Carousel
												autoplay
												autoplaySpeed={3000}
												draggable
												pauseOnFocus={false}
												pauseOnHover={false}
												pauseOnDotsHover={false}
												arrows
												infinite
											>
												{['splash1.jpg', 'splash2.jpg', 'splash3.jpg'].map((image, key) => (
													<img
														key={key}
														src={`https://static.prepseed.com/brand/jnv/${image}`}
													/>
												))}
											</Carousel>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};
}

export default HeadOne;
