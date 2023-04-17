import { apiBaseUrl, apiCacheBaseUrl } from 'utils/config';

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

let subdomain1 = '';
let subdomain2 = '';
let subdomain3 = '';
if (process.env.REACT_APP_ENV === 'staging') {
	subdomain1 = 'https://cat.staging.prepleaf.com/';
	subdomain2 = 'https://jobs.staging.prepleaf.com/';
	subdomain3 = 'https://jee.staging.prepleaf.com/';
} else if (process.env.REACT_APP_ENV === 'production') {
	subdomain1 = 'https://cat.prepleaf.com/';
	subdomain2 = 'https://jobs.prepleaf.com/';
	subdomain3 = 'https://jee.prepleaf.com/';
} else {
	subdomain1 = PUBLIC_URL;
	subdomain2 = PUBLIC_URL;
	subdomain3 = PUBLIC_URL;
}

export const URLS = {
	prepleaf: 'https://www.prepleaf.com',
	workshops: 'https://www.prepleaf.com/workshops',
	landingPage: PUBLIC_URL,
	registration: `${PUBLIC_URL}registration`,
	scholarship: `${PUBLIC_URL}scholarship-test-registration`,
	signUp: `${PUBLIC_URL}registration/create_account`,
	signIn: `${PUBLIC_URL}registration/sign_in`,
	courses: `${PUBLIC_URL}courses`,
	resources: `${PUBLIC_URL}resources`,
	iiftScore: `${PUBLIC_URL}iift-score-calculator`,
	dashboard: PUBLIC_URL + 'dashboard',
	//

	catDashboard: PUBLIC_URL + 'demo/cat',
	placementDashboard: PUBLIC_URL + 'demo/placement',
	jeeDashboard: PUBLIC_URL + 'demo/jee',

	catDashboard_: subdomain1 + 'demo/cat',
	placementDashboard_: subdomain2 + 'demo/placement',
	jeeDashboard_: subdomain3 + 'demo/jee',

	//
	home: PUBLIC_URL + 'dashboard/home',
	catHome: PUBLIC_URL + 'demo/cat/home',
	placementHome: PUBLIC_URL + 'demo/placement/home',
	jeeHome: PUBLIC_URL + 'demo/jee/home',
	learn: PUBLIC_URL + 'dashboard/learn',
	catLearn: PUBLIC_URL + 'demo/cat/learn',
	placementLearn: PUBLIC_URL + 'demo/placement/learn',
	jeeLearn: PUBLIC_URL + 'demo/jee/learn',
	practice: PUBLIC_URL + 'dashboard/practice',
	catPractice: PUBLIC_URL + 'demo/cat/practice',
	placementPractice: PUBLIC_URL + 'demo/placement/practice',
	jeePractice: PUBLIC_URL + 'demo/jee/practice',

	topicTests: PUBLIC_URL + 'dashboard/topic-tests',
	catTopicTests: PUBLIC_URL + 'demo/cat/topic-tests',
	placementTopicTests: PUBLIC_URL + 'demo/placement/topic-tests',
	jeeTopicTests: PUBLIC_URL + 'demo/jee/topic-tests',

	sectionalTests: PUBLIC_URL + 'dashboard/sectional-tests',
	catSectionalTests: PUBLIC_URL + 'demo/cat/sectional-tests',
	placementSectionalTests: PUBLIC_URL + 'demo/placement/sectional-tests',
	jeeSectionalTests: PUBLIC_URL + 'demo/jee/sectional-tests',

	mocks2: PUBLIC_URL + 'dashboard/compete/mocks',
	catMocks2: PUBLIC_URL + 'demo/cat/compete/mocks',
	placementMocks2: PUBLIC_URL + 'demo/placement/compete/mocks',
	jeeMocks2: PUBLIC_URL + 'demo/jee/compete/mocks',

	mocks: PUBLIC_URL + 'dashboard/mocks',
	mocksSectional: PUBLIC_URL + 'dashboard/mocks/sectional',
	mocksSectional2: PUBLIC_URL + 'dashboard/mocks/sectional2',
	catMocks: PUBLIC_URL + 'demo/cat/mocks',
	placementMocks: PUBLIC_URL + 'demo/placement/mocks',
	jeeMocks: PUBLIC_URL + 'demo/jee/mocks',

	compete: PUBLIC_URL + 'dashboard/compete',
	catCompete: PUBLIC_URL + 'demo/cat/compete',
	placementCompete: PUBLIC_URL + 'demo/placement/compete',
	jeeCompete: PUBLIC_URL + 'demo/jee/compete',

	series: PUBLIC_URL + 'dashboard/series',
	catSeries: PUBLIC_URL + 'demo/cat/series',
	placementSeries: PUBLIC_URL + 'demo/placement/series',
	jeeSeries: PUBLIC_URL + 'demo/jee/series',

	eLearning: PUBLIC_URL + 'dashboard/e-learning',
	missed: PUBLIC_URL + 'dashboard/compete/missed',
	attempted: PUBLIC_URL + 'dashboard/compete/attempted',
	analysis: PUBLIC_URL + 'dashboard/analysis',
	reports: PUBLIC_URL + 'dashboard/reports',
	analysisTests: PUBLIC_URL + 'dashboard/analysis/tests',
	profile: PUBLIC_URL + 'dashboard/profile',
	activity: PUBLIC_URL + 'dashboard/activity',
	practiceTest: PUBLIC_URL + 'practicetest',
	completeProfile: PUBLIC_URL + 'complete-profile',
	liveTest: PUBLIC_URL + 'livetest',
	demo: PUBLIC_URL + 'demo',
	demoCat: PUBLIC_URL + 'demo/cat',
	demoPlacement: PUBLIC_URL + 'demo/placement',
	demoJee: PUBLIC_URL + 'demo/jee',
	mentorshipPortal:
		process.env.REACT_APP_ENV === 'production'
			? 'https://mentors.prepleaf.com'
			: `https://mentors.${process.env.REACT_APP_ENV}.prepleaf.com`,
	analysisOverall: PUBLIC_URL + 'dashboard/analysis/overall',
	analysisTest: PUBLIC_URL + 'dashboard/analysis/tests',
	analysisId: PUBLIC_URL + 'dashboard/analysis/assessment',
	analysisQuestion: PUBLIC_URL + 'analysis/assessment/reviewQuestions', // wtf???
	cart: PUBLIC_URL + 'dashboard/cart',
	schedule: PUBLIC_URL + 'dashboard/schedule',
	forum: PUBLIC_URL + 'dashboard/forum',
	announcements: PUBLIC_URL + 'dashboard/announcements',
	chats: PUBLIC_URL + 'dashboard/chats',
	competeDiscussion: PUBLIC_URL + 'dashboard/compete/discussion',
	competeTestschedule: PUBLIC_URL + 'dashboard/compete/testschedule',
	practiceTopic: PUBLIC_URL + 'dashboard/practice/topic',
	profileAccount: PUBLIC_URL + 'dashboard/profile/account',
	profileJourney: PUBLIC_URL + 'dashboard/profile/journey',
	profileActivity: PUBLIC_URL + 'dashboard/profile/activity',
	profileNotes: PUBLIC_URL + 'dashboard/profile/notes',
	profileBookmarks: PUBLIC_URL + 'dashboard/bookmarks',
	profilePlans: PUBLIC_URL + 'dashboard/profile/plans',
	profileMyData: PUBLIC_URL + 'dashboard/profile/myData',
	activityActivity: PUBLIC_URL + 'dashboard/activity/activity',
	activityGoal: PUBLIC_URL + 'dashboard/activity/goal',
	activitySession: PUBLIC_URL + 'dashboard/activity/practice_session',
	activitySessionDetail:
		PUBLIC_URL + 'dashboard/activity/practice_session/session',
	practiceSession: PUBLIC_URL + 'practice',
	learningCenter: PUBLIC_URL + 'dashboard/learning-center',
	learningCenterPlaylists:
		PUBLIC_URL +
		'dashboard/learning-center/playlists/:resourceType(Videos|ResourceDocuments|Assignments)',
	learningCenterAssignmentPlaylists:
		PUBLIC_URL + 'dashboard/learning-center/playlists/Assignments',
	learningCenterVideoPlaylists:
		PUBLIC_URL + 'dashboard/learning-center/playlists/Videos',
	learningCenterResourceDocumentsPlaylists:
		PUBLIC_URL + 'dashboard/learning-center/playlists/ResourceDocuments',
	learningCenterPlaylist:
		PUBLIC_URL + 'dashboard/learning-center/playlists/:resourceType/playlist',
	learningCenterAssignmentPlaylist:
		PUBLIC_URL + 'dashboard/learning-center/playlists/Assignments/playlist',
	learningCenterDocumentPlaylist:
		PUBLIC_URL + 'dashboard/learning-center/playlists/Assignments/playlist',
	learningCenterVideoPlaylist:
		PUBLIC_URL + 'dashboard/learning-center/playlistsVideos/playlist',
	learningCenterVideoPlayerUrl:
		PUBLIC_URL + 'dashboard/learning-center/playlists/Videos/playlist/Video',
	learningCenterAssignmentViewUrl:
		PUBLIC_URL +
		'dashboard/learning-center/playlists/Assignments/playlist/Assignment',
	placementLearningCenter: PUBLIC_URL + 'demo/placement/learning-center',
	createSession: PUBLIC_URL + 'practice/new',
	reviewQuestions: PUBLIC_URL + 'review',
	submitSolution: PUBLIC_URL + 'submit-solution',
	unsubscribe: PUBLIC_URL + 'unsubscribe',
	assessments: PUBLIC_URL + 'assessments',
	adminBase: PUBLIC_URL + 'dashboard/admin',
	adminUserList: PUBLIC_URL + 'dashboard/admin/users',
	adminUserProfile: PUBLIC_URL + 'dashboard/admin/users/profile/:userId',
	adminTeacherList: PUBLIC_URL + 'dashboard/admin/teachers',
	adminParentList: PUBLIC_URL + 'dashboard/admin/parents',
	adminAttendance: PUBLIC_URL + 'dashboard/admin/attendance',
	adminAssessments: PUBLIC_URL + 'dashboard/admin/assessments',
	adminAssessmentCreate: PUBLIC_URL + 'dashboard/admin/assessments/create',
	adminAssessmentDraftEdit: PUBLIC_URL + 'dashboard/admin/assessments/draft/:id',
	adminAssessmentPublished: PUBLIC_URL + 'dashboard/admin/assessments/draft/:id',
	adminAssessmentStats: PUBLIC_URL + 'dashboard/admin/assessments/stats',
	adminAnalysis: PUBLIC_URL + 'dashboard/admin/analysis',
	adminAnalysisOverall: PUBLIC_URL + 'dashboard/admin/analysis/overall',
	adminAnalysisOverall: PUBLIC_URL + 'dashboard/admin/analysis/overall',
	adminLeave: PUBLIC_URL + 'dashboard/admin/leave',
	busRoutes: PUBLIC_URL + 'dashboard/buses',
	meeting: PUBLIC_URL + 'dashboard/meeting',
	fullMenu: PUBLIC_URL + 'dashboard/full-menu',
	//
	backendUsers: apiBaseUrl + '/users',
	backendAdminPermissions: apiBaseUrl + '/admin/permission',
	backendUserAccount: apiBaseUrl + '/users/account',
	backendAttendance: apiBaseUrl + '/attendance',
	backendBucket: apiBaseUrl + '/bucket',
	backendPhases: apiBaseUrl + '/phase',
	backendCFUsers: apiCacheBaseUrl + '/users',
	backendCourses: apiCacheBaseUrl + '/courses',
	backendLeaderboard: apiBaseUrl + '/leaderboard',
	backendCFLeaderboard: `${apiCacheBaseUrl}/leaderboard`,
	backendUnauthorized: apiBaseUrl + '/unauthorized',
	backendNotifications: apiBaseUrl + '/notifications',
	backendLabs: apiBaseUrl + '/labs',
	backendFeed: apiBaseUrl + '/feed',
	backendTopics: `${apiBaseUrl}/topics`,
	backendGroups: `${apiBaseUrl}/group`,
	backendCFGroups: `${apiCacheBaseUrl}/group`,
	backendCategories: `${apiBaseUrl}/category`,
	backendPracticeQuestion: `${apiBaseUrl}/questions/getPracticeQuestion`, //make it onky questions
	backendQuestions: `${apiBaseUrl}/questions`,
	backendPuzzles: `${apiBaseUrl}/puzzles`,
	backendAssessment: `${apiBaseUrl}/assessment`,
	backendCFAssessment: `${apiCacheBaseUrl}/assessment`,
	backendDiscussion: `${apiBaseUrl}/discussion`,
	validatePremiumPayment: `${apiBaseUrl}/users/validatePremiumPayment`,
	backendPayments: `${apiBaseUrl}/payments`,
	backendQuery: `${apiBaseUrl}/query`,
	backendCFPayments: `${apiCacheBaseUrl}/payments`,
	backendAnnouncements: `${apiBaseUrl}/announcement/user`,
	backendAnnouncementsAdmin: `${apiBaseUrl}/announcement/admin`,
	backendMentor: `${apiBaseUrl}/mentors`,
	backendForum: `${apiBaseUrl}/forum`,
	backendForumCache: `${apiBaseUrl}/forum`,
	backendAnalytics: `${apiBaseUrl}/analytics`,
	backendClients: `${apiBaseUrl}/clients`,
	backendLeaves: `${apiBaseUrl}/leaves`,
};
