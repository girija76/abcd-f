import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, get, isEmpty, map } from 'lodash';
import { MdClose, MdList } from 'react-icons/md';
import { Button, Col, Row, Select, Space, Typography } from 'antd';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { groupTopics } from 'components/extra';
import { URLS } from 'components/urls';
import BookmarkItem from './Item';
import { lightGroupColors } from 'components/colors';

const { Title, Text } = Typography;
const bookmarkBaseUrl = URLS.profileBookmarks;

const Bucket = ({ bucket, bookmarkedAtByQuestionId, subTopicsInBucket }) => {
	const { questions } = bucket;
	const [selectedSubTopic, setSelectedSubTopic] = useState(null);
	const filteredItems = useMemo(
		() =>
			filter(
				questions,
				question =>
					!selectedSubTopic || selectedSubTopic === get(question, 'sub_topic')
			),
		[questions, selectedSubTopic]
	);
	const [showCount, setShowCount] = useState(10);
	const Topics = useSelector(state => state.api.Topics);
	let topic_dict = {};
	let sub_topic_dict = {};
	Topics.forEach(topic => {
		topic_dict[topic._id] = topic.name;
		topic.sub_topics.forEach(sub_topic => {
			sub_topic_dict[sub_topic._id] = sub_topic.name;
		});
	});
	return (
		<div style={{ padding: 16 }}>
			<Row align="center" justify="center" style={{ marginBottom: '1em' }}>
				<Col
					lg={0}
					flex="40px"
					style={{ marginLeft: '-16px', alignItems: 'center' }}
				>
					<Link
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						to={bookmarkBaseUrl}
					>
						<Title
							style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}
							level={2}
						>
							<MdKeyboardArrowLeft />
						</Title>
					</Link>
				</Col>
				<Col flex="auto">
					<Title style={{ marginBottom: 0, marginRight: '2rem' }} level={2}>
						{bucket.name}
					</Title>
					{subTopicsInBucket && subTopicsInBucket.length ? (
						<Select
							allowClear
							onChange={v => setSelectedSubTopic(v)}
							showSearch
							optionFilterProp="children"
							style={{
								width: '100%',
								marginTop: '1rem',
								transition: 'all ease 300ms',
							}}
							placeholder="Select topics to filter questions"
						>
							{map(subTopicsInBucket, subTopic => {
								if (!subTopic) {
									return null;
								}
								const topicName = subTopic.topic;
								const subjectName = groupTopics[topicName];
								const color = lightGroupColors[subjectName];
								const style = {
									backgroundColor: color || '#fff',
									color: '#000',
								};
								return (
									<Select.Option key={subTopic._id} value={subTopic._id} style={style}>
										{subTopic.topic} / {subTopic.name} ({subTopic.count})
									</Select.Option>
								);
							})}
						</Select>
					) : null}
				</Col>
			</Row>
			{isEmpty(questions) ? (
				<Text>No questions here</Text>
			) : (
				<Space direction="vertical" style={{ width: '100%' }}>
					{map(
						filter(filteredItems, (_item, index) => index < showCount),
						(item, index) => {
							return (
								<BookmarkItem
									isLast={index === questions.length - 1}
									topic={topic_dict[item.topic]}
									subTopic={sub_topic_dict[item.sub_topic]}
									_id={item._id}
									content={item.content}
									bookmarkedAt={bookmarkedAtByQuestionId[item._id]}
								/>
							);
						}
					)}
					{showCount < filteredItems.length ? (
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button onClick={() => setShowCount(showCount + 20)} type="primary">
								Show More
							</Button>
						</div>
					) : null}
				</Space>
			)}
		</div>
	);
};

const iconMap = {
	Close: MdClose,
	List: MdList,
};
export const Preview = ({ _id, color, icon, isSelected, name, itemCount }) => {
	const IconComponent = iconMap[icon] || iconMap.List;
	const rootStyle = {
		color: isSelected ? '#fff' : '#8d8c8f',
		backgroundColor: isSelected ? color : '#eff2f5',
		padding: 16,
		borderRadius: 8,
		display: 'block',
		// width: 160,
	};
	const itemCountStyle = {
		marginBottom: 0,
		color: isSelected ? '#fff' : undefined,
	};
	const iconContainerStyle = {
		backgroundColor: isSelected ? '#fff' : color,
		borderRadius: 20,
		padding: 4,
	};
	const iconStyle = { fontSize: 18, color: isSelected ? color : '#fff' };
	const textContainerStyle = { marginTop: 8 };
	return (
		<Link to={`${bookmarkBaseUrl}/${_id}`} style={rootStyle}>
			<Row align="middle" justify="space-between">
				<Row align="center" justify="center" style={iconContainerStyle}>
					<IconComponent style={iconStyle} />
				</Row>
				<Title level={2} style={itemCountStyle}>
					{itemCount}
				</Title>
			</Row>
			<div style={textContainerStyle}>
				<Text
					ellipsis
					style={{
						marginBottom: 0,
						width: '100%',
						color: isSelected ? '#fff' : undefined,
					}}
				>
					{name}
				</Text>
			</div>
		</Link>
	);
};

export default Bucket;
