import React from 'react';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import {
	isRegistrationDisabled,
	liteLinks,
	squareCircleLogo,
	squareLogo,
} from 'utils/config';
import './Lite.scss';
import classNames from 'classnames';

const LiteLandingPage = () => {
	const {
		landingPageCfg: { themeColor },
	} = window.config;

	return (
		<section className="lite-landing-page">
			<div className="top-wrapper">
				<div className="background-color-container">
					<div
						className="background-color"
						style={{ backgroundColor: themeColor }}
					/>
				</div>
				<div className="other-content-container">
					<h4>Welcome</h4>
					<div className="logo-container" style={{ borderColor: themeColor }}>
						<div className="logo-square">
							<div className="logo-positioner">
								<div className="logo-wrapper">
									<img
										className={classNames('logo', { 'is-circular': !!squareCircleLogo })}
										alt="Logo"
										src={squareCircleLogo || squareLogo}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="link-container">
				<Link className="link" to="/registration/sign_in">
					Sign In
				</Link>
				{isRegistrationDisabled ? null : (
					<Link className="link" to="/registration/sign_up">
						Don't have account? Sign Up
					</Link>
				)}
				{map(liteLinks, ({ href, target, text }, index) => (
					<a key={index} className="link" href={href} target={target}>
						{text}
					</a>
				))}
			</div>
		</section>
	);
};

export default LiteLandingPage;
