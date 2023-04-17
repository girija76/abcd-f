import React from 'react';
import { Spin, Typography } from 'antd';
import { forEach, map } from 'lodash';
import { CloudDownloadOutlined } from '@ant-design/icons';
import SubmitAssignment from './Submit';
import { useQuery } from 'react-query';
import assignmentApi from 'apis/assignment';
import FeedbackForm from 'components/feedback/Form';

const { Title } = Typography;

const Assignment = ({
	_id: assignmentId,
	files,
	playlistId,
	playlistItemId,
	markingScheme,
}) => {
	const { data, isFetched, refetch } = useQuery(
		assignmentId,
		assignmentApi.getSubmissionsOfAssignment,
		{
			staleTime: 600 * 1000,
		}
	);
	return (
		<div className="root">
			<div className="assignment-title">
				<Title style={{ margin: 0 }} level={4}>
					Assignment files
				</Title>
			</div>
			<div class="assignment-file-list">
				{map(files, file => {
					return (
						<a
							className="assignment-file-list-item"
							href={file.url}
							target="_blank"
							rel="noreferrer"
						>
							{file.name}
							<CloudDownloadOutlined style={{ fontSize: 24, color: '#4a4aef' }} />
						</a>
					);
				})}
			</div>
			{isFetched ? (
				<div
					className="assignment-submission-list"
					style={{ marginBottom: '.5rem' }}
				>
					{data &&
						data.map(submission => {
							const gradesBySectionId = {};
							forEach(submission.grades, gradeItem => {
								gradesBySectionId[gradeItem.section] = gradeItem.marks;
							});
							const grades = map(markingScheme.sections, section => {
								return {
									sectionName: section.name,
									text: `${gradesBySectionId[section._id] || 'Not graded yet'} / ${
										section.maxMarks
									}`,
								};
							});
							return (
								<div key={submission._id}>
									<Title
										className="assignment-title"
										level={4}
										style={{ marginBottom: 0 }}
									>
										Your submission
									</Title>
									<div className="assignment-title">
										{submission.grades.length
											? grades.map((gradeItem, index) => {
													return (
														<div key={index}>
															{gradeItem.sectionName}: {gradeItem.text}
														</div>
													);
											  })
											: 'Not graded yet.'}
									</div>
									<Title
										className="assignment-title"
										level={5}
										style={{ marginBottom: 0 }}
									>
										Submitted files
									</Title>
									<div className="assignment-file-list">
										{submission.files.map((file, index) => (
											<a
												className="assignment-file-list-item"
												key={index}
												target="_blank"
												rel="noreferrer"
												href={file.url}
											>
												<span>{file.name}</span>
												<CloudDownloadOutlined style={{ fontSize: 24, color: '#4a4aef' }} />
											</a>
										))}
									</div>
								</div>
							);
						})}
					{data && data.length ? (
						<FeedbackForm
							item={playlistId}
							itemRef="Playlist"
							formFor={'child'}
							otherRefs={[
								{ type: 'Video', value: assignmentId },
								{ type: 'PlaylistItem', value: playlistItemId },
							]}
						/>
					) : null}
					{!data || !data.length ? (
						<SubmitAssignment
							onSubmit={refetch}
							assignmentId={assignmentId}
							playlistId={playlistId}
							playlistItemId={playlistItemId}
						/>
					) : null}
				</div>
			) : (
				<div style={{ padding: '1rem' }}>
					<Spin />
				</div>
			)}
		</div>
	);
};

export default Assignment;
