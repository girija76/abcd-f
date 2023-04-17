import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { get, map } from 'lodash';
import { BiBookmarks, BiUserCircle } from 'react-icons/bi';
import humanparser from 'humanparser';
import { UserOutlined } from '@ant-design/icons';
import { Grid, Popover, Tooltip, Typography } from 'antd';
import { URLS } from 'components/urls';
import Notification from '../notification/Notification';
import { useBoolean } from 'use-boolean';
import { isLite, topbarLinks, name as clientName } from 'utils/config';
import AppTopbar from './AppTopbar';
import AccountSwitcher from './AccountSwitcher.js';
import './Topbar.scss';
import ProfileDropdown from './ProfileDropdown';
import SwitchPhaseForAdmin from 'components/inputs/SwitchPhaseForAdmin';

const { Text } = Typography;

const dDPColor = '#429add';
const dDSColor = '#ffffff';
const dMPColor = '#429add';
const dMSColor = '#ffffff';

const { tpCfg } = window.config;
const altText = `${clientName} logo`;
const dPColor = tpCfg && tpCfg.dPColor ? tpCfg.dPColor : dDPColor;
const dSColor = tpCfg && tpCfg.dSColor ? tpCfg.dSColor : dDSColor;
const mPColor = tpCfg && tpCfg.mPColor ? tpCfg.mPColor : dMPColor;
const mSColor = tpCfg && tpCfg.mSColor ? tpCfg.mSColor : dMSColor;
const logo = tpCfg && tpCfg.logo ? tpCfg.logo : 'black';
const logoStyle = tpCfg && tpCfg.logoStyle ? tpCfg.logoStyle : 'black';
const height = tpCfg && tpCfg.height ? tpCfg.height : 64;
const { centerLogoOnDesktop } = tpCfg;

const userSelector = state => state.api.UserData;

function generateGreetings() {
	var currentHour = parseInt(dayjs().format('HH'), 10);

	if (currentHour >= 3 && currentHour < 12) {
		return 'Good Morning';
	} else if (currentHour >= 12 && currentHour < 15) {
		return 'Good Afternoon';
	} else if (currentHour >= 15 && currentHour < 20) {
		return 'Good Evening';
	} else if (currentHour >= 20 && currentHour < 3) {
		return 'Good Night';
	} else {
		return 'Hello';
	}
}

const getFirstName = name => {
	if (!name) {
		return '';
	}
	const { firstName } = humanparser.parseName(name);
	return firstName;
};

