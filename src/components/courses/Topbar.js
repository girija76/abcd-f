import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { URLS } from '../urls';
import { logoDark, name } from 'utils/config';

const { Header } = Layout;

const Topbar = ({
	position = 'absolute',
	background,
	linkColor,
	isLoggedIn,
}) => {
	return (
		<Header
			style={{
				display: 'flex',
				position,
				zIndex: 1000,
				width: '100%',
				background: background || 'transparent',
			}}
		>
			<a href="/">
				<img alt={name} style={{ height: '40px' }} src={logoDark} />
			</a>
			<div style={{ flex: 1 }} />
			{isLoggedIn ? null : (
				<Link
					className="portal-link"
					to={URLS.landingPage}
					style={{ color: linkColor || 'white', margin: '0px 16px' }}
				>
					Login
				</Link>
			)}
			<div className="user-wrapper"></div>
		</Header>
	);
};
export default Topbar;
