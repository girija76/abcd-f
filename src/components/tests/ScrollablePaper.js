import React, { useState } from 'react';
import { map } from 'lodash';
import { Button, Tabs } from 'antd';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import Questions from 'components/question/Question';
import './ScrollablePaper.scss';

const { TabPane } = Tabs;

/**
 * All questions on one page
 * For quick view of the paper
 */
function ScrollablePaper({ closeScrollViewMode, test }) {
	const { sections } = test;
	const [activeTab, setActiveTab] = useState('0');
	const handleTabChange = key => {
		setActiveTab(key);
		window.scrollTo(0, 0);
	};
	return (
		<div class="scrollable-paper">
			<div
				style={{
					padding: '0',
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 5,
					backgroundColor: 'white',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						paddingTop: '0.75rem',
					}}
				>
					<Button
						size="large"
						onClick={closeScrollViewMode}
						icon={<EyeInvisibleOutlined />}
					>
						Exit Scroll Mode
					</Button>
				</div>
				<Tabs centered activeKey={activeTab} onChange={handleTabChange}>
					{map(sections, (section, index) => {
						return <TabPane key={index} tab={section.name}></TabPane>;
					})}
				</Tabs>
			</div>
			<div style={{ paddingTop: 125, marginBottom: 24 }}>
				<Section {...sections[activeTab]} />
			</div>
		</div>
	);
}

const Section = ({ name, questions }) => {
	return (
		<div>
			{questions.map((question, index) => {
				return (
					<Question
						key={index}
						{...question}
						sectionName={name}
						attemptMode={false}
						isViewMode
					/>
				);
			})}
		</div>
	);
};

const Question = props => {
	return <Questions {...props} />;
};

export default ScrollablePaper;
