import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { BsArrowRightShort, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { MdPlayCircleOutline } from 'react-icons/md';
import { AiOutlineLineChart } from 'react-icons/ai';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { roleSelector } from 'selectors/user';
import { get, map } from 'lodash';
import { isAtLeastMentor, isAtLeastModerator } from 'utils/auth';
import EditScheduledLectureButton from 'components/admin/attendance/EditScheduledLecture';

dayjs.extend(advancedFormat);

const { Text, Title } = Typography;

const textForType = {
	ScheduledLecture: 'Class',
};

const CoursePlanEvent = ({
	start,
	isCompleted,
	type,
	title,
	url,
	isUpcoming,
	isOngoing,
	options,
	originalData,
	afterChange,
}) => {
	const role = useSelector(roleSelector);
	const isMentor = isAtLeastModerator(role);
	const showStart = options && options.showStart;
	const showStartInNewLine = options && options.showStartInNewLine;
	const titleEllipsis = options && options.titleEllipsis;
	const typeText = get(textForType, type);
	return (
		<Card size="small">
			<Title
				style={{ marginTop: 0, marginBottom: 0 }}
				level={4}
				ellipsis={titleEllipsis}
			>
				{title}
				{showStart && !showStartInNewLine ? (
					<Text
						style={{ fontSize: '.75rem', fontWeight: 'normal', marginLeft: '.5rem' }}
						type="secondary"
					>
						{dayjs(start).format('DD MMM YY hh:mmA')}
					</Text>
				) : null}
			</Title>
			{showStart && showStartInNewLine ? (
				<Text
					style={{ fontSize: '.75rem', fontWeight: 'normal', marginLeft: 0 }}
					type="secondary"
				>
					{dayjs(start).format('DD MMM YY hh:mmA')}
				</Text>
			) : null}
			{type === 'ScheduledLecture' && originalData && originalData.lecturer ? (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<span>Teacher: {get(originalData.lecturer, 'name')}</span>
					{isMentor ? (
						<EditScheduledLectureButton
							onSuccess={afterChange}
							_id={originalData._id}
						/>
					) : null}
				</div>
			) : null}
			{type !== 'ScheduledLecture' ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '0.25rem',
					}}
				>
					{isCompleted ? (
						<Text
							type="success"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								cursor: 'default',
							}}
						>
							<BsCheckCircle style={{ fontSize: 24, marginRight: 4 }} />{' '}
							<Text>
								{type === 'Video'
									? 'Watched'
									: type === 'Assessment'
									? 'Attempted'
									: type === 'Assignment'
									? 'Submitted'
									: 'Completed'}
							</Text>
						</Text>
					) : isUpcoming ? (
						`Upcoming ${typeText}`
					) : isOngoing ? (
						`Ongoing ${typeText}`
					) : role === 'user' ? (
						<Text
							type="danger"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								cursor: 'default',
							}}
						>
							<BsXCircle style={{ fontSize: 15, marginRight: 4 }} />{' '}
							<Text>{typeText} Missed</Text>
						</Text>
					) : (
						<Text></Text>
					)}
					<div>
						{isUpcoming ? (
							<Text type="secondary">Not available yet</Text>
						) : (
							<Link
								to={url}
								component={Typography.Link}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
								}}
							>
								{type === 'Video' ? (
									isCompleted ? (
										<>
											<MdPlayCircleOutline style={{ fontSize: 20, marginRight: 4 }} />{' '}
											Watch Again
										</>
									) : (
										<>
											<MdPlayCircleOutline style={{ fontSize: 20, marginRight: 4 }} />{' '}
											Watch Now
										</>
									)
								) : type === 'Assessment' ? (
									isCompleted ? (
										<>
											<AiOutlineLineChart style={{ fontSize: 20, marginRight: 6 }} /> View
											Analysis
										</>
									) : (
										<>
											Attempt Now <BsArrowRightShort style={{ fontSize: 20 }} />
										</>
									)
								) : (
									'View'
								)}
							</Link>
						)}
					</div>
				</div>
			) : null}
		</Card>
	);
};
export default CoursePlanEvent;
