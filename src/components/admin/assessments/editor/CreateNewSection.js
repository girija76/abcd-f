import { Button, Card, Input, Space, Typography, Col, Row } from 'antd';
import { uniqueId } from 'lodash-es';
import React, { useContext, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { initialMarkingScheme, types } from './initialProps';
import { QuestionContext } from './QuestionContext';
import TypeSelector from './TypeSelector';
import Title from 'antd/lib/typography/Title';

const CreateNewSection = () => {
	const questionContext = useContext(QuestionContext);
	const savedMarkingSchemes = questionContext.savedMarkingSchemes;

	const [isCreatingSection, setIsCreatingSection] = useState(true);
	const [newSectionName, setNewSectionName] = useState('');
	const [newSectionDescription, setNewSectionDescription] = useState('');
	const [newSectionType, setNewSectionType] = useState(
		'MULTIPLE_CHOICE_SINGLE_CORRECT'
	);
	const [newSectionMarkingScheme, setNewSectionMarkingScheme] = useState(
		initialMarkingScheme
	);

	const initialOption = {
		rawOption: {},
		id: uniqueId(),
		isCorrect: false,
	};

	const initialQuestion = {
		rawQuestion: {},
		options: [initialOption],
		range: '',
		type: newSectionType,
		id: uniqueId(),
		markingScheme: newSectionMarkingScheme,
		active: true,
		hasChanged: true,
	};

	const initialSection = {
		name: '',
		description: '',
		maxMarks: '',
		questions: [initialQuestion],
		id: uniqueId('section_'),
		duration: -1,
	};

	const handleTypeSelect = e => {
		setNewSectionType(e.key);
		setNewSectionMarkingScheme(
			savedMarkingSchemes.length > 0
				? savedMarkingSchemes.find(s => s.type === e.key)
					? savedMarkingSchemes.find(s => s.type === e.key).scheme
					: initialMarkingScheme
				: initialMarkingScheme
		);
	};

	const handleMarkingSchemeChange = (e, key) => {
		setNewSectionMarkingScheme(
			newSectionMarkingScheme.map(i =>
				i.key === key ? { ...i, value: e.target.value } : i
			)
		);
	};

	const handleCreateSection = () => {
		questionContext.setFinalData([
			...questionContext.finalData,
			{
				...initialSection,
				name: newSectionName,
				description: newSectionDescription,
				defaultType: newSectionType,
				defautlMarkingScheme: newSectionMarkingScheme,
			},
		]);
		questionContext.setSavedMarkingSchemes([
			...questionContext.savedMarkingSchemes,
			{
				scheme: newSectionMarkingScheme,
				type: newSectionType,
				section: initialSection.id,
			},
		]);

		setIsCreatingSection(false);
		setNewSectionName('');
		setNewSectionDescription('');
	};

	const styleSheet = {
		headings: {
			fontSize: '1rem',
		},
	};

	return (
		<Card
			title={
				<Title level={4} style={{ margin: 0 }}>
					Create New Section
				</Title>
			}
			bordered={false}
			extra={
				<Space>
					<Button
						icon={isCreatingSection ? <AiOutlineMinus /> : <AiOutlinePlus />}
						onClick={() => setIsCreatingSection(!isCreatingSection)}
					></Button>
				</Space>
			}
		>
			{isCreatingSection ? (
				<div>
					<Row>
						<Col xs={24}>
							<Typography style={styleSheet.headings}>Section:</Typography>

							<Input
								style={{ height: '3rem', marginBottom: '1rem' }}
								placeholder={'Name'}
								value={newSectionName}
								onChange={e => setNewSectionName(e.target.value)}
							/>

							<Typography style={styleSheet.headings}>Description:</Typography>

							<Input
								style={{ height: '6rem', marginBottom: '1rem' }}
								placeholder={'Description'}
								value={newSectionDescription}
								onChange={e => setNewSectionDescription(e.target.value)}
							/>

							<Typography style={styleSheet.headings}>Question Type:</Typography>

							<TypeSelector onClick={handleTypeSelect} types={types} color="#d1d1d1" />

							<Typography style={styleSheet.headings}>Marking Scheme:</Typography>
							<Row>
								{newSectionMarkingScheme.map((scheme, index) => {
									return (
										<Col
											key={index}
											style={{
												marginRight: '1rem',
											}}
										>
											<Typography style={{ fontSize: '0.7rem' }}>{scheme.key}</Typography>
											<Input
												style={{ marginBottom: '0.5rem' }}
												type="number"
												value={scheme.value}
												onChange={e => handleMarkingSchemeChange(e, scheme.key)}
											/>
										</Col>
									);
								})}
							</Row>
						</Col>
					</Row>

					<Button
						onClick={handleCreateSection}
						size="large"
						type="primary"
						style={{
							marginTop: '1rem',
						}}
					>
						Create Section
					</Button>
				</div>
			) : null}
		</Card>
	);
};

export default CreateNewSection;
