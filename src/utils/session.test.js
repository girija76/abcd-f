import { parseConfigParameters, createConfigParameter } from './session';

it('PARSE session config params from url', () => {
	expect(
		parseConfigParameters({
			clt: 't',
			alr: '1',
			cs: '1',
			db: '1',
			ptf: '1',
			pts: '1',
			tq: 11,
			til: 180,
			tsd: 'puq',
			ss: 10,
			st: 'something',
			qst: 1200,
			tfm: 2,
			abts: 15,
		})
	).toEqual({
		clockType: 'timer',
		allowReattempt: '1',
		canSkip: '1',
		disableBack: '1',
		preventTooFast: '1',
		preventTooSlow: '1',
		totalQuestions: 11,
		timeLimit: 180,
		tooSlowDetector: 'puq',
		shouldSelect: 10,
		sessionType: 'something',
		questionSelectionTimeLimit: 1200,
		tooFastMultiplier: 2,
		alertBeforeTooSlow: 15,
	});
	expect(parseConfigParameters({ pts: '1' })).toEqual({
		preventTooSlow: '1',
	});
	expect(parseConfigParameters({ scl: undefined })).toEqual({});
	expect(parseConfigParameters({ alr: '1' })).toEqual({ allowReattempt: '1' });
	expect(parseConfigParameters({ alr: '' })).toEqual({});
	expect(parseConfigParameters({ st: 'something' })).toEqual({
		sessionType: 'something',
	});
	expect(parseConfigParameters({ qst: 100 })).toEqual({
		questionSelectionTimeLimit: 100,
	});
	expect(parseConfigParameters({ tfm: 3 })).toEqual({ tooFastMultiplier: 3 });
});

it('CREATE config params for url', () => {
	expect(createConfigParameter({})).toEqual('{}');
	expect(createConfigParameter({ preventTooSlow: '1' })).toEqual('{"pts":"1"}');
	expect(createConfigParameter({ preventTooFast: '1' })).toEqual('{"ptf":"1"}');
	expect(createConfigParameter({ allowReattempt: '1' })).toEqual('{"alr":"1"}');
	expect(createConfigParameter({ clockType: 'timer' })).toEqual('{"clt":"t"}');
	expect(createConfigParameter({ shouldSelect: 150 })).toEqual('{"ss":150}');
	expect(createConfigParameter({ sessionType: 'something' })).toEqual(
		'{"st":"something"}'
	);
	expect(createConfigParameter({ questionSelectionTimeLimit: 200 })).toEqual(
		'{"qst":200}'
	);
	expect(createConfigParameter({ tooFastMultiplier: 20 })).toEqual('{"tfm":20}');
	let randomNumber;
	for (let i = -1; i < 10; i++) {
		randomNumber = i === -1 ? 0 : Math.ceil(Math.random() * 1000) + 1;
		expect(createConfigParameter({ totalQuestions: randomNumber })).toEqual(
			randomNumber === 0 ? '{}' : `{"tq":${randomNumber}}`
		);
		expect(createConfigParameter({ timeLimit: randomNumber })).toEqual(
			randomNumber === 0 ? '{}' : `{"til":${randomNumber}}`
		);
	}
});

it('create and parse config are INVERSE of each other', () => {
	const a = {};
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.preventTooFast = '1';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.preventTooSlow = '1';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.canSkip = '1';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.disableBack = '1';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.clockType = 'timer';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.allowReattempt = '1';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.shouldSelect = Math.ceil(Math.random() * 100);
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.sessionType = Math.random() + '';
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.questionSelectionTimeLimit = 1222000;
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
	a.tooFastMultiplier = 12;
	expect(parseConfigParameters(JSON.parse(createConfigParameter(a)))).toEqual(a);
});
