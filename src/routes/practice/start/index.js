import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { Spin } from 'antd';

import { start as startSession, endAllActive } from 'actions/session';
import { parseParamsFromURL } from 'utils/session';

import { LoadingOutlined } from '@ant-design/icons';

import './styles.scss';
import { clearUserApiResponseCache } from 'utils/user';

const StartPracticeSession = ({
	location: { search },
	startSession,
	endAllActive,
	history,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasFailed, setHasFailed] = useState(false);
	const [sessionId, setSessionId] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [errorCode, setErrorCode] = useState(null);
	const [previousActiveSessionId, setPreviousActiveSessionId] = useState('');
	const [isEndingAllActiveSessions, setIsEndingAllActiveSessions] = useState(
		false
	);
	const startNewSession = () => {
		clearUserApiResponseCache();
		try {
			const params = new URLSearchParams(search);
			const sessionParams = parseParamsFromURL(params);
			startSession(sessionParams)
				.then(body => {
					const { session } = body;
					setSessionId(session._id);
					setIsLoading(false);
					setHasFailed(false);
				})
				.catch(error => {
					setErrorMessage(error.message);
					try {
						const errorCode = error.code;
						setErrorCode(errorCode);
						setPreviousActiveSessionId(error.sessionId);
					} catch (e) {
						setErrorCode('unknown');
					}
					setHasFailed(true);
					setIsLoading(false);
				});
		} catch (e) {
			setErrorMessage('Invalid link');
			setHasFailed(true);
		}
	};
	useEffect(startNewSession, [search, startSession]);
	useEffect(() => {
		if (!isLoading && !hasFailed) {
			window.location = `/practice/active?s=${sessionId}`;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, hasFailed, sessionId]);

	const endAllActiveSessionsAndStartNew = () => {
		setIsEndingAllActiveSessions(true);
		endAllActive()
			.then(() => {
				startNewSession();
				setIsEndingAllActiveSessions(false);
			})
			.catch(e => {
				setIsEndingAllActiveSessions(false);
			});
	};
	const retryButton = (
		<button
			onClick={startNewSession}
			className={classnames('button', 'retry-button', 'primary')}
		>
			Retry
		</button>
	);
	const goBackToPracticeButton = (
		<Link
			to={`/dashboard/practice`}
			className={classnames('button', 'view-topics')}
		>
			Go back to practice
		</Link>
	);

	return (
		<div
			className={classnames('start-practice-session-root', {
				'is-loading': isLoading,
			})}
		>
			<div className="start-practice-session-content-wrapper">
				{isLoading || !hasFailed ? (
					<div className="start-practice-session-loading">
						<div style={{ width: '64px', height: 80 }}>
							<Spin indicator={<LoadingOutlined style={{ fontSize: '64px' }} />} />
						</div>
						<div>Curating questions for you</div>
					</div>
				) : (
					<div className="start-practice-session-content">
						<div className="start-practice-session-failed">
							<div className="error-message">{errorMessage}</div>
							<div className="action-list">
								{errorCode === 'session-in-progress' ? (
									<>
										{goBackToPracticeButton}
										<button
											onClick={endAllActiveSessionsAndStartNew}
											disabled={isEndingAllActiveSessions}
											className={classnames('button', 'end-previous-session')}
										>
											Start new session
										</button>
										<Link
											to={`/practice/active?s=${previousActiveSessionId}`}
											replace
											className={classnames(
												'button',
												'primary',
												'resume-previous-session'
											)}
										>
											Resume previous session
										</Link>
									</>
								) : (
									<>
										{retryButton}
										{goBackToPracticeButton}
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default withRouter(
	connect(null, { startSession, endAllActive })(StartPracticeSession)
);
