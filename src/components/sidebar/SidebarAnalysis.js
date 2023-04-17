import React, { useCallback, useMemo } from 'react';
import QuestionLinkAnalysis from './QuestionLinkAnalysis.js';

import { Tabs } from 'antd';

import './SidebarAnalysis.css';

const TabPane = Tabs.TabPane;

export const SidebarAnalysis = ({
	moveToQuestion,
	sidebarLinks,
	currSection,
	currQuestion,
}) => {
	const handleTabChange = useCallback(
		key => {
			moveToQuestion(parseInt(key.split('-')[1]), 0);
		},
		[moveToQuestion]
	);

	const sectionLinks = useMemo(
		() =>
			sidebarLinks.map((section, id) => {
				return (
					<TabPane key={'section-' + id} tab={section.name}>
						<div className="question-analysis-links-container">
							{section.questions.map(question => {
								return (
									<QuestionLinkAnalysis
										key={'question-' + currSection + '-' + question.qNo}
										currSection={currSection}
										questionNo={question.qNo}
										offset={sidebarLinks[currSection].offset}
										active={currQuestion === question.qNo}
										moveToQuestion={moveToQuestion}
										correct={question.correct}
										isBadChoice={question.isWorstChoice}
									/>
								);
							})}
						</div>
					</TabPane>
				);
			}),
		[currQuestion, currSection, moveToQuestion, sidebarLinks]
	);

	return (
		<div>
			<div
				style={{ marginLeft: 20, fontWeight: 'bolder' }}
				className="sidebar-analysis-heading"
			>
				Question List
			</div>
			<div
				bodyStyle={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
				className="sidebar-analysis-head"
			>
				<Tabs
					centered
					defaultActiveKey={'section-' + currSection}
					activeKey={'section-' + currSection}
					className="sidebar-analysis-tabs"
					onChange={handleTabChange}
				>
					{sectionLinks}
				</Tabs>
			</div>
		</div>
	);
};

export default SidebarAnalysis;
