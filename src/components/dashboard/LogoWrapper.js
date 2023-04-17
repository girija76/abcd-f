import { URLS } from 'components/urls';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userSelector } from 'selectors/user';
import { name as clientName, sidebarConfig } from 'utils/config';

function getLogoStyle(logoStyle) {
	if (logoStyle) {
		return {
			overflow: 'hidden',
			...logoStyle,
		};
	}
	return {
		overflow: 'hidden',
	};
}

const {
	hide,
	logo,
	logoHeight,
	url,
	logoSmall,
	hardCodedCourseName,
	showClientName,
	hideSuperGroup,
	showProfile,
} = sidebarConfig;
const logoStyle = getLogoStyle(sidebarConfig.logoStyle);
const altText = `${clientName} logo`;

const LogoWrapper = ({ collapsed }) => {
	const currentSupergroup = localStorage.getItem('currentSupergroup');
	const user = useSelector(userSelector);
	const dp = useMemo(() => (user ? user.dp : ''), [user]);
	const SupergroupNames = useSelector(state => state.api.SupergroupNames);
	return (
		<div style={{ marginBottom: hideSuperGroup ? '' : '1rem' }}>
			{hide ? null : url ? (
				<a
					data-ga-on="click,auxclick"
					data-ga-event-action="click"
					data-ga-event-category="Sidebar"
					data-ga-event-label="Logo"
					href={url}
					className="prepleaf-logo-wrapper"
					style={{ cursor: 'pointer' }}
				>
					{collapsed ? (
						<div>
							{logoSmall ? (
								<div style={logoStyle}>
									<img src={logoSmall} alt={altText} height="100%" />
								</div>
							) : (
								<div
									style={{
										height: 62,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								></div>
							)}
						</div>
					) : (
						<div>
							<div style={logoStyle}>
								<img src={logo} alt={altText} height={logoHeight || '100%'} />
							</div>
						</div>
					)}
				</a>
			) : (
				<div>
					{collapsed ? (
						<div>
							{logoSmall ? (
								<div style={logoStyle}>
									<img src={logoSmall} alt={altText} height="100%" />
								</div>
							) : (
								<div
									style={{
										height: 62,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								></div>
							)}
						</div>
					) : (
						<div>
							<div style={logoStyle}>
								<img src={logo} alt={altText} height={logoHeight || '100%'} />
							</div>
						</div>
					)}
				</div>
			)}
			{showClientName && !collapsed ? (
				<div
					style={{
						color: '#313131',
						fontSize: 11,
						padding: '0px 20px',
						height: 16,
						marginTop: '1rem',
						textAlign: 'center',
					}}
				>
					{clientName}
				</div>
			) : null}
			{showProfile ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						padding: 12,
						borderBottom: 'solid 1px #eee',
						borderTop: !hide ? 'solid 1px #eee' : undefined,
					}}
				>
					<Link to={URLS.profile}>
						<img
							src={dp}
							alt="user profile"
							style={{ width: 48, borderRadius: 48 }}
						/>
					</Link>
				</div>
			) : null}
			{hideSuperGroup ? null : (
				<div
					style={
						collapsed
							? {
									color: '#313131',
									fontSize: 11,
									padding: '0px 11px',
									height: 16,
									justifyContent: 'center',
							  }
							: {
									color: '#313131',
									fontSize: 11,
									padding: '0px 20px',
									height: 16,
									marginTop: '1rem',
									textAlign: 'center',
							  }
					}
				>
					{!collapsed ? 'Course: ' : ''}
					{hardCodedCourseName || get(SupergroupNames, currentSupergroup)}
				</div>
			)}
		</div>
	);
};

export default LogoWrapper;
