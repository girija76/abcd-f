import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import { URLS } from '../urls';

import { logout } from 'utils/user';

import './style.css';

const Assessment = ({
	isLoggedIn,
	accessAllowed,
	isAlreadyAttempted,
	isAvailableForPhase,
	assessmentCore,
	topicMap,
	assessmentWrapper,
}) => {
	const handleLogout = () => {
		logout(window.location.href);
	};

	const syllabus = assessmentCore.syllabus;

	let message = '';
	if (isLoggedIn && !isAvailableForPhase) {
		message =
			'This assessment is not available for the phase you have registerd for. Please login with another account.';
	}

	return (
		<div
			style={{
				padding: 24,
			}}
			className="assessment-action-wrapper"
		>
			<div
				style={{ display: 'flex', flexDirection: 'column' }}
				className="assessment-action-button-wrapper"
			>
				{message ? <div style={{ marginBottom: 12 }}>{message}</div> : null}
				{!isLoggedIn ? (
					<Link to={`${URLS.signIn}?redirect_url=${window.location.href}`}>
						<Button size="large" type="primary" style={{ width: 180 }}>
							Sign In
						</Button>
					</Link>
				) : !isAvailableForPhase ? (
					<Button
						size="large"
						type="primary"
						style={{ width: 180 }}
						onClick={handleLogout}
					>
						Logout
					</Button>
				) : !accessAllowed ? (
					<Button size="large" type="primary" style={{ width: 180 }}>
						Buy Now
					</Button>
				) : isAlreadyAttempted ? (
					<Link to={`${URLS.analysisId}/?wid=${assessmentWrapper._id}`}>
						<Button size="large" type="primary" style={{ width: 180 }}>
							View Analysis
						</Button>
					</Link>
				) : (
					<Link to={`${URLS.liveTest}/${assessmentWrapper._id}`}>
						<Button size="large" type="primary" style={{ width: 180 }}>
							Attempt Now
						</Button>
					</Link>
				)}
			</div>
			<div style={{ marginTop: 24 }}>
				<h2>Syllabus</h2>
				{syllabus.topics.map(t => {
					return (
						<div>
							<div style={{ fontWeight: 500 }}>{topicMap[t.id]}</div>
							<div style={{ paddingLeft: 8 }}>
								{t.subTopics.map(st => {
									return <div style={{ fontWeight: 500 }}>- {topicMap[st.id]}</div>;
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Assessment;
