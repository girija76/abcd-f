var shortName = 'Dakshana';
var logo = 'https://static.prepseed.com/brand/dakshana/dakshana-square.png';
var logoWide = 'https://static.prepseed.com/brand/dakshana/dakshana.png';
window.config = {
	clientId: '6062c86905a7bd76fc035daf',
	_id: 'coaching',
	apiEndpoint: 'https://napi.prepseed.com',
	// customHeaderComponent: 'brothersacademy',
	name: shortName,
	hideLogoOnHeadOne: false,
	favicon: 'https://static.prepseed.com/brand/prepseed/favicon.ico',
	allowSignupWithGoogle: false,
	logoDark: logo,
	logoDarkHeight: 72,
	support: {
		email: '',
	},
	logoWide,
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to support@prepleaf.com.',
	tpCfg: {
		dPColor: '#fff',
		dSColor: '#000',
		mPColor: '#e0e0e0',
		mSColor: '#000',
		logo: logoWide,
		logoStyle: {
			display: 'flex',
			paddingLeft: 4,
			height: '100%',
		},
		dLISC: true,
		height: 60,
		faq: 'https://www.prepseed.com/faq',
	},
	sidebarCfg: {
		logo: logoWide,
		logoHeight: '100%',
		logoStyle: {
			height: 60,
			padding: 4,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#fff',
		},
		logoSmall: '',
		url: '',
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	subGroupLabel: 'Course Type',
	phaseLabel: 'Class',
	showPhaseDates: false,
	landingPageCfg: {
		swg: true,
		themeColor: '#1976d2',
		groups: [
			// is used on sign up page
			{ _id: 0, name: 'IIT-JEE', supergroup: '5dd95e8097bc204881be3f2c' },
			{
				_id: 1,
				name: 'NEET',
				supergroup: '6058854dc918200cab212817',
			},
		],
	},
	testCfg: {
		name: 'Tests',
		url: 'compete',
	},
	url: '',
	faq: 'https://www.prepseed.com/faq',
	fbPixelId: '211744939877186',
	blogs: 'https://blog.prepleaf.com',
	showProgress: true,
	hidePractice: true,
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
		DISABLE_SIGNUP: false,
		ENABLE_E_LEARNING: true,
		ENABLE_TIMEWISE_FILTER: true,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		SERVICES: false,
		DASHBOARD_CARDS: false,
		USER_GROUPS: false,
		ENABLE_REPORTS: true,
	},
	profile: {},
	analysis: {
		minimumAttempts: 30,
	},
	defaultTestTab: 'topic-tests',
	hideDemo: false,
	disableSkipping: true,
	dashboardOtherLinks: [],
	companyLinks: [],
	productLinks: [],
	connectLinks: [],
	liteLandingPage: {
		links: [],
	},

	isLoaded: true,
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
};
