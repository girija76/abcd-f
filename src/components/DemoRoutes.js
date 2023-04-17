import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { URLS } from './urls.js';
import { updateTopicsAssessments } from './api/ApiAction';

import 'antd/lib/layout/style/index.css';
import 'antd/lib/menu/style/index.css';
import 'antd/lib/card/style/index.css';
import 'antd/lib/button/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/modal/style/index.css';
import 'antd/lib/list/style/index.css';
import 'antd/lib/icon/style/index.css';
import 'antd/lib/skeleton/style/index.css';
import 'antd/lib/tabs/style/index.css';
import 'antd/lib/table/style/index.css';
import 'antd/lib/checkbox/style/index.css';
import 'antd/lib/form/style/index.css';
import 'antd/lib/grid/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import 'antd/lib/radio/style/index.css';
import 'antd/lib/switch/style/index.css';
import 'antd/lib/dropdown/style/index.css';
import 'antd/lib/spin/style/index.css';
import 'antd/lib/notification/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/avatar/style/index.css';
import 'antd/lib/timeline/style/index.css';
import 'antd/lib/popover/style/index.css';
import 'antd/lib/progress/style/index.css';
import 'antd/lib/alert/style/index.css';
import 'antd/lib/pagination/style/index.css';
import 'antd/lib/style/index.css';

import Logo from './images/logo.svg';
import AsyncDashboard from 'components/dashboard';

import { CloseOutlined } from '@ant-design/icons';

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}}
		/>
	);
};

class DemoRoutes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			showNotification: true,
		};
	}

	componentWillMount() {
		let path = window.location.pathname;
		const key =
			path.indexOf('cat') !== -1
				? 'cat'
				: path.indexOf('placement') !== -1
				? 'placement'
				: path.indexOf('jee') !== -1
				? 'jee'
				: '';
		const supergroupName =
			path.indexOf('cat') !== -1
				? 'Cat'
				: path.indexOf('placement') !== -1
				? 'Placement'
				: path.indexOf('jee') !== -1
				? 'IIT-JEE'
				: '';
		fetch(`${URLS.backendCFUsers}/${key}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					localStorage.setItem('currentSupergroup', responseJson.supergroup);
					responseJson.supergroupNames = {};
					responseJson.supergroupNames[responseJson.supergroup] = supergroupName;
					this.props.updateTopicsAssessments(responseJson);
					this.setState({ loading: false });
				});
			} else {
				this.props.history.push(URLS.landingPage);
			}
		});
	}

	componentWillUnmount() {
		this.props.updateTopicsAssessments({
			assessmentWrappers: null,
			feeds: [],
		});
	}

	moveToLandingPage = () => {
		this.props.history.push(URLS.landingPage);
	};

	hideNotification = () => {
		this.setState({ showNotification: false });
	};

	render() {
		const { loading, showNotification } = this.state;
		return (
			<div>
				{!loading ? (
					<Switch>
						<PropsRoute path={URLS.demoCat} component={AsyncDashboard} mode="demo" />
						<PropsRoute
							path={URLS.demoPlacement}
							component={AsyncDashboard}
							mode="demo"
						/>
						<PropsRoute
							path={URLS.jeePlacement}
							component={AsyncDashboard}
							mode="demo"
						/>
					</Switch>
				) : null}
				{loading ? <Loading3QuartersOutlined spin /> : null}
				{showNotification ? (
					<div
						style={{
							position: 'fixed',

							width: '100vw',
							left: 0,
							bottom: 0,
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							backdropFilter: 'blur(10px)',
							color: 'white',

							zIndex: 1000,
						}}
					>
						<div style={{ height: 23, display: 'flex' }}>
							<div style={{ flex: 1 }}></div>
							<CloseOutlined
								style={{
									color: 'white',
									fontSize: 16,
									padding: 3,
									marginRight: 12,
									marginTop: 12,
									cursor: 'pointer',
								}}
								onClick={this.hideNotification}
							/>
						</div>
						<div
							style={{
								paddingBottom: 23,
								display: 'flex',
								justifyContent: 'space-evenly',
								alignItems: 'center',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{ width: 64, height: 48, overflow: 'hidden', marginRight: 12 }}
								>
									<img alt="" src={Logo} height={48} />
								</div>
								<div>
									<div style={{ padding: '6px 0px' }}>Log In to Prepleaf</div>
									<div style={{ padding: '6px 0px' }}>
										Log in to attempt practice questions, assessments and explore
										personalized dashboard which you'll love.
									</div>
								</div>
							</div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexDirection: 'column',
								}}
							>
								<Link
									to="/registration/sign_in"
									style={{
										backgroundColor: '#0aabdc',
										padding: '6px 24px',
										color: 'white',
										borderRadius: 100,
										cursor: 'pointer',
									}}
									data-ga-on="click"
									data-ga-action="click"
									data-ga-category="bottom-registration-banner"
									data-ga-label="Login"
									onClick={this.moveToLandingPage}
								>
									Login
								</Link>
								<Link
									data-ga-on="click"
									data-ga-action="click"
									data-ga-category="bottom-registration-banner"
									data-ga-label="Sign Up"
									style={{
										color: '#0aabdc',
										padding: '6px 24px',
										cursor: 'pointer',
									}}
									to="/registration/create_account"
								>
									Signup
								</Link>
							</div>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
	return {
		updateTopicsAssessments: data => dispatch(updateTopicsAssessments(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(DemoRoutes));
