import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { MdPermIdentity as PersonOutline } from 'react-icons/md';
import { MdPowerSettingsNew as SignOutIcon } from 'react-icons/md';
import { MdHelpOutline as HelpOutlineIcon } from 'react-icons/md';
import { MdBookmarkBorder as BookmarkOutlineIcon } from 'react-icons/md';
import { TiHome as HomeIcon } from 'react-icons/ti';
import { LineChartOutlined } from '@ant-design/icons';
import { GoZap as Zap } from 'react-icons/go';
import { GoBook as BookIcon } from 'react-icons/go';

import { URLS } from 'components/urls';
import { logout } from 'utils/user';
import { showELearning, faq } from 'utils/config';

import './styles.scss';
import AccountSwitcher from '../AccountSwitcher';
import { NavigationDrawerAccountSelector } from '../AccountSwitcherComponents';

const navigationDrawerRoot = document.body;
const userSelector = state => state.api.UserData;

const NavigationDrawer = ({ visible, onClose }) => {
	const [isOpening, setIsOpening] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [isClosed, setIsClosed] = useState(true);
	const [isReadyToOpen, setIsReadyToOpen] = useState(false);
	const { dp, email, name, xp } = useSelector(userSelector);

	const handleListClick = e => {
		// if (e.target.tagName.toLowerCase() === 'a' && e.target.getAttribute('href')) {
		onClose();
		// }
	};
	useEffect(() => {
		if (visible) {
			setIsClosed(false);
			setIsReadyToOpen(true);
			requestAnimationFrame(() => {
				setIsOpening(true);
				setTimeout(() => {
					setIsReadyToOpen(false);
					setIsOpening(false);
				}, 10);
			});
		} else {
			setIsClosing(true);
			setTimeout(() => {
				setIsClosing(false);
				setIsClosed(true);
			}, 200);
		}
	}, [visible]);
	return (
		<div
			className={classnames('app-navigation-drawer', {
				visible: !isClosed,
				'is-opening': isOpening,
				'is-closing': isClosing,
				'is-closed': isClosed,
				'ready-to-open': isReadyToOpen,
			})}
		>
			<div onClick={onClose} className="panel-close-helper"></div>
			<div className="main-content">
				<div className="user-info-wrapper">
					<div className="avatar-container">
						<Avatar src={dp} size={64} />
					</div>
					<div className="user-info">
						<div className="item name">
							<span className="text">{name}</span>
						</div>
						<div className="item">
							<span className="text">{email}</span>
						</div>
						<div className="item">
							<Zap />
							<span className="text">{Math.floor(xp.net)}</span>
						</div>
					</div>
				</div>
				<div onClick={handleListClick} className="list">
					<Link to={URLS.dashboard} className="list-item">
						<HomeIcon className="icon" />
						<span className="text">Home</span>
					</Link>
					<Link
						to={URLS.learningCenter}
						className={classnames('list-item', {
							hidden: !showELearning,
						})}
					>
						<BookIcon className="icon" />
						<span className="text">Learning Center</span>
					</Link>
					<Link to={URLS.analysis} className="list-item">
						<LineChartOutlined className="icon" />
						<span className="text">Analysis</span>
					</Link>
					<Link to={URLS.profileBookmarks} className="list-item">
						<BookmarkOutlineIcon className="icon" />
						<span className="text">Bookmarks</span>
					</Link>
					<Link to={URLS.profile} className="list-item">
						<PersonOutline className="icon" />
						<span className="text">My Profile</span>
					</Link>
					<button className="list-item" onClick={logout}>
						<SignOutIcon className="icon" />
						<span className="text">Sign Out</span>
					</button>
					<div className="list-item-divider"></div>
					<div class="list-item">
						<AccountSwitcher renderer={NavigationDrawerAccountSelector} />
					</div>
					<div className="list-item-divider" />
					{faq ? (
						<a className="list-item" href={faq}>
							<HelpOutlineIcon className="icon" />
							<span className="text">Help</span>
						</a>
					) : null}
				</div>
			</div>
		</div>
	);
};

class NavigationDrawerPortal extends React.Component {
	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		navigationDrawerRoot.appendChild(this.el);
	}

	componentWillUnmount() {
		navigationDrawerRoot.removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal(<NavigationDrawer {...this.props} />, this.el);
	}
}

export default NavigationDrawerPortal;
