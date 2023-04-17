var shortName = 'Resonance';
var identifier = 'resonance';
var logoSquare =
	'https://static.prepseed.com/brand/' + identifier + '/resonance-square.png';
var logoLandscape =
	'https://static.prepseed.com/brand/' +
	identifier +
	'/resonance-logo-landscape.png';
var favicon =
	'https://static.prepseed.com/brand/' + identifier + '/favicon.ico';
window.config = {
	_id: 'coaching',
	clientId: '60eac6967898f60ce2feb7a2',
	apiEndpoint: 'https://napi.prepseed.com',
	// lambdaApiEndpoint:
	// 	'https://t8gl3836t3.execute-api.ap-south-1.amazonaws.com/prepseed-pro',
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to support@prepseed.com.',
	cookieNotRequired: true,
	customHeaderComponent: 'coaching',
	name: shortName,
	hideLogoOnHeadOne: false,
	favicon,
	logoSquare,
	logoDark: logoLandscape,
	logoDarkHeight: 54,
	tpCfg: {
		dPColor: '#f0f1f2',
		dSColor: '#000',
		mPColor: '#f0f1f2',
		mSColor: '#000',
		logo: logoLandscape,
		logoStyle: {
			display: 'flex',
			paddingLeft: 12,
			height: '56%',
		},
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	sidebarCfg: {
		logo: logoLandscape,
		logoStyle: {
			height: 63,
			padding: '15px 8px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#f6f6f6',
			boxShadow: '0px 3px 5px rgba(0, 0, 0,.10)',
		},
		logoSmall: logoSquare,
		url: '',
	},
	useLiteIfPossible: true,
	showServicePlansOnHome: false,
	testUi: 'jee',
	landingPageCfg: {
		swg: false,
		themeColor: 'rgb(206,234,151)',
		hidePortalFeatures: true,
		hideRegistrationAtBottom: true,
		headTwo: {
			hide: true,
		},
		groups: [{ _id: 0, name: 'IIT-JEE', supergroup: '5dd95e8097bc204881be3f2c' }],
	},
	footer: {
		hide: true,
	},
	supergroups: [{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE' }],
	testCfg: {
		name: 'Test Series',
		url: 'compete',
	},
	url: '',
	faq: 'https://www.prepseed.com/faq',
	fbPixelId: '211744939877186',
	showProgress: false,
	hidePractice: false,
	practice: {
		hide: false,
		title: 'Free Practice',
		mobileTitle: 'Practice',
	},
	hideFeatures: {
		goal: true,
		activity: true,
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
		ENABLE_E_LEARNING: false,
		ENABLE_TIMEWISE_FILTER: true,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		ENABLE_REPORTS: false,
	},
	profile: {
		// username: 'Mkway ID',
	},
	analysis: {
		minimumAttempts: 30,
	},
	defaultTestTab: 'compete/mocks',
	hideDemo: true,
	disableSkipping: true,
	dashboardOtherLinks: [],
	companyLinks: [],
	productLinks: [],
	connectLinks: [],

	isLoaded: true,
	title: 'Preparation Portal - ' + shortName,
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
		name: 'Resonance',
		description: 'Course purchase',
		image: logoSquare,
	},
};
