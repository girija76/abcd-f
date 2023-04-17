import { get } from 'lodash';

export const isLite =
	!!window.config.useLiteIfPossible &&
	(window.sessionStorage.getItem('isPwa') ||
		window.matchMedia('standalone').matches ||
		navigator.userAgent.indexOf('PrepleafApp') > -1);

export const showELearning =
	window &&
	window.config &&
	window.config.FEATURES &&
	window.config.FEATURES.ENABLE_E_LEARNING
		? true
		: false;

export const showBookmarks =
	window &&
	window.config &&
	window.config.FEATURES &&
	window.config.FEATURES.ENABLE_BOOKMARKS_SHORTCUT
		? true
		: false;

export const paymentGatewayOptions =
	(window && window.config && window.config.paymentGatewayOptions) || {};

const getConfigValueForKey = (key, defaultValue) => {
	if (window && window.config && typeof window.config[key] !== 'undefined') {
		return window.config[key];
	}
	return defaultValue;
};

export const getConfig = (key, defaultValue) => {
	if (window && window.config) {
		return get(window.config, key, defaultValue);
	}
	return defaultValue;
};
export const clientAlias = getConfig('_id');
export const emailLogo = getConfigValueForKey('emailLogo');
export const name = getConfigValueForKey('name');
export const logoDark = getConfigValueForKey('logoDark');
export const wideLogo = getConfigValueForKey('logoWide', logoDark);
export const squareLogo = getConfig('logoSquare', logoDark);
export const appTopbarLogo = getConfig('appTopbarLogo', squareLogo || wideLogo);
export const squareCircleLogo = getConfig('logoSquareCircle');

export const themeColor = getConfig('themeColor', '#1976d2');

export const faq = getConfigValueForKey('faq');
export const isCBT = getConfig('isCBT');

export const hideUserJourney = getConfigValueForKey('hideFeatures', {})
	.userJourney;

export const resourceTypeLabels = getConfigValueForKey(
	'resourceTypeLabels',
	{}
);

export const whatsAppNumber = getConfigValueForKey('whatsAppNumber');

export const topbarLinks = getConfigValueForKey('topbarLinks', []);

export const competeTitle = getConfigValueForKey('competeTitle', 'Compete');

export const hideTestRecommendations = getConfigValueForKey(
	'hideTestRecommendations',
	false
);

export const subGroupLabel = getConfigValueForKey('subGroupLabel');
export const phaseLabel = getConfigValueForKey('phaseLabel', 'Phase');
export const showPhaseDates = getConfigValueForKey('showPhaseDates', true);
export const usernameSuffix = getConfigValueForKey('usernameSuffix', '');

export const features = getConfigValueForKey('FEATURES', {});

export const isRegistrationDisabled = features.DISABLE_SIGNUP;
export const isSignUpGoogleDisabled = !getConfig(
	'allowSignupWithGoogle',
	!features.DISABLE_SIGNUP_GOOGLE
);

const liteLandingPage = getConfigValueForKey('liteLandingPage', {});
export const liteLinks = liteLandingPage.links;
export const registrationMoreLinks = liteLandingPage.links;

export const signInText = getConfigValueForKey('signInText');

export const showReports = features.ENABLE_REPORTS;

export const hasServicesEnabled = !(features.SERVICES === false);
export const hasDashboardCardsEnabled = !(features.DASHBOARD_CARDS === false);
export const isUserGroupsEnabled = !(features.USER_GROUPS === false);
export const hideNavigation =
	isLite &&
	getConfigValueForKey(
		'hideNavigation',
		window.localStorage.hideNavigation === 'true' ? true : false
	);

export const environment = process.env.NODE_ENV;
export const isDev = environment === 'development';
export const isProduction = environment === 'production';
export const isStage = environment === 'staging';
export const isTest = environment === 'testing';

export const apiBaseUrl = window.apiBaseUrl;
export const apiCacheBaseUrl = window.apiCacheBaseUrl || apiBaseUrl;

export const accessMessage = getConfigValueForKey(
	'accessMsg',
	'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to support@prepleaf.com.'
);

export const accessMsgWithRevocationReason = getConfigValueForKey(
	'accessMsgWithRevocationReason',
	accessMessage
);

export const enableBatches = !!features.BATCHES;

