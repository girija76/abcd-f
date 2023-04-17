/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {
	TeamOutlined,
	CalculatorTwoTone,
	ContainerTwoTone,
	AimOutlined,
} from '@ant-design/icons';
import { clientAlias } from 'utils/config';
import { productMap } from '../data';
import '../HeadOne.scss';
import './style.css';
import { BsFilePdfFill } from 'react-icons/bs';
import { FaVideo } from 'react-icons/fa';

class HeadOne extends Component {
	constructor(props) {
		super(props);
		const searchParams = new URLSearchParams(window.location.search);
		let isOnCoursePage = true;
		const courseFromPage = 'prepniti'; //props.match.params.identifier;
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
			"Prepniti's portal is the most insightful and robust, equipped with newest tools like - behaviour analysis, personalized recommendations, smart practice. You just need to follow the schedule, leave the rest on Prepniti.";
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
										<h1 className="course-heading" style={{ fontSize: 30 }}>
											<span style={{ color: '#0AABDC' }}>Full length Series</span>{' '}
											<span>for CSAT 2022-2024</span>
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
												flexDirection: 'column',
												alignItems: 'center',
												padding: 12,
												display: 'none',
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
												<AimOutlined style={{ fontSize: 24, color: '#2f54eb' }} />
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
													Hustle Test Series
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													60 Hustle Mocks (30 mins), 8 Hustle+ Mocks (90 mins)
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
													boxShadow: 'rgba(245, 34, 45, 0.12) 0px 6px 12px',
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
													Assessments
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Full length Mocks with detailed analysis
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
													boxShadow: 'rgba(245, 34, 45, 0.12) 0px 6px 12px',
												}}
											>
												<BsFilePdfFill
													style={{ fontSize: 24, color: 'rgba(255, 0, 0, 0.85)' }}
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
													Documents
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Resource Documents for reading and more reliable informative
													content
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
													boxShadow: 'rgba(245, 34, 45, 0.12) 0px 6px 12px',
												}}
											>
												<FaVideo
													style={{ fontSize: 24, color: 'rgba(100, 35, 67, 0.85)' }}
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
													Videos
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Playlists for videos to explore how to compete over exams with
													solutions
												</div>
											</div>
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
