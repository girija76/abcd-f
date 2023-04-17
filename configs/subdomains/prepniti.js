var shortName = 'Prepniti';
var identifier = 'prepniti';
var logoDark =
	'https://static.prepseed.com/brand/' + identifier + '/prepniti-landscape.png';
var logoLandscape =
	'https://static.prepseed.com/brand/' + identifier + '/prepniti-landscape.png';
var favicon =
	'https://static.prepseed.com/brand/' + identifier + '/prepniti.ico';
window.config = {
	isDummy: false,
	_id: 'prepniti',
	clientId: '62c694d783256a2081a3a29a',
	apiEndpoint: 'https://napi.prepseed.com',
	cookieNotRequired: false,
	customHeaderComponent: 'prepniti',
	name: shortName,
	hideLogoOnHeadOne: false,
	favicon,
	logoDark: logoDark,
	logoDarkHeight: 64,
	tpCfg: {
		dPColor: '#3757b2',
		dSColor: '#fff',
		mPColor: '#3757b2',
		mSColor: '#fff',
		logo: logoLandscape,
		logoStyle: {
			display: 'flex',
			paddingLeft: 0,
			height: '100%',
		},
		dLISC: true,
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	sidebarCfg: {
		logo: logoLandscape,
		logoStyle: {
			height: 63,
			padding: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#f6f6f6',
		},
		url: '',
		logoSmall: logoLandscape,
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	landingPageCfg: {
		swg: true,
		themeColor: '#1976d2',
		groups: [
			{
				_id: 0,
				name: 'CSAT Study Material + Video Lecture',
				supergroup: '62c67129618ad320886edcd2',
				subgroup: '62da3f1843a660342ef20d28',
			},
			{
				_id: 1,
				name: 'CSAT Study Material + Test Series + Video Lecture',
				supergroup: '62c67129618ad320886edcd2',
				subgroup: '62da3ede43a660342ef20cd3',
			},
			{
				_id: 2,
				name: 'CSAT Study Material + Test Series',
				supergroup: '62c67129618ad320886edcd2',
				subgroup: '62da3ea643a660342ef208ae',
			},
			{
				_id: 3,
				name: 'CSAT Study Material PDF',
				supergroup: '62c67129618ad320886edcd2',
				subgroup: '62da3dd52115783d6845fdde',
			},
		],
	},
	supergroups: [{ _id: '62c67129618ad320886edcd2', name: 'CSAT' }],
	testCfg: {
		name: 'Tests',
		url: 'compete',
	},
	sectionalTestCfg: {
		name: 'Previous Year Papers',
		mobileName: 'Previous Year Papers',
		url: 'sectional-tests',
	},
	url: '',
	faq: 'https://www.prepseed.com/faq',
	fbPixelId: '211744939877186',
	blogs: 'https://blog.prepseed.com',
	showProgress: true,
	hidePractice: true,
	hideFeatures: {
		goal: true,
		activity: true,
		subscription: true,
		referral: true,
	},
	busRoutes: {
		enable: false,
		buses: [
			{
				url: 'https://static.prepseed.com/brand/' + identifier + '/buses/1.pdf',
				type: 'pdf',
				name: 'Bus 1',
			},
			{
				url: 'https://static.prepseed.com/brand/' + identifier + '/buses/2.pdf',
				type: 'pdf',
				name: 'Bus 2',
			},
			{
				url: 'https://static.prepseed.com/brand/' + identifier + '/buses/3.pdf',
				type: 'pdf',
				name: 'Bus 3',
			},
			{
				url: 'https://static.prepseed.com/brand/' + identifier + '/buses/4.pdf',
				type: 'pdf',
				name: 'Bus 4',
			},
		],
	},
	hideStatistics: {
		// accuracy: true,
	},
	showErpFeatures: {
		leave: true,
		meeting: false,
	},
	hideELearningFeatures: {
		assignments: true,
	},
	FEATURES: {
		ENABLE_E_LEARNING: true,
		ENABLE_TIMEWISE_FILTER: true,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		ENABLE_REPORTS: true,
		enableChats: true,
		enableForum: true,
		enableAnnouncements: true,
		DISABLE_SIGNUP_GOOGLE: false,
	},
	profile: {
		// username: 'Mkway ID',
	},
	analysis: {
		minimumAttempts: 15,
	},
	defaultTestTab: 'topic-tests',
	hideDemo: true,
	disableSkipping: true,
	dashboardOtherLinks: [],
	companyLinks: [],
	productLinks: [],
	connectLinks: [],

	isLoaded: true,
	title: shortName,
	metaDescription:
		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your aim.',
	metaData: {
		landingPage: {
			title:
				'Prepare online for UPSC with ' +
				shortName +
				' - Aptitude, Reasoning, English',
			description:
				'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your aim.',
		},
		resources: {
			title: 'UPSC Resources - ' + shortName,
			description: '',
		},
		courses: {
			title: 'Courses and Test Series -' + shortName,
			description:
				'Join ' +
				shortName +
				' courses and test series for free - unlimited practice sessions, topic tests, sectional tests, live tests, full mocks, peer comparison stats, behaviour analysis and lot more. Checkout the demo.',
		},
		coursesPlacement: {
			title: 'Placement Aptitude Course (FREE) - ' + shortName,
			description:
				'Get unlimited practice sessions, topic tests, live tests, mocks tests, puzzles, peer comparison stats, behaviour analysis, mentorship, workshops and lot more. Checkout the demo of Placement portal',
			text: 'Placement Aptitude Course',
		},
		coursesCat: {
			title: 'CAT Complete Course (FREE) - ' + shortName,
			description:
				'Get unlimited practice sessions, topic tests, sectional test live tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of CAT portal.',
			text: 'CAT Complete Course',
		},
		coursesJee: {
			title: 'Jee Full Test Series (FREE) - ' + shortName,
			description:
				'Get unlimited practice sessions, topic tests, live tests, sectional tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of JEE portal.',
			text: 'Jee Full Test Series',
		},
		demo: {
			title: 'Prepare for UPSC - ' + shortName,
			description:
				'Start your UPSC exam preparation with practice sessions, topic tests, live tests, mock tests and AI based behaviour and academic knowledge feedback.',
		},
		demoPractice: {
			title: 'Practice Aptitude, Reasoning, English for UPSC Exam',
			description:
				'Start practice sessions to improve your Aptitude, Reasoning, English.',
		},
		demoTopicTests: {
			title: 'Topic Tests for Aptitude, Reasoning, English',
			description:
				'Attempt topic tests to improve your topics- Aptitude, Reasoning, English.',
		},
		demoSectionalTests: {
			title: 'Previous Year Papers for Aptitude, Reasoning, English',
			description:
				'Attempt Previous Year Papers to improve your topics - Aptitude, Reasoning, English.',
		},
		demoCompete: {
			title: 'Live and Mocks Tests for UPSC Exam Preparation',
			description: 'Attempt live tests and full mocks of UPSC Exam.',
		},
	},
	sitemap: [],
	paymentGatewayOptions: {
		name: 'Prepniti',
		description: 'Prepniti - Purchase',
		image: logoLandscape,
	},
};
