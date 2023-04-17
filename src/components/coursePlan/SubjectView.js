import React, { useEffect, useMemo, useState } from 'react';
import { forEach, get } from 'lodash';
import { Card, Space, Tag, Timeline, Typography } from 'antd';
import { FaDotCircle } from 'react-icons/fa';

const { Text } = Typography;

const colorsByResourceType = {
	Video: 'gold',
	Assignment: 'geekblue',
};

const groupByKey = (items, key, defaultKeyValue) => {
	const groupsByKey = {};
	const keys = [];
	forEach(items, item => {
		const keyValue = get(item, [key], defaultKeyValue) || defaultKeyValue;
		if (!groupsByKey[keyValue]) {
			groupsByKey[keyValue] = [];
			keys.push(keyValue);
		}
		groupsByKey[keyValue].push(item);
	});
	return keys.map(key => ({ title: key, items: groupsByKey[key] }));
};

const SubjectWiseCoursePlanViewer = ({
	items,
	publishedTill,
	title,
	resourceTypeAliasMap,
}) => {
	const subjectWiseGroups = useMemo(
		() => groupByKey(items, 'subject', 'Other'),
		[items]
	);
	const topicWiseGroupingInSubject = useMemo(
		() =>
			subjectWiseGroups.map(group => {
				const topicWiseGroups = groupByKey(group.items, ['topic'], 'Others');
				const dateWiseGroups = topicWiseGroups.map(topicWiseGroup => {
					const { items, title } = topicWiseGroup;
					return {
						title,
						items: groupByKey(
							items.map(item => ({
								...item,
								onDate: item.availableFrom && item.availableFrom.format('Do MMM YY'),
							})),
							'onDate'
						),
					};
				});
				return {
					...group,
					items: dateWiseGroups,
				};
			}),
		[subjectWiseGroups]
	);
	const tabs = useMemo(
		() =>
			topicWiseGroupingInSubject.map(subject => ({
				tab: subject.title,
				key: subject.title,
			})),
		[topicWiseGroupingInSubject]
	);
	const [selectedTab, setSelectedTab] = useState();
	const [currentSubject, setCurrentSubject] = useState(null);
	useEffect(() => {
		setSelectedTab(get(tabs, [0, 'key']));
	}, [tabs]);

	useEffect(() => {
		topicWiseGroupingInSubject.forEach(({ title, items }) => {
			if (title === selectedTab) {
				setCurrentSubject({ title, items });
			}
		});
	}, [selectedTab, topicWiseGroupingInSubject]);

	return (
		<Card
			title={title}
			tabList={Array.isArray(tabs) && tabs.length > 1 ? tabs : null}
			bodyStyle={{ padding: 8, display: 'flex' }}
			style={{ marginBottom: 8 }}
			activeTabKey={selectedTab}
			onTabChange={tabKey => setSelectedTab(tabKey)}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				{currentSubject &&
					currentSubject.items.map(group => (
						<Card
							size="small"
							key={group.title}
							title={group.title}
							bodyStyle={{ paddingBottom: 0, paddingTop: '2rem' }}
						>
							<Timeline mode="alternate">
								{group.items.map((item, index) => {
									const isGroupAvailable =
										items[0].availableFrom &&
										items[0].availableFrom.isBefore(publishedTill);
									const formattedDate = item.title;

									return (
										<Timeline.Item
											key={formattedDate}
											label={<Text type="secondary">{formattedDate}</Text>}
											dot={isGroupAvailable ? <FaDotCircle /> : undefined}
										>
											{item.items.map(item => {
												const resourceType = get(item, ['resourceModel']);
												const color = get(colorsByResourceType, resourceType);
												const resourceTypeAlias = get(
													resourceTypeAliasMap,
													[resourceType],
													resourceType
												);
												const isContentOnLeft = index % 2 === 1;
												return (
													<div
														key={item._id}
														style={{
															marginBottom: 4,
															display: 'flex',
															flexDirection: isContentOnLeft ? 'row-reverse' : 'row',
															flexWrap: 'wrap',
														}}
													>
														<Tag style={{ margin: 0 }} color={color}>
															{resourceTypeAlias}
														</Tag>
														<span style={{ margin: '0 4px' }}>
															{get(item, ['resource', 'title'])}
														</span>
													</div>
												);
											})}
										</Timeline.Item>
									);
								})}
							</Timeline>
						</Card>
					))}
			</Space>
		</Card>
	);
};

export default SubjectWiseCoursePlanViewer;
