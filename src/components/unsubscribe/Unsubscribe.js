import React from 'react';

import { URLS } from '../urls';

import {
	LoadingOutlined,
	CheckCircleOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons';

class Unsubscribe extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: true,
			success: false,
			error: '',
		};
	}

	componentWillMount() {
		const chunks = window.location.pathname.split('/unsubscribe/');
		if (chunks.length >= 2) {
			fetch(`${URLS.backendUsers}/unsubscribe/${chunks[1]}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
				.then(resposne => {
					resposne
						.json()
						.then(resposneJson => {
							if (resposneJson.success) {
								this.setState({ loading: false, success: true });
							} else {
								this.setState({
									loading: false,
									error: 'Something wrong. Please contact support@prepleaf.com.',
								});
							}
						})
						.catch(() => {
							this.setState({
								loading: false,
								error: 'Something wrong. Please contact support@prepleaf.com.',
							});
						});
				})
				.catch(() => {
					this.setState({
						loading: false,
						error: 'Something wrong. Please contact support@prepleaf.com.',
					});
				});

			console.log('check chunks', chunks[1]);
		} else {
			this.setState({
				success: false,
				error: 'Invalid url. Please contact support@prepleaf.com.',
			});
		}
	}

	render() {
		const { loading, success, error } = this.state;
		return (
			<div
				style={{
					width: '100vw',
					height: '60vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{loading ? (
					<div>
						<LoadingOutlined style={{ marginRight: 4, fontSize: 18 }} /> Please wait
						while we are unsubscribing you from email notifications.
					</div>
				) : success ? (
					<div>
						<CheckCircleOutlined
							style={{ marginRight: 4, fontSize: 18, color: 'green' }}
						/>
						You have successfully unsubscribed from email notifications.
					</div>
				) : (
					<div>
						<ExclamationCircleOutlined
							style={{ marginRight: 4, fontSize: 18, color: 'red' }}
						/>
						{error}
					</div>
				)}
			</div>
		);
	}
}

export default Unsubscribe;
