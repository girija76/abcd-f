import { Divider, Layout } from 'antd';
import classNames from 'classnames';
import { getConfigGenerator } from 'configs/navigation';
import { get, map } from 'lodash-es';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { activePhaseSelector, userSelector } from 'selectors/user';
import { isLite } from 'utils/config';
import LogoWrapper from './LogoWrapper';
import './sideNavigation.scss';

const { Sider } = Layout;

const SidebarNavigationItem = ({ item, collapsed }) => {
	const Icon = item.icon;
	const label = get(item, 'text', get);
	return (
		<NavLink
			to={item.url}
			data-ga-on={'click,auxclick'}
			data-ga-event-action="click"
			data-ga-event-category="Sidebar"
			data-ga-event-label={label}
			className="link"
			onClick={() => window.scrollTo(0, 0)}
		>
			{Icon ? (
				<span className="icon">
					<Icon />
				</span>
			) : null}
			{collapsed ? null : <span>{label}</span>}
		</NavLink>
	);
};

export function SidebarNavigationGroup({ group, collapsed }) {
	return (
		<div>
			{collapsed ? (
				<Divider />
			) : (
				<Divider orientation="left">{group.label}</Divider>
			)}
			<div>
				{group.items.map(item => {
					return (
						<SidebarNavigationItem key={item.key} item={item} collapsed={collapsed} />
					);
				})}
			</div>
		</div>
	);
}

function SideNavigation({ collapsed, mode }) {
	const user = useSelector(userSelector);

	let activePhase = useSelector(activePhaseSelector);
	const configGenerator = useMemo(
		() => getConfigGenerator('desktop', 'side'),
		[]
	);
	const sideConfig = useMemo(() => configGenerator(activePhase, user, mode), [
		activePhase,
		configGenerator,
		mode,
		user,
	]);

	if (isLite) {
		return null;
	}

	return (
		<Sider
			collapsible
			trigger={null}
			collapsed={collapsed}
			width={200}
			style={{
				paddingBottom: 64,
				overflow: 'auto',
				height: '100vh',
				position: 'fixed',
				left: 0,
				backgroundColor: '#fff',
				borderRight: 'solid 1px #d9dce0',
			}}
			className={classNames('side-navigation', { collapsed })}
		>
			<LogoWrapper collapsed={collapsed} />

			{map(get(sideConfig, 'items'), item => {
				return (
					<SidebarNavigationGroup
						group={item}
						collapsed={collapsed}
						key={item.key}
					/>
				);
			})}
		</Sider>
	);
}

export default SideNavigation;
