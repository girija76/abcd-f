import { Col, Row, Typography } from 'antd';
import assignmentApi from 'apis/assignment';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { activePhaseIdSelector, roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';
import { getViewAsPhase } from 'utils/viewAs';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';

const { Title } = Typography;

const GradesGraph = ({ id, userId }) => {
	const userPhase = useSelector(activePhaseIdSelector);
	const role = useSelector(roleSelector);
	const phaseId = getViewAsPhase(userPhase, role);

	const { data: graphData, isSuccess: graphDataLoaded } = useQuery(
		['get-grade-graph-data', phaseId],
		() =>
			assignmentApi.getGradesGraphData({
				phaseId,
			}),
		{
			staleTime: 6e5,
		}
	);

	const { data: userGradesData, isSuccess: userGradesDataLoaded } = useQuery(
		['get-user-grades-data', userId],
		() =>
			assignmentApi.getUserGrades({
				userId,
			}),
		{
			staleTime: 6e5,
		}
	);

	const finalData =
		graphDataLoaded && userGradesDataLoaded
			? graphData.map(subject => {
					return subject.assignments.map((assignment, index) => {
						const reqObj =
							userGradesData.length > 0
								? userGradesData.find(o => o.assignmentId === assignment.assignmentId)
								: undefined;
						return reqObj
							? {
									...assignment,
									marks: reqObj.marks,
									percent: (100 * reqObj.marks) / assignment.maxMarks,
									index: `A${index + 1}`,
							  }
							: {
									...assignment,
									index: `A${index + 1}`,
							  };
					});
			  })
			: [];

	// graphDataLoaded ? console.log("graphData", graphData) : console.log("loading");
	// userGradesDataLoaded ? console.log("userGradesData", userGradesData) : console.log("loading");
	// console.log("newState", finalData);

	return (
		<div id={id}>
			{finalData.length > 0
				? finalData.map((item, index) => {
						return (
							<div key={index}>
								<Title level={3}> {item[0].subject} </Title>

								<Row>
									<Col xs={12}>
										<VictoryChart
											theme={VictoryTheme.material}
											domainPadding={50}
											domain={{ y: [0, 100] }}
										>
											<VictoryBar data={item} x="index" y="percent" />
										</VictoryChart>
									</Col>
								</Row>
							</div>
						);
				  })
				: isAtLeastMentor(role)
				? "Student hasn't given any assessment"
				: ''}
		</div>
	);
};

export default GradesGraph;
