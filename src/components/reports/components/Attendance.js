import React, { useEffect, useMemo, useState } from 'react';
import { get, includes } from 'lodash';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector } from 'selectors/user';
import createOthersApi from 'apis/others';
import videoApi from 'apis/video';
import { Card, Col, Modal, Progress, Row, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { MdPlayCircleOutline } from 'react-icons/md';
import { AiOutlineFrown } from 'react-icons/ai';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { URLS } from 'components/urls';
import { useWindowSize } from 'utils/hooks';

const { Text, Title } = Typography;

const othersApi = createOthersApi();

const createAttendance = (coursePlan, completedVideos) => {
	const attendanceItems = [];
	const itemsBySubject = {};
	const joinedLiveVideoIds = completedVideos.filter(i => i.djl).map(i => i.v);
	const watchedLaterVideoIds = completedVideos.filter(i => i.iw).map(i => i.v);
	const itemsWithAttendance = coursePlan
		.filter(item => get(item, 'resourceModel') === 'Video')
		.filter(item => dayjs().isAfter(get(item, 'availableFrom')))
		.map(item => {
			const didJoinLive = includes(
				joinedLiveVideoIds,
				get(item, ['resource', '_id'])
			);
			const didWatchLater =
				!didJoinLive &&
				includes(watchedLaterVideoIds, get(item, ['resource', '_id']));
			return {
				...item,
				didJoinLive,
				didWatchLater,
			};
		});
	itemsWithAttendance.forEach(item => {
		const subject = get(item, ['subject'], 'Other') || 'Other';
		if (!itemsBySubject[subject]) {
			itemsBySubject[subject] = [];
		}
		itemsBySubject[subject].push(item);
	});

	Object.keys(itemsBySubject).forEach(subject => {
		const items = itemsBySubject[subject];
		const total = items.length;
		const joinedLiveCount = items.filter(i => i.didJoinLive).length;
		const watchedLaterCount = items.filter(i => i.didWatchLater).length;
		const missedCount = total - joinedLiveCount - watchedLaterCount;
		attendanceItems.push({
			subject,
			items,
			total,
			joinedLiveCount,
			watchedLaterCount,
			missedCount,
		});
	});
	return attendanceItems;
};

const createItemFilter = type => {
	if (type === 'didJoinLive') {
		return item => get(item, ['didJoinLive']);
	}
	if (type === 'didWatchLater') {
		return item => get(item, ['didWatchLater']);
	}
	if (type === 'all') {
		return () => true;
	}
	if (type === 'missed') {
		return item => !get(item, ['didJoinLive']) && !get(item, ['didWatchLater']);
	}
	return () => false;
};

const typeToName = {
	didJoinLive: 'Watched Live',
	all: 'All',
	didWatchLater: 'Watched Later',
	missed: 'Missed',
};

const urlAccessor = item => {
	const resourceId = get(item, ['resource', '_id']);
	const playlistItemId = get(item, '_id');
	const playlistId = get(item, 'playlistId');
	return `${URLS.learningCenterVideoPlayerUrl}?v=${resourceId}&i=${playlistItemId}&p=${playlistId}`;
};

const VideoItem = ({
	_id: itemId,
	playlistId,
	resource,
	didWatchLater,
	didJoinLive,
}) => {
	return (
		<Card size="small">
			<Title style={{ marginTop: 0 }} level={4}>
				{get(resource, ['title'])}
			</Title>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				{didJoinLive ? (
					<Text
						type="success"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							cursor: 'default',
						}}
					>
						<BsCheckCircle style={{ fontSize: 24, marginRight: 4 }} />{' '}
						<Text>Watched Live</Text>
					</Text>
				) : didWatchLater ? (
					<Typography.Link
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							cursor: 'default',
						}}
					>
						<BsCheckCircle style={{ fontSize: 24, marginRight: 4 }} />{' '}
						<Text>Watched Later</Text>
					</Typography.Link>
				) : (
					<Text
						type="danger"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							cursor: 'default',
						}}
					>
						<BsXCircle style={{ fontSize: 15, marginRight: 4 }} /> <Text>Missed</Text>
					</Text>
				)}
				<div>
					<Link
						to={urlAccessor({ _id: itemId, playlistId, resource })}
						component={Typography.Link}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
						}}
					>
						<MdPlayCircleOutline style={{ fontSize: 20, marginRight: 4 }} />{' '}
						{didJoinLive || didWatchLater ? 'Watch Again' : 'Watch Now'}
					</Link>
				</div>
			</div>
		</Card>
	);
};

