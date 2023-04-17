import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Hammer from 'hammerjs';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { MdMenu as MenuIcon } from 'react-icons/md';
import NavigationDrawer from './NavigationDrawer';
import useWindowScroll, {
	useIsWindowScrolled,
} from 'utils/hooks/useWindowScroll';
import { URLS } from 'components/urls';
import { appTopbarLogo } from 'utils/config';
import './AppTopbar.scss';

const userSelector = state => state.api.UserData;

function getStartPosition(e) {
	try {
		const delta_x = e.deltaX;
		const delta_y = e.deltaY;
		const final_x = e.center.x || e.srcEvent.pageX || e.srcEvent.screenX || 0;
		const final_y = e.srcEvent.pageY || e.srcEvent.screenY || 0;

		return {
			x: final_x - delta_x,
			y: final_y - delta_y,
		};
	} catch (e) {
		return { x: undefined, y: undefined };
	}
}
const Menu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const openNavigationDrawer = () => {
		setIsOpen(true);
	};
	const closeNavigationDrawer = () => {
		setIsOpen(false);
	};
	const handleSwipeRight = e => {
		e.preventDefault();
		const { x } = getStartPosition(e);
		//swipe right to open nav /* note the condition here */
		if (e.type === 'swiperight' && x >= 0 && x <= 64) {
			// open menu
			setIsOpen(true);
			//swiping left should slide out nav and/or sub-nav
		} else {
			// close/hide menu
			//setIsOpen(false);
		}
	};
	const handleSwipeLeft = e => {
		setIsOpen(false);
	};
	useEffect(() => {
		const swipe = new Hammer(document, { inputClass: Hammer.TouchInput });

		swipe.on('swiperight', handleSwipeRight);
		swipe.on('swipeleft', handleSwipeLeft);
		return () => {
			swipe.off('swipeleft', handleSwipeLeft);
			swipe.off('swiperight', handleSwipeRight);
		};
	}, []);

	return (
		<>
			<button
				className="menu-button"
				onMouseDown={openNavigationDrawer}
				onClick={openNavigationDrawer}
			>
				<MenuIcon style={{ fontSize: 32 }} />
			</button>
			<NavigationDrawer onClose={closeNavigationDrawer} visible={isOpen} />
		</>
	);
};

const { tpCfg, name } = window.config;
const logo = tpCfg && tpCfg.logo ? tpCfg.logo : 'black';
const AppTopbar = () => {
	const lastStablePosition = useRef(0);
	const lastStableTime = useRef(Date.now());
	const { dp } = useSelector(userSelector);
	const [hideAbove, setHideAbove] = useState(false);
	const isScrolled = useIsWindowScrolled();
	const { y: scrollPosition } = useWindowScroll();
	const { pathname, search } = useLocation();

	useEffect(() => {
		if (Date.now() - lastStableTime.current < 100) {
			if (Math.abs(scrollPosition - lastStablePosition.current) > 30) {
				if (scrollPosition > lastStablePosition.current && scrollPosition > 64) {
					setHideAbove(true);
				} else {
					setHideAbove(false);
				}
			}
		} else {
			lastStablePosition.current = scrollPosition;
			lastStableTime.current = Date.now();
		}
		if (scrollPosition < 100) {
			setHideAbove(false);
		}
		return () => {};
	}, [scrollPosition]);

	useEffect(() => {
		setHideAbove(false);
	}, [pathname, search]);

	return (
		<>
			<div className="app-topbar"></div>
			<div
				className={classnames('app-topbar fixed', {
					'with-shadow': isScrolled,
					'hide-above': hideAbove,
				})}
			>
				<div className="left-side">
					<Menu />
				</div>
				<div className="center-side">
					<Link to={URLS.dashboard}>
						<img className="logo" alt={`Logo of ${name}`} src={appTopbarLogo} />
					</Link>
				</div>
				<div className="right-side">
					<Link to={URLS.profile} className="user-dp-container">
						<Avatar className="user-dp" src={dp} alt="User Display Picture" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default AppTopbar;
