import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, List, Tooltip } from 'antd';
import { URLS } from '../urls.js';
import ListItem from './ListItem';
import { updateLeaderboard } from '../api/ApiAction';
import { isLite } from 'utils/config.js';
import { AiOutlineInfoCircle, AiOutlineTrophy } from 'react-icons/ai';

class Leaderboard extends Component {
	componentWillMount() {
		const {
			Leaderboard_,
			activePhase: { _id },
		} = this.props;
		if (Leaderboard_ === null && _id) {
			fetch(`${URLS.backendCFLeaderboard}/getphaseleaderboard/${_id}`, {
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
							this.props.updateLeaderboard(responseJson);
						}
					});
				}
			});
		}
	}

	render() {
		const { Leaderboard_ } = this.props;

		const leaderboardInfo =
			'Leaderboard ranking is updated every two hours and based on your performance in assessments.';

		if (Leaderboard_ && Leaderboard_.length >= 5) {
			return (
				<Card
					size="small"
					bordered={false}
					style={{ borderRadius: isLite ? 0 : undefined, overflow: 'hidden' }}
					bodyStyle={{ padding: '0px 0 8px' }}
					headStyle={{ padding: 0 }}
				>
					<div
						style={{
							display: 'flex',
							backgroundColor: '#577bf3',
							color: 'white',
							padding: 12,
							alignItems: 'center',
							overflow: 'hidden',
						}}
					>
						<span
							style={{
								height: '48px',
								width: '48px',
								border: 'solid 0px rgba(0,0,0,0.07)',
								borderRadius: '50%',
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								opacity: 0.7,
								marginRight: 6,
								position: 'relative',
							}}
						>
							<AiOutlineTrophy style={{ fontSize: '28px' }} />
							<span
								style={{
									position: 'absolute',
									top: 24 - 30,
									left: 24 - 30,
									height: 60,
									width: 60,
									border: 'solid 8px rgba(0,0,0,0.07)',
									borderRadius: '50%',
								}}
							></span>
							<span
								style={{
									position: 'absolute',
									top: 24 - 60,
									left: 24 - 60,
									height: 120,
									width: 120,
									border: 'solid 15px rgba(0,0,0,0.07)',
									borderRadius: '50%',
								}}
							></span>
							<span
								style={{
									position: 'absolute',
									top: 24 - 100,
									left: 24 - 100,
									height: 200,
									width: 200,
									border: 'solid 20px rgba(0,0,0,0.07)',
									borderRadius: '50%',
								}}
							></span>
						</span>
						<div style={{ flex: 1, textAlign: 'right' }}>
							<div style={{ fontSize: 18 }}>Leaderboard</div>
						</div>

						<Tooltip
							title={leaderboardInfo}
							placement="topLeft"
							overlayClassName="rating-description-tooltip"
						>
							<AiOutlineInfoCircle style={{ fontSize: 16, marginLeft: 10 }} />
						</Tooltip>
					</div>

					<List
						itemLayout="horizontal"
						dataSource={Leaderboard_}
						renderItem={(item, idx) => (
							<ListItem
								rank={idx + 1}
								rating={item.rating}
								changeInRating={0 ? item.del_rating : 0}
								username={item.user.username}
								marks={item.marks}
								avatar={
									item.user.dp
										? item.user.dp
										: `https://avatars.dicebear.com/v2/bottts/:${item.username}.svg`
								}
								mode={this.props.mode}
							/>
						)}
					/>
				</Card>
			);
		}
		return null;
	}
}

const mapStateToProps = state => ({ Leaderboard_: state.api.Leaderboard });

const mapDispatchToProps = dispatch => {
	return {
		updateLeaderboard: data => dispatch(updateLeaderboard(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
