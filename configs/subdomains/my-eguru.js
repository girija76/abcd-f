var shortName = 'My-EGuru';
var logoDark = 'https://static.prepleaf.com/brand/my-eguru/logo.png';
window.config = {
	_id: 'coaching',
	clientId: '5ef0a9468ddf9b748054e9e7',
	customHeaderComponent: 'my-eguru',
	name: shortName,
	hideLogoOnHeadOne: false,
	logoDark,
	emailLogo: logoDark,
	logoDarkHeight: 72,
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. In case of any query please send an email to support@prepleaf.com.',
	tpCfg: {
		dPColor: '#a6c2d0',
		dSColor: '#000',
		mPColor: '#e0e0e0',
		mSColor: '#000',
		logo: 'https://static.prepleaf.com/brand/my-eguru/logo.png',
		logoStyle: {
			display: 'flex',
			paddingLeft: 8,
			height: '70%',
		},
		dLISC: true,
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	sidebarCfg: {
		logo: 'https://static.prepleaf.com/brand/my-eguru/logo.png',
		logoStyle: {
			height: 63,
			padding: 10,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#ffffff',
		},
		logoSmall: '',
		url: '',
	},
	resourceCfg: {
		logo: 'https://static.prepleaf.com/brand/my-eguru/logo.png',
	},
	useLiteIfPossible: true,
	testUi: 'jee',
	landingPageCfg: {
		swg: true,
		themeColor: '#1976d2',
		groups: [
			{
				_id: 0,
				name: 'JEE/NEET with Boards',
				supergroup: '5dd95e8097bc204881be3f2c',
			},
			{ _id: 1, name: 'PCCP', supergroup: '5ef239b8961414160f0a8da3' },
			{
				_id: 2,
				name: 'CAT',
				supergroup: '5d10e43944c6e111d0a17d0c',
				subgroup: '5ef99fa1cae3035c339e4a21',
			},
			{
				_id: 3,
				name: 'Other',
				supergroup: '5d10e43e44c6e111d0a17d0e',
			},
		],
	},
	supergroups: [
		{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE' },
		{ _id: '5ef239b8961414160f0a8da3', name: 'PCCP' },
		{ _id: '5d10e43944c6e111d0a17d0c', name: 'CAT' },
		{ _id: '5d10e43e44c6e111d0a17d0e', name: 'SSC' },
	],
	subgroups: [
		{ _id: '5ef0a9c18ddf9b748054ea77', name: 'Target 2022 MeG' },
		{ _id: '5ef0a9b08ddf9b748054ea6a', name: 'Target 2021 MeG' },
		{ _id: '5ef0a99cd5a287737c569823', name: 'Target 2020 MeG' },
		{ _id: '5ef8ce9ccae3035c339da786', name: '13Th NEET' },
		{ _id: '5ef8ce8e3961405c045887c1', name: '12th NEET' },
		{ _id: '5ef8ce7e3961405c045887b4', name: '11th NEET' },
		{ _id: '5ef8e117cae3035c339dace9', name: '7th' },
		{ _id: '5ef8e124cae3035c339dacee', name: '8th' },
		{ _id: '5ef8e130cae3035c339dacf3', name: '9th' },
		{ _id: '5ef8e1443961405c04588bb0', name: '10th' },
		{ _id: '5ef9a132cae3035c339e4a66', name: 'SSC' },
		{ _id: '5ef9a153cae3035c339e4a79', name: 'Banking' },
		{ _id: '5ef9a1643961405c0458b6ee', name: 'PO' },
	],
	testCfg: {
		name: 'Tests',
		url: 'topic-tests',
	},
	url: '',
	faq: '',
	fbPixelId: '211744939877186',
	blogs: 'https://blog.prepleaf.com',
	showProgress: true,
	hidePractice: true,
	hideFeatures: {
		goal: true,
		activity: true,
		subscription: true,
		referral: true,
		userJourney: true,
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
	},
	profile: {},
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

	resourceTypeLabels: {
		ResourceDocument: 'Study Material',
	},

	isLoaded: true,
	title: 'Preparation Portal - Prepleaf',
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
		name: 'My-Eguru',
		description: 'Course purchase',
		image: logoDark,
	},
	whatsAppNumber: 918187965612,
};
