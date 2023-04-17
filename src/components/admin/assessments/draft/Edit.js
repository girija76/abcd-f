import { Typography } from 'antd';
import draftApi from 'apis/draft';
import { set, uniqueId } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AssessmentEditor from '../editor';

const EditDraft = () => {
	const { id } = useParams();
	console.log(id);

	const [draft, setDraft] = useState({});
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const parseData = async sections => {
		const parsedData = sections.map(sec => {
			return {
				_id: sec._id,
				name: sec.name,
				description: sec.description,
				maxMarks: '',
				id: uniqueId('section_'),
				duration: -1,
				questions: sec.questions.map(ques => {
					return {
						_id: ques.question._id,
						rawQuestion: ques.question.content && ques.question.content.rawContent,
						range: ques.question.range,
						integer: ques.question.integerAnswer,
						type: ques.question.type,
						savedType: ques.question.type,
						id: uniqueId('ques_'),
						hasChanged: false,
						rawSolution: ques.question.solution && ques.question.solution.rawContent,
						hasSolution:
							ques.question.solution && ques.question.solution.rawContent === '{}'
								? false
								: true,
						rawHint: ques.question.hint && ques.question.hint.rawContent,
						rawHint:
							ques.question.hint && ques.question.hint.rawContent === '{}'
								? false
								: true,
						markingScheme: [
							{
								key: 'Correct',
								value: ques.correctMark,
								color: '#90ee90',
							},
							{
								key: 'Incorrect',
								value: ques.incorrectMark,
								color: '#ff6863',
							},
						],
						active: false,
						options:
							ques.question.options.length > 0
								? ques.question.options.map(o => {
										return {
											_id: o._id,
											rawOption:
												o.content && o.content.rawContent
													? o.content.rawContent
													: o.content,
											id: uniqueId('option_'),
											isCorrect: o.isCorrect,
										};
								  })
								: ques.question.multiOptions &&
								  ques.question.multiOptions.map(o => {
										return {
											_id: o._id,
											rawOption:
												o.content && o.content.rawContent
													? o.content.rawContent
													: o.content,
											id: uniqueId('option_'),
											isCorrect: o.isCorrect,
										};
								  }),
					};
				}),
			};
		});

		console.log('parsedData', parsedData);
		setData(parsedData);
	};

	useEffect(() => {
		draftApi
			.getDraft(id)
			.then(res => {
				parseData(res.sections);
				setDraft(res);
				console.log('draft-data', res);
			})
			.catch(() => {
				setErrorMessage('Somthing went wrong');
			})
			.finally(setIsLoading(false));
	}, []);

	return (
		<>
			{data.length > 0 ? (
				<AssessmentEditor data={data} kind={'draft'} />
			) : (
				<Typography>Loading...</Typography>
			)}
		</>
	);
};

export default EditDraft;
