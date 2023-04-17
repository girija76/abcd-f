import { get, has } from 'lodash';

import { URLS } from 'components/urls';

import {
	FileDoneOutlined,
	QuestionCircleOutlined,
	MessageOutlined,
} from '@ant-design/icons';
import { BsCalendar, BsCheckAll } from 'react-icons/bs';
import { HiOutlineDocumentReport, HiOutlineSpeakerphone } from 'react-icons/hi';
import {
	testsDefaultUrl,
	showELearning,
	testsTabName,
	topicTestsTitle,
	practiceTabTitle,
	isLite,
	showReports,
	showActivity,
	testsTabNameMobile,
	hidePractice,
	hasBusRoutes,
	erp,
	showAssignments,
	sectionalTestDefaultUrl,
	sectionalTestTabName,
} from 'utils/config';
import {
	AiOutlineFilePdf,
	AiOutlineLineChart,
	AiOutlinePlayCircle,
} from 'react-icons/ai';
import AssignmentIcon from 'components/icons/AssignmentIcon.js';
import { FiActivity, FiUsers } from 'react-icons/fi';
import { isAtLeast } from 'utils/auth.js';
import { FaUserTie } from 'react-icons/fa';
import { getPluralLabelForResourceType } from 'utils/playlist/index.js';
import {
	BiBusSchool,
	BiUserCircle,
	BiBookmarks,
	BiCalendar,
} from 'react-icons/bi';
import { createItemsById } from 'utils/store';
import {
	RiBook2Line,
	RiBoxingLine,
	RiDashboardLine,
	RiMenuLine,
	RiTestTubeLine,
} from 'react-icons/ri';
import { MdVideoCall } from 'react-icons/md';

const resourcesLabel = getPluralLabelForResourceType('ResourceDocument');
const videosLabel = getPluralLabelForResourceType('Video');
const assignmentsLabel = getPluralLabelForResourceType('Assignment');

const sidebarOrBottomBar = [
	'desktop-web-side',
	'mobile-app-bottom',
	'mobile-web-bottom',
	'mobile-web-full',
	'mobile-app-full',
];

function createCommonShowFunction(deviceAppLayouts, phaseConfigKey, visibleTo) {
	return function(deviceType, appType, layoutPart, activePhase, user) {
		const deviceAppLayout = `${deviceType}-${appType}-${layoutPart}`;
		if (deviceAppLayouts) {
			// if deviceAppLayouts is specified
			if (!deviceAppLayouts.includes(deviceAppLayout)) {
				return false;
			}
		}
		if (visibleTo) {
			if (!visibleTo.includes(user.role)) {
				return false;
			}
		}
		if (phaseConfigKey) {
			let phaseConfigFullKey = ['config'];
			let requiredValue = true;
			if (typeof phaseConfigKey === 'string') {
				phaseConfigFullKey.push(phaseConfigKey);
			} else if (!Array.isArray(phaseConfigKey)) {
				requiredValue = phaseConfigKey.value;
				if (typeof phaseConfigKey.key === 'string') {
					phaseConfigFullKey.push(phaseConfigKey.key);
				} else {
					phaseConfigFullKey = phaseConfigKey.key;
				}
			} else {
				phaseConfigFullKey = phaseConfigKey;
			}
			if (get(activePhase, phaseConfigFullKey, false) !== requiredValue) {
				return false;
			}
		}
		return true;
	};
}

