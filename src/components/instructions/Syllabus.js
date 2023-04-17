import React from 'react';
import { connect } from 'react-redux';
import List from 'antd/es/list';
import { getTopicNameMapping } from '../libs/lib';

export class Syllabus extends React.Component {
	render() {
		const { syllabus, customSyllabus, Topics } = this.props;

		if (customSyllabus && customSyllabus.length) {
			return (
				<List
					itemLayout="vertical"
					dataSource={customSyllabus}
					renderItem={item => (
						<List.Item className="custom-list" style={{ padding: 5, border: '0px' }}>
							<div style={{ fontWeight: 'bold' }}>{item.name}</div>
							{item.subTopics && item.subTopics.length ? (
								<List
									itemLayout="vertical"
									dataSource={item.subTopics}
									renderItem={subItem => (
										<List.Item
											style={{ padding: '2px 0px', border: '0px', marginLeft: 10 }}
										>
											{subItem.name}
										</List.Item>
									)}
								/>
							) : null}
						</List.Item>
					)}
					style={{ flex: 1 }}
				/>
			);
		} else {
			const TopicNameMapping = getTopicNameMapping(Topics);
			return (
				<List
					itemLayout="vertical"
					dataSource={syllabus.topics}
					renderItem={item => (
						<List.Item className="custom-list" style={{ padding: 5, border: '0px' }}>
							<div style={{ fontWeight: 'bold' }}>{TopicNameMapping[item.id]}</div>
							{item.subTopics && item.subTopics.length ? (
								<List
									itemLayout="vertical"
									dataSource={item.subTopics}
									renderItem={subItem => (
										<List.Item
											style={{ padding: '2px 0px', border: '0px', marginLeft: 10 }}
										>
											{TopicNameMapping[subItem.id]}
										</List.Item>
									)}
								/>
							) : null}
						</List.Item>
					)}
					style={{ flex: 1 }}
				/>
			);
		}
	}
}

const mapStateToProps = state => ({ Topics: state.api.Topics });

export default connect(
	mapStateToProps,
	{}
)(Syllabus);
