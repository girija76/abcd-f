import React, { useMemo, useState } from 'react';
import { useBoolean } from 'use-boolean';
import { Card, Modal, Tooltip } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { URLS } from 'components/urls';
import { customSyllabus } from '../customSyllabus';
import Instructions from 'components/instructions/Instructions';
import Syllabus from 'components/instructions/Syllabus';

function StartTestButtonWrapper({
	component: Component,
	test,
	status,
	mode,
	...otherProps
}) {
	const [key, setKey] = useState('instructions');
	const [isModalOpen, openModal, closeModal] = useBoolean(false);
	const tabs = [
		{
			key: 'instructions',
			tab: 'Instructions',
		},
		{
			key: 'syllabus',
			tab: 'Syllabus',
		},
	];
	const handleClick = () => {
		openModal();
		otherProps.onClick();
	};
	const content = useMemo(() => {
		const customInstructions = test.core.customInstructions;

		let testUrl = URLS.liveTest;

		let cs = null;
		if (test.core.customSyllabus && test.core.customSyllabus.length) {
			cs = test.core.customSyllabus;
		} else if (customSyllabus[test._id]) {
			cs = customSyllabus[test._id];
		}

		const af = new Date(test.availableFrom).getTime();
		const tn = new Date().getTime();

		return {
			tab1: (
				<Instructions
					instructions={test.core.instructions}
					sectionInstructions={test.core.sectionInstructions}
					customInstructions={customInstructions}
					id={test._id}
					cost={test.cost}
					reward={test.reward}
					status={status}
					mode={mode}
					testUrl={testUrl}
					disableBegin={af > tn}
				/>
			),
			tab2: <Syllabus syllabus={test.core.syllabus} customSyllabus={cs} />,
		};
	}, [
		mode,
		status,
		test._id,
		test.availableFrom,
		test.core.customInstructions,
		test.core.customSyllabus,
		test.core.instructions,
		test.core.sectionInstructions,
		test.core.syllabus,
		test.cost,
		test.reward,
	]);
	return (
		<>
			<Component onClick={handleClick} />
			<Modal
				title={
					<div>
						<span style={{ fontWeight: 'bolder' }}>{test.name}</span>
						{test.description ? (
							<Tooltip
								title={test.description}
								placement="top"
								overlayClassName="rating-description-tooltip"
							>
								<InfoCircleTwoTone style={{ fontSize: 16, marginLeft: 10 }} />
							</Tooltip>
						) : null}
					</div>
				}
				visible={isModalOpen}
				footer={null}
				onCancel={closeModal}
				bodyStyle={{ padding: 0 }}
				headStyle={{ borderBottom: '0px' }}
				style={{ color: 'blue' }}
				className="instructions-modal"
			>
				<Card
					className="instructions-card"
					headStyle={{ fontSize: 24 }}
					tabList={tabs}
					activeTabKey={key}
					onTabChange={key => {
						setKey(key);
					}}
					bordered={false}
					bodyStyle={{ padding: 18 }}
				>
					{content[key]}
				</Card>
			</Modal>
		</>
	);
}

export default StartTestButtonWrapper;
