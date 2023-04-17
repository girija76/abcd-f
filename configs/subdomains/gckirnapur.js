var shortName = 'Government College Kirnapur';
var identifier = 'gckiranpur';
var logoDark =
	'https://static.prepseed.com/brand/' + identifier + '/gckiranpur.jpg';
var logoLandscape = logoDark;
window.config = {
	_id: '613b10d87440600cba859eeb',
	clientId: '613b10d87440600cba859eeb',
	apiEndpoint: 'https://napi.prepseed.com',
	// lambdaApiEndpoint:
	// 	'https://t8gl3836t3.execute-api.ap-south-1.amazonaws.com/prepseed-pro',
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to support@prepseed.com.',
	cookieNotRequired: true,
	customHeaderComponent: 'coaching',
	name: shortName,
	hideLogoOnHeadOne: false,
	favicon: 'https://static.prepseed.com/brand/prepseed/favicon.ico',
	logoDark,
	logoDarkHeight: 84,
	tpCfg: {
		dPColor: '#e4ffa2',
		dSColor: '#000',
		mPColor: '#f0f1f2',
		mSColor: '#000',
		logo: logoLandscape,
		logoStyle: {
			display: 'flex',
			paddingLeft: 8,
			height: '80%',
		},
		height: 64,
		faq: 'https://www.prepseed.com/faq',
		centerLogoOnDesktop: true,
	},
	sidebarCfg: {
		logo: logoLandscape,
		logoStyle: {
			height: 63,
			padding: '8px 0px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#e4ffa2',
		},
		logoSmall: logoDark,
		url: '',
		hideSuperGroup: true,
		hide: true,
		showProfile: true,
	},
	resourceTypeLabels: {
		Video: 'Lecture',
		ResourceDocument: 'File',
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	landingPageCfg: {
		swg: false,
		themeColor: '#1976d2',
		groups: [
			// is used on sign up page
			{ _id: 0, name: 'IIT-JEE/NEET', supergroup: '5dd95e8097bc204881be3f2c' },
		],
	},
	supergroups: [{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE/NEET' }],
	testCfg: {
		name: 'Compete',
		mobileName: 'Tests',
		url: 'compete',
	},
	url: '',
	faq: 'https://www.prepseed.com/faq',
	fbPixelId: '211744939877186',
	showProgress: true,
	hidePractice: true,
	hideFeatures: {
		goal: false,
		activity: false,
		subscription: true,
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
	},
	profile: {
		// username: 'Mkway ID',
	},
	analysis: {
		minimumAttempts: 30,
	},
	defaultTestTab: 'topic-tests',
	hideDemo: true,
	disableSkipping: true,
	dashboardOtherLinks: [],
	companyLinks: [],
	productLinks: [],
	connectLinks: [],

	isLoaded: true,
	title: `Preparation Portal - ${shortName}`,
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
		name: 'Prepseed',
		description: 'Course purchase',
		image: logoDark,
	},
};
