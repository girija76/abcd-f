import React from 'react';
import { Space } from 'antd';
import ReactLinkify from 'react-linkify';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import TimeAgo from './TimeAgo';
import ViewFiles from 'components/forum/ViewFiles';

function AnnouncementDetail({ announcement }) {
	const { createdAt, body, files } = announcement;
	return (
		<Space direction="vertical">
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<span
					style={{
						width: '2.5rem',
						height: '2.5rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '50%',
						border: 'solid 2px rgb(27, 115, 231)',
						marginRight: '.5rem',
					}}
				>
					<HiOutlineSpeakerphone
						style={{ fontSize: '1.5rem', color: 'rgb(27, 115, 231)' }}
					/>
				</span>
				<div>
					<span style={{ fontSize: '1.1rem', color: '#353637' }}>
						<TimeAgo date={createdAt} />
					</span>
				</div>
			</div>
			<ReactLinkify properties={{ target: '_blank', style: { color: 'blue' } }}>
				<div style={{ paddingTop: 4 }}>{body}</div>
			</ReactLinkify>
			<ViewFiles files={files} />
		</Space>
	);
}

export default AnnouncementDetail;
