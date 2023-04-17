import React, { useMemo } from 'react';
import { Card, Tag, Typography } from 'antd';
import { useGetAllPhaseSubjects } from 'components/subject/hook';
import { Link } from 'react-router-dom';
import { URLS } from 'components/urls';
import PostHead from './PostHead';

const { Title } = Typography;

function ThreadOverview({ question, phase }) {
	const {
		_id,
		title,
		createdBy,
		createdAt,
		tags: { subjects: subjectIds },
	} = question;
	const { subjectsById } = useGetAllPhaseSubjects([phase]);
	const subjects = useMemo(() => {
		if (subjectIds && subjectsById) {
			return subjectIds
				.map(subjectId => subjectsById[subjectId])
				.filter(subject => !!subject);
		}
		return [];
	}, [subjectIds, subjectsById]);
	return (
		<Link to={`${URLS.forum}/question/${_id}`}>
			<Card size="small">
				<PostHead createdAt={createdAt} {...createdBy} />
				<div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '.5rem' }}>
					{subjects.map(subject => (
						<Tag key={subject._id} color={subject.color}>
							{subject.name}
						</Tag>
					))}
				</div>
				<Title
					style={{ marginTop: '.5rem', fontWeight: '400', marginBottom: 0 }}
					level={5}
					ellipsis
				>
					{title}
				</Title>
			</Card>
		</Link>
	);
}

export default ThreadOverview;
