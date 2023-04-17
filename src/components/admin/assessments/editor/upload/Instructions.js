import { message, Modal } from 'antd';
import draftApi from 'apis/draft';
import React from 'react';
import { useParams } from 'react-router';

const PublishingInstructions = ({
	showingInstructions,
	showInstructions,
	hideInstructions,
}) => {
	const { id } = useParams();

	const handlePublishAssessment = () => {
		draftApi.publishAssessment({ id: id }).then(() => {
			message.success('Assessment Published');
		});
		hideInstructions();
	};
	return (
		<>
			<Modal
				width="60%"
				title="Instructions"
				visible={showingInstructions}
				onOk={handlePublishAssessment}
				onCancel={hideInstructions}
				centered
			/>
		</>
	);
};

export default PublishingInstructions;
