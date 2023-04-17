import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { LockTwoTone } from '@ant-design/icons';

import { parseTestDateTime2 } from '../libs/lib';

import { URLS } from '../urls.js';

function getPostSubmissionMsg(assessmentWrapper) {
	const tn = new Date().getTime();
	const at = new Date(assessmentWrapper.availableTill).getTime();

	const currentSupergroup = localStorage.getItem('currentSupergroup');

	if (assessmentWrapper.type === 'LIVE-TEST' && at > tn) {
		if (currentSupergroup === '5dd95e8097bc204881be3f2c') {
			return 'Assessment will be graded at 8:00 PM after which you will get detailed analysis and solution of the assessment!';
		} else {
			return (
				'Assessment will be graded on ' +
				parseTestDateTime2(
					new Date(
						new Date(assessmentWrapper.availableTill).getTime() + 5 * 60 * 1000
					).toString()
				) +
				' after which you will get detailed analysis and solution of the assessment!'
			);
		}
	} else if (
		assessmentWrapper.type === 'LIVE-TEST' &&
		currentSupergroup === '5dd95e8097bc204881be3f2c'
	) {
		return 'Assessment will be graded at 8:00 PM after which you will get detailed analysis and solution of the assessment!';
	}
	return 'Detailed analysis will be available once the assessment is graded!';
}

const TestLevelPreview = ({
	answerSheet: {
		meta: {
			precision,
			questionsAttempted,
			correctQuestions,
			incorrectQuestions,
			marksAttempted,
			marksGained,
			marksLost,
			marks,
		},
	},
	autoGrade,
	id,
	name,
	maxMarks,
	assessmentWrapper,
}) => {
	const postSubmissionMsg = getPostSubmissionMsg(assessmentWrapper);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'space-between',
					margin: '10px 0px',
				}}
			>
				<div style={{ fontSize: 24, fontWeight: 'bold' }}>{name}</div>
				<Link class="ant-btn" to={URLS.analysisTest}>
					Back
				</Link>
			</div>
			{window.config._id === 'cat' ? (
				<div style={{ width: '100%', marginBottom: 24 }}>
					<a
						href="https://www.facebook.com/groups/MBAPrepZone/"
						target="_blank"
						rel="noreferrer"
						style={{ textDecoration: 'underline' }}
					>
						Join Hustle 30 - Powered by PrepZone
					</a>
				</div>
			) : null}
			<div
				style={{
					marginBottom: 5,
					fontSize: 20,
					fontWeight: '600',
					width: '100%',
				}}
			>
				Scorecard
			</div>
			<Card
				style={{ width: '100%', borderTop: 0 }}
				bodyStyle={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					minWidth: 400,
				}}
			>
				<div
					style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
				>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
								flex: 1,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>
								Total Marks out of {maxMarks}
							</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{marks}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
								flex: 1,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>Precision</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{precision}%
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>Questions Attempted</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{questionsAttempted}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>Marks Attempted</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{marksAttempted}
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>Correct Questions</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{correctQuestions}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1 }}>Marks Gained</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#039be5' }}>
								{marksGained}
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1, color: '#FF8C00' }}>
								Incorrect Questions
							</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#FF8C00' }}>
								{incorrectQuestions}
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								margin: 10,
							}}
						>
							<div style={{ fontSize: 16, flex: 1, color: '#FF8C00' }}>Marks Lost</div>
							<div style={{ fontSize: 24, fontWeight: 'bolder', color: '#FF8C00' }}>
								{marksLost}
							</div>
						</div>
					</div>
				</div>
			</Card>
			{!autoGrade ? (
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						width: '100%',
						marginTop: 12,
					}}
				>
					<LockTwoTone style={{ fontSize: 18, margin: '0px 5px' }} />
					<div style={{ fontWeight: 'bold' }}>{postSubmissionMsg}</div>
				</div>
			) : (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						marginTop: 32,
					}}
				>
					<div style={{ fontSize: 16, textAlign: 'center', marginRight: 16 }}>
						See how you have performed
					</div>
					<Link
						data-ga-on="click"
						data-ga-event-action="click"
						data-ga-event-category="Review Questions"
						data-ga-event-label="Page: Analysis, Position: Section 2"
						to={`${URLS.analysisQuestion}?id=${id}`}
					>
						<Button type="primary" size="large">
							Review Questions
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
};

export default withRouter(TestLevelPreview);
