import React from 'react';
import { get, has, sortBy } from 'lodash';

import { URLS } from '../urls.js';

import {
	HomeOutlined,
	FormOutlined,
	FileDoneOutlined,
	ContainerOutlined,
	AimOutlined,
	QuestionCircleOutlined,
	MessageOutlined,
} from '@ant-design/icons';
import { BsCalendar, BsCheckAll } from 'react-icons/bs';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import {
	testsDefaultUrl,
	enableAnnouncements,
	enableChats,
	enableForum,
	hidePractice,
	showELearning,
	tabSortOrder,
	testsTabName,
	topicTestsTitle,
	practiceTabTitle,
	hasBusRoutes,
} from 'utils/config';
import { AiOutlineFilePdf, AiOutlinePlayCircle } from 'react-icons/ai';
import AssignmentIcon from 'components/icons/AssignmentIcon.js';
import { FiUsers } from 'react-icons/fi';
import { isAtLeastMentor, isAtLeastModerator } from 'utils/auth.js';
import { FaUserTie } from 'react-icons/fa';
import { getPluralLabelForResourceType } from 'utils/playlist/index.js';
import { BiBusSchool } from 'react-icons/bi';

const homes = {
	default: URLS.home,
	cat: URLS.catHome,
	placement: URLS.placementHome,
	jee: URLS.jeeHome,
};

const practices = {
	default: URLS.practice,
	cat: URLS.catPractice,
	placement: URLS.placementPractice,
	jee: URLS.jeePractice,
};

const topics = {
	default: URLS.topicTests,
	cat: URLS.catTopicTests,
	placement: URLS.placementTopicTests,
	jee: URLS.jeeTopicTests,
};

const sections = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

const competes = {
	default: URLS.compete,
	cat: URLS.catCompete,
	placement: URLS.placementCompete,
	jee: URLS.jeeCompete,
};

const seriesUrls = {
	default: URLS.series,
	cat: URLS.catSeries,
	placement: URLS.placementSeries,
	jee: URLS.jeeSeries,
};

function getKey(mode, path) {
	let key_ = 'default';
	if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
	if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
	if (mode === 'demo' && path.indexOf('jee') !== -1) key_ = 'jee';
	return key_;
}

function getPhaseConfig(phase, key, defaultValue) {
	return get(phase, ['config', key], defaultValue);
}

const resourcesLabel = getPluralLabelForResourceType('ResourceDocument');
const videosLabel = getPluralLabelForResourceType('Video');
const assignmentsLabel = getPluralLabelForResourceType('Assignment');

const siderMenu = [
	{
		key: '107-1',
		text: videosLabel,
		icon: (
			<AiOutlinePlayCircle
				className="icon react-icons-icon anticon"
				style={{ fontSize: 18 }}
			/>
		),
		url: URLS.learningCenterVideoPlaylists,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': videosLabel,
		show: showELearning,
	},
	{
		key: '107-2',
		text: resourcesLabel,
		icon: (
			<AiOutlineFilePdf
				className="icon react-icons-icon anticon"
				style={{ fontSize: 18 }}
			/>
		),
		url: URLS.learningCenterResourceDocumentsPlaylists,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': resourcesLabel,
		show: showELearning,
	},
	{
		key: '107-3',
		text: assignmentsLabel,
		icon: <AssignmentIcon size={18} className="icon react-icons-icon anticon" />,
		url: URLS.learningCenterAssignmentPlaylists,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': assignmentsLabel,
		show: !showELearning,
	},
	{
		key: 'admin-users',
		text: 'Students',
		icon: <FiUsers size={18} className="icon react-icons-icon anticon" />,
		url: URLS.adminUserList,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': 'Students',
		show: function({ role }) {
			if (isAtLeastMentor(role)) {
				return true;
			}
			return false;
		},
	},
	{
		key: 'admin-teachers',
		text: 'Teachers',
		icon: <FaUserTie size={18} className="icon react-icons-icon anticon" />,
		url: URLS.adminTeacherList,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': 'Teachers',
		show: function({ role }) {
			if (isAtLeastModerator(role)) {
				return true;
			}
			return false;
		},
	},
	{
		key: 'admin-attendance',
		text: 'Attendance',
		icon: <BsCheckAll size={18} className="icon react-icons-icon anticon" />,
		url: URLS.adminAttendance,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': 'Attendance',
		show: function({ role }) {
			if (isAtLeastMentor(role)) {
				return true;
			}
			return false;
		},
	},
	{
		key: 'bus-routes',
		text: 'Buses',
		icon: <BiBusSchool size={18} className="icon react-icons-icon anticon" />,
		url: URLS.busRoutes,
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': 'Buses',
		show: hasBusRoutes,
	},
];

