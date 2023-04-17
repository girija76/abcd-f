import quant from './images/topics/quant.svg'; // use admin panel to manage svgs
import verbal from './images/topics/verbal.svg';
import di from './images/topics/di.svg';
import lr from './images/topics/lr.svg';
import algebra from './images/topics/maths/algebra.svg';
import calculas from './images/topics/maths/calculas.svg';
import geometry from './images/topics/maths/geometry.svg';
import integral from './images/topics/maths/intragral.svg';
import matrices from './images/topics/maths/matrices.svg';
import prob from './images/topics/maths/prob.svg';

import physical1 from './images/topics/chemistry/physical1.svg';
import physical2 from './images/topics/chemistry/physical2.svg';
import organic1 from './images/topics/chemistry/organic1.svg';
import organic2 from './images/topics/chemistry/organic2.svg';
import inorganic1 from './images/topics/chemistry/inorganic1.svg';
import inorganic2 from './images/topics/chemistry/inorganic2.svg';

import mechanics1 from './images/topics/physics/mechanics1.svg';
import mechanics2 from './images/topics/physics/mechanics2.svg';
import fluids from './images/topics/physics/fluids.svg';
import magnetism from './images/topics/physics/magnetism.svg';
import optics from './images/topics/physics/optics.svg';
import nuclear from './images/topics/physics/nuclear.svg';

import programming from './images/topics/programming.svg';
import ml from './images/topics/ml.svg';

import quant_color from './images/topics/quant_color.svg';
import verbal_color from './images/topics/verbal_color.svg';
import di_color from './images/topics/di_color.svg';
import lr_color from './images/topics/lr_color.svg';

import algebra_color from './images/topics/maths/algebra_color.svg';
import calculas_color from './images/topics/maths/calculas_color.svg';
import geometry_color from './images/topics/maths/geometry_color.svg';
import integral_color from './images/topics/maths/intragral_color.svg';
import matrices_color from './images/topics/maths/matrices_color.svg';
import prob_color from './images/topics/maths/prob_color.svg';

import physical1_color from './images/topics/chemistry/physical1_color.svg';
import physical2_color from './images/topics/chemistry/physical2_color.svg';
import organic1_color from './images/topics/chemistry/organic1_color.svg';
import organic2_color from './images/topics/chemistry/organic2_color.svg';
import inorganic1_color from './images/topics/chemistry/inorganic1_color.svg';
import inorganic2_color from './images/topics/chemistry/inorganic2_color.svg';

import mechanics1_color from './images/topics/physics/mechanics1_color.svg';
import mechanics2_color from './images/topics/physics/mechanics2_color.svg';
import fluids_color from './images/topics/physics/fluids_color.svg';
import magnetism_color from './images/topics/physics/magnetism_color.svg';
import optics_color from './images/topics/physics/optics_color.svg';
import nuclear_color from './images/topics/physics/nuclear_color.svg';

import SatReading from './images/topics/sat/reading.svg';
import SatWriting from './images/topics/sat/writing.svg';
import SatReadingColor from './images/topics/sat/reading-color.svg';
import SatWritingColor from './images/topics/sat/writing-color.svg';
import SatCalculator from './images/topics/sat/calculator.svg';
import SatCalculatorColor from './images/topics/sat/calculator-color.svg';

import programming_color from './images/topics/programming_color.svg';
import ml_color from './images/topics/ml_color.svg';

export const topicImages = {
	Quant: quant,
	VARC: verbal,
	'Data Interpretation': di,
	'Logical Reasoning': lr,
	'Probability & Statistics': prob,
	'Algebra & Trigonometry': algebra,
	Geometry: geometry,
	Calculus: calculas,
	'Matrices and vectors': matrices,
	'Integral Calculus': integral,
	'Physical Chemistry 1': physical1,
	'Physical Chemistry 2': physical2,
	'Organic Chemistry 1': organic1,
	'Organic Chemistry 2': organic2,
	'Inorganic Chemistry 1': inorganic1,
	'Inorganic Chemistry 2': inorganic2,
	'Mechanics 1': mechanics1,
	'Mechanics 2': mechanics2,
	'Electricity and Magnetism': magnetism,
	'Fluids and Heat': fluids,
	'Optics and Waves': optics,
	'Modern Physics': nuclear,
	Programming: programming,
	'Statistics & Machine Learning': ml,
	'Math - No Calculator': algebra,
	'Math - Calculator': SatCalculator,
	Reading: SatReading,
	Writing: SatWriting,
};

