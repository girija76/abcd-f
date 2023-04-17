import React from 'react';
import Input from 'antd/lib/input';
import Popover from 'antd/lib/popover';
import Button from 'antd/lib/button';
import Spin from 'antd/es/spin';

import { LoadingOutlined } from '@ant-design/icons';

import { URLS } from '../urls.js';
import { RiFeedbackLine } from 'react-icons/ri';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { TextArea } = Input;

export class SupportButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			message: '',
			messageError: '',
			supportView: 0,
		};
	}

	handleVisibleChange = visible => {
		this.setState({ visible });
		if (visible) this.setState({ supportView: 0, message: '', messageError: '' });
	};

	handleMessage = msg => {
		this.setState({ message: msg.target.value, messageError: '' });
	};

	handleMessageNext = () => {
		const { message } = this.state;
		if (message.trim()) {
			//show loader!!!
			const token = localStorage.getItem('token');
			fetch(URLS.backendUsers + '/support', {
				method: 'POST',
				body: JSON.stringify({
					msg: message,
				}),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Token ' + token,
				},
			})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({ supportView: 1 });
					setTimeout(() => {
						this.setState({ visible: false });
					}, 5000);
				})
				.catch(error => {
					console.log(error);
				});
		} else {
			this.setState({ messageError: 'Please enter message.' });
		}
	};

	render() {
		let { message, supportView, messageError } = this.state;

		const afterSent = 1
			? 'Thank you for your feedback.'
			: "We'll get back to you soon.";

		return (
			<div
				style={{ position: 'fixed', bottom: 0, right: '40px' }}
				className="feedback-wrapper"
			>
				<Popover
					content={
						supportView === 0 ? (
							<div style={{ minWidth: 240 }}>
								<TextArea
									rows={8}
									style={{ resize: 'none' }}
									onChange={this.handleMessage}
									value={message}
								/>
								<div
									style={{
										display: 'flex',
										paddingTop: 10,
										paddingRight: 3,
									}}
								>
									<div
										style={{
											flex: 1,
											fontSize: 11,
											color: 'red',
											lineHeight: '28px',
										}}
									>
										{messageError}
									</div>
									<Button
										type="primary"
										size="small"
										style={{
											borderRadius: 1000,
											fontSize: 12,
											height: 28,
											padding: '0px 12px',
											letterSpacing: '1.2px',
										}}
										onClick={this.handleMessageNext}
									>
										Send
									</Button>
								</div>
							</div>
						) : supportView === 1 ? (
							<div
								style={{
									minWidth: 240,
									height: 246,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{ fontWeight: 'bold', fontSize: 18, margin: 2 }}>
									Message sent!
								</div>
								<div style={{ fontSize: 13, margin: 2 }}>{afterSent}</div>
							</div>
						) : (
							<div
								style={{
									minWidth: 240,
									height: 216,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Spin indicator={antIcon} />
							</div>
						)
					}
					title={
						supportView === 0
							? 'Send us a message'
							: supportView === 1
							? ''
							: 'Sending message ...'
					}
					trigger="click"
					visible={this.state.visible}
					onVisibleChange={this.handleVisibleChange}
					placement="topRight"
				>
					<Button
						type="primary"
						style={{
							width: 160,
							borderRadius: 0,
							paddingTop: 12,
							paddingBottom: 13,
							height: 40,
							fontSize: 15,
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						className="dark-button"
						icon={<RiFeedbackLine style={{ fontSize: 18, marginRight: 4 }} />}
					>
						<span style={{ fontSize: 13 }}>Feedback</span>
					</Button>
				</Popover>
			</div>
		);
	}
}

export default SupportButton;
