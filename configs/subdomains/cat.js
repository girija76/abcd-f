const configLargeLogoUrl =
	'https://static.prepleaf.com/brand/cat/prepleaf-prepzone.jpg';

const logo = configLargeLogoUrl;
// 'https://static.prepleaf.com/brand/logo.svg'
window.config = {
	clientId: '5f098baaf79fcd232152a54d',
	_id: 'cat',
	name: 'Prepleaf',
	preconnect: 'https://cat.prepseed.com',
	supergroups: [{ _id: '5d10e43944c6e111d0a17d0c', name: 'CAT' }],
	subgroups: [{ _id: '5db1c9e160908b33b21fbfc8', name: 'CAT' }],
	landingPageCfg: {
		swg: true,
		themeColor: '#0aabdc',
	},
	tabSortOrder: { 4: 1, '1': 0, 91: 2, 90: 3 },
	competeTitle: 'Take Full length CAT Mock in New Pattern',
	lambdaApiEndpoint:
		'https://4b2kcixs35.execute-api.ap-south-1.amazonaws.com/pro',
	apiEndpoint: 'https://api.prepseed.com',
	hideTestRecommendations: true,
	showServicePlansOnHome: true,
	sidebarCfg: {
		logo,
		logoStyle: {
			height: 64,
			padding: 4,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'auto',
		},
		logoSmall: logo,
		// url: 'https://www.prepleaf.com',
		url: 'https://www.myprepzone.com/',
	},
	tpCfg: {
		dPColor: '#429add',
		dSColor: '#ffffff',
		mPColor: '#ffffff',
		mSColor: '#000000',
		logo,
		logoStyle: {
			display: 'flex',
			paddingLeft: 20,
			height: '80%',
		},
		dLISC: false,
		height: 64,
		faq: 'https://www.prepseed.com/faq',
	},
	hideStatistics: {
		// accuracy: true,
	},
	showErpFeatures: {
		leave: true,
	},
	testCfg: {
		name: 'Full Mocks',
		url: 'compete',
	},
	practice: {
		hide: false,
		title: 'Free Practice',
		mobileTitle: 'Practice',
	},
	FEATURES: {
		ENABLE_E_LEARNING: true,
	},
	pwa: false,
	hideLocked: false,
	useLiteIfPossible: true,
	headTwoLinks: {
		name: 'MBA Exams',
		links: [
			{ name: 'About CAT Exam', link: 'resources/cat' },
			{ name: 'Free Tests', link: 'resources/cat/pricing' },
			{ name: 'Pricing', link: 'resources/cat/pricing' },
			{ name: 'Other Courses', link: 'courses' },
		],
	},
	logoDark: configLargeLogoUrl,
	logoDarkHeight: 64,
	logoLightHeight: '55%',
	url: 'https://www.prepseed.com',
	fbPixelId: '211744939877186',
	faq: 'https://www.prepseed.com/faq',
	allowSignupWithGoogle: true,
	showProgress: true,
	companyLinks: [
		{
			name: 'About Prepleaf',
			url: 'https://www.prepleaf.com/about',
			target: '_self',
		},
		{
			name: 'Contact Us',
			url: 'https://www.prepleaf.com/contactus',
			target: '_self',
		},
		{
			name: 'Privacy Policy',
			url: 'https://www.prepleaf.com/policy',
			target: '_self',
		},
		{
			name: 'Terms of Use',
			url: 'https://www.prepleaf.com/terms',
			target: '_self',
		},
		{ name: 'Sign Up', url: '/registration/create_account' },
		{ name: 'Sign In', url: '/registration/sign_in' },
	],
	otherLinks: [
		{ name: 'FAQ', url: 'https://www.prepseed.com/faq', target: '_self' },
		{
			name: 'CAT preparation with PrepZone',
			url: 'https://www.myprepzone.com',
			target: '_blank',
		},
		{
			name: 'MyPrepZone - CAT 2020 Results',
			url: 'https://static.prepleaf.com/brand/prepzone/wall-of-fame-cat-20.jpeg',
		},
		{
			name: 'MyPrepZone - CAT 2019 Results',
			url: 'https://static.prepleaf.com/brand/prepzone/wall-of-fame-cat-19.jpeg',
		},
		{
			name: 'MyPrepZone - GDPI 2020 Results',
			url:
				'https://static.prepleaf.com/brand/prepzone/wall-of-fame-cat-19-gdpi.jpeg',
		},
		{ name: 'Blogs', url: 'https://blog.prepleaf.com', target: '_blank' },
		{
			name: 'Telegram Channel',
			url: 'https://t.me/s/targetcat2020',
			target: '_blank',
		},
		{ name: 'About CAT Exam', url: '/resources/cat', target: '_self' },
		{ name: 'Free Tests', url: '/resources/cat/pricing', target: '_self' },
		{
			name: 'Other Courses',
			url: 'https://www.prepleaf.com/courses',
			target: '_self',
		},
	],
	productLinks: [
		{
			name: 'Preparation Portal',
			url: 'https://prepare.prepleaf.com',
			target: '_self',
		},
		{
			name: 'Mentorship',
			url: 'https://mentors.prepleaf.com',
			target: '_self',
		},
		{
			name: 'Workshops',
			url: 'https://www.prepleaf.com/workshops',
			target: '_self',
		},
	],
	connectLinks: [
		{
			name: 'Facebook',
			url: 'https://www.facebook.com/Prepleaf',
			target: '_blank',
		},
		{ name: 'Twitter', url: 'https://twitter.com/Prepleaf', target: '_blank' },
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/company/prepleaf/about',
			target: '_blank',
		},
		{
			name: 'Youtube',
			url: 'https://www.youtube.com/channel/UCg0AJl1CbDVzrjlJuk0c4AQ',
			target: '_blank',
		},
	],
	isLoaded: true,
	title: 'Prepare for CAT, XAT, NMAT, SNAPs - Prepleaf',
	metaDescription:
		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your dream career.',
	metaData: {
		landingPage: {
			title: 'Prepare for CAT, XAT, NMAT, SNAPs - Prepleaf',
			description:
				'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your dream career.',
		},
		resources: {
			title: 'CAT Resources - Prepleaf',
			description: '',
		},
		courses: {
			title: 'Courses and Test Series - Prepleaf',
			description:
				'Join Prepleaf courses and test series for free - unlimited practice sessions, topic tests, sectional tests, live tests, full mocks, peer comparison stats, behaviour analysis and lot more. Checkout the demo.',
		},
		coursesPlacement: {
			title: 'Placement Aptitude Course (FREE) - Prepleaf',
			description:
				'Get unlimited practice sessions, topic tests, live tests, mocks tests, puzzles, peer comparison stats, behaviour analysis, mentorship, workshops and lot more. Checkout the demo of Placement portal',
			text: 'Placement Aptitude Course',
		},
		coursesCat: {
			title: 'CAT Complete Course (FREE) - Prepleaf',
			description:
				'Get unlimited practice sessions, topic tests, sectional test live tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of CAT portal.',
			text: 'CAT Complete Course',
		},
		coursesJee: {
			title: 'Jee Full Test Series (FREE) - Prepleaf',
			description:
				'Get unlimited practice sessions, topic tests, live tests, sectional tests, mocks tests, peer comparison stats, behaviour analysis, and lot more. Checkout the demo of JEE portal.',
			text: 'Jee Full Test Series',
		},
		demo: {
			title: 'Prepare for CAT, XAT, NMAT, SNAPs - Prepleaf',
			description:
				'Start your MBA entrance exam preparation with practice sessions, topic tests, live tests, mock tests and AI based behaviour and academic knowledge feedback.',
		},
		demoPractice: {
			title: 'Practice Quant, VARC, LR, DI, Programming for MBA Entrance Exams',
			description:
				'Start practice sessions to improve your topics- Quant, VARC, Logical Reasoning, Data Interpretation.',
		},
		// demoPracticeQuant: {
		// 	title: 'Prepare Aptitude for Placements & Jobs',
		// 	description:
		// 		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your dream career.',
		// },
		// demoPracticeVARC: {
		// 	title: 'Prepare Aptitude for Placements & Jobs',
		// 	description:
		// 		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your dream career.',
		// },
		// demoPracticeProgramming: {
		// 	title: 'Prepare Aptitude for Placements & Jobs',
		// 	description:
		// 		'AI-generated personalized improvement tests, free practice questions, and live assessments to achieve your dream career.',
		// },
		demoTopicTests: {
			title: 'Topic Tests for Quant, VARC, LR, DI',
			description:
				'Attempt topic tests to improve your topics- Quant, VARC, LR, DI.',
		},
		demoSectionalTests: {
			title: 'Sectional Tests for Quant, VARC, LR, DI',
			description:
				'Attempt sectional tests to improve your sections- Quant, VARC, LR, DI.',
		},
		demoCompete: {
			title: 'Live and Mocks Tests for MBA Entrance Exam Preparation',
			description: 'Attempt live tests and full mocks of MBA Entrance Exams.',
		},
	},
	sitemap: [
		'/demo/cat',
		'/demo/cat/practice',
		'/demo/cat/practice/5c9a660e01d3a533d7c16aaf',
		'/demo/cat/practice/5d1f1ba3c144745ffcdcbabf',
		'/demo/cat/topic-tests',
		'/demo/cat/sectional-tests',
		'/demo/cat/compete',
		'/resources',
		'/courses',
		'/courses/cat',
	],
};
