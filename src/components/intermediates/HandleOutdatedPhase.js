/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get, size } from 'lodash';
import { Button, Divider, Modal, Select, Skeleton, Typography } from 'antd';
import { URLS } from '../urls';
import { parseFullDate } from '../libs/lib';
import { logout } from 'utils/user';
import AccountSwitcher from 'components/topbar/AccountSwitcher';
import { userAccountSelector } from 'selectors/userAccount';

const { Text } = Typography;
const Option = Select.Option;

function getActiveSubgroup(subscriptions, currentSupergroup) {
	let activeSubgroup = '';
	subscriptions.forEach(subscription => {
		if (subscription.group === currentSupergroup) {
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(phase => {
					if (phase.active) activeSubgroup = sg.group;
				});
			});
		}
	});
	return activeSubgroup;
}

class HandleOutdatedPhase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			phases: null,
			subgroup: '',
			selectedPhase: '',
			updating: false,
		};
	}

	componentWillMount() {
		const { UserData } = this.props;
		if (UserData && UserData.subscriptions) {
			const currentSupergroup = localStorage.getItem('currentSupergroup');
			const activeSubgroup = getActiveSubgroup(
				UserData.subscriptions,
				currentSupergroup
			);
			this.fetchAllPhases(activeSubgroup);
		}
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (
			nextProps.UserData &&
			nextProps.UserData.subscriptions &&
			(!this.props.UserData || !this.props.UserData.subscriptions)
		) {
			const currentSupergroup = localStorage.getItem('currentSupergroup');
			const activeSubgroup = getActiveSubgroup(
				nextProps.UserData.subscriptions,
				currentSupergroup
			);
			this.fetchAllPhases(activeSubgroup);
		}
		// this.updateState(UserData);
		// this.fetchAllGroups();
	}

	fetchAllPhases = subgroup => {
		fetch(`${URLS.backendGroups}/getPhasesOfSubgroup?id=${subgroup}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(res => {
			if (res.ok) {
				res.json().then(resBody => {
					if (resBody.success) {
						this.setState({ phases: resBody.phases, subgroup });
					}
				});
			}
		});
	};

	handlePhase = selectedPhase => this.setState({ selectedPhase });

	updatePhase = () => {
		const { selectedPhase, subgroup } = this.state;
		this.setState({ updating: true });

		fetch(`${URLS.backendUsers}/updatePhase`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				phase: selectedPhase,
				subgroup: subgroup,
			}),
		}).then(res => {
			if (res.ok) {
				res.json().then(resBody => {
					if (resBody.success) {
						console.log('check body', resBody);
						window.location = '/dashboard';
					}
				});
			}
			this.setState({ updating: false });
		});
	};

	render = () => {
		const { phases, selectedPhase, updating } = this.state;
		const { userAccount } = this.props;
		return (
			<div>
				<Modal title="Your phase has ended!" visible={true} footer={null}>
					<Skeleton loading={phases === null}>
						<div>Please choose a new phase:</div>
						{phases && phases.length ? (
							<Select
								defaultValue="Select phase"
								style={{ width: '100%', marginTop: 12, fontSize: 13 }}
								onChange={this.handlePhase}
							>
								{phases.map(phase => {
									return (
										<Option value={phase._id} style={{ fontSize: 12 }}>
											{`${phase.name} (${parseFullDate(phase.startDate)} - ${parseFullDate(
												phase.endDate
											)})`}
										</Option>
									);
								})}
							</Select>
						) : (
							<div>No phase available</div>
						)}
						{size(get(userAccount, ['users'])) > 1 ? (
							<div style={{ marginTop: '1rem' }}>
								<div style={{ marginBottom: '.25rem' }}>
									<Text type="secondary">Switch account</Text>
								</div>
								<AccountSwitcher onSuccess={() => (window.location = '/dashboard')} />
							</div>
						) : null}
						<div style={{ display: 'flex', paddingTop: 24 }}>
							<div style={{ flex: 1 }}></div>
							<Button onClick={logout}>Logout</Button>
							<Divider type="vertical" />
							<Button
								type="primary"
								disabled={!selectedPhase}
								loading={updating}
								onClick={this.updatePhase}
							>
								Continue
							</Button>
						</div>
					</Skeleton>
				</Modal>
			</div>
		);
	};
}

const mapStateToProps = state => ({
	SuperGroups: state.api.SuperGroups,
	UserData: state.api.UserData,
	AssessmentWrappers: state.api.AssessmentWrappers,
	userAccount: userAccountSelector(state),
});

const mapDispatchToProps = dispatch => {
	return {};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(HandleOutdatedPhase)
);
