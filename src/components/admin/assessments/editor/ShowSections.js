import React, { useContext } from 'react';
import { QuestionContext } from './QuestionContext';
import Section from './Section';

const ShowSections = () => {
	const questionContext = useContext(QuestionContext);
	const sectionsData = questionContext.finalData;

	return (
		<>
			{sectionsData.map((section, index) => {
				return (
					<Section
						key={index}
						sectionIndex={index}
						totalSections={sectionsData.length}
						sectionData={section}
					/>
				);
			})}
		</>
	);
};

export default ShowSections;
