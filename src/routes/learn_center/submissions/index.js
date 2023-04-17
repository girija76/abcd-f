import { Button, Card, Modal, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import assignmentApi from 'apis/assignment';
import { forEach, get, map, size } from 'lodash-es';
import Text from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import { ViewSubmissionButton } from './Submission.js';
import Files from './Files.js';

const Submissions = () => {
	const columns = [
		{
			title: 'Actions',
			dataIndex: '_id',
			width: 150,
			render: (_submissionId, record) => (
				<ViewSubmissionButton onUpdate={record.onUpdate} submission={record} />
			),
		},
		{
			title: 'User',
			dataIndex: 'user',
			width: 200,
			render: user =>
				`${get(user, ['name'], 'NA')} (${get(user, ['email'], 'NA')})`,
		},

		{
			title: 'Grades',
			dataIndex: 'grades',
			width: 150,
			render: (grades, submission) => {
				const marksBySectionId = {};
				forEach(get(submission, ['grades']), gradeItem => {
					marksBySectionId[gradeItem.section] = gradeItem.marks;
				});
				return !grades || size(grades) === 0
					? 'NOT GRADED'
					: map(
							get(submission, ['assignment', 'markingScheme', 'sections']),
							section => {
								const marks = get(marksBySectionId, [section._id], 'NOT GRADED');
								return (
									<div key={section._id}>
										<span>{section.name}: </span>
										<span>
											<Text strong style={{ fontSize: '1.1rem' }}>
												{marks}
											</Text>{' '}
											/ {section.maxMarks}
										</span>
									</div>
								);
							}
					  );
			},
		},
		{
			title: 'Files',
			dataIndex: 'files',
			width: 300,
			render: files => <Files items={files} />,
		},
		{
			title: 'Submitted At',
			dataIndex: 'createdAt',
			width: 200,
			render: createdAt => dayjs(createdAt).format('DD MMM YYYY hh:mm A'),
		},
	];

	const location = useLocation();
	const backPageURL = location.state.backPageURL;
	const itemName = location.state.itemName;
	const { id } = useParams();

	const {
		data: assignment,
		isLoading: assignmentLoading,
		refetch: refetchAssignment,
	} = useQuery(
		['get-assignment-list', id],
		() =>
			assignmentApi.getAssignmentList({
				skip: 0,
				limit: 0,
				id: id,
			}),
		{
			staleTime: 6e5,
		}
	);

	const {
		data: items,
		isLoading: itemsLoading,
		refetch: refetchSubmission,
	} = useQuery(
		['get-assignment-submissions', id],
		() =>
			assignmentApi.getSubmissions({
				id: id,
			}),
		{
			staleTime: 6e5,
		}
	);

	const dataSource = useMemo(
		() =>
			items &&
			items.map(item => ({ ...item, assignment, onUpdate: refetchSubmission })),
		[assignment, items, refetchSubmission]
	);

	return (
		<div>
			<Card
				style={{ width: '100%', borderRadius: 0 }}
				bordered={false}
				bodyStyle={{ padding: '0' }}
				headStyle={{ fontSize: '1.2rem' }}
				title={
					<div>
						<Link style={{ marginRight: 12 }} to={backPageURL}>
							<ArrowLeftOutlined />
						</Link>
						<span>
							{' '}
							{itemName} submissions ({items ? items.length : ''}){' '}
						</span>
					</div>
				}
			>
				<Table
					pagination={{ position: ['topLeft', 'bottomLeft'] }}
					loading={itemsLoading}
					dataSource={dataSource}
					columns={columns}
				/>
			</Card>
		</div>
	);
};

export default Submissions;