function getDefaultKey(mode) {
	let path = window.location.pathname;
	let key_ = getKey(mode, path);
	let defaultKey = '1';
	siderMenu.forEach(menuItem => {
		if (path.indexOf(menuItem.url) > -1) {
			defaultKey = menuItem.key;
		}
	});
	if (path.indexOf(homes[key_]) >= 0) {
		defaultKey = '1';
	} /**else if (path.indexOf(URLS.learn) >= 0) {
		defaultKey = '2';
	}*/ else if (
		path.indexOf(practices[key_]) >= 0
	) {
		defaultKey = '3';
	} else if (path.indexOf(competes[key_]) >= 0) {
		defaultKey = '4';
	} else if (path.indexOf(URLS.analysis) >= 0) {
		defaultKey = '5';
	} else if (path.indexOf(URLS.profile) >= 0) {
		defaultKey = '6';
	} else if (path.indexOf(URLS.activity) >= 0) {
		defaultKey = '7';
	} else if (path.indexOf(topics[key_]) >= 0) {
		defaultKey = '90';
	} else if (path.indexOf(sections[key_]) >= 0) {
		defaultKey = '91';
	} else if (path.indexOf(URLS.profileBookmarks) >= 0) {
		defaultKey = 'bookmarks';
	} else if (path.indexOf('/series-') >= 0) {
		defaultKey = 'series-' + path.split('/series-')[1].split('/')[0];
	} else if (path.indexOf('/reports') >= 0) {
		defaultKey = 'reports';
	} else if (path.indexOf(URLS.schedule) >= 0) {
		defaultKey = 'schedule';
	} else if (path.indexOf(URLS.forum) > -1) {
		defaultKey = 'forum';
	} else if (path.indexOf(URLS.announcements) > -1) {
		defaultKey = 'announcements';
	} else if (path.indexOf(URLS.chats) > -1) {
		defaultKey = 'chats';
	}
	return defaultKey;
}

export function getTabs(mode, activePhase, { role }) {
	let path = window.location.pathname;
	let key_ = getKey(mode, path);

	const tabs = [];
	tabs.push({
		key: '1',
		text: 'Home',
		icon: (
			<HomeOutlined className="anticon anticon-user" style={{ fontSize: 18 }} />
		),
		url: homes[key_],
		'data-ga-on': 'click,auxclick',
		'data-ga-event-action': 'click',
		'data-ga-event-category': 'Sidebar',
		'data-ga-event-label': 'Home',
	});

	const disablePracticeInPhase = getPhaseConfig(activePhase, 'disablePractice');
	if (!hidePractice && !disablePracticeInPhase) {
		tabs.push({
			key: '3',
			text: practiceTabTitle,
			icon: <FormOutlined style={{ fontSize: 18 }} />,
			url: practices[key_],
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Practice',
		});
	}

	if (activePhase.topicMocks) {
		tabs.push({
			key: '90',
			text: topicTestsTitle,
			icon: <FileDoneOutlined style={{ fontSize: 18 }} />,
			url: topics[key_],
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Topic Tests',
		});
	}

	if (activePhase.sectionalMocks) {
		tabs.push({
			key: '91',
			text: 'Sectional Tests',
			icon: <FileDoneOutlined style={{ fontSize: 18 }} />,
			url: sections[key_],
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Sectional Tests',
		});
	}

	if (activePhase.fullMocks || activePhase.liveTests) {
		tabs.push({
			key: '4',
			text: testsTabName,
			icon: <ContainerOutlined style={{ fontSize: 18 }} />,
			url: `/dashboard/${testsDefaultUrl}`,
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Compete',
		});
	}

	if (activePhase.series) {
		activePhase.series.forEach(series => {
			tabs.push({
				key: `series-${series
					.split(' ')
					.join('')
					.toLowerCase()}`,
				text: series,
				icon: <AimOutlined style={{ fontSize: 18 }} />,
				url: `${seriesUrls[key_]}-${series
					.split(' ')
					.join('')
					.toLowerCase()}`,
				'data-ga-on': 'click,auxclick',
				'data-ga-event-action': 'click',
				'data-ga-event-category': 'Sidebar',
				'data-ga-event-label': `Series-${series}`,
				new: true,
			});
		});
	}
	siderMenu.forEach(menuItem => {
		if (has(menuItem, 'show') && typeof menuItem.show === 'function') {
			if (menuItem.show({ role })) {
				tabs.push(menuItem);
			}
		} else if (menuItem.show !== false) {
			tabs.push(menuItem);
		}
	});

	if (activePhase.inferCoursePlan) {
		tabs.push({
			key: 'schedule',
			text: 'Schedule',
			icon: (
				<BsCalendar
					className="icon react-icons-icon anticon"
					style={{ fontSize: 18, padding: 1 }}
				/>
			),
			url: URLS.schedule,
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Schedule',
		});
	}
	const isForumEnabled = getPhaseConfig(activePhase, 'enableForum', enableForum);
	const isAnnouncementsEnabled = getPhaseConfig(
		activePhase,
		'enableAnnouncements',
		enableAnnouncements
	);
	const isChatsEnabled = getPhaseConfig(activePhase, 'enableChats', enableChats);
	if (isForumEnabled) {
		tabs.push({
			key: 'forum',
			text: 'Doubts',
			icon: <QuestionCircleOutlined />,
			url: URLS.forum,
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Forum',
		});
	}
	if (isAnnouncementsEnabled) {
		tabs.push({
			key: 'announcements',
			text: 'Announcements',
			icon: (
				<HiOutlineSpeakerphone
					className="icon react-icons-icon anticon"
					style={{ fontSize: 18 }}
				/>
			),
			url: URLS.announcements,
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Announcements',
		});
	}
	if (isChatsEnabled) {
		tabs.push({
			key: 'chats',
			text: 'Chats',
			icon: <MessageOutlined />,
			url: URLS.chats,
			'data-ga-on': 'click,auxclick',
			'data-ga-event-action': 'click',
			'data-ga-event-category': 'Sidebar',
			'data-ga-event-label': 'Chats',
		});
	}

	let sortedTabs = tabs;
	if (tabSortOrder) {
		sortedTabs = sortBy(tabs, tab => tabSortOrder[tab.key]);
	}

	const defaultKey = getDefaultKey(mode);

	return { tabs: sortedTabs, defaultKey };
}
