import React, { useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { get, isEmpty, map } from 'lodash';
import { useRouteMatch, Link, generatePath } from 'react-router-dom';
import { Button, Card, Space, Spin, Typography } from 'antd';
import { LoadingOutlined, WarningFilled } from '@ant-design/icons';
import { AiOutlineFrown } from 'react-icons/ai';
import { useQuery } from 'react-query';
import {
	hideNavigation,
	isLite,
	resourceTypeLabels as resourceTypeLabelsOverride,
} from 'utils/config';

import playlistApi from 'apis/playlist';
import { getResourceTypes } from 'utils/learning_center';
import TypeFilter from './type_filter';
import { URLS } from 'components/urls';
import { useWindowSize } from 'utils/hooks';

const { Text } = Typography;

const PlaylistList = ({
	history: { push, replace },
	match: { isExact, path: matchedPath, url },
	mode,
	activePhase,
}) => {
	const typeMatch = useRouteMatch({ path: `${matchedPath}/:type` });
	const resourceType = useMemo(() => {
		const type = typeMatch ? typeMatch.params.type.slice(0, -1) : null;
		return type;
	}, [typeMatch]);

	const { data, isFetching, isSuccess, isError, refetch } = useQuery(
		['/playlists', mode, activePhase],
		playlistApi.getPlaylists,
		{
			// 5 minutes
			staleTime: 3e5,
		}
	);

	const resourceTypeLabels = data ? data.playlistTypeLabels : {};

	const playlists = data ? data.playlists : undefined;

	const resourceTypes = useMemo(
		() =>
			playlists
				? map(getResourceTypes(playlists), type => ({
						type,
						url: generatePath(URLS.learningCenterPlaylists, {
							resourceType: `${type === 'Book' ? 'ResourceDocument' : type}s`,
						}),
				  }))
				: [],
		[playlists]
	);

	useEffect(() => {
		if (isExact && Array.isArray(resourceTypes) && resourceTypes.length) {
			const defaultResourceType = get(resourceTypes, [0, 'type']);
			if (defaultResourceType) {
				const path = generatePath(URLS.learningCenterPlaylists, {
					resourceType: `${defaultResourceType}s`,
				});

				replace(path);
			}
		}
	}, [isExact, resourceTypes, replace, url]);
	const { width } = useWindowSize();
	const hideCardHead = useMemo(() => width >= 900, [width]);
	return (
		<div className={classnames('', { 'no-margin': isLite })}>
			<Card
				bordered={false}
				style={{ width: '100%', borderRadius: 0 }}
				bodyStyle={{
					padding: '0',
				}}
				headStyle={{
					fontSize: '1.2rem',
				}}
				title={isLite || hideCardHead ? null : 'Learning Center'}
				activeTabKey={resourceType ? resourceType : undefined}
				onTabChange={key => {
					push(
						generatePath(URLS.learningCenterPlaylists, {
							resourceType: `${key}s`,
						})
					);
				}}
				tabList={
					hideNavigation || hideCardHead
						? []
						: map(resourceTypes, ({ type, url }) => ({
								key: type,
								tab: (
									<Link to={url}>
										{resourceTypeLabelsOverride[type] || resourceTypeLabels[type] || type}
									</Link>
								),
						  }))
				}
			>
				{isExact && isFetching ? (
					<div style={{ textAlign: 'center', padding: 50 }}>
						<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
						<div style={{ marginTop: 16 }}>Loading</div>
					</div>
				) : null}
				{isExact && isError ? (
					<Space
						direction="vertical"
						style={{ alignItems: 'center', width: '100%' }}
					>
						<Text style={{ fontSize: 72 }} type="warning">
							<WarningFilled />
						</Text>
						<div style={{ fontSize: '1.4rem', textAlign: 'center' }}>
							Failed to load content.
							<br /> Please check your internet connection.
						</div>
						<Button type="primary" onClick={() => refetch({ force: true })}>
							Retry
						</Button>
					</Space>
				) : null}
				{isExact &&
				isSuccess &&
				!isFetching &&
				isEmpty(resourceTypes) &&
				resourceTypes !== null ? (
					<div style={{ alignItems: 'center', width: '100%', margin: '12px 0' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								fontSize: 48,
								textAlign: 'center',
							}}
						>
							<AiOutlineFrown />
						</div>
						<div style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: 8 }}>
							Nothing here!
						</div>
						<div style={{ textAlign: 'center' }}>
							<Button type="primary" onClick={() => refetch({ force: true })}>
								Refresh
							</Button>
						</div>
					</div>
				) : null}
				{resourceType ? (
					<TypeFilter
						resourceType={resourceType}
						mode={mode}
						activePhase={activePhase}
					/>
				) : null}
			</Card>
		</div>
	);
};

export default PlaylistList;
