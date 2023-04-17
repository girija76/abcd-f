import { isEmpty } from 'lodash';

const parseRawContent = rawContent => {
	let parsedContent;
	try {
		parsedContent = JSON.parse(rawContent);
	} catch (e) {
		parsedContent = rawContent;
	}
	return parsedContent;
};

export const isRawContentEmpty = rawContent => {
	let parsedContent = parseRawContent(rawContent);
	return parsedContent.blocks.every(block => {
		return isEmpty(block.text.trim()) && block.type !== 'atomic';
	});
};

export const fixQuestionRawContent = rawContent => {
	const parsedContent = parseRawContent(rawContent);
	const blocks = parsedContent.blocks.map((block, index) => {
		if (index === 0 && block.type === 'unstyled') {
			return {
				...block,
				text: block.text.replace(/^\s+/, ''),
			};
		}
		return block;
	});
	return {
		...parsedContent,
		blocks,
	};
};

export const fixOptionRawContent = rawContent => {
	const parsedContent = parseRawContent(rawContent);
	const blockContentLengths = parsedContent.blocks.map(block => {
		if (block.type === 'unstyled') {
			return block.text.trim().length;
		}
		return 5;
	});
	const indexesToRemove = {};
	for (let i = 0; i < parsedContent.blocks.length; i++) {
		if (blockContentLengths[i] === 0) {
			indexesToRemove[i] = true;
			// remove block
		} else {
			break;
		}
	}

	for (let i = parsedContent.blocks.length - 1; i > -1; i--) {
		if (blockContentLengths[i] === 0) {
			indexesToRemove[i] = true;
			// remove block
		} else {
			break;
		}
	}

	const blocks = parsedContent.blocks.filter((f, index) => {
		return !indexesToRemove[index];
	});

	return { ...parsedContent, blocks };
};
