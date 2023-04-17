var shortName = 'Open Student Foundation';
var identifier = 'osf';
var logoDark =
	'https://static.prepseed.com/brand/' + identifier + '/osf-landscape.png';
var logoLandscape =
	'https://static.prepseed.com/brand/' + identifier + '/osf-landscape.png';
var favicon =
	'https://static.prepseed.com/brand/' + identifier + '/osf-favicon.jpg';
window.config = {
	isDummy: false,
	_id: 'jee',
	clientId: '634cf6f8960dff31b7a2ed4e',
	apiEndpoint: 'https://napi.prepseed.com',
	cookieNotRequired: false,
	customHeaderComponent: 'coaching',
	name: shortName,
	hideLogoOnHeadOne: false,
	favicon,
	logoDark: logoDark,
	logoDarkHeight: 120,
	tpCfg: {
		dPColor: '#0F294A',
		dSColor: '#fff',
		mPColor: '#0F294A',
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
			backgroundColor: '#fff',
		},
		url: '',
		logoSmall: logoLandscape,
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	landingPageCfg: {
		swg: true,
		themeColor: '#102a83',
		groups: [
			{
				id: 1,
				supergroup: '5dd95e8097bc204881be3f2c',
				subgroup: '634cf83289f2902025a42b3b',
				name: 'Demo Signup',
			},
		],
	},
	supergroups: [{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE/NEET' }],
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
		subscription: false,
		referral: true,
	},
	hideStatistics: {
		// accuracy: true,
	},
	showErpFeatures: {
		leave: true,
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
		DISABLE_SIGNUP: false,
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
			title: 'Topic Tests for Physics, Chemistry, Maths',
			description:
				'Attempt topic tests to improve your topics- Physics, Chemistry, Maths.',
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
		name: 'Miracle Academy',
		description: 'Miracle Academy - Purchase',
		image: logoLandscape,
	},
};
