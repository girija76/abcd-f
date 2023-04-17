var shortName = 'Shanti Asiatic School';
var identifier = 'sas';
var logoDark =
	'https://static.prepseed.com/brand/' + identifier + '/landscape.jpg';
var logoLandscape =
	'https://static.prepseed.com/brand/' + identifier + '/landscape.jpg';
var favicon =
	'https://static.prepseed.com/brand/' + identifier + '/favicon.ico';
window.config = {
	isDummy: false,
	_id: 'jee',
	clientId: '63dca9c42b23700d59efd683',
	apiEndpoint: 'https://napi.prepseed.com',
	cookieNotRequired: false,
	customHeaderComponent: 'jee',
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
				name: 'Demo Signup',
				supergroup: '62d7f826846ccb0ec0c7a6ab',
				subgroup: '63dcaa512b23700d59efd684',
			},
		],
	},
	supergroups: [{ _id: '62d7f826846ccb0ec0c7a6ab', name: 'CBSE' }],
	testCfg: {
		name: 'Tests',
		url: 'compete',
	},
	url: '',
	faq: 'https://www.prepseed.com/faq',
	fbPixelId: '211744939877186',
	blogs: 'https://blog.prepseed.com',
	showProgress: true,
	hidePractice: false,
	hideFeatures: {
		goal: false,
		activity: false,
		subscription: true,
		referral: true,
	},
	busRoutes: {
		enable: true,
		buses: [
			{
				url: 'https://static.prepseed.com/brand/' + 'nachiar' + '/buses/1.pdf',
				type: 'pdf',
				name: 'Bus 1',
			},
			{
				url: 'https://static.prepseed.com/brand/' + 'nachiar' + '/buses/2.pdf',
				type: 'pdf',
				name: 'Bus 2',
			},
			{
				url: 'https://static.prepseed.com/brand/' + 'nachiar' + '/buses/3.pdf',
				type: 'pdf',
				name: 'Bus 3',
			},
			{
				url: 'https://static.prepseed.com/brand/' + 'nachiar' + '/buses/4.pdf',
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
	FEATURES: {
		ENABLE_E_LEARNING: true,
		ENABLE_TIMEWISE_FILTER: true,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		ENABLE_REPORTS: true,
		enableChats: true,
		enableForum: true,
		enableAnnouncements: true,
		DISABLE_SIGNUP_GOOGLE: true,
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
				'Prepare online for IIT JEE with ' +
				shortName +
				' - Physics, Chemistry, and Maths',
			description:
				'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your aim.',
		},
		resources: {
			title: 'JEE Resources - ' + shortName,
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
			title: 'Prepare for JEE - ' + shortName,
			description:
				'Start your JEE exam preparation with practice sessions, topic tests, live tests, mock tests and AI based behaviour and academic knowledge feedback.',
		},
		demoPractice: {
			title: 'Practice Physics, Chemistry, Maths for JEE Exam',
			description:
				'Start practice sessions to improve your Physics, Chemistry, Maths.',
		},
		demoTopicTests: {
			title: 'Quantized Sheet for Physics, Chemistry, Maths',
			description:
				'Attempt quantized tests to improve your topics- Physics, Chemistry, Maths.',
		},
		demoSectionalTests: {
			title: 'Sectional Tests for Physics, Chemistry, Maths',
			description:
				'Attempt sectional tests to improve your sections- Physics, Chemistry, Maths.',
		},
		demoCompete: {
			title: 'Live and Mocks Tests for JEE Exam Preparation',
			description: 'Attempt live tests and full mocks of JEE Exam.',
		},
	},
	sitemap: [],
	paymentGatewayOptions: {
		name: 'Allen',
		description: 'Allen - Purchase',
		image: logoLandscape,
	},
};
