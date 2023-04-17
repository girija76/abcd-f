import { Button, Card, Col, Row, Tabs, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { QuestionContext } from './QuestionContext';

const { TabPane } = Tabs;

const Navigation = () => {
	const questionContext = useContext(QuestionContext);
	const finalData = questionContext.finalData;

	const selectedSection = questionContext.selectedNavigation.section;
	const selectedQuestion = questionContext.selectedNavigation.question;

	const handleSectionSelection = key => {
		const sectionId = finalData[key].id;
		const activeQuestion = finalData[key].questions.findIndex(
			ques => ques.active === true
		);

		questionContext.scrollToSection(sectionId);

		questionContext.setSelectedNavigation({
			section: key,
			question: activeQuestion,
		});
	};

	const handleQuestionSelection = (id, sectionId, questionId, index) => {
		questionContext.setSelectedNavigation({
			...questionContext.selectedNavigation,
			question: index,
		});

		questionContext.setFinalData(
			finalData.map(sec =>
				sec.id === sectionId
					? {
							...sec,
							questions: sec.questions.map(ques =>
								ques.id === questionId
									? {
											...ques,
											active: true,
									  }
									: {
											...ques,
											active: false,
									  }
							),
					  }
					: sec
			)
		);
		setTimeout(() => {
			questionContext.scrollToQuestion(id);
		}, 100);
	};

	return (
		<div>
			<Card bordered={false}>
				<Tabs activeKey={`${selectedSection}`} onChange={handleSectionSelection}>
					{finalData.map((section, idx) => {
						return (
							<TabPane key={idx} tab={section.name ? section.name : `S-${idx + 1}`}>
								<Row gutter={24}>
									{section.questions.map((question, index) => {
										return (
											<Col key={index} xs={24} sm={24} md={12} lg={12} xl={6}>
												<Button
													style={{
														marginBottom: '1rem',
														backgroundColor: index === selectedQuestion ? '#8fd3fe' : '',
														borderColor: index === selectedQuestion && '#8fd3fe',
														color: '#000',
													}}
													// type={index === selectedQuestion ? 'primary' : 'default'}
													onClick={() =>
														handleQuestionSelection(
															`${finalData[idx].id}-${question.id}`,
															finalData[idx].id,
															question.id,
															index
														)
													}
												>
													{index + 1}
												</Button>
											</Col>
										);
									})}
								</Row>
							</TabPane>
						);
					})}
				</Tabs>
			</Card>
		</div>
	);
};

export default Navigation;
