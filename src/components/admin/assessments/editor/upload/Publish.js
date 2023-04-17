import { Button } from 'antd';
import React from 'react';
import { useBoolean } from 'use-boolean';
import PublishingInstructions from './Instructions';

const PublishAssessment = () => {
	const [showingInstructions, showInstructions, hideInstructions] = useBoolean(
		false
	);
	return (
		<div>
			<Button onClick={showInstructions}>Publish Assessment</Button>
			<PublishingInstructions
				showingInstructions={showingInstructions}
				showInstructions={showInstructions}
				hideInstructions={hideInstructions}
			/>
		</div>
	);
};

export default PublishAssessment;
