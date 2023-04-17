import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Card } from 'antd';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Select from 'antd/es/select';

import SelectSubgroup from '../../routes/CompleteProfile/SelectSubgroup';

import { checkMobileNumber, parseFullDate } from '../libs/lib';
import { URLS } from '../urls';

import {
	updateUserData,
	updateGroups,
	updateServicePlans,
} from '../api/ApiAction';

import { getPhaseFromSubscription } from '../libs/lib';

import './Account.css';
import { clearUserApiResponseCache } from 'utils/user';

const { Option } = Select;

function filterSubgroup(groups) {
	const allowedSubgroup = window.config.subgroups;
	if (!allowedSubgroup || !allowedSubgroup.length) return groups;
	const aSg = allowedSubgroup.map(s => {
		return s._id;
	});
	return groups.filter(g => {
		if (aSg.indexOf(g.subgroup._id) !== -1) return true;
		return false;
	});
}

function getCourseAndPhaseBySupergroup(subscriptions, supergroup) {
	let course = '';
	let phase = '';
	subscriptions.forEach(subscription => {
		if (subscription.group === supergroup) {
			let activePhaseFound = false;
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(ph => {
					if (ph.active && !activePhaseFound) {
						course = sg.group;
						phase = ph.phase;
					}
				});
			});
		}
	});
	return { course, phase };
}