function SubjectAttendance({
	subject,
	total,
	joinedLiveCount,
	watchedLaterCount,
	missedCount,
	items,
	printableElementRef,
}) {
	const [showType, setShowType] = useState(null);
	const livePercentage = Math.floor((100 * joinedLiveCount) / total);
	const laterPercentage = Math.floor((100 * watchedLaterCount) / total);
	const completePercentage = Math.min(100, livePercentage + laterPercentage);
	const filteredItems = useMemo(() => {
		return items.filter(createItemFilter(showType));
	}, [items, showType]);
	const { width } = useWindowSize();
	const modalWidth = useMemo(
		() => (width < 600 ? '100%' : width < 1200 ? '90%' : '80%'),
		[width]
	);
	return (
		<div
			ref={printableElementRef}
			style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12 }}
		>
			<Title level={3}>{subject}</Title>
			<div style={{ padding: 4 }}>
				<Row gutter={[8, 8]}>
					<Col onClick={() => setShowType('all')} xs={12} md={6}>
						<div>
							<Text type="secondary">Total</Text>
						</div>
						<div>
							<Title level={4}>{total}</Title>
						</div>
					</Col>
					<Col onClick={() => setShowType('didJoinLive')} xs={12} md={6}>
						<div>
							<Text
								type="success"
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									cursor: 'default',
								}}
							>
								<BsCheckCircle style={{ fontSize: 18, marginRight: 4 }} />{' '}
								<Text type="secondary">Watched Live</Text>
							</Text>
						</div>
						<div>
							<Title level={4}>{joinedLiveCount}</Title>
						</div>
					</Col>
					<Col onClick={() => setShowType('didWatchLater')} xs={12} md={6}>
						<div>
							<Typography.Link
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									cursor: 'default',
								}}
							>
								<BsCheckCircle style={{ fontSize: 18, marginRight: 4 }} />{' '}
								<Text type="secondary">Watched Later</Text>
							</Typography.Link>
						</div>
						<div>
							<Title level={4}>{watchedLaterCount}</Title>
						</div>
					</Col>
					<Col onClick={() => setShowType('missed')} xs={12} md={6}>
						<div>
							<Text
								type="danger"
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									cursor: 'default',
								}}
							>
								<BsXCircle style={{ fontSize: 15, marginRight: 4 }} />{' '}
								<Text type="secondary">Missed</Text>
							</Text>
						</div>
						<div>
							<Title level={4}>{missedCount}</Title>
						</div>
					</Col>
				</Row>
			</div>
			<Progress
				percent={completePercentage}
				success={{ percent: livePercentage }}
				showInfo={false}
				strokeColor="#fdda6f"
			/>
			<Modal
				centered
				title={`${subject} > ${typeToName[showType]}`}
				footer={null}
				visible={showType}
				width={modalWidth}
				onCancel={() => setShowType(null)}
			>
				{filteredItems.length === 0 ? (
					<Title style={{ textAlign: 'center' }} level={4}>
						<AiOutlineFrown style={{ fontSize: '1.8em' }} />
						<br />
						Nothing here
					</Title>
				) : null}
				<div style={{ padding: 4 }}>
					<Row gutter={[8, 8]}>
						{filteredItems.map(item => {
							return (
								<Col xs={24} md={12} lg={8} key={item._id}>
									<VideoItem {...item} />
								</Col>
							);
						})}
					</Row>
				</div>
			</Modal>
		</div>
	);
}

function Attendance({ refreshKey }) {
	const activePhaseId = useSelector(activePhaseIdSelector);

	const {
		data: coursePlan,
		isFetched: isCoursePlanFetched,
		refetch: refetchPlan,
	} = useQuery(
		['get-video-course-plan', activePhaseId],
		() => othersApi.getCoursePlan(activePhaseId),
		{
			staleTime: 60 * 60 * 1000,
		}
	);
	const {
		data: completedVideos,
		isFetched: areCompletedItemsFetched,
		refetch: refetchCompletedVideos,
	} = useQuery(['get-watched-videos'], () => videoApi.getCompletedVideos(), {
		staleTime: 5 * 60 * 1000,
	});

	const hasFetched = areCompletedItemsFetched && isCoursePlanFetched;
	const attendanceItems = useMemo(
		() => (hasFetched ? createAttendance(coursePlan.items, completedVideos) : []),
		[completedVideos, coursePlan, hasFetched]
	);

	useEffect(() => {
		refetchPlan();
		refetchCompletedVideos();
	}, [refetchCompletedVideos, refetchPlan, refreshKey]);

	return (
		<div>
			{hasFetched ? (
				attendanceItems.length ? (
					<Space direction="vertical" style={{ width: '100%' }}>
						{attendanceItems.map(item => (
							<SubjectAttendance key={item.subject} {...item} />
						))}
					</Space>
				) : (
					<div>No subjects found.</div>
				)
			) : (
				'Loading...'
			)}
		</div>
	);
}

export default Attendance;
