import { map, toLower } from 'lodash';

const getCommonTextLengthFromStart = (names, skipNames) => {
	const minLength = Math.min(...map(names, name => name.length));
	let commonLength = 0;
	for (var i = 0; i < minLength; i++) {
		let isCharSame = true;
		for (var j = 1; j < names.length; j++) {
			if (names[j] !== names[j - 1]) {
				isCharSame = false;
				break;
			}
		}
		if (isCharSame) {
			commonLength += 1;
		} else {
			break;
		}
	}
	return commonLength;
};

export const getCommonTextLengthsFromStartAndEnd = names => {
	const lowerCaseNames = map(names, name => toLower(name));
	return [getCommonTextLengthFromStart(lowerCaseNames, ['jee', 'neet']), 0];
};

export function getRandomString(stringLength, options) {
	let result = '';
	const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const alphaNumeric =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const characters = options && options.onlyAlphabets ? alphabets : alphaNumeric;
	const charactersLength = characters.length;
	// eslint-disable-next-line
	for (let i = 0; i < stringLength; i = i + 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
