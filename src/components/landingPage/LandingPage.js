import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { URLS } from 'components/urls';
import './LandingPage.scss';
import asyncComponent from 'components/AsyncComponent';

import HeadOne from './HeadOne';
import HeadTwo from './HeadTwo';
import Footer from './LandingPageFooter';

import Registration from '../login';
import ServicePlans from 'components/servicePlans';
import {
	clientAlias,
	isLite,
	showServicePlansOnHome,
	landingPage,
	footer,
} from 'utils/config';
import LiteLandingPage from './Lite';

const hidePortalFeatures = get(landingPage, 'hidePortalFeatures', false);
const hideRegistrationAtBottom = get(
	landingPage,
	'hideRegistrationAtBottom',
	false
);
const headTwo = get(landingPage, 'headTwo', {});
const hideHeadTwo = get(headTwo, 'hide', false);
const hideFooter = get(footer, 'hide');

const getPortalFeatureComponent = clientAlias => {
	const fileNameMap = {
		default: 'default',
		jee: 'jee',
		coaching: 'jee',
		cat: 'cat',
		placement: 'jobs',
		onlinetangedco: 'Tangedco',
		'610991b03b2d7e0ccb560d09': '610991b03b2d7e0ccb560d09',
		'613b10d87440600cba859eeb': 'gckiranpur',
		sat: 'sat',
		prepniti: 'prepniti',
		jnv: 'jnv',
		satya: 'satya-classes',
	};
	if (fileNameMap[clientAlias] === 'none') {
		return () => <></>;
	}

	return asyncComponent(() =>
		import(
			/* webpackChunkName: "portalFeatures"*/ `./portalFeatures/${fileNameMap[
				clientAlias
			] || fileNameMap.default}`
		)
	);
};

class LandingPage extends Component {
	constructor(props) {
		super(props);
		const showSignUpAtEnd = Date.now() % 10 !== 0;
		this.state = {
			showSignUpAtEnd,
		};
	}

	handlePropChange = props => {
		const { UserData } = props;
		if (!UserData) {
			return;
		}
		const { subscriptions } = UserData;
		if (
			// username &&
			// isVerified &&
			subscriptions
			// subscriptions.length
		) {
			this.props.history.replace(URLS.dashboard);
		}
	};

	componentDidMount() {
		this.handlePropChange(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.handlePropChange(nextProps);
	}

	enroll = () => {
		// window.scrollTo({ top: 0, behavior: 'smooth' });
		this.setState({ showSignUpAtEnd: true });
	};

	goToSignIn = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	render() {
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;

		const view = screenHeight > 1.5 * screenWidth ? 'potrait' : 'landscape';

		const PortalFeatureComponent = getPortalFeatureComponent(clientAlias);

		if (isLite) {
			return (
				<div
					style={{
						background: '#fafafa',
						minHeight: '100vh',
						width: '100vw',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<LiteLandingPage />
				</div>
			);
		} else {
			return (
				<React.Fragment>
					<div className="landing-page-wrapper">
						<div className="head-wrapper">
							<HeadOne view={view} />
							{hideHeadTwo ? null : <HeadTwo view={view} />}
						</div>
						{showServicePlansOnHome ? (
							<ServicePlans
								WrapperComponent={({ children }) => (
									<div style={{ padding: '1rem' }}>{children}</div>
								)}
								buyNowQuery={'flow=buy&prefer=sign_up'}
								colSizes={{
									xs: 24,
									sm: 24,
									md: 8,
									lg: 8,
									xl: 6,
									xxl: 4,
								}}
							/>
						) : null}
						{hidePortalFeatures ? null : <PortalFeatureComponent />}
						{hideRegistrationAtBottom ? null : (
							<div
								style={{
									backgroundColor: '#FAFAFA',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									padding: '40px 0px',
								}}
								className="product-wrapper"
							>
								{this.state.showSignUpAtEnd ? (
									<React.Fragment>
										<Registration
											isFormWide
											defaultView="signup"
											gaCategory="main-page-footer-registration"
										/>
										<span id="main-page-footer-registration" />
									</React.Fragment>
								) : (
									<React.Fragment>
										<div style={{ color: '#2A2A2A' }} className="bottom-text">
											What are you waiting for?
										</div>
										<button
											id="enroll-now-cta"
											data-ga-on="click"
											data-ga-event-action="Click Enroll Now"
											data-ga-event-category="CTA"
											data-ga-event-label="Enroll Now"
											style={{
												marginTop: 12,
												backgroundColor: '#0AABDC',
												cursor: 'pointer',
												color: 'white',
												borderRadius: 1000,
												padding: '8px 20px',
											}}
											onClick={this.enroll}
										>
											Enroll Now
										</button>
									</React.Fragment>
								)}
							</div>
						)}
						{hideFooter ? null : <Footer />}
					</div>
				</React.Fragment>
			);
		}
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

export default connect(mapStateToProps)(withRouter(LandingPage));
