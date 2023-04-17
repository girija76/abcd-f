import React from 'react';
import Card from 'antd/es/card';

import { topicColors, groupColors } from '../colors';
import { topicImages, groupTopics } from '../extra';

import './Practice.css';

export class TopicCard extends React.Component {
	truncate = text => {
		if (text === undefined) return '';
		if (text.length > 19) {
			return `${text.substring(0, 17)}...`;
		}
		return text;
	};

	render() {
		const { item, mode, clickable } = this.props;
		return (
			<Card
				style={{
					backgroundColor: topicColors[item.name],
					border: 0,
					borderRadius: 6,
					cursor: 'pointer',
				}}
				bodyStyle={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					padding: 16,
					height: '100%',
				}}
				className="topic-card-inner-wrapper"
			>
				<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
					<img src={topicImages[item.name]} className="topic-card-image"></img>
				</div>
				{clickable ? (
					<div style={{ color: 'white', fontSize: 13 }}>[ Click to attempt ]</div>
				) : null}
				<div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
					<div style={{ flex: 1 }}>
						<div
							style={{ color: 'white', fontWeight: 'bold' }}
							className="topic-card-title"
						>
							{this.truncate(item.name)}
						</div>
						<div style={{ fontSize: 11, fontWeight: 'lighter', color: 'white' }}>
							{mode === 'demo' ? 0 : Math.round(item.percent_complete)} % completed
						</div>
					</div>
				</div>
			</Card>
		);
	}
}

export default TopicCard;
