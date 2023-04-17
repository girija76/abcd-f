import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Divider, Grid, Typography } from 'antd';
import Editor from 'components/Editor';
import { URLS } from 'components/urls';

const { useBreakpoint } = Grid;

const { Text, Title } = Typography;

const BookmarkItem = ({
	_id,
	content,
	topic,
	subTopic,
	isLast,
	bookmarkedAt,
}) => {
	const rootRef = useRef();
	const screens = useBreakpoint();
	useEffect(() => {}, [content, _id, topic, subTopic]);
	return (
		<Link
			to={`${URLS.reviewQuestions}?id=${_id}`}
			ref={rootRef}
			style={{
				maxHeight: '200px',
				overflow: 'hidden',
				position: 'relative',
				padding: `16px ${screens.lg ? '0px' : '8px'}`,
				display: 'block',
			}}
		>
			<Title style={{ marginBottom: 0 }} level={3}>
				<span style={{ color: 'rgba(0,0,0,.75)' }}>{topic}</span>
				<span style={{ color: 'rgba(0,0,0,.6)', fontWeight: 'normal' }}>
					{' / '}
				</span>
				{subTopic}
			</Title>
			<div style={{ marginBottom: '0.75em' }}>
				<Text type="secondary">
					{dayjs(bookmarkedAt).format('D MMM YY hh:mm a')}
				</Text>
			</div>
			<div style={{ display: 'flex' }}>
				<Editor key={_id} rawContent={content.rawContent} />
			</div>
			<div style={{ marginTop: 12 }} />
			{isLast ? null : (
				<Divider
					style={{ position: 'absolute', bottom: 0, margin: 0 }}
					type="horizontal"
				/>
			)}
		</Link>
	);
};

export default BookmarkItem;
