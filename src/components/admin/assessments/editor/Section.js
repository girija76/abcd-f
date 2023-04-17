import { Button, Card, Input, Space, Typography } from 'antd';
import { uniqueId } from 'lodash-es';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import QuestionCard from './QuestionCard';
import { QuestionContext } from './QuestionContext';

const { Title } = Typography;

const Section = ({ sectionData, sectionIndex, totalSections }) => {
	const questionContext = useContext(QuestionContext);

	const [isEditingName, setIsEditingName] = useState(false);
	const [newName, setNewName] = useState(sectionData.name);

	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [newDescription, setNewDescription] = useState(sectionData.description);

	const nameInputRef = useRef(null);
	const descriptionInputRef = useRef(null);

	const handleDeleteSection = id => {
		questionContext.setFinalData(
			questionContext.finalData.filter(sec => sec.id !== id)
		);
		// questionContext.setSelectedNavigation({
		//     section: sectionIndex===totalSections-1 ? totalSections-2 : sectionIndex,
		//     question:0
		// })
	};

	const initialOption = {
		rawOption: {},
		id: uniqueId(),
		isCorrect: false,
	};

	const initialQuestion = {
		rawQuestion: {},
		options: [initialOption],
		range: '',
		type: sectionData.defaultType,
		id: uniqueId('addedNewQues_'),
		markingScheme: sectionData.defautlMarkingScheme,
		active: true,
	};

	const handleNameChange = e => {
		setNewName(e.target.value);
		if (e.key === 'Enter') {
			handleNameSave();
		}
	};

	const handleKeyDown = (e, type) => {
		if (e.key === 'Enter' && type === 'Name') {
			handleNameSave();
		} else if (e.key === 'Enter' && type === 'Description') {
			handleDescriptionSave();
		}
	};

	const handleNameSave = () => {
		questionContext.setFinalData(
			questionContext.finalData.map(sec =>
				sec.id === sectionData.id
					? {
							...sec,
							name: newName,
					  }
					: sec
			)
		);
		setIsEditingName(false);
	};

	const handleDescriptionChange = e => {
		setNewDescription(e.target.value);
	};

	const handleDescriptionSave = () => {
		questionContext.setFinalData(
			questionContext.finalData.map(sec =>
				sec.id === sectionData.id
					? {
							...sec,
							description: newDescription,
					  }
					: sec
			)
		);
		setIsEditingDescription(false);
	};

	const handleAddQuestion = () => {
		questionContext.setFinalData(
			questionContext.finalData.map(sec =>
				sec.id === sectionData.id
					? {
							...sec,
							questions: [...sec.questions, initialQuestion],
					  }
					: sec
			)
		);
	};

	useEffect(() => {
		isEditingName && nameInputRef.current.focus();
		isEditingDescription && descriptionInputRef.current.focus();
	}, [isEditingName, isEditingDescription]);

	return (
		<div id={sectionData.id}>
			<Card
				title={
					<div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Typography
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									margin: '0 1rem 0 0',
								}}
							>
								({sectionIndex + 1}/{totalSections}) Section- {sectionData.name}
							</Typography>

							<Button
								style={
									{
										// marginBottom: '0.9rem',
									}
								}
								onClick={() => setIsEditingName(!isEditingName)}
							>
								{sectionData.name ? <AiFillEdit /> : 'Add name'}
							</Button>
						</div>

						{isEditingName && (
							<div
								style={{
									display: 'flex',
									width: '50%',
									marginBottom: '1rem',
								}}
							>
								<Typography
									style={{
										marginRight: '1rem',
									}}
								>
									New Name:
								</Typography>
								<Input
									ref={nameInputRef}
									placeholder={'Name'}
									value={newName}
									onChange={handleNameChange}
									onKeyDown={e => handleKeyDown(e, 'Name')}
								/>
								<Button onClick={handleNameSave}>save</Button>
							</div>
						)}

						{/* <div
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Typography
								style={{
									marginRight: '1rem',
									marginTop:"1rem"
								}}
							>
								{sectionData.description}
							</Typography>

							<Button onClick={() => setIsEditingDescription(!isEditingDescription)}>
								{sectionData.description ? <AiFillEdit /> : 'Add description'}
							</Button>
						</div> */}

						{isEditingDescription && (
							<div
								style={{
									display: 'flex',
									width: '70%',
								}}
							>
								<Typography
									style={{
										marginRight: '1rem',
									}}
								>
									New Description:
								</Typography>
								<Input
									ref={descriptionInputRef}
									placeholder={'Description'}
									value={newDescription}
									onChange={handleDescriptionChange}
									onKeyDown={e => handleKeyDown(e, 'Description')}
								/>
								<Button onClick={handleDescriptionSave}>save</Button>
							</div>
						)}
					</div>
				}
				bordered={false}
				style={{
					marginBottom: '2rem',
				}}
				extra={
					<div>
						<Button type="danger" onClick={() => handleDeleteSection(sectionData.id)}>
							Delete
						</Button>
					</div>
				}
			>
				{sectionData.questions.map((question, index) => {
					return (
						<QuestionCard
							id={`${sectionData.id}-${question.id}`}
							key={question.id} //this is very important
							sectionIndex={sectionIndex}
							sectionId={sectionData.id}
							questionData={question}
							questionIndex={index}
							defautlType={sectionData.defaultType}
							defautlMarkingScheme={sectionData.defautlMarkingScheme}
						/>
					);
				})}

				{sectionData.questions.length === 0 && (
					<Button type="primary" onClick={handleAddQuestion}>
						Add Question
					</Button>
				)}
			</Card>
		</div>
	);
};

export default Section;
