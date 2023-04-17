import { URLS } from 'components/urls';
import { cloneDeep, forEach, get } from 'lodash';
import { createItemsById } from 'utils/store';
import { createBaseApi } from './base';

const defaultUser = {
	name: 'Deleted User',
	dp: '',
	_id: 'deleted',
	username: 'deleted_user',
};

function makeNestedList(
	parents,
	childs,
	childKeyInParent = 'items',
	parentIdKey = 'item',
	selfIdKeyParent = '_id'
) {
	const parentsById = createItemsById(parents, selfIdKeyParent);
	forEach(childs, item => {
		const parentId = get(item, parentIdKey);
		let parent = get(parentsById, parentId);
		if (!parent) {
			parent = {};
		}
		if (!parent[childKeyInParent]) {
			parent[childKeyInParent] = [];
		}
		parent[childKeyInParent].push(item);
	});
	return parents.map(({ [selfIdKeyParent]: id }) => parentsById[id]);
}

const makeNestedAnswers = (answers, comments, users) => {
	const usersById = createItemsById(users);
	const nestedComments = comments.map(comment => {
		return {
			...comment,
			createdBy: get(usersById, comment.createdBy, cloneDeep(defaultUser)),
		};
	});
	const userPopulatedAnswers = answers.map(answer => ({
		...answer,
		createdBy: get(usersById, answer.createdBy, cloneDeep(defaultUser)),
	}));
	const nestedAnswers = makeNestedList(
		userPopulatedAnswers,
		nestedComments,
		'comments'
	);
	return nestedAnswers;
};

const createForumApi = () => {
	const forumBaseApi = createBaseApi(URLS.backendForum);
	return {
		listQuestions: (phase, subject, skip, limit) =>
			forumBaseApi
				.get(`/list/${phase}/${subject}/${skip}/${limit}`)
				.then(res => res.data),
		postQuestion: (phase, subject, title, body, bodyType, files) =>
			forumBaseApi
				.post('/post/question', {
					phase,
					tags: { subjects: [subject] },
					title,
					body,
					bodyType,
					files,
				})
				.then(res => res.data),
		getQuestion: question =>
			forumBaseApi
				.get(`/get/question/${question}`)
				.then(res => res.data)
				.then(({ question, comments, users, answers, ...others }) => {
					const response = {
						answers: makeNestedAnswers(answers, comments, users),
						question: makeNestedAnswers([question], comments, users)[0],
						...others,
					};
					return response;
				}),
		postAnswer: (question, body, bodyType, files) =>
			forumBaseApi
				.post('/post/answer', {
					question,
					body,
					bodyType,
					files,
				})
				.then(res => res.data),
		postComment: (item, itemType, text) =>
			forumBaseApi
				.post('/post/comment', {
					item,
					itemType,
					text,
				})
				.then(res => res.data),
		getUploadPolicy: (mime, fileName) =>
			forumBaseApi
				.post('/file-upload-policy', { mime, fileName })
				.then(res => res.data),
	};
};

export default createForumApi;
