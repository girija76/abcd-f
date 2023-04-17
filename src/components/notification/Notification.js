import React, { useEffect, useState } from 'react';
import { Popover, Tooltip } from 'antd';
import { LoadingOutlined, BellOutlined, BellFilled } from '@ant-design/icons';
import { URLS } from 'components/urls.js';
import './Notifications.scss';

const dDSColor = '#ffffff';
const dMSColor = '#ffffff';

const fetchUnreadCount = callback => {
	return fetch(`${URLS.backendNotifications}/unread?product=preparation`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Some error occurred');
			}
		})
		.then(res => {
			callback((res && res.items && res.items.length) || 0);
		})
		.catch(error => {
			callback();
		});
};

const updateLastSeenTime = (resolve, reject) => {
	return fetch(`${URLS.backendNotifications}/seen?product=preparation`, {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Some error occurred');
			}
		})
		.then(res => {
			resolve(res);
			return res;
		})
		.catch(error => {
			reject(error);
			return error;
		});
};

const fetchNotifications = (resolve, reject) => {
	return fetch(`${URLS.backendNotifications}/latest?product=preparation`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Error occurred while fetching notifications');
			}
		})
		.then(responseJson => {
			resolve(responseJson.items);
			return responseJson.items;
		})
		.catch(error => {
			reject(error);
			return error;
		});
};

const NotificationPanel = ({ notifications, notificationError }) => {
	const error = notificationError ? (
		<div style={{ padding: '12px', textAlign: 'center', color: '#f5222d' }}>
			{notificationError.message || notificationError}
		</div>
	) : null;
	return (
		<div
			style={{ margin: '-12px -16px', display: 'flex', flexDirection: 'column' }}
		>
			{error}
			{notifications && Array.isArray(notifications) ? (
				notifications.length > 0 ? (
					notifications.map((n, idx) => {
						const style = { padding: '12px', display: 'flex' };
						if (idx !== notifications.length - 1) {
							style.borderBottom = '1px solid #dadada';
						}
						let url = '';
						if (n.action.type === 'redirect-internal' && n.action.data.question) {
							url = `/review?id=${n.action.data.question}`;
						}
						if (
							n.action.type === 'redirect-solution-request' &&
							n.action.data.question
						) {
							url = `/submit-solution?id=${n.action.data.question}`;
						}
						return url ? (
							<a
								key={n._id}
								style={{ ...style, padding: '12px 16px' }}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
							>
								{n.content.data}
							</a>
						) : (
							<span key={n._id}>{n.content.data}</span>
						);
					})
				) : (
					<div style={{ padding: '12px' }}>No notifications</div>
				)
			) : error ? null : (
				<div style={{ padding: 12, textAlign: 'center' }}>
					<LoadingOutlined spinning style={{ fontSize: '24px' }} />
				</div>
			)}
		</div>
	);
};

const Notifications = ({ mode }) => {
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState();
	const [notificationFetchError, setNotificationFetchError] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [unreadCountFetchedAt, setUnreadCountFetchedAt] = useState();
	const [notificationsFetchedAt, setNotificationsFetchedAt] = useState();
	const [lastSeenUpdatedAt, setLastSeenUpdatedAt] = useState();
	const notificationsContent = (
		<NotificationPanel
			notifications={notifications}
			notificationError={notificationFetchError}
		/>
	);
	useEffect(() => {
		if (!isOpen && mode !== 'demo') {
			const lastFetchedAt = parseInt(window.sessionStorage.getItem('NFat'), 10);
			// 45 minute
			// don't fetch notifications on refreshing the same tab for 45 minutes
			if (lastFetchedAt + 60 * 1000 * 45 > Date.now()) {
				return;
			}
			fetchUnreadCount((...args) => {
				setUnreadCountFetchedAt(Date.now());
				setUnreadCount(...args);
				window.sessionStorage.setItem('NFat', Date.now());
			});
		}
	}, [isOpen, mode]);
	useEffect(() => {
		if (
			(notificationsFetchedAt
				? notificationsFetchedAt + 1000 < Date.now()
				: true) &&
			isOpen &&
			(!notifications ||
				(unreadCount && notificationsFetchedAt
					? notificationsFetchedAt < unreadCountFetchedAt
					: false))
		) {
			setNotificationFetchError(null);
			fetchNotifications((...args) => {
				setNotificationsFetchedAt(Date.now());
				setNotifications(...args);
			}, setNotificationFetchError);
		}
	}, [
		isOpen,
		unreadCount,
		notifications,
		notificationsFetchedAt,
		unreadCountFetchedAt,
	]);

	useEffect(() => {
		if (
			isOpen &&
			notificationsFetchedAt &&
			(lastSeenUpdatedAt ? notificationsFetchedAt > lastSeenUpdatedAt : true)
		) {
			const now = Date.now();
			updateLastSeenTime(
				() => {
					setUnreadCount(0);
					setLastSeenUpdatedAt(now);
				},
				() => {}
			);
		}
	}, [isOpen, lastSeenUpdatedAt, notificationsFetchedAt]);
	return (
		<div className="topbar-button-container">
			<Popover
				content={notificationsContent}
				trigger="click"
				visible={isOpen}
				onVisibleChange={state => {
					mode !== 'demo' && setIsOpen(state);
				}}
				placement="bottomRight"
				arrowPointAtCenter
				overlayClassName="notifications-tooltip"
			>
				<Tooltip title="My Notifications">
					<button
						style={{
							position: 'relative',
						}}
						className="topbar-button button-text-color"
					>
						{unreadCount ? (
							<span
								style={{
									position: 'absolute',
									top: '8px',
									right: '6px',
									lineHeight: 'normal',
									width: '18px',
									height: '18px',
									background: '#096dd9',
									borderRadius: '50%',
									textAlign: 'center',
									fontSize: '10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
								}}
							>
								{unreadCount}
							</span>
						) : null}
						{unreadCount > 0 ? (
							<BellFilled className="notification-icon" style={{ fontSize: 24 }} />
						) : (
							<BellOutlined className="notification-icon" style={{ fontSize: 24 }} />
						)}
					</button>
				</Tooltip>
			</Popover>
		</div>
	);
};

export default Notifications;
