/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
	GiftTwoTone,
	CalculatorTwoTone,
	MobileTwoTone,
} from '@ant-design/icons';
import { clientAlias } from 'utils/config';
import { productMap } from '../data';
import '../HeadOne.scss';
import './style.css';

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
		} = window.config;
		const altText = `${clientName} logo`; //default is 48

		const products = productMap[clientAlias];
		const activeProduct = products[currentProduct];

		const { demo } = activeProduct;
		const detail =
			"Prepleaf's prepartion portal is the most insightful and robust, equipped with newest tools like - behaviour analysis, personalized recommendations, smart practice. You just need to follow the schedule, leave the rest on Prepleaf.";
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
								}}
								className={`home-product-subwrapper`}
							>
								<div style={{ margin: '24px 0px' }} className={`product-wrapper`}>
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
										<h1 className="course-heading">
											<span style={{ color: '#0AABDC' }}>PLACEMENT</span>{' '}
											<span> TEST SERIES</span>
										</h1>
									</div>
									<div style={{ fontSize: 16, fontWeight: 600 }}>{detail}</div>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											justifyContent: 'center',
											marginTop: 36,
										}}
									>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												padding: 12,
											}}
											className="feature-wrapper"
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: 88,
													width: 88,
													borderRadius: 1000,
													boxShadow: 'rgba(47, 84, 235, 0.12) 0px 6px 12px',
												}}
											>
												<CalculatorTwoTone
													style={{ fontSize: 24 }}
													twoToneColor="#2f54eb"
												/>
											</div>
											<div style={{ padding: 8 }}>
												<h2
													style={{
														marginBottom: 0,
														fontWeight: 'bold',
														fontSize: 18,
														textAlign: 'center',
													}}
												>
													Live Test Series
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Compete with users from all over the country
												</div>
											</div>
										</div>
										<div
											style={{
												display: 'none',
												flexDirection: 'column',
												alignItems: 'center',
												padding: 12,
											}}
											className="feature-wrapper"
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: 88,
													width: 88,
													borderRadius: 1000,
													boxShadow: 'rgba(245, 34, 45, 0.12) 0px 6px 12px',
												}}
											>
												<GiftTwoTone
													style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.85)' }}
													twoToneColor="#f5222d"
												/>
											</div>
											<div style={{ padding: 8 }}>
												<h2
													style={{
														marginBottom: 0,
														fontWeight: 'bold',
														fontSize: 18,
														textAlign: 'center',
													}}
												>
													Prizes for Toppers
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Win prizes while learning!
												</div>
											</div>
										</div>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												padding: 12,
											}}
											className="feature-wrapper"
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													height: 88,
													width: 88,
													borderRadius: 1000,
													boxShadow: 'rgba(250, 173, 20, 0.12) 0px 6px 12px',
												}}
											>
												<MobileTwoTone
													style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.85)' }}
													twoToneColor="#faad14"
												/>
											</div>
											<div style={{ padding: 8 }}>
												<h2
													style={{
														marginBottom: 0,
														fontWeight: 'bold',
														fontSize: 18,
														textAlign: 'center',
													}}
												>
													Mobile Compatible
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													<a
														rel="noreferrer"
														href="https://play.google.com/store/apps/details?id=com.prepleaf.twa.jobs.preparation"
														target="_blank"
														style={{ textDecoration: 'underline' }}
													>
														Download App
													</a>
													<div>Learn anytime, anywhere</div>
												</div>
											</div>
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'center' }}>
										<Link
											style={{
												padding: '6px 24px',
												borderRadius: 100,
												backgroundColor: 'transparent',
												color: '#0aabdc',
												border: 'solid 2px',
												fontWeight: 'bold',
												cursor: 'poiner',
												marginTop: 12,
												marginRight: 12,
											}}
											to={'/registration/sign_up'}
										>
											Enroll
										</Link>
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
												marginLeft: 12,
											}}
											href={demo}
										>
											Get Demo
										</a>
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
