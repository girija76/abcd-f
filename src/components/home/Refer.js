import React, { useRef, useState } from 'react';

import { notification, Button, Input } from 'antd';
import { CopyOutlined, SendOutlined } from '@ant-design/icons';

import { URLS } from '../urls.js';

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

const Refer = ({ referralCode, xp, uEmail }) => {
	const inputRef = useRef();
	const referralLink = `${window.location.origin}${URLS.landingPage}?code=${referralCode}`;
	const copyToClipboard = e => {
		console.log('copied');
		inputRef.current.select();
		document.execCommand('copy');
		e.target.focus();
	};

	const [email, setEmail] = useState('');

	const inviteThroughEmail = () => {
		if (!validateEmail(email)) {
			notification.warning({
				message: 'Please enter a valid email.',
				duration: 20,
			});
		} else if (email.toLowerCase() === uEmail.toLowerCase()) {
			notification.warning({
				message: 'You can not refer yourself!!.',
				duration: 20,
			});
		} else {
			fetch(`${URLS.backendUsers}/send-invitation`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					email,
					referralLink: referralLink,
				}),
			})
				.then(res => res.json())
				.then(result => {
					if (result.success) {
						notification.success({
							message:
								'We have sent the invitation to ' +
								email +
								'. It can take upto few minutes for the invitation to be delivered.',
							duration: 20,
						});
						setEmail('');
					} else {
						notification.error({
							message: 'Something went wrong. Please try after some time.',
							duration: 20,
						});
						setEmail('');
					}
				});
		}
	};

	return (
		<div>
			<style>
				{`
					.refer-copy-container{
						display: flex;
						align-items: stretch;
						border: solid 1px #dcdae0;
						border-radius: 5px;
						margin: 8px 0;
						overflow: hidden;
					}
					.refer-copy-input{
						padding: 8px 12px;
						border:none;
						background: trnsparent;
						flex-grow: 1;
					}
					.refer-copy-button{
						padding: 0 10px;
						border:none;
						border-left: solid 1px #dcdae0;
						background: transparent;
						cursor: pointer;
					}
				`}
			</style>
			<div>
				Earn 200 XP for each referred user. You can use XP to get discounts on
				premium features. Here is your referral link:
			</div>
			<div className="refer-copy-container">
				<input
					data-ga-on="focus"
					data-ga-event-action="copy"
					data-ga-event-category="Refer"
					data-ga-event-label="InputBox"
					ref={inputRef}
					onFocus={copyToClipboard}
					className="refer-copy-input"
					readOnly
					value={referralLink}
				/>
				<button
					data-ga-on="click"
					data-ga-event-action="copy"
					data-ga-event-category="Refer"
					data-ga-event-label="Clipboard Button"
					className="refer-copy-button"
					onClick={copyToClipboard}
				>
					<span style={{ padding: '0 4px' }}>
						<CopyOutlined />
					</span>
				</button>
			</div>
			<div
				style={{
					textAlign: 'center',
					marginBottom: 6,
					fontWeight: 500,
					fontSize: 13,
				}}
			>
				OR
			</div>
			<div style={{ display: 'flex' }}>
				<div style={{ flex: 1 }}>
					<Input.Search
						onSearch={inviteThroughEmail}
						enterButton={
							<Button
								data-ga-on="click"
								data-ga-event-action="click"
								data-ga-event-category="Refer"
								data-ga-event-label="Email Button"
								type={email ? 'primary' : undefined}
								icon={<SendOutlined />}
							/>
						}
						size="large"
						placeholder="Invite through email"
						value={email}
						onChange={e => {
							setEmail(e.target.value.trim());
						}}
						style={{ borderBottomRight: 0 }}
					/>
				</div>
			</div>
			{xp ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 4,
					}}
				>
					<div
						style={{
							fontSize: 28,
							marginRight: 4,
							fontWeight: 'bold',
							color: 'rgb(66, 154, 221)',
						}}
					>
						{xp}
					</div>
					<div style={{ color: 'rgb(0, 21, 41)', fontWeight: 'bold' }}>
						xp earned so far
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Refer;
