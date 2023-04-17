import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import createForumApi from 'apis/forum';
import { Button, Spin } from 'antd';
import ForumQuestionView from 'components/forum/ForumQuestionView';

const forumApi = createForumApi();

function ForumQuestionPage({ questionId }) {
	const { data, isFetching, isError, refetch, isSuccess } = useQuery(
		['get-forum-question', questionId],
		() => forumApi.getQuestion(questionId),
		{
			staleTime: 3e5,
		}
	);
	const { question, answers, totalAnswers } = useMemo(() => {
		if (isSuccess) {
			return data;
		}
		return {};
	}, [data, isSuccess]);
	if (isFetching && !isSuccess) {
		return (
			<div style={{ textAlign: 'center' }}>
				<Spin />
				<div>Loading question</div>
			</div>
		);
	}
	if (isError) {
		return (
			<div style={{ textAlign: 'center' }}>
				<Spin />
				<div>Error occurred. Please try again.</div>
				<Button onClick={refetch}>Reload</Button>
			</div>
		);
	}
	return (
		<div>
			<ForumQuestionView
				question={question}
				answers={answers}
				totalAnswers={totalAnswers}
				onRefresh={refetch}
			/>
		</div>
	);
}

export default ForumQuestionPage;
