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
			"Prepseed's prepartion portal is the most insightful and robust, equipped with newest tools like - behaviour analysis, personalized recommendations, smart practice. You just need to follow the schedule, leave the rest on Prepleaf.";
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
											<span style={{ color: '#0AABDC' }}>
												All India Full length Mock Series
											</span>{' '}
											<span>for CAT 2021</span>
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
													CAT 2021 Mocks
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													10 Full length Mocks with detailed analysis
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
												<ContainerTwoTone
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
													Topic & Sectional Tests
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													With five step test analysis - QA, LRDI, VARC
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
												<TeamOutlined style={{ fontSize: 24, color: '#faad14' }} />
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
													Study Community
												</h2>
												<div style={{ fontSize: 16, textAlign: 'center' }}>
													<a
														rel="noreferrer"
														href="https://www.facebook.com/groups/MBAPrepZone/"
														target="_blank"
													>
														Facebook
													</a>{' '}
													community
												</div>
											</div>
										</div>
									</div>
									<Row justify="center" gutter={[8, 8]}>
										<Col xs={24} sm={16} md={12} lg={18} xl={12}>
											<a
												style={{
													padding: '8px 24px',
													borderRadius: 100,
													color: '#fff',
													backgroundColor: '#0aabdc',
													border: 'solid 2px #0aabdc',
													borderLeft: 'none',
													borderRight: 'none',
													fontWeight: 'bold',
													cursor: 'poiner',
													textAlign: 'center',
													display: 'flex',
													justifyContent: 'center',
												}}
												href={'/registration/sign_up?redirect_url=/dashboard/compete'}
											>
												Register for the Mocks
											</a>
										</Col>
									</Row>
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
