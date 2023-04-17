import { URLS } from 'components/urls';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logout } from 'utils/user';
import AccountSwitcher from './AccountSwitcher';
import { TopbarDropdownAccountSelector } from './AccountSwitcherComponents';
import { hasBusRoutes, showReports } from 'utils/config';
import {
	AiOutlineLogout,
	AiOutlineProfile,
	AiOutlineUser,
} from 'react-icons/ai';
import SwitchPhaseForAdmin from 'components/inputs/SwitchPhaseForAdmin';
import { isAtLeast } from 'utils/auth';
import { roleSelector } from 'selectors/user';
import { BiBusSchool } from 'react-icons/bi';

const superGroupNameSelector = state => state.api.SupergroupNames;

function ProfileDropdown({ mode, name, email, dp, onClose, subscriptions }) {
	const role = useSelector(roleSelector);
	const history = useHistory();
	const supergroupNames = useSelector(superGroupNameSelector);

	const filteredSubscriptions = useMemo(() => {
		const currentSupergroup = localStorage.getItem('currentSupergroup');
		return subscriptions
			? subscriptions.filter(subscription => {
					return subscription.group !== currentSupergroup;
			  })
			: [];
	}, [subscriptions]);

	return (
		<div style={{ width: 300 }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					padding: '12px 0px',
				}}
			>
				<div
					style={{
						minWidth: 64,
						minHeight: 64,
						maxHeight: 64,
						maxWidth: 64,
						marginLeft: 12,
						border: '1px solid #dcdae0',
						borderRadius: 1000,
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img
						alt=""
						src={
							mode === 'demo' ? 'https://avatars.dicebear.com/v2/bottts/julie.svg' : dp
						}
						width={64}
						height={64}
					/>
				</div>
				<div style={{ padding: '8px 15px' }}>
					<div
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							color: 'black',
							wordBreak: 'break-word',
						}}
					>
						{mode === 'demo' ? 'Julie Anne' : name}
					</div>
					<div style={{ wordBreak: 'break-word' }}>
						{mode === 'demo' ? 'julie@prepleaf.com' : email}
					</div>
				</div>
			</div>
			<div>
				{mode !== 'demo' ? (
					<>
						{filteredSubscriptions.map(subscription => {
							return (
								<button
									key={subscription.group}
									data-ga-on="click,auxclick"
									data-ga-event-action="click"
									data-ga-event-category="Topbar"
									data-ga-event-label="Logout"
									className="topbar-account-dropdown-button mobile-only"
									onClick={() => {
										localStorage.setItem('currentSupergroup', subscription.group);
										window.location.pathname = URLS.dashboard;
									}}
								>
									Switch to {supergroupNames[subscription.group]}
								</button>
							);
						})}
						<SwitchPhaseForAdmin style={{ width: '100%', borderRadius: 0 }} />
						<AccountSwitcher renderer={TopbarDropdownAccountSelector} />
						{showReports ? (
							<Link
								data-ga-on="click,auxclick"
								data-ga-event-action="click"
								data-ga-event-category="Topbar"
								data-ga-event-label="Reports"
								className="topbar-account-dropdown-button"
								onClick={onClose}
								to={URLS.reports}
							>
								<span className="text">My Reports</span>
								<AiOutlineProfile className="icon" />
							</Link>
						) : null}
					</>
				) : null}
				<Link
					className="topbar-account-dropdown-button"
					to={URLS.profile}
					onClick={onClose}
				>
					<span className="text">My Account</span>
					<AiOutlineUser className="icon" />
				</Link>
				{
					hasBusRoutes &&
					<Link
						className="topbar-account-dropdown-button"
						to={URLS.busRoutes}
						onClick={onClose}
					>
						<span className="text">Buses</span>
						<BiBusSchool className="icon" />
					</Link>
				}
				<button
					data-ga-on="click,auxclick"
					data-ga-event-action="click"
					data-ga-event-category="Topbar"
					data-ga-event-label="Logout"
					className="topbar-account-dropdown-button"
					onClick={() => {
						if (mode === 'demo') {
							history.push(URLS.landingPage);
						} else {
							logout();
							onClose();
						}
					}}
				>
					{mode === 'demo' ? (
						'Exit Demo'
					) : (
						<>
							<span className="text">Sign Out</span>
							<AiOutlineLogout className="icon" />
						</>
					)}
				</button>
			</div>
		</div>
	);
}

export default ProfileDropdown;
