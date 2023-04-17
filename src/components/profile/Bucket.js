import React from 'react';
import { connect } from 'react-redux';
import Editor from '../Editor';
import List from 'antd/es/list';
import { URLS } from '../urls.js';
import './Bookmark.css';

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

class Bucket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	parseDate = date => {
		//also in allnotes.js
		return (
			date.getDate() +
			' ' +
			months[date.getMonth()] +
			' ' +
			(date.getFullYear() - 2000)
		);
	};

	renderBookmarks = questions => {
		let { Topics } = this.props;
		let topic_dict = {};
		let sub_topic_dict = {};
		Topics.forEach(topic => {
			topic_dict[topic._id] = topic.name;
			topic.sub_topics.forEach(sub_topic => {
				sub_topic_dict[sub_topic._id] = sub_topic.name;
			});
		});
		return (
			<List
				itemLayout="vertical"
				dataSource={questions}
				className="bookmarks-list"
				renderItem={item => (
					<a
						href={`${URLS.reviewQuestions}?id=${item._id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<List.Item
							style={{ cursor: 'pointer', paddingLeft: 15, paddingRight: 16 }}
						>
							<List.Item.Meta
								title={
									<div style={{ display: 'flex' }}>
										<div style={{ flex: 1 }}>
											{topic_dict[item.topic] + ' > ' + sub_topic_dict[item.sub_topic]}
										</div>
										{item.date ? (
											<div style={{ fontSize: 13 }}>
												{this.parseDate(new Date(item.date))}
											</div>
										) : null}
									</div>
								}
							/>
							<Editor key={item._id} rawContent={item.content.rawContent} />
						</List.Item>
					</a>
				)}
			/>
		);
	};
	render() {
		const { bucket } = this.props;
		let bookmarks = this.renderBookmarks(bucket ? bucket.questions : []);
		return <div>{bookmarks}</div>;
	}
}

const mapStateToProps = state => ({
	Topics: state.api.Topics,
});

export default connect(mapStateToProps)(Bucket);
