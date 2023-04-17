import update from 'immutability-helper';
import { filter, forEach, get, map } from 'lodash';

export const EXTERNAL_EVENT_UPDATE_USER_DATA2 = 'UPDATE_USER_DATA2';

const TopicReducer = (
	state = {
		topics: [],
		itemsById: {},
		topicIds: [],
	},
	action
) => {
	switch (action.type) {
		case EXTERNAL_EVENT_UPDATE_USER_DATA2:
			const { topics } = action;
			const topicIds = filter(
				map(topics, topic => get(topic, ['_id'])),
				topicId => !!topicId
			);
			const topicsById = {};
			const subTopicsById = filter(map());
			forEach(topics, topic => {
				topicsById[topic._id] = topic;
				forEach(topic.sub_topics, subTopic => {
					subTopicsById[subTopic._id] = subTopic;
				});
			});
			const itemsById = { ...subTopicsById, ...topicsById };
			const updatedState = update(state, {
				itemsById: { $merge: itemsById },
				topics: { $set: topics },
				topicIds: { $set: topicIds },
			});
			return updatedState;
		default:
			return state;
	}
};

export default TopicReducer;
