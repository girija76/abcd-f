/* eslint-disable no-nested-ternary */
import React from 'react';
import { Card, Divider, Table, Tooltip, Typography } from 'antd';
import { size } from 'lodash';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { showAccuracy } from 'utils/config';

const { Text } = Typography;

let columns = [
	{
		dataIndex: 'name',
		title: 'Section',
		width: '15%',
	},
	{
		dataIndex: 'marksAttempted',
		title: 'Marks Attempted',
		align: 'right',
		width: '15%',
	},
	{
		dataIndex: 'marksGained',
		title: 'Marks Gained',
		align: 'right',
		width: '15%',
	},
	{
		dataIndex: 'marksLost',
		title: 'Marks Lost',
		align: 'right',
		width: '15%',
	},
	{
		dataIndex: 'marks',
		title: 'Marks Got',
		align: 'right',
		width: '15%',
	},
	{
		dataIndex: 'precision',
		title: 'Accuracy',
		align: 'right',
		width: '15%',
		render: n => `${n}%`,
	},
];

const AnalysisPartOne = ({
	maxMarks,
	marks,
	live,
	rank,
	percentile,
	precision,
	questionsAttempted,
	correctQuestions,
	incorrectQuestions,
	autoGrade,
	liveAttempts,
	sections,
}) => {
	const percentMarks = Math.min(
		Math.round((100 * 100 * marks) / maxMarks) / 100,
		100
	);
	if (!showAccuracy) {
		columns = columns.filter(value => value.title !== 'Accuracy');
	}
	return (
		<Card className="analysis-scorecard" style={{ width: '100%' }}>
			<div className="list" style={{ display: 'flex' }}>
				<div className="item">
					<div className="label">Marks Obtained</div>
					<div>
						<div
							className="numbers"
							style={{ lineHeight: Number.isNaN(percentMarks) ? '' : 'normal' }}
						>
							{Math.round(100 * marks) / 100.0}
							<span
								style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#676767' }}
							>
								/{maxMarks}
							</span>
						</div>
						{!Number.isNaN(percentMarks) ? (
							<div>
								<Text style={{ fontSize: '1rem', color: '#777', fontWeight: 'normal' }}>
									({percentMarks}%)
								</Text>
							</div>
						) : null}
					</div>
				</div>
				<Divider
					type="vertical"
					style={{
						height: 64,
						backgroundColor: '#dcdae0',
						width: 2,
						margin: '0 15px',
					}}
				/>
				<div className="item">
					<div className="label" style={{ display: 'flex' }}>
						Overall Rank
						{!autoGrade && !live ? (
							<Tooltip
								placement="bottom"
								title={
									'Projected rank (you did not attempt this assessment when it was live)'
								}
							>
								<AiFillQuestionCircle size={20} style={{ marginLeft: 8 }} />
							</Tooltip>
						) : null}
					</div>
					<div className="numbers">
						{!autoGrade || liveAttempts > 60 ? rank : 'N/A'}
					</div>
				</div>
				<Divider
					type="vertical"
					style={{
						height: 64,
						backgroundColor: '#dcdae0',
						width: 2,
						margin: '0 15px',
					}}
				/>
				<div className="item">
					<div className="label" style={{ display: 'flex' }}>
						Percentile
						<Tooltip
							placement="right"
							title="Your score is more than this many per cent of students"
						>
							<AiFillQuestionCircle size={20} style={{ marginLeft: 8 }} />
						</Tooltip>
					</div>
					<div className="numbers">
						{!autoGrade || liveAttempts > 60 ? percentile : 'N/A'}
					</div>
				</div>
			</div>
			<div style={{ marginTop: 18 }}>
				<Divider
					style={{
						height: 1,
						backgroundColor: '#dcdae0',
						margin: '16px 0px',
					}}
				/>
				<div
					className="list"
					style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}
				>
					{showAccuracy && (
						<div>
							<div className="item">
								<div className="label">Accuracy</div>
								<div className="numbers">{precision !== null ? precision : 0}%</div>
							</div>
						</div>
					)}

					<div>
						<div className="item">
							<div className="label">Questions Attempted</div>
							<div className="numbers">{questionsAttempted}</div>
						</div>
					</div>
					<div>
						<div className="item">
							<div className="label">Correct Questions</div>
							<div className="numbers color color-correct">{correctQuestions}</div>
						</div>
					</div>
					<div>
						<div className="item">
							<div className="label">Incorrect Questions</div>
							<div className="numbers color color-incorrect">{incorrectQuestions}</div>
						</div>
					</div>
				</div>
			</div>
			{size(sections) > 1 ? (
				<div>
					<Divider type="horizontal" />
					<Table
						columns={columns}
						dataSource={sections}
						bordered={true}
						size="small"
						pagination={false}
					/>
				</div>
			) : null}
		</Card>
	);
};

export default AnalysisPartOne;
