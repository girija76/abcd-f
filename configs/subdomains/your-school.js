var shortName = 'Your School';
var logo = 'https://static.prepseed.com/brand/your-coaching/logo.png';
var logoWide = logo;
window.config = {
	clientId: '60ee67694ee3f40cd138b216',
	_id: 'coaching',
	customHeaderComponent: 'school',
	apiEndpoint: 'https://napi.prepseed.com',
	name: shortName,
	hideLogoOnHeadOne: false,
	logoDark: logo,
	logoDarkHeight: 72,
	hideNavigation: false,
	showServicePlansOnHome: true,
	favicon: 'https://static.prepseed.com/brand/prepseed/favicon.ico',
	logoWide,
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to vyasedification@gmail.com',
	tpCfg: {
		dPColor: '#3c6e71',
		dSColor: '#fff',
		mPColor: '#3c6e71',
		mSColor: '#000',
		logo: logoWide,
		logoStyle: {
			display: 'flex',
			paddingLeft: 0,
			height: '100%',
		},
		dLISC: true,
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	enableDld: true,
	sidebarCfg: {
		logo: logoWide,
		logoHeight: '62%',
		logoStyle: {
			height: 63,
			padding: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'transparent',
		},
		logoSmall: '',
		url: '',
		hideSuperGroup: true,
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	subGroupLabel: 'Course Type',
	phaseLabel: 'Class',
	showPhaseDates: false,
	landingPageCfg: {
		swg: true,
		themeColor: '#fcc621',
		// groups: [
		// 	// is used on sign up page
		// 	{ _id: 0, name: 'IIT-JEE/NEET', supergroup: '5dd95e8097bc204881be3f2c' },
		// 	{
		// 		_id: 1,
		// 		name: '7th, 8th, 9th & 10th',
		// 		supergroup: '5ef239b8961414160f0a8da3',
		// 	},
		// 	{
		// 		_id: 2,
		// 		name: 'CUET',
		// 		supergroup: '625d56ffa481f30caa94b1fe',
		// 		subgroup: '625d57b56b179720775cc799',
		// 	},
		// ],
	},
	supergroups: [
		{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE' },
		{ _id: '6058854dc918200cab212817', name: 'NEET' },
		{ _id: '5ef239b8961414160f0a8da3', name: 'PCCP' },
		{ _id: '627bb05a6125b00f7e80fdee', name: 'Schools' },
	],
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
		DISABLE_SIGNUP: true,
		// DISABLE_SIGNUP_GOOGLE: true,
		ENABLE_E_LEARNING: true,
		ENABLE_TIMEWISE_FILTER: false,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		ENABLE_REPORTS: true,
		enableChats: true,
		enableForum: true,
		enableAnnouncements: true,
	},
	learningCenter: {
		vimeo: 'play_inline',
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
};