const Topbar = ({ mode }) => {
	const [
		isProfileDropdownOpen,
		openProfileDropdown,
		closeProfileDropdown,
	] = useBoolean();
	const breakpoints = Grid.useBreakpoint();
	const { dp, email, name, subscriptions } = useSelector(userSelector);
	const [failedToLoadDp, setFailedToLoadDp] = useState(false);

	const firstName = useMemo(() => getFirstName(name), [name]);
	const showName = !breakpoints.xs && firstName;

	if (isLite) {
		return <AppTopbar />;
	}

	return (
		<div
			className="topbar-wrapper"
			style={{
				display: 'flex',
				height: height,
				alignItems: 'center',
				boxShadow: '0 1px 3px 0 rgba(0,0,0,.3)',
			}}
		>
			<div style={logoStyle} className="mobile-only">
				<img src={logo} alt={altText} height="100%" />
			</div>
			<div className="salutation" style={{ marginLeft: '1rem' }}>
				{generateGreetings()}, {firstName ? `${firstName}.` : '🤔'}
			</div>
			<div className="mobile-only" style={{ flex: 1 }} />
			<div style={{ flex: 1, height: '100%' }} className="desktop-only">
				{centerLogoOnDesktop ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
					>
						<span style={logoStyle}>
							<img
								height="100%"
								style={{ height: '100%' }}
								src={logo}
								alt={clientName}
							/>
						</span>
					</div>
				) : null}
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'stretch',
				}}
			>
				{map(topbarLinks, (item, index) => (
					<span
						style={{ marginRight: 12, lineHeight: 'normal', alignSelf: 'center' }}
						key={index}
					>
						<a
							data-ga-on="click"
							data-ga-event-action="open-dynamic-link"
							data-ga-event-category="Topbar"
							data-ga-event-label={get(item, 'label')}
							href={get(item, 'href')}
							className="topbar-dynamic-link"
						>
							{get(item, 'label')}
						</a>
					</span>
				))}
				<span className="desktop-only" style={{ paddingRight: 12 }}>
					<SwitchPhaseForAdmin />
					<AccountSwitcher />
				</span>
				<Notification mode={mode} />
				<Tooltip title="My Bookmarks">
					<span className="topbar-button-container">
						<Link
							to={URLS.profileBookmarks}
							data-ga-on="click"
							data-ga-event-action="click"
							data-ga-event-category="Topbar"
							data-ga-event-label="Bookmarks"
							className="topbar-button button-text-color"
						>
							<BiBookmarks size={24} />
						</Link>
					</span>
				</Tooltip>
				<style>
					{`
						.topbar-wrapper{
							background-color: ${mPColor};
						}
						.salutation, .button-text-color{
							color: ${mSColor};
						}
						.text-color-as-background{
							color: ${mPColor};
							background-color: ${mSColor};
						}
						.salutation{
							display: none;
						}
						.topbar-dynamic-link{
							display: inline-flex;
							align-items: center;
							opacity: 0.97;
							// background: rgba(255, 255, 255,  0.8);
							color: #000;
							color: rgba(255,255,255,0.95);
							padding: 8px 12px;
							height: 42px;
							line-height: normal;
							border-radius: 0px;
							transition: all ease 300ms;
							border:none;
							border-bottom: solid 2px transparent;
						}
						.topbar-dynamic-link:hover{
							opacity:1;
							background-color: transparent;
							border-bottom: solid 2px #fff;
							color: #fff;
						}
						@media only screen and (min-width: 900px) {
							.topbar-wrapper{
								background-color: ${dPColor};
							}
							.salutation, .button-text-color{
								color: ${dSColor};
							}
							.salutation{
								display: block;
							}
							.text-color-as-background{
								color: ${dPColor};
								background-color: ${dSColor};
							}
						}
					`}
				</style>
				<div className="topbar-button-container">
					<Popover
						visible={isProfileDropdownOpen}
						onVisibleChange={isOpen => {
							isOpen ? openProfileDropdown() : closeProfileDropdown();
						}}
						trigger="click"
						arrowPointAtCenter
						placement="bottomRight"
						overlayClassName="topbar-account-popover"
						content={
							<ProfileDropdown
								subscriptions={subscriptions}
								dp={dp}
								name={name}
								email={email}
								mode={mode}
								onClose={closeProfileDropdown}
							/>
						}
					>
						<button
							className="topbar-button button-text-color"
							style={{ opacity: 1 }}
						>
							{showName ? (
								<span
									style={{
										maxWidth: 80,
										height: 34,
										lineHeight: 'normal',
										display: 'flex',
										alignItems: 'center',
										padding: '0 8px 0 12px',
										paddingRight: failedToLoadDp ? 0 : 8,
										borderTopLeftRadius: '30px',
										borderBottomLeftRadius: '30px',
										borderTopRightRadius: 0,
										borderBottomRightRadius: 0,
									}}
									className="text-color-as-background"
								>
									<Text ellipsis style={{ color: 'inherit' }}>
										{firstName}
									</Text>
								</span>
							) : null}
							{mode === 'demo' || dp ? (
								<span
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: 34,
										height: 34,
										borderRadius: '50%',
										borderTopLeftRadius: showName ? 0 : '50%',
										borderBottomLeftRadius: showName ? 0 : '50%',
										overflow: 'hidden',
										backgroundColor: '#fff',
									}}
								>
									{failedToLoadDp ? (
										<BiUserCircle
											className="text-color-as-background"
											style={{ fontSize: 26 }}
										/>
									) : (
										<img
											onError={() => setFailedToLoadDp(true)}
											src={
												mode === 'demo'
													? 'https://avatars.dicebear.com/v2/bottts/julie.svg'
													: dp
											}
											alt="user"
											style={{ width: 28, maxHeight: 28, borderRadius: 100 }}
										/>
									)}
								</span>
							) : (
								<UserOutlined
									style={{
										fontSize: 20,
										border: '1px solid white',
										borderRadius: 1000,
										padding: 5,
									}}
								/>
							)}
						</button>
					</Popover>
				</div>
			</div>
		</div>
	);
};

export default Topbar;
