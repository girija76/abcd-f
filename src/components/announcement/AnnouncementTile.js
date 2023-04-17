import React from 'react';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import TimeAgo from './TimeAgo';
import { Card, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { URLS } from 'components/urls';

const { Title } = Typography;

function AnnouncementTile({ _id, createdAt, title, files }) {
	return (
		<Link to={`${URLS.announcements}/announcement/${_id}`}>
			<Card className="announcement" bodyStyle={{ padding: 12 }}>
				<Space direction="vertical">
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span
							style={{
								width: '3rem',
								height: '3rem',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '50%',
								border: 'solid 2px rgb(27, 115, 231)',
								marginRight: '.75rem',
							}}
						>
							<HiOutlineSpeakerphone
								style={{ fontSize: '2rem', color: 'rgb(27, 115, 231)' }}
							/>
						</span>
						<div>
							<Title level={5} style={{ marginBottom: 4 }}>
								{title}
							</Title>
							<div>
								<span style={{ color: '#575859', marginRight: 4 }}>
									<TimeAgo date={createdAt} />
								</span>
								{Array.isArray(files) && files.length ? (
									<Tag color="geekblue">
										{files.length} attachment{files.length !== 1 ? 's' : ''}
									</Tag>
								) : null}
							</div>
						</div>
					</div>
				</Space>
			</Card>
		</Link>
	);
}

export default AnnouncementTile;
