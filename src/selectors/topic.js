import update from 'immutability-helper';
import { get, map } from 'lodash';

export const conceptSelector = state => {
	const topics = state.api.Topics;
	let concepts = [];
	topics.forEach(topic => {
		topic.sub_topics.forEach(sub_topic => {
			if (Array.isArray(sub_topic.concepts) && sub_topic.concepts.length) {
				concepts = update(concepts, {
					$push: sub_topic.concepts.map(c => c.concept),
				});
			}
		});
	});
	return concepts;
};

export const allTopicSelector = state => state.topic.topics;

export const topicsByIdSelector = state => state.topic.itemsById;

// export const selectTopicById = (state, topicId) =>
// 	get(state, ['topic', 'itemsById', topicId]);

// export const createSelectTopicById = topicId => state =>
// 	get(state, ['topic', 'itemsById', topicId]);

export const createSelectTopicsById = topicIds => state => {
	const filtered = map(topicIds, topicId =>
		get(state, ['topic', 'itemsById', topicId])
	).filter(topic => !!topic);
	return filtered;
};
