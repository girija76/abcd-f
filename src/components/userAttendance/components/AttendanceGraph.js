import attendanceApi from 'apis/attendance';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getViewAsPhase } from 'utils/viewAs';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import {
	VictoryAxis,
	VictoryChart,
	VictoryLabel,
	VictoryLine,
	VictoryPie,
} from 'victory';
import { Col, Radio, Row } from 'antd';

const AttendanceGraph = ({
	userId,
	subjectId,
	dateFrom,
	sortBy,
	showPie,
	showLine,
}) => {
	const oneYear = dayjs()
		.subtract(1, 'year')
		.format('YYYY-MM-DD');

	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);

	const [user, setUser] = useState(userId ? userId : '');
	const [subject, setSubject] = useState(subjectId ? subjectId : '');
	const [from, setFrom] = useState(dateFrom ? dateFrom : oneYear);
	const [sort, setSort] = useState(sortBy ? sortBy : 'week');

	const onChangeSort = e => {
		setSort(e.target.value);
	};

	const { data, isSuccess } = useQuery(
		['get-attendance-data', phaseId, user, subject, from, sort],
		() =>
			attendanceApi.getAttendanceGraphData({
				phase: phaseId,
				user: user,
				subject: subject,
				from,
				sort,
			}),
		{
			staleTime: 6e6,
		}
	);

	const graphData = isSuccess ? data.data : [{ bySort: [], byStatus: [] }];
	const lineData = graphData[0].bySort;
	const pieData = graphData[0].byStatus;

	return (
		<>
			{lineData.length > 1 && pieData.length > 1 ? (
				<Row>
					{showPie ? (
						<Col xs={12} md={8}>
							<VictoryPie
								data={pieData}
								x="_id"
								y="count"
								colorScale={[
									'lightgreen',
									'lightcoral',
									'lightsalmon',
									'lightblue',
									'lightgray',
									'#e0e5ff',
								]}

								// labels={({ datum }) => (datum.y === 0 ? "" : datum.x)}
							/>
						</Col>
					) : null}
					{showLine ? (
						<Col xs={12} md={16}>
							<VictoryChart>
								<VictoryLabel
									text={lineData.length <= 1 ? 'Not enough data' : ''}
									x={225}
									y={30}
									textAnchor="middle"
								/>

								<VictoryLine
									style={{
										data: { stroke: '#c43a31' },
										parent: { border: '1px solid #ccc' },
									}}
									data={lineData.length > 1 ? lineData : []}
									x="_id"
									y="count"
								/>
							</VictoryChart>

							<div
								style={{ display: 'flex', marginLeft: '10%', paddingBottom: '16px' }}
							>
								<Radio.Group onChange={onChangeSort} value={sort}>
									<Radio value={'day'}>days</Radio>
									<Radio value={'week'}>weeks</Radio>
									<Radio value={'month'}>months</Radio>
								</Radio.Group>
							</div>
						</Col>
					) : null}
				</Row>
			) : (
				'Not enough data '
			)}
		</>
	);
};

export default AttendanceGraph;
