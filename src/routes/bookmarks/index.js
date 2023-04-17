import React, { useEffect, useMemo, useState } from 'react';
import { filter, forEach, get, isEmpty, map } from 'lodash';
import { useQuery, queryCache } from 'react-query';
import { Button, Card, Col, Divider, Grid, Row, Spin, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouteMatch } from 'react-router-dom';
import Bucket, { Preview as BucketPreview } from 'components/bookmarks/Bucket';
import Create from 'components/bookmarks/Create';
import createBookmarksAPI from 'apis/bookmarks';

const bookmarksApi = createBookmarksAPI();
const { Title } = Typography;
const { useBreakpoint } = Grid;

const selectTopicsById = state => {
	const topicsById = {};
	const subTopicsById = {};
	state.api.Topics.forEach(topic => {
		topicsById[topic._id] = topic;
		forEach(get(topic, ['sub_topics']), subTopic => {
			subTopicsById[subTopic._id] = subTopic;
		});
	});
	return { topicsById, subTopicsById };
};

const BookmarksRoutes = ({
	match: { path },
	history: { push, goBack },
	location: { search },
}) => {
	const [selectedBucket, setSelectedBucket] = useState(null);
	const { topicsById, subTopicsById } = useSelector(selectTopicsById);
	const match = useRouteMatch({ path: `${path}/:selectedBucketId` });
	const [isCreating, setIsCreating] = useState(false);
	const { data, isFetching, refetch, status } = useQuery(
		'/bookmarks/buckets',
		bookmarksApi.getBuckets,
		{
			staleTime: 2 * 60 * 1000,
			refetchOnMount: true,
		}
	);

	const buckets = data ? data.buckets : null;
	const bookmarkedAtByQuestionId = data ? data.bookmarkedAtByQuestionId : null;
	const [topicsInBucket, subTopicsInBucket] = useMemo(() => {
		const topics = [];
		const subTopics = {};
		if (selectedBucket) {
			forEach(get(selectedBucket, ['questions']), question => {
				const topicId = get(question, 'topic');
				if (topicId && topicsById[topicId]) {
					topics.push(topicsById[topicId]);
				}
				const subTopicId = get(question, ['sub_topic']);
				if (subTopicId && subTopicsById[subTopicId]) {
					// subTopics.push(subTopicsById[subTopicId]);
					if (!subTopics[subTopicId]) {
						subTopics[subTopicId] = {
							name: subTopicsById[subTopicId].name,
							_id: subTopicsById[subTopicId]._id,
							topic: topicsById[topicId] ? topicsById[topicId].name : '',
							count: 0,
						};
					}
					subTopics[subTopicId].count += 1;
				}
			});
		}
		const sortedSubTopics = map(subTopics).sort((s1, s2) => s2.count - s1.count);
		return [topics, sortedSubTopics];
	}, [selectedBucket, subTopicsById, topicsById]);
	const screens = useBreakpoint();

	const {
		params: { selectedBucketId },
	} = match || { params: {} };

	useEffect(() => {
		const bucket = filter(buckets, b => b._id === selectedBucketId)[0];
		setSelectedBucket(bucket);
	}, [selectedBucketId, buckets]);

	useEffect(() => {
		const params = new URLSearchParams(search);
		setIsCreating(params.get('create') === '1');
	}, [search]);

	return (
		<>
			<Card
				style={{ width: '100%', borderRadius: 0 }}
				bodyStyle={{
					padding: '0',
				}}
				headStyle={{
					fontSize: '1.2rem',
					display: selectedBucketId && !screens.lg ? 'none' : '',
				}}
				title={
					<Title level={4} style={{ margin: 0 }}>
						My Bookmarks
					</Title>
				}
				bordered={false}
				extra={
					<Button
						onClick={() => {
							push('?create=1');
						}}
						type="primary"
					>
						Add List
					</Button>
				}
			>
				<Row>
					<Col
						xs={selectedBucketId ? 0 : 24}
						sm={selectedBucketId ? 0 : 24}
						md={selectedBucketId ? 0 : 24}
						lg={selectedBucketId ? 8 : 24}
					>
						{isFetching ? (
							<div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
								<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
							</div>
						) : null}
						{isEmpty(buckets) ? (
							status === 'success' ? (
								<div style={{ padding: 16, textAlign: 'center' }}>
									No bookmark lists here
								</div>
							) : status === 'error' ? (
								<Row style={{ padding: 8 }} gutter={[8, 8]} justify="center">
									<Col xs={24} style={{ textAlign: 'center' }}>
										Failed to load bookmarks. Please try again later.
									</Col>
									<Col>
										<Button type="primary" onClick={refetch}>
											Try again
										</Button>
									</Col>
								</Row>
							) : null
						) : (
							<Row
								style={{ margin: 0, padding: '16px 8px' }}
								className="bookmarks-bucket-list"
								gutter={[16, 16]}
							>
								{buckets.map((bucket, index) => (
									<Col
										xs={24}
										sm={12}
										md={selectedBucketId ? 24 : 8}
										lg={selectedBucketId ? 24 : 6}
										xl={selectedBucketId ? 12 : 6}
										key={bucket._id}
									>
										<BucketPreview
											color={bucket.color}
											icon={bucket.icon}
											name={bucket.name}
											itemCount={bucket.questions ? bucket.questions.length : 0}
											isSelected={selectedBucketId === bucket._id}
											_id={bucket._id}
										/>
									</Col>
								))}
							</Row>
						)}
					</Col>
					<Col
						xs={0}
						lg={selectedBucketId ? 1 : 0}
						style={{ maxWidth: '1px', marginRight: -1 }}
					>
						<Row justify="center" style={{ height: '100%' }}>
							<Divider type="vertical" style={{ height: '100%' }} />
						</Row>
					</Col>
					<Col
						xs={selectedBucketId ? 24 : 0}
						md={selectedBucketId ? 24 : 0}
						lg={selectedBucketId ? 16 : 0}
						flex="auto"
					>
						{selectedBucket ? (
							<Bucket
								topicsInBucket={topicsInBucket}
								subTopicsInBucket={subTopicsInBucket}
								bookmarkedAtByQuestionId={bookmarkedAtByQuestionId}
								bucket={selectedBucket}
							/>
						) : null}
					</Col>
				</Row>
			</Card>
			<Create
				isOpen={isCreating}
				handleClose={() => {
					goBack();
					queryCache.invalidateQueries('/bookmarks/buckets');
					refetch();
				}}
			/>
		</>
	);
};

export default BookmarksRoutes;
