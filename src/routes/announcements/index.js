import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { generatePath, Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import AnnouncementList from './List';
import CreateAnnouncement from 'components/announcement/Create';
import AnnouncementPage from './Announcement';
import { getViewAsPhase } from 'utils/viewAs';

const { Title } = Typography;

function AnnouncementsRoute({ match: { path, url, isExact } }) {
	const [refreshKey, setRefreshKey] = useState(0);
	const [announcement, setAnnouncement] = useState(null);
	const createPath = `${path}/create`;
	const detailPagePath = `${path}/announcement/:announcementId`;
	const createUrl = generatePath(createPath, {});
	const createRouteMatch = useRouteMatch({ path: createPath });
	const detailRouteMatch = useRouteMatch({ path: detailPagePath });
	const role = useSelector(roleSelector);
	const activePhaseId = useSelector(activePhaseIdSelector);
	const phaseId = useMemo(() => getViewAsPhase(activePhaseId, role), [
		activePhaseId,
		role,
	]);
	const refresh = useCallback(() => {
		setRefreshKey(refreshKey + 1);
	}, [refreshKey]);

	return (
		<Card
			title={
				<Space align="center">
					{!isExact ? (
						<Link
							to={url}
							style={{
								width: 32,
								height: 32,
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								background: 'transparent',
								border: 'none',
							}}
						>
							{!isExact && <ArrowLeftOutlined />}
						</Link>
					) : null}
					<Title level={4} style={{ margin: 0 }}>
						{isExact
							? 'Announcements'
							: createRouteMatch
							? 'Create Announcement'
							: detailRouteMatch
							? announcement
								? announcement.title
								: 'Announcement'
							: 'Announcements'}
					</Title>
				</Space>
			}
			bordered={false}
			style={{ borderRadius: 0 }}
			extra={
				<Space>
					{role !== 'user' ? (
						<Link to={createUrl}>
							<Button size="large" type="primary">
								Create Announcement
							</Button>
						</Link>
					) : null}
				</Space>
			}
		>
			{isExact ? (
				<AnnouncementList refreshKey={refreshKey} phase={phaseId} />
			) : createRouteMatch ? (
				<CreateAnnouncement phase={phaseId} onComplete={refresh} />
			) : detailRouteMatch ? (
				<AnnouncementPage
					onLoad={announcement => setAnnouncement(announcement)}
					announcementId={detailRouteMatch.params.announcementId}
				/>
			) : (
				<div>You are lost</div>
			)}
		</Card>
	);
}

export default AnnouncementsRoute;
