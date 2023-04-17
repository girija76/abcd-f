import Title from 'antd/lib/typography/Title';
import Loading from 'components/extra/Loading';
import React from 'react';
import { themeColor } from 'utils/config';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';

const titleMapping = {
	precision: 'Precision',
	correctTIme: 'Correct Time',
	incorrectTime: 'Incorrect Time',
	unattemptedTime: 'Unattempted Time',
	marks: 'Marks',
	marksGained: 'Marks Gained',
	marksLost: 'Marks Lost',
	questionsAttempted: 'Questions Attempted',
	questionsUnattempted: 'Questions Unattempted',
	totalQuestions: 'Total Questions',
	correctQuestions: 'Correct Questions',
	incorrectQuestions: 'Incorrect Questions',
};

export const GradeGraph = ({ grades, title, loading }) => {
	const [questions, setQuestion] = React.useState([]);

	React.useEffect(() => {
		const arr = [];

		Object.keys(grades).forEach(key => {
			if (
				!['precision', 'correctTime', 'incorrectTime', 'unattemptedTime'].includes(
					key
				)
			) {
				arr.push({ x: titleMapping[key], y: grades[key] });
			}
		});
		setQuestion(arr);
	}, [grades]);

	return (
		<>
			{!loading ? (
				<>
					<Title level={4} style={{ textAlign: 'center' }}>
						{title}
					</Title>
					<VictoryChart
						theme={VictoryTheme.material}
						horizontal
						domainPadding={{ x: 20 }}
						padding={{ left: 200, right: 200, bottom: 50 }}
						width={1000}
					>
						<VictoryBar
							style={{
								data: {
									fill: `${themeColor}`,
									width: 15,
								},
							}}
							data={questions}
						/>
					</VictoryChart>
				</>
			) : (
				<Loading simple />
			)}
		</>
	);
};
