import React from 'react';
import Tag from 'antd/es/tag';

export const catColumns = [
	{
		title: 'Topic',
		dataIndex: 'topic',
		key: 'topic',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Concepts',
		key: 'tags',
		dataIndex: 'tags',
		render: tags => (
			<span>
				{tags.map(tag => {
					return (
						<Tag key={tag} style={{ margin: 2, fontSize: 9 }}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</span>
		),
	},
	{
		title: 'Practice Questions',
		dataIndex: 'questions',
		key: 'questions',
	},
	{
		title: 'Tests',
		dataIndex: 'tests',
		key: 'tests',
	},
];

export const catData = [
	{
		key: '1',
		topic: 'Numbers',
		questions: 30,
		tests: 3,
		tags: [
			'Classification of Numbers',
			'Even Odd Parity',
			'LCM HCF Model',
			'Prime Number',
			'Factor',
			'Rule of Divisibility',
			'Highest Power of k in n',
			'Last digits in number',
			'Remainder',
		],
	},
	{
		key: '2',
		topic: 'Algebra',
		questions: 30,
		tests: 3,
		tags: [
			'Quadratic Equations',
			'Maxima and Minima',
			'Nature of Roots',
			'Change in Roots',
			'Higher degree equation',
			'Log',
			'Modulus',
			'Surds',
			'Inequaliity',
			'Number and its reverse problem',
			'Age based problem',
			'Simple Equations',
		],
	},
	{
		key: '3',
		topic: 'Progression & Series',
		questions: 30,
		tests: 1,
		tags: [
			'Arithmetic Progression',
			'Geometric Progression',
			'AGP',
			'Summation by finding nth term',
			'Maxima minima using means',
			'Arithmetic Mean',
			'Geometric Mean',
		],
	},
	{
		key: '4',
		topic: 'Average, Ratio & Proportion',
		questions: 30,
		tests: 3,
		tags: [
			'Ratio',
			'Proportion',
			'Simple Average',
			'Weighted Average',
			'Mixture and Alligation',
			'Replacement of Solutions',
			'More than two mixture problems',
		],
	},
	{
		key: '5',
		topic: 'Time, Distance & Work',
		questions: 30,
		tests: 3,
		tags: [
			'Train problem',
			'Speed and Boat',
			'Linear races',
			'Circular races',
			'Clock',
			'Time work approach',
			'Working for different duration',
			'Pipes and Cistern',
			'Alternate Day Problem',
		],
	},
	{
		key: '6',
		topic: 'Profit, Loss, Percentage & Interest',
		questions: 30,
		tests: 2,
		tags: [
			'Basic profit and loss',
			'Marked price and discount',
			'Dishonest merchant',
			'Partnership',
			'Stock and share',
			'Simple interest',
			'Compound interest',
			'Repayment',
			'Difference in CI and SI',
			'Percentage problem',
		],
	},
	{
		key: '7',
		topic: 'Probability & Combinatorics',
		questions: 30,
		tests: 3,
		tags: [
			'Basic PnC',
			'Like object permutation',
			'Sitting arrangement (Gap filling)',
			'Grouping',
			'Circular arrangement',
			'Derangement',
			'Geometry PnC',
			'Word problem/Dictionary',
			'Basic Probability',
			'Cards probability problem',
			'Expected return',
			'Success in k event out of N event',
		],
	},
	{
		key: '8',
		topic: 'Geometry',
		questions: 30,
		tests: 2,
		tags: [
			'Lines and angles',
			'Triangle and its existence',
			'Area of triangle',
			'Geometrical center in triangle',
			'Parallelogram',
			'Squares and rectangle',
			'Cyclic Quadrilateral',
			'Spheres and hemisphere',
			'Coordinate geometry basics',
			'Chord problem',
		],
	},
	{
		key: '9',
		topic: 'Data Interpretation',
		questions: 30,
		tests: 6,
		tags: [
			'Games and Tournament',
			'Charts and Graph',
			'Caselet',
			'networks',
			'Tables',
		],
	},
	{
		key: '10',
		topic: 'Logical Reasoning',
		questions: 30,
		tests: 6,
		tags: [
			'Cubes and Calendar',
			'Arrangements',
			'Combination and Selection',
			'Venn Diagram and Binary Logic',
			'Syllogism and Input Output',
			'Blood Relation/Directions',
			'Coding/Decoding',
		],
	},
	{
		key: '11',
		topic: 'Reading Comprehension',
		questions: 30,
		tests: 6,
		tags: [],
	},
	{
		key: '12',
		topic: 'Verbal Reasoning',
		questions: 30,
		tests: 6,
		tags: [],
	},
];

export const placementColumns = [
	{
		title: 'Topic',
		dataIndex: 'topic',
		key: 'topic',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Concepts',
		key: 'tags',
		dataIndex: 'tags',
		render: tags => (
			<span>
				{tags.map(tag => {
					return (
						<Tag key={tag} style={{ margin: 2, fontSize: 9 }}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</span>
		),
	},
	{
		title: 'Practice Questions',
		dataIndex: 'questions',
		key: 'questions',
	},
];

export const placementData = [
	{
		key: '1',
		topic: 'Numbers',
		questions: 30,
		tests: 3,
		tags: [
			'Classification of Numbers',
			'Even Odd Parity',
			'LCM HCF Model',
			'Prime Number',
			'Factor',
			'Rule of Divisibility',
			'Highest Power of k in n',
			'Last digits in number',
			'Remainder',
		],
	},
	{
		key: '2',
		topic: 'Algebra',
		questions: 30,
		tests: 3,
		tags: [
			'Quadratic Equations',
			'Maxima and Minima',
			'Nature of Roots',
			'Change in Roots',
			'Higher degree equation',
			'Log',
			'Modulus',
			'Surds',
			'Inequaliity',
			'Number and its reverse problem',
			'Age based problem',
			'Simple Equations',
		],
	},
	{
		key: '3',
		topic: 'Progression & Series',
		questions: 30,
		tests: 1,
		tags: [
			'Arithmetic Progression',
			'Geometric Progression',
			'AGP',
			'Summation by finding nth term',
			'Maxima minima using means',
			'Arithmetic Mean',
			'Geometric Mean',
		],
	},
	{
		key: '4',
		topic: 'Average, Ratio & Proportion',
		questions: 30,
		tests: 3,
		tags: [
			'Ratio',
			'Proportion',
			'Simple Average',
			'Weighted Average',
			'Mixture and Alligation',
			'Replacement of Solutions',
			'More than two mixture problems',
		],
	},
	{
		key: '5',
		topic: 'Time, Distance & Work',
		questions: 30,
		tests: 3,
		tags: [
			'Train problem',
			'Speed and Boat',
			'Linear races',
			'Circular races',
			'Clock',
			'Time work approach',
			'Working for different duration',
			'Pipes and Cistern',
			'Alternate Day Problem',
		],
	},
	{
		key: '6',
		topic: 'Profit, Loss, Percentage & Interest',
		questions: 30,
		tests: 2,
		tags: [
			'Basic profit and loss',
			'Marked price and discount',
			'Dishonest merchant',
			'Partnership',
			'Stock and share',
			'Simple interest',
			'Compound interest',
			'Repayment',
			'Difference in CI and SI',
			'Percentage problem',
		],
	},
	{
		key: '7',
		topic: 'Probability & Combinatorics',
		questions: 30,
		tests: 3,
		tags: [
			'Basic PnC',
			'Like object permutation',
			'Sitting arrangement (Gap filling)',
			'Grouping',
			'Circular arrangement',
			'Derangement',
			'Geometry PnC',
			'Word problem/Dictionary',
			'Basic Probability',
			'Cards probability problem',
			'Expected return',
			'Success in k event out of N event',
		],
	},
	{
		key: '8',
		topic: 'Geometry',
		questions: 30,
		tests: 2,
		tags: [
			'Lines and angles',
			'Triangle and its existence',
			'Area of triangle',
			'Geometrical center in triangle',
			'Parallelogram',
			'Squares and rectangle',
			'Cyclic Quadrilateral',
			'Spheres and hemisphere',
			'Coordinate geometry basics',
			'Chord problem',
		],
	},
	{
		key: '9',
		topic: 'Data Interpretation',
		questions: 30,
		tests: 6,
		tags: [
			'Games and Tournament',
			'Charts and Graph',
			'Caselet',
			'networks',
			'Tables',
		],
	},
	{
		key: '10',
		topic: 'Logical Reasoning',
		questions: 30,
		tests: 6,
		tags: [
			'Cubes and Calendar',
			'Arrangements',
			'Combination and Selection',
			'Venn Diagram and Binary Logic',
			'Syllogism and Input Output',
			'Blood Relation/Directions',
			'Coding/Decoding',
		],
	},
	{
		key: '11',
		topic: 'Verbal Ability',
		questions: 60,
		tests: 6,
		tags: ['Reading Comprehension', 'Verbal Reasoning'],
	},
];

export const jeeColumns = [
	{
		title: 'Topic',
		dataIndex: 'topic',
		key: 'topic',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Subtopics',
		key: 'tags',
		dataIndex: 'tags',
		render: tags => (
			<span>
				{tags.map(tag => {
					return (
						<Tag key={tag} style={{ margin: 2, fontSize: 9 }}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</span>
		),
	},
];

export const jeeData = [
	{
		key: '1',
		topic: 'Mechanics 1',
		tags: [
			'Circular Motion',
			'Projectile',
			'Relative Motion',
			'Rectilinear Motion',
			'Maths for Physics',
			'Newtons Law of Motion',
		],
	},
	{
		key: '2',
		topic: 'Mechanics 2',
		tags: [
			'Center of Mass',
			'SHM',
			'Gravitation',
			'Rotation (RBD)',
			'Friction',
			'Work, Power, Energy',
		],
	},
	{
		key: '3',
		topic: 'Fluids and Heat',
		tags: [
			'Fluid Mechanics',
			'Thermodynamics and KTG',
			'Surface Tension',
			'Elasticity and Viscosity',
			'Maxima minima using means',
			'Arithmetic Mean',
			'Geometric Mean',
		],
	},
	{
		key: '4',
		topic: 'Electricity and Magnetism',
		tags: [
			'Electrostatics',
			'Current Electricity',
			'Electromagnetic Induction',
			'Electromagnetic Field',
			'Capacitance',
			'Alternating Current',
			'Magnetism',
		],
	},
	{
		key: '5',
		topic: 'Optics and Wave',
		tags: ['Geometric Optics', 'Wave Optics', 'String Waves', 'Sound Waves'],
	},
	{
		key: '6',
		topic: 'Modern Physics',
		tags: [
			'Modern Physics',
			'Nuclear Physics',
			'Semiconductor',
			'Magnetic Effect of Current (MEC)',
			'Electromagnetic Waves',
			'Errors and Experiments',
		],
	},
	{
		key: '7',
		topic: 'Probability & Statistics',
		tags: [
			'Probability',
			'Statstics',
			'Permutations and Combinations',
			'Mathematical Induction',
		],
	},
	{
		key: '8',
		topic: 'Algebra & Trigonometry',
		tags: [
			'Quadratic Equation',
			'Sequence & Series',
			'Trigonometry',
			'Binomial Theorem',
			'Complex Numbers',
			'SOT',
			'Fundamental of Mathematics',
		],
	},
	{
		key: '9',
		topic: 'Geometry',
		tags: ['Straight Line', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'],
	},
	{
		key: '10',
		topic: 'Calculas',
		tags: [
			'Limits, Continuity and Differentiability',
			'MOD',
			'Functions and Relation',
			'AOD',
		],
	},
	{
		key: '11',
		topic: 'Matrices and Vectors ',
		tags: ['Vector 3D', 'Matrices and Determinants', '3D Geometry'],
	},
	{
		key: '12',
		topic: 'Integral Calculas',
		tags: [
			'Definite Integration',
			'Indefinite Integration',
			'Differential Equation',
			'AUC',
		],
	},
	{
		key: '13',
		topic: 'Physical Chemistry 1',
		tags: [
			'Redox',
			'Mole Concept',
			'Atomic Structure',
			'Gaseous State',
			'Thermodynamics and Thermochemistry',
			'Chemical Equilibrium',
			'Ionic Equilibrium',
		],
	},
	{
		key: '14',
		topic: 'Physical Chemistry 2',
		tags: [
			'Solid States',
			'Solution and Colligative Property',
			'Electrochemistry',
			'Chemical Kinetics',
			'Surface Chemistry',
			'Nuclear Chemistry',
		],
	},
	{
		key: '15',
		topic: 'Organic Chemistry 1',
		tags: [
			'Isomerism',
			'General Organic Chemistry',
			'Hydrocarbon',
			'Purification and Characterization of Organic Compounds',
		],
	},
	{
		key: '16',
		topic: 'Organic Chemistry 2',
		tags: [
			'Aromatic Compound',
			'Reduction Oxidation and Hydrolysis',
			'Bio molecules and Polymers',
			'Halogen containing compounds',
			'Alcohol, Phenol and Ether',
			'Aldehydes and Ketones',
			'Chemistry in everyday life',
			'Carbonyl compound and Acid derivatives',
			'Amines and Diazonium Salt',
		],
	},
	{
		key: '17',
		topic: 'Inorganic Chemistry 1',
		tags: ['S Block', 'Chemical Bonding', 'Periodic Table'],
	},
	{
		key: '18',
		topic: 'Inorganic Chemistry 2',
		tags: [
			'Salt Analysis',
			'Coordination Compound',
			'Metallurgy',
			'D Block',
			'P Block',
		],
	},
];
