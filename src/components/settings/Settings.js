import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import AccountSettings from './AccountSettings.js';
import PasswordSettings from './PasswordSettings.js';
import NotificationSettings from './NotificationSettings.js';
import GoalSettings from './GoalSettings.js';
import './Settings.css';
import { URLS } from '../urls.js';

const tabList = [
	{
		key: 'tab1',
		tab: 'Account',
	},
	{
		key: 'tab2',
		tab: 'Password',
	},
	{
		key: 'tab3',
		tab: 'Notifications',
	},
	{
		key: 'tab4',
		tab: 'Daily Goals',
	},
];

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

export class Settings extends React.Component {
	constructor(props) {
		super(props);
		let url = window.location.pathname;
		let key = 'tab1';
		if (url === URLS.settingsGoal || url === URLS.settingsGoal + '/') {
			key = 'tab4';
		}
		this.state = {
			key: key,
			user: null,
		};
	}

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
		if (key === 'tab1') {
			this.props.history.push(URLS.settingsAccount);
		} else if (key === 'tab2') {
			this.props.history.push(URLS.settingsPassword);
		} else if (key === 'tab3') {
			this.props.history.push(URLS.settingsNotification);
		} else if (key === 'tab4') {
			this.props.history.push(URLS.settingsGoal);
		}
	};

	renderTabContent = () => {
		let { attemptedTests } = this.props;
		let { allTests } = this.state;
		return {
			tab1: <AccountSettings />,
			tab2: <PasswordSettings />,
			tab3: <NotificationSettings />,
			tab4: <GoalSettings />,
		};
	};

	render() {
		let { key } = this.state;
		const contentList = this.renderTabContent();
		let url = window.location.pathname;
		if (
			window.location.pathname === URLS.settings ||
			window.location.pathname === URLS.settings + '/'
		)
			url = URLS.settingsAccount;
		return (
			<Card
				className="settings-card"
				style={{ width: '100%' }}
				headStyle={{ fontSize: 18, fontWeight: 'bold' }}
				title="Settings"
				tabList={tabList}
				activeTabKey={key}
				onTabChange={key => {
					this.onTabChange(key, 'key');
				}}
			>
				{contentList[key]}
			</Card>
		);
	}
}

export default withRouter(Settings);
