import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Card, Spin } from 'antd';
import { useQuery } from 'react-query';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Linkify from 'react-linkify';
import playlistApi from 'apis/playlist';
import Assignment from './Assignment';
import { isLite } from 'utils/config';
import { URLS } from 'components/urls';
import './styles.scss';

const getParamsFromUrl = search => {
	const params = new URLSearchParams(search);
	return {
		playlistId: params.get('p'),
		playlistItemId: params.get('i'),
		resourceId: params.get('v'),
		viewAs: params.get('viewAs') || '',
		phases: params.get('phases') || '',
	};
};

const AssignmentPage = ({ location: { search: searchParams } }) => {
	const {
		playlistId,
		playlistItemId,
		resourceId,
		viewAs,
		phases,
	} = useMemo(() => getParamsFromUrl(searchParams), [searchParams]);
	const [resource, setResource] = useState();
	const [queryToPass, setQueryToPass] = useState('');
	const { data: playlist } = useQuery(playlistId, playlistApi.getPlaylist, {
		staleTime: 10 * 60 * 1000,
	});

	useEffect(() => {
		if (playlist) {
			playlist.items.forEach(playlistItem => {
				if (playlistItem._id === playlistItemId) {
					setResource(playlistItem.resource);
				}
			});
		}
	}, [playlist, playlistItemId, resourceId]);
	useEffect(() => {
		if (viewAs && phases) {
			setQueryToPass(`viewAs=${viewAs}&phases=${encodeURIComponent(phases)}`);
		}
	}, [viewAs, phases]);
	const backButtonBaseLink = URLS.learningCenterAssignmentPlaylist;
	return playlist ? (
		<div
			className={classnames('learning-center-assignment', {
				'no-margin': isLite,
			})}
		>
			<Card
				style={{ width: '100%', borderRadius: 0 }}
				bordered={false}
				bodyStyle={{ padding: '0' }}
				headStyle={{ fontSize: '1.2rem' }}
				title={
					resource ? (
						<div>
							<Link
								style={{ marginRight: 12 }}
								to={`${backButtonBaseLink}?p=${playlistId}${
									queryToPass ? `&${queryToPass}` : ''
								}`}
							>
								<ArrowLeftOutlined />
							</Link>
							<span>{resource.title}</span>
						</div>
					) : (
						'Assignment'
					)
				}
			>
				{resource ? (
					<div style={{ flexGrow: 1 }}>
						<Linkify>
							<div className="assignment-description">{resource.description}</div>
						</Linkify>
						<Assignment
							key={resource._id}
							{...resource}
							playlistId={playlistId}
							playlistItemId={playlistItemId}
						/>
					</div>
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							backgroundColor: '#212121',
						}}
					>
						<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
					</div>
				)}
			</Card>
		</div>
	) : (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				paddingTop: 40,
			}}
		>
			<Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
			<div style={{ marginTop: 8 }}>Loading assignment...</div>
		</div>
	);
};
export default AssignmentPage;
