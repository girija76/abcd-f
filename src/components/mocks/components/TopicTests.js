import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Card, Col, Row, Space, Spin, Typography } from 'antd';
import { activePhaseIdSelector } from 'selectors/user';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { getTopicGroups } from '../../libs/lib';

import { updateAssessmentWrappersAndFeeds } from '../../api/ApiAction';
import getwrappers from '../../api/getwrappers';
import { getTagValueByKey, createGroupsByTag } from 'utils/tags';
import { allTopicSelector, topicsByIdSelector } from 'selectors/topic';
import SubSectionItem from './SubSectionItem';
import { useHistory, useRouteMatch } from 'react-router';
import SubSection from './SubSection';
import { AiOutlineFrown } from 'react-icons/ai';
import { topicTestsTitle } from 'utils/config';

const { Text } = Typography;

const TopicTestsPage = ({ isMobileUI, match }) => {
	const history = useHistory();
	const sectionMatch = useRouteMatch(`${match.url}/:Section`);
	const subSectionMatch = useRouteMatch(`${match.url}/:Section/:SubSection`);

	const activeTabKey = sectionMatch ? sectionMatch.params.Section : null;
	const activeSubSectionKey = subSectionMatch
		? subSectionMatch.params.SubSection
		: null;

	const activePhaseId = useSelector(activePhaseIdSelector);
	const topicsById = useSelector(topicsByIdSelector);
	const dispatch = useDispatch();
	const allTopics = useSelector(allTopicSelector);
	const { topicGroupsReverse: hardCodedSectionsByTopicId } = useMemo(() => {
		return getTopicGroups(allTopics);
	}, [allTopics]);
	const setActiveTabKey = useCallback(
		key => {
			history.push(`${match.url}/${key}`);
		},
		[history, match.url]
	);
	const { data: assessmentData, isFetching } = useQuery(
		['get-assessments', activePhaseId],
		() => getwrappers(activePhaseId),
		{
			staleTime: 60 * 60 * 1000,
		}
	);
	const allAssessmentWrappers = useMemo(
		() => (assessmentData ? assessmentData.assessmentWrappers : []),
		[assessmentData]
	);
	const topicTests = useMemo(
		() =>
			allAssessmentWrappers
				.filter(wrapper => wrapper.type === 'TOPIC-MOCK')
				.map(wrapper => {
					const tags = wrapper.tags.map(t => ({ ...t })) || [];
					let section = getTagValueByKey(tags, 'Section');
					if (!section) {
						const hardCodedSection = hardCodedSectionsByTopicId[wrapper.topic];
						if (!hardCodedSection) {
							section = 'Other';
						} else {
							section = hardCodedSection;
						}
					}
					let subSection = getTagValueByKey(tags, 'Sub Section');
					if (!subSection) {
						const topic = topicsById[wrapper.topic];
						const topicName = topic ? topic.name : 'Other';
						subSection = topicName;
					}
					return {
						...wrapper,
						tags: [
							{
								key: 'Section',
								value: section,
							},
							{
								key: 'Sub Section',
								value: subSection,
							},
						],
					};
				}),
		[allAssessmentWrappers, hardCodedSectionsByTopicId, topicsById]
	);
	const topicTestSections = useMemo(() => {
		return createGroupsByTag(topicTests, 'Section', 'tags').map(
			({ label, items }) => ({
				label,
				items: createGroupsByTag(items, 'Sub Section', 'tags'),
			})
		);
	}, [topicTests]);
	useEffect(() => {
		if (assessmentData) {
			dispatch(updateAssessmentWrappersAndFeeds(assessmentData));
		}
	}, [assessmentData, dispatch]);
	const tabList = useMemo(() => {
		const tabs = topicTestSections.map(({ label }) => ({
			key: label,
			tab: label,
		}));
		return tabs;
	}, [topicTestSections]);
	useEffect(() => {
		if (!activeTabKey) {
			if (tabList.length) {
				const firstTabKey = tabList[0].key;
				setActiveTabKey(firstTabKey);
			}
		}
	}, [activeTabKey, setActiveTabKey, tabList]);
	const hideTabs = useMemo(
		() =>
			tabList &&
			tabList.length === 1 &&
			activeTabKey === tabList[0].label &&
			activeTabKey === 'Other',
		[activeTabKey, tabList]
	);
	const activeSection = useMemo(
		() => topicTestSections.filter(({ label }) => label === activeTabKey)[0],
		[activeTabKey, topicTestSections]
	);
	const activeSubSection = useMemo(
		() =>
			activeSection && activeSubSectionKey
				? activeSection.items.filter(
						({ label }) => label === activeSubSectionKey
				  )[0]
				: null,
		[activeSection, activeSubSectionKey]
	);
	if (isFetching) {
		return (
			<div
				style={{
					backgroundColor: 'white',
					minHeight: '50vh',
					textAlign: 'center',
					padding: '1rem',
				}}
			>
				<Spin
					indicator={<Loading3QuartersOutlined spin style={{ fontSize: 36 }} />}
				/>
				<div style={{ marginTop: 8 }}>
					<span style={{ visibility: 'hidden' }}>...</span>Loading...
				</div>
			</div>
		);
	}
	return (
		<Card
			style={{
				width: '100%',
				background: isMobileUI ? 'white' : '',
				borderRadius: 0,
			}}
			bodyStyle={{ padding: isMobileUI ? 8 : '1rem' }}
			headStyle={{
				fontSize: 18,
				fontWeight: 'bold',
				padding: isMobileUI ? 0 : '',
			}}
			title={!isMobileUI ? topicTestsTitle : null}
			tabList={!hideTabs ? tabList : null}
			activeTabKey={activeTabKey}
			bordered={false}
			onTabChange={setActiveTabKey}
		>
			{sectionMatch && sectionMatch.isExact ? (
				<Row gutter={[12, 12]}>
					{activeSection
						? activeSection.items.map(
								({ label: subSectionLabel, items: assessmentWrappers }) => {
									return (
										<Col
											key={`${activeSection.label}-${subSectionLabel}`}
											xs={24}
											sm={24}
											md={12}
											lg={8}
											xxs={6}
										>
											<SubSectionItem
												key={`${activeSection.label}-${subSectionLabel}`}
												label={subSectionLabel}
												items={assessmentWrappers}
												baseUrl={sectionMatch.url}
											/>
										</Col>
									);
								}
						  )
						: 'No tests found'}
				</Row>
			) : activeSubSection ? (
				<SubSection backUrl={sectionMatch.url} {...activeSubSection} />
			) : (
				<div style={{ paddingTop: 24, paddingBottom: 24 }}>
					<Space style={{ width: '100%' }} direction="vertical" align="center">
						<AiOutlineFrown style={{ fontSize: 36, color: '#607d8b' }} />
						<Text style={{ color: '#607d8b' }}>No tests here.</Text>
					</Space>
				</div>
			)}
		</Card>
	);
};

export default TopicTestsPage;
