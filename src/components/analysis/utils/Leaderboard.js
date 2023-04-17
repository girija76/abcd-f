import React, { Component } from 'react';
import { Card, Table } from 'antd';
import { URLS } from '../../urls.js';

import './ListItem.css';

const columns = [
	{
		title: 'User',
		dataIndex: 'user',
		key: 'user',
		render: user => (
			<div className="leaderboard-listitem-leftside">
				<span className="leaderboard-listitem-avatar-container">
					<div className="leaderboard-listitem-avatar">
						<img alt="" src={user.dp} />
						<span className="rank">{user.rank}</span>
					</div>
				</span>
				<span className="leaderboard-listitem-username">{user.username}</span>
			</div>
		),
	},
	{
		title: 'Marks',
		dataIndex: 'marks',
		key: 'marks',
	},
];

class Leaderboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leaderboard: [],
		};
	}

	componentWillMount() {
		const { wrapperId } = this.props;

		fetch(`${URLS.backendCFAssessment}/getwrappertoppers/${wrapperId}`, {
			method: 'GET', //GET not working!?
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					if (responseJson.success) {
						this.setState({ leaderboard: responseJson.toppers });
					}
				});
			}
		});
	}

	render() {
		const { leaderboard } = this.state;

		console.log('check leaderboard', leaderboard);

		if (leaderboard && leaderboard.length >= 10) {
			return (
				<div style={{ width: '100%' }}>
					<div
						style={{
							marginTop: 20,
							marginBottom: 5,
							fontSize: 20,
							fontWeight: '600',
							width: '100%',
						}}
					>
						Leaderboard
					</div>

					<Card bodyStyle={{ padding: 0 }}>
						<Table
							columns={columns}
							dataSource={leaderboard}
							className="leaderboard-table"
						/>
					</Card>
				</div>
			);
		}
		return null;
	}
}

export default Leaderboard;