const menuConfigFull = [
	{
		key: 'side',
		type: 'group',
		label: 'Side Menu',
		items: [
			'dashboard',
			'analysis-and-stats',
			'admin',
			'learn',
			'practice-and-work',
			'interact',
		],
		show: true,
	},
	{
		key: 'bottom',
		type: 'group',
		label: 'Bottom Menu',
		items: ['home', 'practice', 'mobile-learn', 'mobile-tests', 'more-mobile'],
		show: true,
	},
	{
		key: 'full',
		label: 'Full Menu',
		items: [
			'dashboard',
			'analysis-and-stats',
			'admin',
			'learn',
			'practice-and-work',
			'interact',
		],
		show: true,
		type: 'group',
	},
	{
		key: 'mobile-learn',
		text: 'Learn',
		icon: RiBook2Line,
		url: URLS.learningCenter,
		show: showELearning
			? createCommonShowFunction(
					['mobile-web-bottom', 'mobile-app-bottom'],
					null,
					['user', 'mentor']
			  )
			: false,
	},
	{
		key: 'mobile-tests',
		icon: RiTestTubeLine,
		text: testsTabNameMobile,
		url: `/dashboard/${testsDefaultUrl}`,
	},
	{
		key: 'more-mobile',
		icon: RiMenuLine,
		text: 'More',
		url: URLS.fullMenu,
	},
	{
		type: 'group',
		key: 'dashboard',
		label: 'Dashboard',
		items: ['home'],
		show: createCommonShowFunction(sidebarOrBottomBar),
	},
	{
		type: 'group',
		key: 'analysis-and-stats',
		label: 'Stats & Analysis',
		items: ['analysis', 'reports', 'activity'],
		show: createCommonShowFunction(sidebarOrBottomBar),
	},
	{
		type: 'group',
		key: 'learn',
		label: 'Learn',
		items: ['videos', 'resourceDocuments', 'assignments'],
		labels: {
			desktop: null,
		},
		show: createCommonShowFunction(sidebarOrBottomBar, null, [
			'user',
			'mentor',
			'moderator',
		]),
	},
	{
		type: 'group',
		key: 'practice-and-work',
		label: 'Execute',
		items: ['practice', 'topic-tests', 'sectional-tests', 'compete'],
		show: createCommonShowFunction(sidebarOrBottomBar, null, [
			'user',
			'mentor',
			'moderator',
		]),
	},
	{
		type: 'group',
		key: 'admin',
		label: 'Admin',
		items: [
			'admin-students',
			'admin-teachers',
			'admin-parents',
			'admin-attendance',
			'admin-assessments',
			'admin-leaves',
			// 'admin-meeting',
		],
		show: createCommonShowFunction(sidebarOrBottomBar, null, [
			'mentor',
			'moderator',
		]),
	},
	{
		type: 'group',
		key: 'interact',
		label: 'Interact',
		items: ['forum', 'announcements', 'chats'],
		show: createCommonShowFunction(sidebarOrBottomBar, null),
	},
	{
		key: 'home',
		text: 'Home',
		icon: RiDashboardLine,
		url: URLS.home,
	},
	{
		key: 'practice',
		text: practiceTabTitle,
		icon: RiBoxingLine,
		url: URLS.practice,
		show:
			!hidePractice &&
			createCommonShowFunction(
				sidebarOrBottomBar,
				{
					key: 'disablePractice',
					value: false,
				},
				['user']
			),
	},
	{
		key: 'videos',
		text: videosLabel,
		icon: AiOutlinePlayCircle,
		url: URLS.learningCenterVideoPlaylists,
		show: showELearning,
	},
	{
		key: 'resourceDocuments',
		text: resourcesLabel,
		icon: AiOutlineFilePdf,
		url: URLS.learningCenterResourceDocumentsPlaylists,
		show: showELearning,
	},
	{
		key: 'assignments',
		text: assignmentsLabel,
		icon: AssignmentIcon,
		url: URLS.learningCenterAssignmentPlaylists,
		show:
			showAssignments &&
			createCommonShowFunction(null, null, ['mentor', 'user', 'moderator']),
	},
	{
		key: 'student-meeting',
		text: 'Meeting',
		icon: MdVideoCall,
		url: URLS.meeting,
		show: erp.meeting === true && createCommonShowFunction(null, null, ['user']),
	},
	{
		key: 'admin-students',
		text: 'Students',
		icon: FiUsers,
		url: URLS.adminUserList,
		show: createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'admin-analysis',
		text: 'Analysis',
		icon: AiOutlineLineChart,
		url: URLS.adminAnalysis,
		show: createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'admin-parents',
		text: 'Parents',
		icon: FaUserTie,
		url: URLS.adminParentList,
		show: createCommonShowFunction(null, null, ['moderator']),
	},
	{
		key: 'admin-teachers',
		text: 'Teachers',
		icon: FaUserTie,
		url: URLS.adminTeacherList,
		show: createCommonShowFunction(null, null, ['moderator']),
	},
	{
		key: 'admin-attendance',
		text: 'Attendance',
		icon: BsCheckAll,
		url: URLS.adminAttendance,
		show: createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'admin-assessments',
		text: 'Assessments',
		icon: FileDoneOutlined,
		url: URLS.adminAssessments,
		show: createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'admin-leaves',
		text: 'Leaves',
		icon: BiCalendar,
		url: URLS.adminLeave,
		show:
			erp.leave === true &&
			createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'admin-meeting',
		text: 'Meeting',
		icon: MdVideoCall,
		url: URLS.meeting,
		show:
			erp.meeting === true &&
			createCommonShowFunction(null, null, ['mentor', 'moderator']),
	},
	{
		key: 'buses',
		text: 'Buses',
		icon: BiBusSchool,
		url: URLS.busRoutes,
		show: hasBusRoutes,
	},
	{
		key: 'topic-tests',
		text: topicTestsTitle,
		icon: FileDoneOutlined,
		url: URLS.topicTests,
		show: createCommonShowFunction(null, ['topicMocks']),
	},
	{
		key: 'sectional-tests',
		text: sectionalTestTabName,
		icon: FileDoneOutlined,
		url: `/dashboard/${sectionalTestDefaultUrl}`,
		show: createCommonShowFunction(null, ['sectionalMocks']),
	},
	{
		key: 'compete',
		text: testsTabName,
		icon: FileDoneOutlined,
		url: `/dashboard/${testsDefaultUrl}`,
		show: (...args) =>
			createCommonShowFunction(null, ['fullMocks'])(...args) ||
			createCommonShowFunction(null, ['liveTests'])(...args),
	},
	{
		key: 'schedule',
		text: 'Schedule',
		icon: BsCalendar,
		url: URLS.schedule,
		show: createCommonShowFunction(null, ['inferCoursePlan']),
	},
	{
		key: 'forum',
		text: 'Doubts',
		icon: QuestionCircleOutlined,
		url: URLS.forum,
		show: createCommonShowFunction(null, 'enableForum'),
	},
	{
		key: 'announcements',
		text: 'Announcements',
		icon: HiOutlineSpeakerphone,
		url: URLS.announcements,
		show: createCommonShowFunction(null, 'enableAnnouncements'),
	},
	{
		key: 'chats',
		text: 'Chats',
		icon: MessageOutlined,
		url: URLS.chats,
		show: createCommonShowFunction(null, 'enableChats'),
	},
	{
		url: URLS.analysis,
		icon: AiOutlineLineChart,
		text: 'Analysis',
		key: 'analysis',
		show: createCommonShowFunction(null, null, ['user']),
	},
	{
		key: 'reports',
		url: URLS.reports,
		icon: HiOutlineDocumentReport,
		text: 'Reports',
		show: showReports ? createCommonShowFunction(sidebarOrBottomBar) : false,
	},
	{
		url: URLS.activity,
		icon: FiActivity,
		text: 'Activity',
		key: 'activity',
		show: showActivity,
	},
	{
		url: URLS.profileBookmarks,
		icon: BiBookmarks,
		text: 'Bookmarks',
		key: 'bookmarks',
	},
	{
		url: URLS.profile,
		icon: BiUserCircle,
		text: 'Profile',
		key: 'profile',
	},
];

