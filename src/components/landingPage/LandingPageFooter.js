import React, { useState } from 'react';
import './LandingPageFooter.scss';

const data = require('../../gitInfo.txt');

const trackButtonClick = e => {};

const trackButton = e => {
	const label = e.target.innerText;

	trackButtonClick({
		event_category: 'footer-link',
		event_label: label,
	});
};

const LandingPageFooter = () => {
	const {
		name,
		companyLinks,
		otherLinks,
		productLinks,
		connectLinks,
	} = window.config;

	const [version, setVersion] = useState('');

	if (!version) {
		fetch(data).then(result => {
			result.text().then(d => {
				const dd = d.split('\n');
				if (dd.length >= 1) {
					setVersion(dd[0].split(' ')[0]);
				}
			});
		});
	}

	console.log('check version', version);

	return (
		<div className="landing-page-footer" style={{ padding: 24 }}>
			<div className="root">
				<div className="group-list">
					{companyLinks && companyLinks.length ? (
						<div className="group">
							<div className="group-title">Company</div>
							{companyLinks.map(link => {
								return (
									<div>
										<a onClick={trackButton} href={link.url} target={link.target}>
											{link.name}
										</a>
									</div>
								);
							})}
						</div>
					) : null}
					{otherLinks && otherLinks.length ? (
						<div className="group">
							<div className="group-title">Others</div>
							{otherLinks.map(link => {
								return (
									<div>
										<a onClick={trackButton} href={link.url} target={link.target}>
											{link.name}
										</a>
									</div>
								);
							})}
						</div>
					) : null}
					{productLinks && productLinks.length ? (
						<div className="group">
							<div className="group-title">Products</div>
							{productLinks.map(link => {
								return (
									<div>
										<a onClick={trackButton} href={link.url} target={link.target}>
											{link.name}
										</a>
									</div>
								);
							})}
						</div>
					) : null}
					{connectLinks && connectLinks.length ? (
						<div className="group">
							<div className="group-title">Connect</div>
							{connectLinks.map(link => {
								return (
									<div>
										<a
											onClick={trackButton}
											href={link.url}
											target={link.target}
											rel="noopener"
										>
											{link.name}
										</a>
									</div>
								);
							})}
						</div>
					) : null}
				</div>
				<div style={{ display: 'flex', marginTop: 20 }}>
					<div style={{ display: 'none', width: 80, fontSize: 9, opacity: 0.4 }}>
						{version ? 'v: ' + version : ''}
					</div>
					<div style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>
						Prepseed © 2022 All Rights Reserved
					</div>
					<div style={{ width: 80 }}></div>
				</div>
				<div style={{ height: 0, overflow: 'hidden' }}>
					{/*This is to make sign in crwalable for server side rendering */}
					<a href="/registration/sign_in">Sign In</a>
					<a href="/registration/sign_up">Sign Up</a>
					<a href="/registration/reset_password">Reset Password</a>
					<a href="/assessments">Assessments</a>
					<a href="/scholarship-test-registration">Assessments</a>
				</div>
			</div>
		</div>
	);
};

export default LandingPageFooter;
