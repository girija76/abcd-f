import React, { useState } from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';

import PracticeInstructions from '../../../../../components/instructions/PracticeInstructions';

import { generateSmartInstructionsNew2 } from '../../../../../components/analysis/lib';

import './style.scss';

const cMap = {
	intent: 1,
	endurance: 2,
	selectivity: 3,
	stubbornness: 4,
	stamina: 4,
};

const sessionTypes = {
	intent: 'Intent',
	endurance: 'Endurance',
	selectivity: 'selectivity',
	stubbornness: 'Agility',
	stamina: 'Stamina',
};

const InstructionButton = ({ session, Topics }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const baseClass = 'active-session-end';

	const { config } = session;
	const TopicNameMapping = {};
	Topics.forEach(topic => {
		TopicNameMapping[topic._id] = topic.name;
		topic.sub_topics.forEach(subTopic => {
			TopicNameMapping[subTopic._id] = subTopic.name;
		});
	});
	const cAssigned = cMap[config.sessionType] ? cMap[config.sessionType] : 0;

	const instructions = generateSmartInstructionsNew2(cAssigned, config);

	const extraInfo = sessionTypes[config.sessionType]
		? ' - ' + sessionTypes[config.sessionType] + ' Improvement'
		: '';

	return (
		<React.Fragment>
			<button
				className={`${baseClass}-button`}
				onClick={() => {
					setIsModalOpen(true);
				}}
			>
				Instructions
			</button>
			<Modal
				title={`Instructions${extraInfo}`}
				visible={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				footer={
					<Button
						type="primary"
						onClick={() => {
							setIsModalOpen(false);
						}}
					>
						Okay
					</Button>
				}
				bodyStyle={{ fontSize: '16px' }}
			>
				<PracticeInstructions instructions={instructions} />
			</Modal>
		</React.Fragment>
	);
};

export default InstructionButton;