class AccountSettings extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			college: '',
			username: '',
			mobileNumber: '',
			isCollegeRequired: false,
			askForCollege: true,
			sharing: false,
			loading: false,
			success: false,
			allgroups: [],
			allunfilteredgroups: [],
			course: '',
			phase: {},
			phaseId: '',
			errorMsg: '',
		};
	}

	componentWillMount() {
		let { UserData } = this.props;
		this.updateState(UserData);
		this.fetchAllGroups();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.UserData != nextProps.UserData) {
			this.updateState(nextProps.UserData);
		}
	}

	updateState = UserData => {
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		const {
			course,
			phase: { _id: phaseId },
		} = getCourseAndPhaseBySupergroup(UserData.subscriptions, currentSupergroup);

		if (Object.keys(UserData).length) {
			this.setState({
				name: UserData.name,
				email: UserData.email,
				username: UserData.username,
				mobileNumber: UserData.mobileNumber,
				sharing: UserData.settings.sharing,
				course,
				phaseId,
				askForCollege: course ? false : true,
			});
		}
	};

	fetchAllGroups = () => {
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		const { clientId } = window.config;

		const url = clientId
			? `${URLS.backendGroups}/getSuperGroupWithAllSubgroups?id=${currentSupergroup}&clientId=${clientId}`
			: `${URLS.backendGroups}/getSuperGroupWithAllSubgroups?id=${currentSupergroup}`;
		fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(res => {
			if (res.ok) {
				res.json().then(resBody => {
					if (currentSupergroup === '5dd95e8097bc204881be3f2c') {
						if (clientId) {
							this.setState({
								allgroups: resBody.item.subgroups, //filterSubgroup(resBody.item.subgroups),
								allunfilteredgroups: resBody.item.subgroups,
							});
						} else {
							this.setState({
								allgroups: filterSubgroup(resBody.item.subgroups),
								allunfilteredgroups: resBody.item.subgroups,
							});
						}
					} else {
						this.setState({
							allgroups: resBody.item.subgroups,
							allunfilteredgroups: resBody.item.subgroups,
						});
					}
				});
			}
		});
	};

	handleName = name => {
		this.setState({
			name: name.target.value,
			success: false,
		});
	};

	handleCollege = college => {
		this.setState({
			college: college.target.value,
			errorMsg: '',
			success: false,
		});
	};

	handleUsername = uname => {
		this.setState({
			username: uname.target.value.replace(/\s/g, ''),
			errorMsg: '',
			success: false,
		});
	};

	handlePhone = phone => {
		this.setState({
			mobileNumber: phone.target.value,
			errorMsg: '',
			success: false,
		});
	};

	save = () => {
		//update store??. Atleast check if things are correct!
		const {
			name,
			username,
			mobileNumber,
			course,
			college,
			isCollegeRequired,
			askForCollege,
			phase,
			phaseId,
		} = this.state;
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		if (username.length < 6) {
			const { profile } = window.config;
			const msg =
				profile && profile.username
					? profile.username + ' should have atleast 6 characters.'
					: 'Username should have atleast 6 characters.';
			this.setState({ errorMsg: msg });
		} else if (mobileNumber && !checkMobileNumber(mobileNumber)) {
			this.setState({ errorMsg: 'Invalid phone number.' });
		} else if (!course) {
			const collegeText =
				currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';
			this.setState({ errorMsg: `Please select a ${collegeText}.` });
		} else if (askForCollege && isCollegeRequired && !college) {
			this.setState({ errorMsg: 'Please enter college name.' });
		} else if (!phaseId && (!phase || !phase._id)) {
			this.setState({ errorMsg: 'Please select a phase.' });
		} else {
			this.setState({ loading: true });
			fetch(URLS.backendUsers + '/updateAccount', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					name,
					username,
					mobileNumber,
					course,
					college,
					supergroup: currentSupergroup,
					phase: phase._id,
				}),
			})
				.then(res => res.json())
				.then(result => {
					//update user accordingly
					if (result.success) {
						this.props.updateUserData(result.user);
						this.fetchGroups();
						if (result.user.subscriptions) {
							const activePhase = getPhaseFromSubscription(
								result.user.subscriptions,
								currentSupergroup
							);
							if (activePhase && activePhase._id) {
								this.fetchServicePlans(activePhase._id);
							}
						}
						this.setState({ loading: false, success: true });
						clearUserApiResponseCache();
					} else {
						if (result.error.code === 'username-used') {
							this.setState({
								errorMsg: 'Username already used.',
								loading: false,
								success: false,
							});
						} else {
							this.setState({ loading: false, success: false });
						}
					}
				});
		}
	};

	fetchGroups = () => {
		fetch(`${URLS.backendGroups}/get`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateGroups(responseJson.groups);
					const currentSupergroup = localStorage.getItem('currentSupergroup');
					if (!currentSupergroup && responseJson.groups.length) {
						localStorage.setItem('currentSupergroup', responseJson.groups[0]._id);
					} else {
						let found = false;
						responseJson.groups.forEach(g => {
							if (g._id === currentSupergroup) found = true;
						});
						if (!found) {
							if (responseJson.groups.length) {
								localStorage.setItem('currentSupergroup', responseJson.groups[0]._id);
							} else {
								localStorage.removeItem('currentSupergroup');
							}
						}
					}
					window.onSupergroupChange();
				});
			} else {
			}
		});
	};

	fetchServicePlans = activePhaseId => {
		fetch(`${URLS.backendPayments}/service/plan/list/${activePhaseId}`, {
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
						this.props.updateServicePlans(responseJson);
					}
				});
			}
		});
	};

	handleChange = course => {
		if (course) {
			const phases = course.phases
				? course.phases.filter(phase => {
						if (phase.phase.hidden || !phase.phase.isOpenForEnrollment) {
							return false;
						} else {
							return true;
						}
				  })
				: [];
			if (phases.length === 1) {
				this.setState({
					phase: phases[0].phase,
					isCollegeRequired: course.isCollegeRequired,
					course: course._id,
					errorMsg: '',
				});
			} else {
				this.setState({
					course: course._id,
					isCollegeRequired: course.isCollegeRequired,
					errorMsg: '',
				});
			}
		}
	};

	handlePhaseChange = id => {
		const { course } = this.state;
		const phases = this.getPhases(course);
		phases.forEach(phase => {
			if (phase.phase._id === id) {
				this.setState({ phase: phase.phase, errorMsg: '' });
			}
		});
	};

	getPhases = course => {
		const { allunfilteredgroups } = this.state;
		const phases = [];
		allunfilteredgroups.forEach(ssg => {
			if (ssg.subgroup._id === course) {
				phases.push(...ssg.subgroup.phases);
			}
		});
		return phases;
	};

	render() {
		let { UserData } = this.props;
		const { allgroups, allunfilteredgroups } = this.state;
		let {
			email,
			name,
			username,
			mobileNumber,
			sharing,
			loading,
			success,
			errorMsg,
			course,
			phase,
			phaseId,
			isCollegeRequired,
			askForCollege,
			college,
		} = this.state;

		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const availableGroups = [];

		let selectedSubgroup = '';

		UserData.subscriptions.forEach(subscription => {
			if (subscription.group === currentSupergroup) {
				subscription.subgroups.forEach(sg => {
					if (sg.active) selectedSubgroup = sg.group;
				});
			}
		});

		const subgroupMap = {};
		const unfilteredSubgroupMap = {};
		const phases = this.getPhases(course);
		allgroups.forEach(ssg => {
			subgroupMap[ssg.subgroup._id] = ssg.subgroup.name;
			if (ssg.subgroup.name !== 'NOT_SET') availableGroups.push(ssg.subgroup);
		});
		allunfilteredgroups.forEach(ssg => {
			unfilteredSubgroupMap[ssg.subgroup._id] = ssg.subgroup.name;
			// if (ssg.subgroup.name !== 'NOT_SET') availableGroups.push(ssg.subgroup);
		});

		const collegeText =
			currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'College' : 'Course';

		const phaseMap = {};
		phases.forEach(ph => {
			phaseMap[ph.phase._id] = ph.phase;
		});

		const visiblePhases = phases.filter(phase => {
			if (phase.phase.hidden || !phase.phase.isOpenForEnrollment) {
				return false;
			} else {
				return true;
			}
		});

		const { profile } = window.config;

		// console.log('check phaseId', phaseId);

		return (
			<Card title="Profile Detail" style={{ marginBottom: 16 }}>
				<Form
					style={{ flex: 1, width: '100%' }}
					onFinish={this.save}
					layout="vertical"
				>
					<Form.Item label="Email">
						<Input placeholder="Email Address" disabled value={email} />
					</Form.Item>
					<Form.Item
						label={profile && profile.username ? profile.username : 'Username'}
					>
						<Input
							placeholder={profile && profile.username ? profile.username : 'Username'}
							disabled={UserData && UserData.username}
							value={username}
							onChange={this.handleUsername}
						/>
					</Form.Item>
					<Form.Item label="Name">
						<Input placeholder="Name" value={name} onChange={this.handleName} />
					</Form.Item>
					<Form.Item label="Phone No.">
						<Input
							placeholder="Phone"
							value={mobileNumber}
							onChange={this.handlePhone}
							type="number"
						/>
					</Form.Item>
					{Object.keys(subgroupMap).length ? (
						<Form.Item label={collegeText}>
							{phaseId ? (
								<Input value={unfilteredSubgroupMap[course]} disabled />
							) : (
								<SelectSubgroup
									labelClassName="form-item-label-profile"
									inputClassName="profile-input"
									listClassName="profile-details"
									supergroup={currentSupergroup}
									onChange={this.handleChange}
								/>
							)}
						</Form.Item>
					) : null}

					{askForCollege && isCollegeRequired ? (
						<Form.Item>
							<Input
								ref="college"
								placeholder="Enter college name"
								value={college}
								onChange={this.handleCollege}
							/>
						</Form.Item>
					) : null}

					{visiblePhases.length || (phaseId && phaseMap[phaseId]) ? (
						<Form.Item label="Phase">
							{phaseId && phaseMap[phaseId] ? (
								<Input
									value={`${phaseMap[phaseId].name} (${parseFullDate(
										phaseMap[phaseId].startDate
									)} - ${parseFullDate(phaseMap[phaseId].endDate)})`}
									disabled
								/>
							) : (
								<Select
									defaultValue="Choose a phase" //redundant?
									value={
										phase && phase.name
											? `${phase.name} (${parseFullDate(
													phase.startDate
											  )} - ${parseFullDate(phase.endDate)})`
											: 'Choose a phase'
									}
									onChange={this.handlePhaseChange}
									disabled={visiblePhases.length < 2}
								>
									{visiblePhases.map(ph => {
										return (
											<Option value={ph.phase._id} style={{ fontSize: 12 }}>
												{`${ph.phase.name} (${parseFullDate(
													ph.phase.startDate
												)} - ${parseFullDate(ph.phase.endDate)})`}
											</Option>
										);
									})}
								</Select>
							)}
						</Form.Item>
					) : null}

					{errorMsg ? (
						<Form.Item>
							<Alert type="error" message={errorMsg} />
						</Form.Item>
					) : null}
					<Form.Item style={{ marginBottom: 0 }}>
						<Button
							size="large"
							htmlType="submit"
							type="primary"
							loading={loading}
							disabled={loading || success}
							style={{ width: 120 }}
						>
							{loading ? 'Saving...' : success ? 'Saved!' : 'Save'}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		SuperGroups: state.api.SuperGroups,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateUserData: userData => dispatch(updateUserData(userData)),
		updateGroups: superGroups => dispatch(updateGroups(superGroups)),
		updateServicePlans: data => dispatch(updateServicePlans(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
