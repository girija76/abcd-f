import React, { createContext, useState } from 'react';

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
	const initialMarkingScheme = [
		{
			key: 'correct',
			value: 4,
		},
		{
			key: 'incorrect',
			value: -1,
		},
		{
			key: 'skip',
			value: 0,
		},
	];

	const [finalData, setFinalData] = useState([]);
	const [savedMarkingSchemes, setSavedMarkingSchemes] = useState([]);
	const [selectedNavigation, setSelectedNavigation] = useState({
		section: 0,
		question: 0,
	});

	console.log('selectedNavigation', selectedNavigation);

	const scrollToQuestion = id => {
		document.getElementById(id).scrollIntoView();
	};

	const scrollToSection = id => {
		document.getElementById(id).scrollIntoView();
	};

	console.log('finalData', finalData);

	return (
		<QuestionContext.Provider
			value={{
				finalData,
				initialMarkingScheme,
				savedMarkingSchemes,
				selectedNavigation,
				setFinalData,
				setSavedMarkingSchemes,
				scrollToQuestion,
				scrollToSection,
				setSelectedNavigation,
			}}
		>
			{children}
		</QuestionContext.Provider>
	);
};
