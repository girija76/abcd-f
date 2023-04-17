import React, { Component } from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import 'antd/lib/form/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

import { URLS } from '../urls.js';
import './styles.scss';

// const FormItem = Form.Item;

// const formItemLayout = {
// 	labelCol: {
// 		xs: { span: 24 },
// 		sm: { span: 5 },
// 	},
// 	wrapperCol: {
// 		xs: { span: 24 },
// 		sm: { span: 12 },
// 	},
// };

// const tailFormItemLayout = {
// 	wrapperCol: {
// 		xs: {
// 			span: 24,
// 			offset: 0,
// 		},
// 		sm: {
// 			span: 24,
// 			offset: 5,
// 		},
// 	},
// };

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 8 },
};
const formTailLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 8, offset: 4 },
};

class Reset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pass1: '',
			pass2: '',
			loading: false,
		};
	}

	handlePass1 = pass => {
		this.setState({ pass1: pass.target.value });
	};

	handlePass2 = pass => {
		this.setState({ pass2: pass.target.value });
	};

	checkSecure = pass => {
		if (pass.length < 6) {
			this.setState({ errNewPass1: 'Password should be at least 6 characters' });
			return false;
		} else {
			return true;
		}
	};

	update = () => {
		//add loader while password is updating
		let { pass1, pass2 } = this.state;
		const token = window.location.pathname.split('/')[2];
		if (pass1 !== pass2) {
			this.setState({ errNewPass2: 'Passwords do not match' });
		} else if (this.checkSecure(pass1)) {
			//update password here
			this.setState({ loading: true });
			fetch(URLS.backendUsers + '/resetPassword', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password: pass1, token: token }),
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.error) {
						// this.showErrors(responseJson.error)
						this.setState({ loading: false });
						this.setState({ loading: false });
					} else {
						//redirect
						this.setState({ loading: false });
						// this.setState({loading: false, success: true, currentPassword: "", pass1: "", pass2: ""})
					}
				})
				.catch(error => {});
		}
	};

	render() {
		let { pass1, pass2, loading } = this.state;
		return (
			<div
				style={{
					display: 'flex',
					width: '100vw',
					height: '100vh',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Form
					style={{
						border: '1px solid #d0d0d0',
						padding: '25px 35px',
						borderRadius: 3,
						width: 400,
					}}
				>
					<FormItem {...formItemLayout} label="New Password">
						<Input placeholder="Password" value={pass1} onChange={this.handlePass1} />
					</FormItem>

					<FormItem {...formItemLayout} label="Reenter Password">
						<Input
							placeholder="Reenter Password"
							value={pass2}
							onChange={this.handlePass2}
						/>
					</FormItem>

					<FormItem {...formTailLayout}>
						<Button
							size="large"
							onClick={this.update}
							type="primary"
							loading={loading}
							disabled={loading || !pass1 || !pass2}
							style={{ width: 120 }}
						>
							{loading ? 'Updating...' : 'Update'}
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

export default Reset;
