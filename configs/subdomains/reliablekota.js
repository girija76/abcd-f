var logo = 'https://reliablekota.com/images/logo.png';
window.config = {
	_id: 'coaching',
	clientId: '5ee3e7b612e86f77ac72dad3',
	customHeaderComponent: 'reliable',
	usernameSuffix: '@reliablekota.com',
	name: 'Reliable Kota',
	hideLogoOnHeadOne: false,
	logoDark: logo,
	logoDarkHeight: 114,
	accessMsg:
		'Your account unlocking process has been initiated. Your account will unlock soon. Possible reason for locked account can be - account not verified, fee not received. In case of any query please send an email to support@prepleaf.com.',
	accessMsgWithRevocationReason:
		'Please fill your details to unlock your account. Link: {{link}}',
	tpCfg: {
		dPColor: '#429add',
		dSColor: '#ffffff',
		mPColor: '#f8c2a2eb',
		mSColor: '#ffffff',
		logo: logo,
		logoStyle: {
			display: 'flex',
			paddingLeft: 20,
			height: '90%',
		},
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	sidebarCfg: {
		logo,
		logoStyle: {
			height: 63,
			padding: 2,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#ffffff',
		},
		logoSmall: '',
		url: '',
	},
	testUi: 'jee',
	landingPageCfg: {
		swg: true,
		groups: [
			{ _id: 0, name: 'Regular User', supergroup: '5dd95e8097bc204881be3f2c' },
			{
				_id: 1,
				name: 'Crash Course',
				supergroup: '5dd95e8097bc204881be3f2c',
				subgroup: '5ea0ea943108c72c66a2d44c',
			},
		],
	},
	supergroups: [{ _id: '5dd95e8097bc204881be3f2c', name: 'IIT-JEE' }],
	subgroups: [
		{ _id: '5e80ae8fefb5ea5e22de38d1', name: 'Target 2022 (R - VIKAAS)' },
		{ _id: '5e80ae93efb5ea5e22de38d3', name: 'Target 2021 R - VIJETA (JPA)' },
		{ _id: '5e80ae9aefb5ea5e22de38d5', name: 'Target 2020' },
		{ _id: '5eaf181267f29f4732e7f76f', name: 'Target 2021 R - VIJETA (JPB)' },
		{
			_id: '5eaf183f67f29f4732e7f7dc',
			name: 'Target 2021 R - VIJETA (JPA) Hindi',
		},
		{
			_id: '5ec253f270a3860925cb5610',
			name: 'RJP01 & RJP02',
		},
		{
			_id: '5ec6cf9a39dbe61a39b489e6',
			name: 'JD01 / 02',
		},
		{ _id: '5ecd713835664c74f3dc36f2', name: 'JD03' },
	],
	testCfg: {
		name: 'Compete',
		mobileName: 'Tests',
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
		accuracy: true,
	},
	showErpFeatures: {
		leave: true,
	},
	FEATURES: {
		ENABLE_E_LEARNING: false,
		ENABLE_TIMEWISE_FILTER: true,
		ENABLE_TOPIC_MOCK_SYLLABUS: true,
		ENABLE_BOOKMARKS_SHORTCUT: true,
		DISABLE_SIGNUP: true,
		ENABLE_REPORTS: true,
		SERVICES: false,
		DASHBOARD_CARDS: true,
		USER_GROUPS: true,
		BATCHES: true,
		TEST_SHOW_USER_INFO: true,
	},
	profile: {
		username: 'Reliable ID',
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
	signInText: 'Login',
	signupText: 'New Registeration',
	isLoaded: true,
	title: 'Preparation Portal - Prepseed',
	metaDescription:
		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your aim.',
	metaData: {
		landingPage: {
			title:
				'IIT-JEE Test Series by Reliable Kota | Practice Physics, Chemistry, and Maths',
			description:
				'Join Reliable Kota courses and test series for free - unlimited practice sessions, topic tests, sectional tests, live tests, full mocks, peer comparison stats, behaviour analysis and lot more. Checkout the demo.',
		},
		resources: {
			title: 'JEE Resources - Reliable Kota',
			description: '',
		},
		courses: {
			title: 'Courses and Test Series - Reliable Kota',
			description:
				'Join Reliable Kota courses and test series for free - unlimited practice sessions, topic tests, sectional tests, live tests, full mocks, peer comparison stats, behaviour analysis and lot more. Checkout the demo.',
		},
		coursesPlacement: {
			title: 'Placement Aptitude Course (FREE) - Reliable Kota',
			description:
				'Get unlimited practice sessions, topic tests, live tests, mocks tests, puzzles, peer comparison stats, behaviour analysis, mentorship, workshops and lot more. Checkout the demo of Placement portal',
			text: 'Placement Aptitude Course',
		},
		coursesCat: {
			title: 'CAT Complete Course (FREE) - Reliable Kota',
			description:
				'Get unlimited practice sessions, topic tests, sectional test live tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of CAT portal.',
			text: 'CAT Complete Course',
		},
		coursesJee: {
			title: 'Jee Full Test Series (FREE) - Reliable Kota',
			description:
				'Get unlimited practice sessions, topic tests, live tests, sectional tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of JEE portal.',
			text: 'Jee Full Test Series',
		},
		demo: {
			title: 'Prepare for JEE - Reliable Kota',
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
