/**
Registration prompt should be used when user tries to take an action which requires authentication
 */
import React from 'react';
import RegistrationContent from './';
import Modal from 'antd/es/modal';

const RegistrationPrompt = ({
	title = 'You need to sign in to access this feature',
	visible,
	onCancel,
	usedIn,
}) => {
	return (
		<Modal
			title={title}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			width={700}
			bodyStyle={{ padding: 0 }}
		>
			<RegistrationContent
				noShadow
				autoMargin
				isFormWide
				defaultView="signup"
				gaCategory={`demo${usedIn ? `${usedIn}-` : ''}-prompt`}
				style={{ boxShadow: 'none', margin: 'auto' }}
			/>
		</Modal>
	);
};

export default RegistrationPrompt;
