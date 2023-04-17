/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { CalculatorTwoTone, AimOutlined } from '@ant-design/icons';
import { clientAlias } from 'utils/config';
import { productMap } from '../data';
import '../HeadOne.scss';
import './style.css';
import { BsFilePdfFill } from 'react-icons/bs';
import { MdOutlineGolfCourse } from 'react-icons/md';

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
			'Satya classes is one of the unique institute in Lucknow, Uttar Pradesh(India) which is working for creating the future of country. Satya classes is working since 2014 which produced IITian and doctors. There are almost 25 members in the team of satya classes who are teaching for 8 years and have brilliance knowledge for creating future. Satya classes is not only an institute but also an emotions';
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
											<span>What is </span>
											<span style={{ color: '#0AABDC' }}>Satya Classes?</span>{' '}
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
												<MdOutlineGolfCourse
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
													Courses
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													Courses prepared by experts, used to crack IIT-JEE/NEET exams
													effectively
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