export const topicColorImages = {
	Quant: quant_color,
	VARC: verbal_color,
	'Data Interpretation': di_color,
	'Logical Reasoning': lr_color,
	'Probability & Statistics': prob_color,
	'Algebra & Trigonometry': algebra_color,
	Geometry: geometry_color,
	Calculus: calculas_color,
	'Matrices and vectors': matrices_color,
	'Integral Calculus': integral_color,
	'Physical Chemistry 1': physical1_color,
	'Physical Chemistry 2': physical2_color,
	'Organic Chemistry 1': organic1_color,
	'Organic Chemistry 2': organic2_color,
	'Inorganic Chemistry 1': inorganic1_color,
	'Inorganic Chemistry 2': inorganic2_color,
	'Mechanics 1': mechanics1_color,
	'Mechanics 2': mechanics2_color,
	'Electricity and Magnetism': magnetism_color,
	'Fluids and Heat': fluids_color,
	'Optics and Waves': optics_color,
	'Modern Physics': nuclear_color,
	Programming: programming_color,
	'Statistics & Machine Learning': ml_color,
	'Math - No Calculator': algebra_color,
	'Math - Calculator': SatCalculatorColor,
	Reading: SatReadingColor,
	Writing: SatWritingColor,
};

export const groupTopics = {
	'Mechanics 1': 'Physics',
	'Mechanics 2': 'Physics',
	'Fluids and Heat': 'Physics',
	'Electricity and Magnetism': 'Physics',
	'Optics and Waves': 'Physics',
	'Modern Physics': 'Physics',
	'Physical Chemistry 1': 'Chemistry',
	'Physical Chemistry 2': 'Chemistry',
	'Organic Chemistry 1': 'Chemistry',
	'Organic Chemistry 2': 'Chemistry',
	'Inorganic Chemistry 1': 'Chemistry',
	'Inorganic Chemistry 2': 'Chemistry',
	'Probability & Statistics': 'Maths',
	'Algebra & Trigonometry': 'Maths',
	Geometry: 'Maths',
	Calculus: 'Maths',
	'Matrices and vectors': 'Maths',
	'Integral Calculus': 'Maths',
	'Math - No Calculator': 'SAT',
	'Math - Calculator': 'SAT',
	Reading: 'SAT',
	Writing: 'SAT',
	// Quant: 'Quant',
};

export const monthNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export const defaultTopics = {
	'5dd95e8097bc204881be3f2c': [
		{
			// Integral Calculus
			id: '5d641e2b2e8a7c5406d4448d',
			'correct-too-fast': 0,
			'correct-optimum': 9,
			'correct-too-slow': 0,
			'incorrect-too-fast': 0,
			'incorrect-optimum': 2,
			'incorrect-too-slow': 2,
			unattempted: 10,
			subTopics: [
				{
					// Indefinite Integration
					id: '5d6426ce2e8a7c5406d4453a',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
				{
					// Definite Integration
					id: '5d6426c62e8a7c5406d44539',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
			],
		},
		{
			// Electricity and Magnetism
			id: '5d641d8f2e8a7c5406d44478',
			'correct-too-fast': 0,
			'correct-optimum': 8,
			'correct-too-slow': 3,
			'incorrect-too-fast': 1,
			'incorrect-optimum': 10,
			'incorrect-too-slow': 4,
			unattempted: 15,
			subTopics: [
				{
					// EMF
					id: '5d6421c92e8a7c5406d444b7',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 3,
					'incorrect-too-fast': 1,
					'incorrect-optimum': 10,
					'incorrect-too-slow': 2,
					unattempted: 10,
				},
				{
					// Capacitance
					id: '5d6421da2e8a7c5406d444b8',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
			],
		},
	],
	'5d10e42744c6e111d0a17d0a': [
		{
			// Quant
			id: '5c9a660e01d3a533d7c16aaf',
			'correct-too-fast': 0,
			'correct-optimum': 9,
			'correct-too-slow': 0,
			'incorrect-too-fast': 0,
			'incorrect-optimum': 2,
			'incorrect-too-slow': 2,
			unattempted: 10,
			subTopics: [
				{
					// Geometry
					id: '5ce27ff5ff96dd1f72ce918a',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
				{
					// P n C
					id: '5ce27fc8ff96dd1f72ce9136',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
			],
		},
		{
			// VARC
			id: '5d1f1ba3c144745ffcdcbabf',
			'correct-too-fast': 0,
			'correct-optimum': 8,
			'correct-too-slow': 3,
			'incorrect-too-fast': 1,
			'incorrect-optimum': 10,
			'incorrect-too-slow': 4,
			unattempted: 15,
			subTopics: [
				{
					// Verbal Reasoning
					id: '5d5e63c4eaf5f804d9c7d975',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 3,
					'incorrect-too-fast': 1,
					'incorrect-optimum': 10,
					'incorrect-too-slow': 2,
					unattempted: 10,
				},
				{
					// Para Jumble / Completion
					id: '5da78b6af0197223284a2783',
					'correct-too-fast': 0,
					'correct-optimum': 4,
					'correct-too-slow': 0,
					'incorrect-too-fast': 0,
					'incorrect-optimum': 0,
					'incorrect-too-slow': 2,
					unattempted: 5,
				},
			],
		},
	],
};