export const tabSortOrder = getConfig('tabSortOrder');

export const lambdaApiEndpoint =
	process.env.NODE_ENV === 'production' && !isCBT
		? getConfigValueForKey('lambdaApiEndpoint', process.env.REACT_APP_LAMBDA_API)
		: null;
export const learningCenterConfig = getConfigValueForKey('learningCenter', {});

export const superGroups = getConfigValueForKey('supergroups', []);

export const clientId = getConfigValueForKey('clientId');

export const showServicePlansOnHome = getConfigValueForKey(
	'showServicePlansOnHome',
	false
);

export const topicTestsTitle = getConfig(
	['rename', 'topic-test', 'title'],
	'Topic Tests'
);

export const topicTestsShortTitle = getConfig(
	['rename', 'topic-test', 'shortTitle'],
	topicTestsTitle
);

export const topicTestSingularTitle = getConfig(
	['rename', 'topic-test', 'singular'],
	topicTestsTitle
);

export const sidebarConfig = getConfig(['sidebarCfg']);

export const enableAnnouncements = features.enableAnnouncements;
export const enableChats = features.enableChats;
export const enableForum = features.enableForum;

export const testConfig = getConfig('testCfg', {
	name: 'Tests',
	mobileName: 'Tests',
	url: 'compete',
});

export const sectionalTestCfg = getConfig('sectionalTestCfg', {
	name: 'Sectional Tests',
	mobileName: 'Sectional Tests',
	url: 'sectional-tests',
});

export const testsTabName = get(testConfig, 'name', 'Compete');
export const testsTabNameMobile = get(testConfig, 'mobileName', testsTabName);
export const testsDefaultUrl = get(testConfig, 'url', 'compete');
export const sectionalTestTabName = get(
	sectionalTestCfg,
	'name',
	'Sectional Tests'
);
export const sectionalTabNameMobile = get(
	sectionalTestCfg,
	'mobileName',
	sectionalTestTabName
);
export const sectionalTestDefaultUrl = get(
	sectionalTestCfg,
	'url',
	'sectional-tests'
);

const legacyHidePracticeConfig = getConfig('hidePractice', false);
const legacyHide = legacyHidePracticeConfig
	? { hide: true, title: 'Practice' }
	: null;
const defaultPractice = { hide: false, title: 'Practice' };
export const practice = getConfig('practice', legacyHide || defaultPractice);
export const practiceTabTitle = get(practice, 'title');
export const practiceTabTitleMobile = get(
	practice,
	'mobileTitle',
	practiceTabTitle
);
export const hidePractice = get(practice, 'hide');
export const showActivity = !getConfig(['hideFeatures', 'activity'], false);
export const showAccuracy = !getConfig(['hideStatistics', 'accuracy'], false);

export const showAssignments =
	!getConfig(['hideELearningFeatures', 'assignments'], false) &&
	getConfig(['FEATURES', 'ENABLE_E_LEARNING'], true);

export const showVideos =
	!getConfig(['hideELearningFeatures', 'videos'], false) &&
	getConfig(['FEATURES', 'ENABLE_E_LEARNING'], true);

export const showDocuments =
	!getConfig(['hideELearningFeatures', 'resources'], false) &&
	getConfig(['FEATURES', 'ENABLE_E_LEARNING'], true);

export const landingPage = getConfig('landingPageCfg');

export const emailLabel = getConfig(
	['landingPageCfg', 'labels', 'email'],
	'Email'
);

export const passwordLabel = getConfig(
	['landingPageCfg', 'labels', 'password'],
	'Password'
);

export const footer = getConfig('footer');
/**
 * True if download detector is enabled
 */
export const enableDetector = getConfig('enableDld');
export const enableScoreboard = getConfig('enableScoreboard');
export const learningCenterLabels = getConfig('learningCenterLabels', {
	Video: 'Videos',
	ResourceDocument: 'Files',
	Assignment: 'Assignments',
});

export const hasBusRoutes = getConfig(['busRoutes', 'enable'], false);
export const buses = getConfig(['busRoutes', 'buses'], []);

export const erp = getConfig('showErpFeatures', {
	leave: false,
	meeting: false,
});

export const axiosCfg = {
	withCredentials: true,
	headers: {
		authorization: `Token ${window.localStorage.getItem('token')}`,
	},
};
