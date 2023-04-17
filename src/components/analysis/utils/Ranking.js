import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'antd/es/card';
import Tooltip from 'antd/es/tooltip';
import Divider from 'antd/es/divider';

import { InfoCircleTwoTone } from '@ant-design/icons';

import { getPhaseFromSubscription } from '../../libs/lib';
import { URLS } from '../../urls.js';

import { updateRanks } from '../../api/ApiAction';

class Ranking extends Component {
	componentWillMount() {
		const {
			UserData: { subscriptions },
		} = this.props;
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		let activePhase = getPhaseFromSubscription(subscriptions, currentSupergroup);

		const { Rank } = this.props;
		if (!Rank) {
			fetch(`${URLS.backendLeaderboard}/getranks?phase=${activePhase._id}`, {
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
							this.props.updateRanks(responseJson);
						}
					});
				}
			});
		}
	}

	render() {
		const {
			style,
			title,
			Rating,
			Rank,
			Percentile,
			UserData: { subscriptions },
		} = this.props;

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const ratingDescription =
			'Rating of a user describes his competence strength. User starts with a rating of 1600, which increases/decreases as per his performance relative to his competitors.';

		let Competitors = 0;
		subscriptions.forEach(subscription => {
			if (subscription.group === currentSupergroup) {
				subscription.subgroups.forEach(subgroup => {
					subgroup.phases.forEach(ph => {
						if (ph.active) {
							Competitors = ph.phase.users;
						}
					});
				});
			}
		});

		return (
			<Card
				style={{ width: '100%', ...style }}
				bodyStyle={{ display: 'flex', padding: 12 }}
				title={title}
			>
				<div
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: 5,
					}}
				>
					<div style={{ fontSize: 16 }}>
						<span>Rating</span>
						<Tooltip
							title={ratingDescription}
							placement="top"
							overlayClassName="rating-description-tooltip"
						>
							<InfoCircleTwoTone style={{ fontSize: 18, marginLeft: 10 }} />
						</Tooltip>
					</div>
					<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
						{Rating && Rating !== -1 ? Rating : 'N/A'}
					</div>
				</div>
				<Divider
					type="vertical"
					style={{
						height: 64,
						backgroundColor: '#a0a0a0',
						width: 2,
						margin: '0 15px',
					}}
				/>
				<div
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: 5,
					}}
				>
					<div style={{ fontSize: 16 }}>
						<span>Overall Rank</span>
					</div>
					<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
						{Rank && Rank !== -1 ? (
							<span>
								<span>{'#' + Rank}</span>{' '}
								{Competitors >= 100 ? (
									<span
										style={{
											fontSize: 14,
											color: 'rgba(0, 0, 0, 0.65)',
											fontWeight: 500,
										}}
									>
										/ {Competitors}
									</span>
								) : null}
							</span>
						) : (
							'N/A'
						)}
					</div>
				</div>
				<Divider
					type="vertical"
					style={{
						height: 64,
						backgroundColor: '#a0a0a0',
						width: 2,
						margin: '0 15px',
					}}
				/>
				<div
					style={{
						flex: 1,
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: 5,
					}}
				>
					<div style={{ fontSize: 16 }}>
						<span>Percentile</span>
					</div>
					<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
						{Percentile && Percentile !== -1 ? Percentile + '%' : 'N/A'}
					</div>
				</div>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	Rating: state.api.Rating,
	Rank: state.api.Rank,
	Percentile: state.api.Percentile,
	UserData: state.api.UserData,
});

const mapDispatchToProps = dispatch => {
	return {
		updateRanks: data => dispatch(updateRanks(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);
