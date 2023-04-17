import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { generatePath, Link, useRouteMatch } from 'react-router-dom';
import SubjectList from 'components/subject/List';
import AskQuestion from 'components/forum/AskQuestion';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ListQuestion from './List';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import ForumQuestionPage from './Question';
import { getViewAsPhase } from 'utils/viewAs';

const { Title } = Typography;

const createLinkPropsGetter = baseUrl => subject => {
	return { to: `${baseUrl}/subject/${subject._id}` };
};

function SubjectListRoute({ match: { path, url, isExact }, history }) {
	const activePhaseId = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = useMemo(() => getViewAsPhase(activePhaseId, role), [
		activePhaseId,
		role,
	]);
	const [refreshKey, setRefreshKey] = useState(0);
	const linkPropsGetter = useMemo(() => createLinkPropsGetter(url), [url]);
	const createPath = `${path}/create`;
	const createPathMatch = useRouteMatch({
		path: `${path}/create`,
	});
	const subjectRouteMatch = useRouteMatch({
		path: `${path}/subject/:subject`,
		exact: true,
	});
	const questionRouteMatch = useRouteMatch({
		path: `${path}/question/:question`,
		exact: true,
	});
	const selectedSubjectId = useMemo(() => {
		const subject = subjectRouteMatch ? subjectRouteMatch.params.subject : 'all';
		if (subject === 'create' || questionRouteMatch || createPathMatch) {
			return null;
		}
		return subject;
	}, [createPathMatch, questionRouteMatch, subjectRouteMatch]);
	const createUrl = generatePath(createPath, {});
	const refresh = useCallback(() => {
		setRefreshKey(refreshKey + 1);
	}, [refreshKey]);
	return (
		<Card
			title={
				<Link to={url}>
					<Space align="center">
						{!isExact && (
							<button
								style={{
									width: 32,
									height: 32,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: 'transparent',
									border: 'none',
								}}
							>
								<ArrowLeftOutlined />
							</button>
						)}
						<Title level={4} style={{ margin: 0 }}>
							Doubts and Discussions
						</Title>
					</Space>
				</Link>
			}
			bordered={false}
			style={{ borderRadius: 0 }}
			extra={
				<Space>
					<Link to={createUrl}>
						<Button size="large" type="primary">
							Ask Question
						</Button>
					</Link>
				</Space>
			}
		>
			{isExact ? (
				<>
					<Title level={4} style={{}}>
						Explore by Subject
					</Title>
					<SubjectList
						phase={phaseId}
						itemComponent={Link}
						itemComponentPropsGetter={linkPropsGetter}
					/>
					<Title level={4} style={{ marginTop: '1rem' }}>
						Recent Questions
					</Title>
				</>
			) : createPathMatch ? (
				<AskQuestion
					onCancel={() => {
						history.push(url);
					}}
					onComplete={() => {
						refresh();
					}}
					phase={phaseId}
				/>
			) : null}
			<div
				style={{
					display: selectedSubjectId === 'all' ? '' : 'none',
				}}
			>
				<ListQuestion refreshKey={refreshKey} phase={phaseId} subject="all" />
			</div>
			{selectedSubjectId && selectedSubjectId !== 'all' ? (
				<ListQuestion
					key={selectedSubjectId}
					refreshKey={refreshKey}
					phase={phaseId}
					subject={selectedSubjectId}
				/>
			) : null}
			{questionRouteMatch ? (
				<ForumQuestionPage questionId={questionRouteMatch.params.question} />
			) : null}
		</Card>
	);
}

export default SubjectListRoute;
