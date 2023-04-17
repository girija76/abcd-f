import { Button, Card, Col, DatePicker, Form, Row, Table } from 'antd';
import axios from 'axios';
import { URLS } from 'components/urls';
import dayjs from 'dayjs';
import { isEqual, toString } from 'lodash';
import React from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { findUserAverage } from '../analysis/utils';
import { GradeGraph } from '../teachers/GradeGraphs';

const axiosCfg = {
	withCredentials: true,
	headers: {
		authorization: `Token ${window.localStorage.getItem('token')}`,
	},
};

const { RangePicker } = DatePicker;

export const Grades = ({ user, overall }) => {
	const [assessmentLoading, setAssessmentLoading] = React.useState(true);
	const [assessments, setAssessments] = React.useState([]);
	const [AssessmentTableColumn, setAssessmentTableColumn] = React.useState([
		{
			key: 'name',
			title: 'Name',
			dataIndex: 'name',
			render: (name, data) => (
				<Link to={`/dashboard/analysis/assessment?wid=${data._id}&uid=${user._id}`}>
					<Button>{name}</Button>
				</Link>
			),
		},
		{
			key: 'type',
			title: 'Type',
			dataIndex: 'type',
		},
		{
			key: 'from',
			title: 'Available From',
			dataIndex: 'availableFrom',
			align: 'center',
			render: availableFrom =>
				dayjs(availableFrom)
					.format('DD MMM YYYY')
					.toString(),
		},
		{
			key: 'till',
			title: 'Available Till',
			dataIndex: 'availableTill',
			align: 'center',
			render: (availableTill, data, i) =>
				dayjs(availableTill)
					.format('DD MMM YYYY')
					.toString(),
		},
		{
			key: 'createdAt',
			title: 'Exam given on',
			dataIndex: 'createdAt',
			align: 'center',
			render: (createdAt, data) => {
				let style = {
					color: 'inherit',
				};
				if (data.availableTill < createdAt) {
					style.color = '#EE5569';
					style.fontWeight = 'bold';
				}
				return (
					<span style={style}>
						{dayjs(createdAt)
							.format('DD MMM YYYY')
							.toString()}
					</span>
				);
			},
		},
		{
			key: 'marks',
			title: 'Marks',
			dataIndex: 'marks',
			align: 'center',
			render: (marks, data) => {
				let style = {
					color: 'inherit',
				};
				const percent = (marks / data.maxMarks) * 100;
				if (percent <= 35) {
					style = {
						color: '#EE5569',
						fontWeight: 'bold',
					};
				}
				return <span style={style}>{marks}</span>;
			},
		},
		{
			key: 'percentage',
			title: 'Percentage',
			dataIndex: 'percentage',
			align: 'center',
			render: (marks, data) => {
				let style = {
					color: 'inherit',
				};
				const percent = (data.marks / data.maxMarks) * 100;
				if (percent <= 35) {
					style = {
						color: '#EE5569',
						fontWeight: 'bold',
					};
				}
				return <span style={style}>{toString(percent).slice(0, 5)}%</span>;
			},
		},
		{
			key: 'maxMarks',
			title: 'Total Marks',
			dataIndex: 'maxMarks',
			align: 'center',
		},
	]);
	const [rangeOverall, setRangeOverall] = React.useState({});

	const getAssessments = React.useCallback(async (q, limit) => {
		setAssessmentLoading(true);
		await axios
			.post(
				`${URLS.backendAnalytics}/user/fullAssessmentData/${user._id}`,
				{ q, limit },
				axiosCfg
			)
			.then(res => {
				setAssessments(res.data);
				setRangeOverall(findUserAverage(res.data));
			})
			.catch(err => console.log(err));
		setAssessmentLoading(false);
	}, []);

	React.useEffect(() => {
		getAssessments();
	}, [getAssessments]);

	const searchAssessmentByQuery = value => {
		const range = value.range;
		if (!range) {
			getAssessments({}, 10);
		} else {
			getAssessments(
				{
					$and: [
						{
							createdAt: {
								$gte: dayjs(range[0]._d).format(),
							},
						},
						{
							createdAt: {
								$lte: dayjs(range[1]._d).format(),
							},
						},
					],
				},
				1000
			);
		}
	};

	return (
		<Card
			title={
				<Row>
					<Col span="6">Grades</Col>
					<Col
						span="18"
						style={{
							display: 'flex',
							justifyContent: 'end',
						}}
					>
						<Form layout="inline" onFinish={searchAssessmentByQuery}>
							<Form.Item name="range">
								<RangePicker />
							</Form.Item>
							<Form.Item>
								<Button
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
									htmlType="submit"
									icon={<BiSearchAlt style={{ marginRight: 8 }} />}
								>
									Search
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			}
			style={{
				marginBottom: 12,
				padding: 0,
			}}
		>
			{assessments && assessments.length === 0 ? (
				`${user.name} has not given any exams in selected duration`
			) : (
				<>
					<Table
						loading={assessmentLoading}
						size="small"
						pagination={{ size: 'small', pageSize: 10 }}
						dataSource={assessments}
						columns={AssessmentTableColumn}
					/>
					{!isEqual(overall, rangeOverall) && (
						<GradeGraph
							loading={assessmentLoading}
							grades={rangeOverall}
							title={`${user.name}'s overall average for selected range`}
						/>
					)}
				</>
			)}
			{overall && (
				<GradeGraph
					loading={assessmentLoading}
					grades={overall}
					title={`${user.name}'s overall average `}
				/>
			)}
		</Card>
	);
};