const menuConfigByKey = createItemsById(menuConfigFull, 'key');

function createItemVisibilityChecker(
	deviceType,
	appType,
	layoutPart,
	activePhase,
	user,
	mode
) {
	return function shouldShowMenuItem(menuItem) {
		if (has(menuItem, 'show') && typeof menuItem.show === 'function') {
			if (
				menuItem.show(deviceType, appType, layoutPart, activePhase, user, mode)
			) {
				return true;
			}
		} else if (menuItem.show !== false) {
			return true;
		}
		return false;
	};
}

function generateConfig(
	configOrConfigKey,
	deviceType,
	appType,
	layoutPart,
	activePhase,
	user,
	mode,
	itemVisibilityChecker
) {
	let config =
		typeof configOrConfigKey === 'string'
			? get(menuConfigByKey, configOrConfigKey)
			: configOrConfigKey;

	const shouldShowRaw = get(config, ['show']);
	let shouldShow = true;
	if (typeof shouldShowRaw === 'function') {
		shouldShow = itemVisibilityChecker(config);
	} else if (shouldShowRaw === false) {
		shouldShow = false;
	}
	if (!config) {
		throw new Error(`Menu config not present for :'${configOrConfigKey}'.`);
	}
	if (!shouldShow) {
		return null;
	}

	if (config.type === 'group') {
		const menu = config.items
			.map(item => {
				const menuItem = generateConfig(
					item,
					deviceType,
					appType,
					layoutPart,
					activePhase,
					user,
					mode,
					itemVisibilityChecker
				);

				return menuItem;
			})
			.filter(item => !!item);
		if (!menu.length) {
			// if no items
			return null;
		}
		return {
			label: config.label,
			key: config.key,
			items: menu,
		};
	} else {
		return config;
	}
}

export function getConfigGenerator(deviceType, layoutPart) {
	return function configGenerator(activePhase, user, mode) {
		const appType = isLite ? 'app' : 'web';
		const itemVisibilityChecker = createItemVisibilityChecker(
			deviceType,
			appType,
			layoutPart,
			activePhase,
			user,
			mode
		);
		return generateConfig(
			menuConfigByKey[layoutPart],
			deviceType,
			appType,
			layoutPart,
			activePhase,
			user,
			mode,
			itemVisibilityChecker
		);
	};
}
