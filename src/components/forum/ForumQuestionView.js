import React from 'react';
import { Button, Card, Divider, Space, Typography } from 'antd';
import { useBoolean } from 'use-boolean';
import WriteAnswer from './WriteAnswer';
import PostHead from './PostHead';
import BodyView from './Body';
import AnswerView from './Answer';
import CommentList from './CommentList';
import ViewFiles from './ViewFiles';

const { Title } = Typography;

function ForumQuestionView({ question, totalAnswers, answers, onRefresh }) {
	const [isWriteOpen, showWriteAnswer, closeWriteAnswer] = useBoolean();
	return (
		<div>
			<Card size="small" title={<Title level={3}>{question.title}</Title>}>
				<BodyView body={question.body} bodyType={question.bodyType} />{' '}
				<Divider style={{ marginTop: 0, marginBottom: '.5rem' }} />
				<PostHead createdAt={question.createdAt} {...question.createdBy} />
				<Divider style={{ margin: '12px 0' }} />
				<ViewFiles files={question.files} />
				<CommentList
					comments={question.comments}
					item={question._id}
					itemType="ForumQuestion"
					onRefresh={onRefresh}
				/>
			</Card>
			<Divider />
			<Title level={4}>
				{totalAnswers ? `Total ${totalAnswers}` : 'No'} answer
				{totalAnswers > 1 ? 's' : ''}
			</Title>
			<Space direction="vertical" size="middle" style={{ width: '100%' }}>
				{answers.map(answer => {
					return (
						<AnswerView answer={answer} key={answer._id} onRefresh={onRefresh} />
					);
				})}

				{isWriteOpen ? (
					<WriteAnswer
						onCancel={closeWriteAnswer}
						onComplete={() => {
							onRefresh();
							closeWriteAnswer();
						}}
						questionId={question._id}
					/>
				) : (
					<Button type="primary" onClick={showWriteAnswer}>
						Write answer
					</Button>
				)}
			</Space>
		</div>
	);
}

export default ForumQuestionView;
