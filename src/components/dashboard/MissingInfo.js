import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Alert, Select } from 'antd';
import { isEmpty } from 'lodash';

import SelectSubgroup from '../../routes/CompleteProfile/SelectSubgroup';
import {
	getCurrentSupergroup,
	checkMobileNumber,
	parseFullDate,
} from '../libs/lib';

import { URLS } from '../urls';

import {
	updateUserData,
	updateGroups,
	updateServicePlans,
} from '../api/ApiAction';
import './MissingInfo.scss';
import { phaseLabel, showPhaseDates, subGroupLabel } from 'utils/config';

import { getPhaseFromSubscription } from '../libs/lib';
import { clearUserApiResponseCache } from 'utils/user';

const { Option } = Select;

function getCourseAndPhaseBySupergroup(subscriptions, supergroup) {
	let course = '';
	let phase = '';
	subscriptions.forEach(subscription => {
		if (subscription.group === supergroup) {
			let activePhaseFound = false;
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(ph => {
					if (typeof ph.phase === 'object') {
						if (ph.active && !activePhaseFound) {
							course = sg.group;
							phase = ph.phase;
						}
					} else {
						course = sg.group;
						phase = { _id: ph.phase };
					}
				});
			});
		}
	});
	return { course, phase };
}

class MissingInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newUsername: '',
			newName: '',
			newCollege: '',
			newMobileNumber: '',
			isCollegeRequired: false,
			phase: {},
			phases: [],
			loading: false,
			errorMsg: '',
		};
	}

	shouldComponentUpdate() {
		return true;
	}

	handleName = name => {
		this.setState({
			newName: name.target.value,
			success: false,
		});
	};

	handleCollege = college => {
		this.setState({
			newCollege: college.target.value,
			errorMsg: '',
			success: false,
		});
	};

	handleUsername = uname => {
		this.setState({
			newUsername: uname.target.value.replace(/\s/g, ''),
			errorMsg: '',
			success: false,
		});
	};

	handlePhone = phone => {
		this.setState({
			newMobileNumber: phone.target.value,
			errorMsg: '',
			success: false,
		});
	};

	handleSubgroupChange = course => {
		if (!isEmpty(course)) {
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
					course: course._id,
					isCollegeRequired: course.isCollegeRequired,
					phases,
					errorMsg: '',
				});
			} else {
				this.setState({
					course: course._id,
					phases,
					phase: {},
					isCollegeRequired: course.isCollegeRequired,
					errorMsg: '',
				});
			}
		}
	};

	save = e => {
		e && e.preventDefault && e.preventDefault();
		const {
			UserData: { username, name, mobileNumber, subscriptions },
		} = this.props;

		const {
			newUsername,
			newName,
			newMobileNumber,
			isCollegeRequired,
			newCollege,
			course: newCourse,
			phase: newPhase,
		} = this.state;

		const currentSupergroup = getCurrentSupergroup();
		const { course, phase } = getCourseAndPhaseBySupergroup(
			subscriptions,
			currentSupergroup
		);

		const finalUsername = username ? username : newUsername;
		const finalName = name ? name : newName;
		const finalMobileNumber = mobileNumber ? mobileNumber : newMobileNumber;
		const finalCourse = course ? course : newCourse;
		const finalPhase = phase ? phase : newPhase;

		if (finalUsername.length < 6) {
			const { profile } = window.config;
			const msg =
				profile && profile.username
					? profile.username + ' should have atleast 6 characters.'
					: 'Username should have atleast 6 characters.';
			this.setState({ errorMsg: msg });
		} else if (finalMobileNumber && !checkMobileNumber(finalMobileNumber)) {
			this.setState({ errorMsg: 'Invalid phone number.' });
		} else if (!finalCourse) {
			const courseLabel =
				currentSupergroup === '5d10e42744c6e111d0a17d0a' ? 'college' : 'course';
			this.setState({ errorMsg: `Please select a ${courseLabel}.` });
		} else if (isCollegeRequired && !newCollege) {
			this.setState({ errorMsg: 'Please enter college name.' });
		} else if (!finalPhase || !finalPhase._id) {
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
					name: finalName,
					username: finalUsername,
					mobileNumber: finalMobileNumber,
					course: finalCourse,
					supergroup: currentSupergroup,
					college: newCollege,
					phase: finalPhase._id,
				}),
			})
				.then(res => res.json())
				.then(result => {
					//update user accordingly
					if (result.success) {
						this.props.onUpdate();
						this.props.updateUserData(result.user);
						this.fetchGroup(currentSupergroup);
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
							const { profile } = window.config;
							const errorMsg =
								profile && profile.username
									? profile.username + ' already used.'
									: 'Username already used.';
							this.setState({
								errorMsg,
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

	fetchGroup = supergroup => {
		fetch(`${URLS.backendGroups}/getOne/${supergroup}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.props.updateGroups(responseJson.groups);
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

	handlePhaseChange = id => {
		const { phases } = this.state;

		phases.forEach(phase => {
			if (phase.phase._id === id) {
				this.setState({ phase: phase.phase, errorMsg: '' });
			}
		});
	};

	render = () => {
		const {
			UserData: { username, name, mobileNumber, subscriptions, loading },
		} = this.props;

		const {
			newUsername,
			newName,
			newCollege,
			newMobileNumber,
			course,
			phase,
			phases,
			errorMsg,
			isCollegeRequired,
		} = this.state;

		const currentSupergroup = getCurrentSupergroup();

		const {
			phase: { _id: phaseId },
		} = getCourseAndPhaseBySupergroup(subscriptions, currentSupergroup);

		const courseLabel =
			currentSupergroup === '5d10e42744c6e111d0a17d0a'
				? 'College'
				: subGroupLabel || 'Course';

		const { profile } = window.config;

		const usernamePlaceholder = `Enter ${
			profile && profile.username ? profile.username : 'Username'
		}`;

		return (
			<Form
				labelAlign="left"
				labelCol={{ xs: { span: 24 }, md: { span: 5 } }}
				onFinish={this.save}
			>
				{!username ? (
					<Form.Item
						label={profile && profile.username ? profile.username : 'Username'}
					>
						<Input
							size="large"
							type="text"
							placeholder={usernamePlaceholder}
							value={newUsername}
							onChange={this.handleUsername}
						/>
					</Form.Item>
				) : null}
				{!name ? (
					<Form.Item label="Name">
						<Input
							size="large"
							ref="name"
							placeholder="Enter name"
							value={newName}
							onChange={this.handleName}
						/>
					</Form.Item>
				) : null}
				{!mobileNumber ? (
					<Form.Item label="Phone">
						<Input
							size="large"
							ref="mobile"
							placeholder="Enter phone number"
							value={newMobileNumber}
							onChange={this.handlePhone}
						/>
					</Form.Item>
				) : null}
				{!phaseId ? (
					<Form.Item label={courseLabel}>
						<SelectSubgroup
							size="large"
							labelClassName="form-item-label-profile"
							supergroup={currentSupergroup}
							onChange={this.handleSubgroupChange}
							courseLabel={courseLabel}
						/>
					</Form.Item>
				) : null}

				{isCollegeRequired ? (
					<Form.Item>
						<Input
							size="large"
							ref="college"
							placeholder="Enter college name"
							value={newCollege}
							onChange={this.handleCollege}
						/>
					</Form.Item>
				) : null}

				{!phaseId && course ? (
					<Form.Item label={phaseLabel}>
						<Select
							size="large"
							className="missing-info-phase-select-form-option"
							defaultValue="Choose a phase" //redundant?
							value={
								phase && phase.name
									? `${phase.name}${
											showPhaseDates
												? ` (${parseFullDate(phase.startDate)} - ${parseFullDate(
														phase.endDate
												  )})`
												: ''
									  }`
									: `Choose a ${phaseLabel}`
							}
							onChange={this.handlePhaseChange}
							disabled={phases.length < 2}
						>
							{phases.map(ph => {
								return (
									<Option
										key={ph.phase._id}
										value={ph.phase._id}
										className={'missing-info-phase-select-form-option'}
									>
										{ph.phase.name}
										{showPhaseDates
											? ` (${parseFullDate(ph.phase.startDate)} - ${parseFullDate(
													ph.phase.endDate
											  )})`
											: ''}
									</Option>
								);
							})}
						</Select>
					</Form.Item>
				) : null}

				{errorMsg ? (
					<Form.Item style={{ marginTop: 8, marginBottom: 8 }}>
						<Alert message={errorMsg} type="error" />
					</Form.Item>
				) : null}
				<Button
					htmlType="submit"
					type="primary"
					size="large"
					loading={loading}
					style={{ width: '100%' }}
				>
					Submit
				</Button>
			</Form>
		);
	};
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

const mapDispatchToProps = dispatch => ({
	updateUserData: userData => dispatch(updateUserData(userData)),
	updateGroups: superGroups => dispatch(updateGroups(superGroups)),
	updateServicePlans: data => dispatch(updateServicePlans(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MissingInfo);
