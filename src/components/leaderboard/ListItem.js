import React from 'react';
import { Typography } from 'antd';
import './ListItem.css';

const { Text } = Typography;

function truncate(text) {
	if (text === undefined) return '';
	if (text.length > 15) {
		return `${text.substring(0, 12)}...`;
	}
	return text;
}

const ListItem = ({ username, avatar, rank, rating, mode, marks }) => {
	return (
		<span className="leaderboard-listitem">
			<div className="leaderboard-listitem-leftside">
				<Text style={{ fontStyle: 'italic' }} type="secondary">
					{rank}
				</Text>
				<span className="leaderboard-listitem-avatar-container">
					<div className="leaderboard-listitem-avatar">
						<img alt="" src={avatar} />
					</div>
				</span>
				<span className="leaderboard-listitem-username">{truncate(username)}</span>
			</div>
			{mode !== 'assessment' ? (
				<span className="leaderboard-listitem-rating">
					<span>{Math.round(rating)}</span>
				</span>
			) : (
				<span
					style={{
						borderLeft: 'solid 20px transparent',
						fontSize: 16,
						fontWeight: 'bold',
						color: 'blue',
					}}
				>
					{marks}
				</span>
			)}
		</span>
	);
};

export default ListItem;
