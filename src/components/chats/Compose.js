import { Form, Input } from 'antd';
import chatApi from 'apis/chat';
import React, { useState } from 'react';

function ChatCompose({ groupId, onSend }) {
	const [value, setValue] = useState('');
	const handleSendMessage = () => {
		if (!value || !value.trim()) {
			return;
		}
		setValue('');
		chatApi.postMessage(groupId, { text: value, type: 'text' }).then(() => {
			onSend();
		});
	};
	return (
		<Form onFinish={handleSendMessage}>
			<Form.Item style={{ marginBottom: 0 }}>
				<Input
					style={{
						width: '100%',
						borderRadius: 0,
						borderLeft: 'none',
						borderRight: 'none',
						minHeight: 48,
					}}
					placeholder="Type your message..."
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			</Form.Item>
			<button type="submit" style={{ display: 'none' }} />
		</Form>
	);
}

export default ChatCompose;
