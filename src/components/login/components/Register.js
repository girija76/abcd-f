import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import 'antd/lib/form/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

import { URLS } from '../../urls.js';

import '../ministyle.css';

class Register extends Component {
	render() {
		const {
			customHeaderComponent,
			landingPageCfg: { themeColor },
		} = window.config;

		if (customHeaderComponent === 'daswaniclasses') {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
					className="register-wrapper"
				>
					<div style={{ textAlign: 'center', color: '#888888', fontSize: 12 }}>
						Don't have an account?
						<Link to="/#signup">
							<span
								style={{
									textDecoration: 'underline',
									color: themeColor,
									marginLeft: 4,
								}}
								className="landscape-only"
							>
								Register
							</span>
						</Link>
					</div>
					<Link to="/#signup">
						<div
							style={{
								backgroundColor: themeColor,
								color: '#fafafa',
								width: '70vw',
								lineHeight: '42px',
								height: 42,
								borderRadius: 4,
								textAlign: 'center',
								marginTop: 8,
							}}
							className="potrait-only"
						>
							REGISTER
						</div>
					</Link>
				</div>
			);
		} else {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						// position: 'absolute',
						marginBottom: 24,
						width: '100%',
					}}
					className="register-wrapper"
				>
					<div style={{ textAlign: 'center', color: '#888888', fontSize: 12 }}>
						Don't have an account?{' '}
						<Link to="/#signup">
							<span style={{ textDecoration: 'underline', color: themeColor }}>
								Register
							</span>
						</Link>
					</div>
				</div>
			);
		}
	}
}

export default Register;
