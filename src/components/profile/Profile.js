import React from 'react';
import { connect } from 'react-redux';
import { isLite } from 'utils/config';
import { withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import { Col, Row } from 'antd';
import Tooltip from 'antd/es/tooltip';
import ProfilePic from './DisplayPicture';
import DataDownload from './DataDownload';
import { URLS } from '../urls';
import './Profile.scss';

import Account from './Account';
// import Categories from './Categories';
import PasswordSettings from './PasswordSettings';
import Plans from './Plans';

import Tabs from 'antd/lib/tabs';

import { InfoCircleTwoTone } from '@ant-design/icons';
import { enableBatches, hasServicesEnabled } from 'utils/config';

const TabPane = Tabs.TabPane;

export class Profile extends React.Component {
	handleTabChange = key => {
		if (key === '1') this.props.history.push(URLS.profileAccount);
		if (key === '2') this.props.history.push(URLS.profileJourney);
		if (key === '3') this.props.history.push(URLS.profileBookmarks);
		if (key === '4') this.props.history.push(URLS.profilePlans);
		if (key === 'my_data') this.props.history.push(URLS.profileMyData);
	};

	render() {
		const url = window.location.pathname;
		let defaultKey = '1';
		if (url === URLS.profileJourney) defaultKey = '2';
		else if (url === URLS.profileBookmarks) defaultKey = '3';
		else if (url === URLS.profilePlans) {
			defaultKey = '4';
		} else if (url === URLS.profileMyData) {
			defaultKey = 'my_data';
		}

		const {
			UserData: { name, username, xp, currentBatch, subscriptions },
			activePhase,
		} = this.props;
		let rank = 'N/A';
		if (
			subscriptions.length &&
			subscriptions[0].overall_rank &&
			subscriptions[0].overall_rank.length
		) {
			const overall_rank = subscriptions[0].overall_rank;
			rank = overall_rank[overall_rank.length - 1].rank;
		}

		return (
			<div>
				<Card
					style={{ width: '100%', borderRadius: 0 }}
					bordered={false}
					headStyle={{ fontSize: 18, fontWeight: 'bold' }}
					bodyStyle={{ padding: isLite ? 0 : 0 }}
				>
					<div className="profile-header-container">
						<div className="profile-header-image">
							<ProfilePic />
						</div>
						<div className="profile-header-detail">
							<div className="user-name">{name}</div>
							<div className="user-username">{username}</div>
							{enableBatches && currentBatch ? (
								<div className="profile-header-detail-item">
									<div className="label">Batch</div>
									<div className="achievement-style">
										{currentBatch && currentBatch.name}
									</div>
								</div>
							) : null}
							<div className="profile-header-detail-item">
								<div className="label">Rank</div>
								<span className="achievement-style">
									{rank}
									{rank === 'N/A' ? (
										<Tooltip
											title="Attempt atleast two live assessments to get overall rank."
											placement="right"
										>
											<InfoCircleTwoTone style={{ fontSize: 18, marginLeft: 10 }} />
										</Tooltip>
									) : null}
								</span>
							</div>
							<div className="profile-header-detail-item">
								<div className="label">XP</div>
								<span className="achievement-style">{Math.floor(xp.net)}</span>
							</div>
							<div className="profile-header-detail-item">
								<div className="label">Streak</div>
								<span className="achievement-style">{xp.streak.day} Days</span>
							</div>
						</div>
					</div>
					<Tabs
						defaultActiveKey={defaultKey}
						onChange={this.handleTabChange}
						className="account-journey-bookmarks-tab"
					>
						<TabPane tab="Account" key="1">
							<div style={{ padding: 16, paddingTop: 0 }}>
								<Row gutter={{ xs: 8, md: 32 }} className="account-tab">
									<Col style={{ width: '100%' }} md={12} xs={24}>
										<Account />
									</Col>
									<Col style={{ width: '100%' }} md={12} xs={24}>
										<PasswordSettings />
									</Col>
								</Row>
							</div>
						</TabPane>

						{hasServicesEnabled ? (
							<TabPane tab="Plans" key="4">
								<Plans activePhase={activePhase} />
							</TabPane>
						) : null}
						<TabPane tab="My Data" key="my_data">
							<DataDownload />
						</TabPane>
					</Tabs>
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
	Topics: state.api.Topics,
});

export default connect(mapStateToProps, {})(withRouter(Profile));
