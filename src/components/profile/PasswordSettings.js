import React, { Component } from 'react';
import Form from 'antd/es/form';
import { Card } from 'antd';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { URLS } from '../urls.js';
import './PasswordSettings.css';

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 12 },
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
			offset: 12,
		},
	},
};

class PasswordSettings extends Component {
	constructor() {
		super();
		this.state = {
			currentPassword: '',
			newPassword1: '',
			newPassword2: '',
			errCurrPass: '',
			errNewPass1: '',
			errNewPass2: '',
			loading: false,
			success: false,
		};
	}

	handleCurrentPassword = password => {
		this.setState({
			currentPassword: password.target.value,
			errCurrPass: '',
		});
	};

	handleNewPassword1 = password => {
		this.setState({
			newPassword1: password.target.value,
			errNewPass1: '',
			errNewPass2: '',
		});
	};

	handleNewPassword2 = password => {
		this.setState({
			newPassword2: password.target.value,
			errNewPass2: '',
		});
	};

	checkSecure = (currPass, newPass) => {
		if (newPass.length < 6) {
			this.setState({ errNewPass1: 'Password should be at least 6 characters' });
			return false;
		} else if (currPass === newPass) {
			this.setState({
				errNewPass1: 'New password can not be same as old password',
			});
			return false;
		} else {
			return true;
		}
	};

	showErrors = error => {
		if (error.code === 'auth/wrong-password') {
			this.setState({ errCurrPass: 'Incorrect password' });
		}
	};

	update = () => {
		//add loader while password is updating
		let { currentPassword, newPassword1, newPassword2 } = this.state;
		if (!currentPassword) {
			this.setState({ errCurrPass: 'Enter your current password' });
		} else if (newPassword1 !== newPassword2) {
			this.setState({ errNewPass2: 'Passwords do not match' });
		} else if (this.checkSecure(currentPassword, newPassword1)) {
			//update password here
			this.setState({ loading: true });

			fetch(URLS.backendUsers + '/updatePassword', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					currentPassword: currentPassword,
					newPassword: newPassword1,
				}),
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.error) {
						this.showErrors(responseJson.error);
						this.setState({ loading: false });
					} else {
						this.setState({
							loading: false,
							success: true,
							currentPassword: '',
							newPassword1: '',
							newPassword2: '',
						});
					}
				})
				.catch(error => {});
		}
	};

	render() {
		let {
			currentPassword,
			newPassword1,
			newPassword2,
			errCurrPass,
			errNewPass1,
			errNewPass2,
			loading,
			success,
		} = this.state;
		return (
			<Card title="Security">
				<Form style={{ width: '100%' }} layout="vertical">
					<FormItem
						label="Current Password"
						validateStatus={errCurrPass ? 'error' : ''}
						help={errCurrPass}
					>
						<Input
							placeholder="Current Password"
							value={currentPassword}
							type="password"
							onChange={this.handleCurrentPassword}
						/>
					</FormItem>

					<FormItem
						label="New Password"
						validateStatus={errNewPass1 ? 'error' : ''}
						help={errNewPass1}
					>
						<Input
							placeholder="New Password"
							value={newPassword1}
							type="password"
							onChange={this.handleNewPassword1}
						/>
					</FormItem>

					<FormItem
						label="Re-enter Password"
						validateStatus={errNewPass2 ? 'error' : ''}
						help={errNewPass2}
					>
						<Input
							placeholder="Re-enter Password"
							value={newPassword2}
							type="password"
							onChange={this.handleNewPassword2}
						/>
					</FormItem>

					<FormItem style={{ marginBottom: 0 }}>
						<Button
							size="large"
							onClick={this.update}
							type="primary"
							loading={loading}
							disabled={loading || success}
							style={{ width: 120 }}
						>
							{loading ? 'Updating...' : success ? 'Updated!' : 'Update'}
						</Button>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default PasswordSettings;
