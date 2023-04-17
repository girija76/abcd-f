import { getConfigGenerator } from 'configs/navigation';
import { get } from 'lodash-es';
import { useHistory, useRouteMatch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { activePhaseSelector, userSelector } from 'selectors/user';
import './bottomNavigation.scss';
import classNames from 'classnames';
import { isLite } from 'utils/config';

const Item = ({
	item,
	temporaryActiveTabKey,
	setTemporaryActiveTabKey,
	onIsSelected,
	style,
}) => {
	const { push } = useHistory();
	const Icon = item.icon;
	const routeMatch = useRouteMatch(item.url);
	const isTemporaryActive = temporaryActiveTabKey === item.key;
	const isActive = temporaryActiveTabKey ? isTemporaryActive : !!routeMatch;

	const handleClick = () => {
		setTemporaryActiveTabKey(item.key);
		push(item.url);
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		if (isActive) {
			onIsSelected();
		}
	}, [isActive, onIsSelected]);

	return (
		<button
			className={classNames('link', { active: isActive })}
			onClick={handleClick}
			style={style}
		>
			{Icon ? (
				<span className="icon-container">
					<Icon />
				</span>
			) : null}
			<span className="text">{get(item, 'text', get(item, 'label'))}</span>
		</button>
	);
};

function BottomNavigation({ mode }) {
	const user = useSelector(userSelector);

	let activePhase = useSelector(activePhaseSelector);

	const configGenerator = getConfigGenerator('mobile', 'bottom');
	const sideConfig = configGenerator(activePhase, user, mode);
	const tabs = sideConfig.items;
	const [temporaryActiveTabKey, setTemporaryActiveTabKey] = useState(null);

	useEffect(() => {
		if (temporaryActiveTabKey) {
			const timeoutId = setTimeout(() => {
				setTemporaryActiveTabKey(null);
			}, 200);
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [temporaryActiveTabKey]);
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const width = 60;
	const left = `calc( ${(100 * (activeTabIndex + 0.5)) /
		tabs.length}% - ${width / 2}px )`;
	return (
		<div
			className={classNames('bottom-navigation', { 'always-visible': isLite })}
		>
			<span
				className={classNames('active-tab-line')}
				style={{ left: left, width }}
			/>
			{tabs.map((tab, index) => {
				return (
					<Item
						style={{ width: `${100 / tabs.length}%` }}
						setTemporaryActiveTabKey={setTemporaryActiveTabKey}
						temporaryActiveTabKey={temporaryActiveTabKey}
						item={tab}
						onIsSelected={() => setActiveTabIndex(index)}
					/>
				);
			})}
		</div>
	);
}

export default BottomNavigation;
