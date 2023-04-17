import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Switch from 'antd/es/switch';
import Button from 'antd/es/button';
import './AccountSettings.css';

import { URLS } from '../urls.js';
import { clearUserApiResponseCache } from 'utils/user';

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

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 24,
			offset: 5,
		},
	},
};

class AccountSettings extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			mobileNumber: '',
			sharing: false,
			loading: false,
			success: false,
		};
	}

	componentWillMount() {
		let { UserData } = this.props;
		if (Object.keys(UserData).length) {
			this.setState({
				name: UserData.name,
				mobileNumber: UserData.mobileNumber,
				sharing: UserData.settings.sharing,
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.UserData != nextProps.UserData) {
			let { UserData } = nextProps;
			if (Object.keys(UserData).length) {
				this.setState({
					name: UserData.name,
					mobileNumber: UserData.mobileNumber,
					sharing: UserData.settings.sharing,
				});
			}
		}
	}

	handleName = name => {
		this.setState({
			name: name.target.value,
			success: false,
		});
	};

	handlePhone = phone => {
		this.setState({
			mobileNumber: phone.target.value,
			success: false,
		});
	};

	handleSharing = mode => {
		this.setState({
			sharing: mode,
			success: false,
		});
	};

	save = () => {
		//update store??. Atleast check if things are correct!
		let {
			UserData: { _id },
		} = this.props;
		let { name, mobileNumber, sharing } = this.state;
		this.setState({ loading: true });
		fetch(URLS.backendUsers + '/updateAccount', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				id: _id,
				name: name,
				mobileNumber: mobileNumber,
				sharing: sharing,
			}),
		})
			.then(res => res.json())
			.then(result => {
				//update user accordingly
				this.setState({ loading: false, success: true });
				clearUserApiResponseCache();
			});
	};

	render() {
		let { UserData } = this.props;
		let email = '';
		let username = '';
		if (Object.keys(UserData).length) {
			email = UserData.email;
			username = UserData.username;
		}
		let { name, mobileNumber, sharing, loading, success } = this.state;
		return (
			<Form>
				<FormItem {...formItemLayout} label="Email">
					<Input placeholder="Email Address" disabled={true} value={email} />
				</FormItem>

				<FormItem {...formItemLayout} label="Username">
					<Input placeholder="Username" disabled={true} value={username} />
				</FormItem>

				<FormItem {...formItemLayout} label="Name">
					<Input placeholder="Name" value={name} onChange={this.handleName} />
				</FormItem>

				<FormItem {...formItemLayout} label="Phone">
					<Input
						placeholder="Phone"
						value={mobileNumber}
						onChange={this.handlePhone}
					/>
				</FormItem>

				<FormItem {...formItemLayout} label="Public Sharing">
					<Switch size="small" checked={sharing} onChange={this.handleSharing} />
				</FormItem>

				<FormItem {...tailFormItemLayout}>
					<Button
						size="large"
						onClick={this.save}
						type="primary"
						loading={loading}
						disabled={loading || success}
						style={{ width: 120 }}
					>
						{loading ? 'Saving...' : success ? 'Saved!' : 'Save'}
					</Button>
				</FormItem>
			</Form>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
