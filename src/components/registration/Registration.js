/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';

import Button from 'antd/es/button';
import Input from 'antd/es/input';

import { URLS } from '../urls.js';

class Registration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			phone: '',
			email: '',
			password: '',
			medium: '',
			address: '',
			loading: false,
			submitted: false,
		};
	}

	submitForm = () => {
		const { name, phone, email, password, medium, address } = this.state;

		this.setState({ loading: true });
		fetch(URLS.backendQuery + '/add-registration', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				data: { name, phone, email, password, medium, address },
			}),
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					this.setState({
						name: '',
						phone: '',
						email: '',
						password: '',
						medium: '',
						address: '',
						loading: false,
						submitted: true,
					});
				} else {
					this.setState({ loading: false });
				}
			})
			.catch(error => {
				this.setState({ loading: false });
			});
	};

	render = () => {
		const {
			name,
			phone,
			email,
			password,
			medium,
			address,
			loading,
			submitted,
		} = this.state;

		const isEmpty = !name || !phone || !email || !password || !medium || !address;

		return (
			<div
				style={{
					backgroundColor: '#fafafa',
					minHeight: '100vh',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				{!submitted ? (
					<div
						style={{
							width: 720,
							backgroundColor: 'white',
							margin: 24,
							borderRadius: 8,
							border: '1px solid #dadada',
							padding: 48,
						}}
					>
						<h2>Foundation Scholarship Test Registration</h2>
						<div style={{ marginTop: 25 }}>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Name</div>
								<Input
									style={{ width: 360 }}
									value={name}
									onChange={e => {
										this.setState({ name: e.target.value });
									}}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Phone Number</div>
								<Input
									style={{ width: 360 }}
									value={phone}
									onChange={e => {
										this.setState({ phone: e.target.value });
									}}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Email Address</div>
								<Input
									style={{ width: 360 }}
									value={email}
									onChange={e => {
										this.setState({ email: e.target.value });
									}}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Password for Registration</div>
								<Input
									style={{ width: 360 }}
									value={password}
									onChange={e => {
										this.setState({ password: e.target.value });
									}}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Medium</div>
								<Input
									style={{ width: 360 }}
									value={medium}
									onChange={e => {
										this.setState({ medium: e.target.value });
									}}
								/>
							</div>
							<div style={{ marginBottom: 24 }}>
								<div style={{ fontWeight: 500 }}>Address</div>
								<Input
									style={{ width: 360 }}
									value={address}
									onChange={e => {
										this.setState({ address: e.target.value });
									}}
								/>
							</div>
							<Button
								type="primary"
								size="large"
								disabled={isEmpty}
								onClick={this.submitForm}
								loading={loading}
							>
								Submit
							</Button>
						</div>
					</div>
				) : (
					<div
						style={{
							width: 720,
							backgroundColor: 'white',
							margin: 24,
							borderRadius: 8,
							border: '1px solid #dadada',
							padding: 48,
							fontWeight: 500,
						}}
					>
						Your response has been submitted successfully! Please refresh the page to
						add another response.
					</div>
				)}
			</div>
		);
	};
}
export default Registration;
