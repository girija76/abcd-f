import React from 'react';
import { TiSortNumerically } from 'react-icons/ti';
import { RiCheckDoubleFill } from 'react-icons/ri';
import { FaSortNumericUpAlt } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

export const types = [
	{
		key: 'MULTIPLE_CHOICE_SINGLE_CORRECT',
		value: 'MULTIPLE CHOICE SINGLE CORRECT',
		param: '',
		updateParam: 'update',
		icon: <FiCheck />,
	},
	{
		key: 'MULTIPLE_CHOICE_MULTIPLE_CORRECT',
		value: 'MULTIPLE CHOICE MULTIPLE CORRECT',
		param: 'createMultiCorrect',
		updateParam: 'updateMultiCorrect',
		icon: <RiCheckDoubleFill />,
	},
	{
		key: 'INTEGER',
		value: 'INTEGER',
		param: 'createInteger',
		updateParam: 'updateInteger',
		icon: <TiSortNumerically />,
	},
	{
		key: 'RANGE',
		value: 'RANGE',
		param: 'createRange',
		updateParam: 'updateRange',
		icon: <FaSortNumericUpAlt />,
	},
];

export const initialMarkingScheme = [
	{
		key: 'Correct',
		value: 4,
		color: '#90ee90',
	},
	{
		key: 'Incorrect',
		value: -1,
		color: '#ff6863',
	},
];

export const initialDraft = {
	key: 'tab1',
	name: '',
	nameError: '',
	supergroup0: '',
	supergroup: '',
	supergroupError: '',
	duration: '',
	sections: [],
	durationError: '',
	sectionGroups: [],
	sectionError: '',
	correct: 3,
	incorrect: -1,
	correctMultiple: 4,
	incorrectMultiple: -2,
	correctNumerical: 3,
	incorrectNumerical: 0,
	marking1: 'JEE_2019',
	marking2: 'NO_PARTIAL',
	markingError: '',
	instructionType: 'NONE',
	config: {
		questionNumbering: 'overall-increasing',
	},
};
