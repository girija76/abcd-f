import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/es/modal';
import Menu from 'antd/es/menu';
import Dropdown from 'antd/es/dropdown'; //use select
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import notification from 'antd/es/notification';
import { URLS } from '../urls';

import { DownOutline } from '@ant-design/icons';

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 5 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 12 },
	},
};

class VerifyDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			name: '',
			username: '',
			mobileNumber: '',
			usernameError: '',
			groupError: '',
			error: '',
			group: '',
		};
	}

	handleName = name => this.setState({ name: name.target.value });

	hasWhiteSpace = s => s.indexOf(' ') >= 0;

	handleUsername = username => {
		const uname = username.target.value;
		if (this.hasWhiteSpace(uname)) {
			this.setState({ usernameError: "Usernames can't contain spaces" });
		} else {
			this.setState({ usernameError: '' });
		}
		this.setState({ username: uname });
	};

	handlePhone = phone =>
		this.setState({
			mobileNumber: phone.target.value.replace(/^\s+|\s+$/g, ''),
			error: '',
		});

	checkMobileNumber = number => {
		const filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
		return filter.test(number) && number.length === 10;
	};

	updateUserDetails = () => {
		const { name, username, mobileNumber, group } = this.state;

		if (!this.checkMobileNumber(mobileNumber)) {
			this.setState({ error: 'Phone number is invalid' });
		} else if (username.indexOf(' ') >= 0) {
			this.setState({ usernameError: "Usernames can't contain spaces" });
		} else if (username.length < 6) {
			this.setState({
				usernameError: 'Usernames should be of atleast 6 characters',
			});
		} else if (group === '') {
			this.setState({
				groupError: 'Required',
			});
		} else {
			fetch(`${URLS.backendUsers}/completeProfile`, {
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
					group,
				}),
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						if (responseJson.error) {
							// put this in else
							this.setState({ usernameError: responseJson.error });
						} else {
							this.props.onVerify(responseJson.user);
							this.openNotification();
						}
					});
				}
			});
		}
	};

	openNotification = () => {
		notification.open({
			message: 'User details updated!',
			description: 'You can update these details again at dashboard > profile.',
			duration: 20,
			className: 'signup-successful',
		});
	};

	_handleKeyPress = e => {
		if (e.key === 'Enter') {
			this.updateUserDetails();
		}
	};

	getGroups = SuperGroups => {
		const groups = [];
		SuperGroups.forEach(sg => {
			sg.subgroups.forEach(subg => {
				if (subg.subgroup) {
					groups.push(subg.subgroup);
				}
			});
		});
		return groups;
	};

	getGroupMapping = groups => {
		const mapping = {};
		groups.forEach(group => {
			mapping[group._id] = group.name;
		});
		return mapping;
	};

	renderMenu = () => {
		const { SuperGroups } = this.props;
		const groups = [];
		SuperGroups.forEach(g => {
			g.subgroups.forEach(sg => {
				if (sg.subgroup) {
					groups.push(sg.subgroup);
				}
			});
		});
		return (
			<Menu>
				{groups.map(group => {
					return (
						<Menu.Item key={group._id} onClick={this.handleMenuClick}>
							{group.name}
						</Menu.Item>
					);
				})}
			</Menu>
		);
	};

	handleMenuClick = e => this.setState({ group: e.key });

	groupMap = () => {
		const { SuperGroups } = this.props;
		const Categories = [];
		const groupMap = {};
		Categories.forEach(c => {
			groupMap[c._id] = c.name;
		});
		return groupMap;
	};

	render() {
		const {
			name,
			username,
			mobileNumber,
			usernameError,
			error,
			group,
			groupError,
		} = this.state;
		const { SuperGroups } = this.props;
		const menu = this.renderMenu();
		const allGroups = this.getGroups(SuperGroups);
		const groupMap = this.getGroupMapping(allGroups);

		return (
			<Modal
				title="Confirm Details"
				visible={true}
				footer={[
					<Button
						key="details-verify-submit-button"
						type="primary"
						size="large"
						disabled={!name || !username || !mobileNumber || !group}
						onClick={this.updateUserDetails}
					>
						Confirm
					</Button>,
				]}
				onCancel={this.cancelSumbit}
				bodyStyle={{ padding: 0, paddingTop: 24 }}
				headStyle={{ borderBottom: '0px' }}
				style={{ color: 'blue' }}
				className="instructions-modal"
			>
				<Form>
					<FormItem {...formItemLayout} label="Name">
						<Input placeholder="Name" value={name} onChange={this.handleName} />
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Username"
						validateStatus={usernameError ? 'error' : ''}
						help={usernameError}
					>
						<Input
							placeholder="Username"
							value={username}
							onChange={this.handleUsername}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Phone"
						validateStatus={error ? 'error' : ''}
						help={error}
					>
						<Input
							placeholder="Phone"
							value={mobileNumber}
							onChange={this.handlePhone}
							onKeyPress={this._handleKeyPress}
						/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="Group"
						validateStatus={groupError ? 'error' : ''}
						help={groupError}
					>
						<Dropdown overlay={menu}>
							<Button>
								{group ? groupMap[group] : 'Select'} <DownOutline />
							</Button>
						</Dropdown>
					</FormItem>
				</Form>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		SuperGroups: state.api.SuperGroups,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyDetails);
