import React from 'react';
import { URLS } from '../urls';

import PREPLEAF_LOGO from '../images/logo.svg';

import './style.css';

export class Topbar extends React.Component {
	render() {
		return (
			<div
				style={{ backgroundColor: '#282828', paddingTop: 24, paddingBottom: 18 }}
			>
				<div
					style={{
						margin: '0px 72px',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<div style={{ display: 'flex' }}>
						<a href="/">
							<img height={44} src={PREPLEAF_LOGO} alt="Prepleaf logo" />
						</a>
						<a
							style={{
								marginLeft: 40,
								marginRight: 10,
								padding: 10,
								color: 'white',
								fontSize: 18,
							}}
							href={URLS.landingPage}
							className="extra-items"
						>
							Preparation Portal
						</a>
						<a
							style={{
								marginLeft: 10,
								marginRight: 10,
								padding: 10,
								color: 'white',
								fontSize: 18,
							}}
							href={URLS.mentorshipPortal}
							className="extra-items"
						>
							Mentorship
						</a>
					</div>
					<div style={{ display: 'flex' }} className="extra-items">
						<a
							style={{
								marginLeft: 10,
								marginRight: 10,
								padding: 10,
								color: 'white',
								fontSize: 18,
							}}
							href={URLS.landingPage}
						>
							Login
						</a>
						<a
							className="link"
							style={{
								border: 'solid 1px',
								borderRadius: 40,
								marginLeft: 10,
								marginRight: 10,
								padding: 10,
								paddingLeft: 30,
								paddingRight: 30,
								textDecoration: 'none',
								fontSize: 18,
								color: 'white',
							}}
							href={URLS.landingPage}
						>
							Sign Up
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default Topbar;
