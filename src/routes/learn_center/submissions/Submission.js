import {
	Button,
	Card,
	Col,
	Input,
	message,
	Modal,
	Row,
	Space,
	Typography,
} from 'antd';
import { forEach, get, keys, map } from 'lodash';

import React, { useMemo, useState } from 'react';
import assignmentApi from 'apis/assignment';
import { isNetworkError } from 'utils/axios';
import dayjs from 'dayjs';
import update from 'immutability-helper';
import Files from './Files';

const { Text, Title } = Typography;

const AssignmentSubmission = ({ submission, onUpdate }) => {
	const [isUpdatingGrades, setIsUpdatingGrades] = useState(false);
	const submissionId = get(submission, ['_id']);
	const assignmentId = get(submission, ['assignment', '_id']);
	const [markUpdatesBySectionId, setMarkUpdatesBySectionId] = useState({});
	const hasChangedMarks = keys(markUpdatesBySectionId).length > 0;
	const marksBySectionId = useMemo(() => {
		const marksBySectionId = {};
		forEach(get(submission, ['grades']), gradeItem => {
			marksBySectionId[gradeItem.section] = gradeItem.marks;
		});
		return marksBySectionId;
	}, [submission]);
	const handleUpdateMarksForSection = (sectionId, marks) => {
		if (marks) {
			setMarkUpdatesBySectionId(
				update(markUpdatesBySectionId, {
					[sectionId]: { $set: parseInt(marks, 10) },
				})
			);
		} else {
			setMarkUpdatesBySectionId(
				update(markUpdatesBySectionId, { $unset: [sectionId] })
			);
		}
	};
	const handleUpdateMarks = () => {
		const updatedGrades = [];
		const mergedMarks = { ...marksBySectionId, ...markUpdatesBySectionId };
		forEach(
			get(submission, ['assignment', 'markingScheme', 'sections']),
			section => {
				const sectionId = section._id;
				const marks = mergedMarks[sectionId];
				if (typeof marks !== 'undefined') {
					updatedGrades.push({ section: sectionId, marks });
				}
			}
		);
		setIsUpdatingGrades(true);
		assignmentApi
			.updateGrades(assignmentId, submissionId, updatedGrades)
			.then(() => {
				message.success('Grades updated successfully');
				setIsUpdatingGrades(false);
				onUpdate();
			})
			.catch(e => {
				if (isNetworkError(e)) {
					message.error(
						'Network error occurred while updating grades. Please retry.'
					);
				} else {
					message.error('Failed to update grades. Please try again.');
				}
				setIsUpdatingGrades(false);
			});
	};
	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Row gutter={[8, 8]}>
				<Col xs={24} md={12}>
					<Card title="User" size="small">
						<div>User Name: {get(submission, ['user', 'name'])}</div>
						<div>
							Email: <Text copyable>{get(submission, ['user', 'email'])}</Text>
						</div>
						<div>
							Mobile Number:{' '}
							<Text copyable>{get(submission, ['user', 'mobileNumber'], 'NA')}</Text>
						</div>
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card title="Details" size="small">
						<Title style={{ marginBottom: 0 }} level={5}>
							Submitted At
						</Title>
						<div>
							{dayjs(get(submission, ['createdAt'])).format('DD MMM YYYY hh:mm A')}
						</div>
						<Title style={{ marginTop: '1rem', marginBottom: 0 }} level={5}>
							Files
						</Title>
						<Files items={get(submission, ['files'])} />
					</Card>
				</Col>
			</Row>
			<Card title="Grades" size="small">
				<Space direction="vertical">
					{map(
						get(submission, ['assignment', 'markingScheme', 'sections']),
						section => {
							const marks = get(marksBySectionId, [section._id], 'NOT GRADED');
							return (
								<div key={section._id}>
									<Text style={{ marginRight: '1rem' }}>{section.name}</Text>
									<span>
										<Text strong style={{ fontSize: '1.1rem' }}>
											{marks}
										</Text>{' '}
										/ {section.maxMarks}
									</span>
									<span>
										<Input
											placeholder="Set marks"
											type="number"
											max={section.maxMarks}
											onChange={e =>
												handleUpdateMarksForSection(section._id, e.target.value)
											}
										/>
									</span>
								</div>
							);
						}
					)}
					<Button
						loading={isUpdatingGrades}
						disabled={isUpdatingGrades || !hasChangedMarks}
						onClick={handleUpdateMarks}
					>
						Update Grades
					</Button>
				</Space>
			</Card>
		</Space>
	);
};

export function ViewSubmissionButton(props) {
	const [isOpen, setIsOpen] = useState(false);
	const closeModal = () => {
		setIsOpen(false);
	};
	const openModal = () => {
		setIsOpen(true);
	};
	return (
		<>
			<Button onClick={openModal}>View</Button>
			<Modal
				width="60%"
				title="Assignment Submission"
				visible={isOpen}
				onCancel={closeModal}
				forceRender
				footer={
					<Button type="primary" onClick={closeModal}>
						Close
					</Button>
				}
			>
				{isOpen ? <AssignmentSubmission {...props} /> : null}
			</Modal>
		</>
	);
}

export default AssignmentSubmission;
