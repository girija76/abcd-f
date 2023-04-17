import { Affix, Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import CreateNewSection from './CreateNewSection';
import Navigation from './Navigation';
import { QuestionContext } from './QuestionContext';
import ShowSections from './ShowSections';
import PublishAssessment from './upload/Publish';
import SaveButton from './upload/Save';
import UpdateDraft from './upload/Update';

const Editor = ({ data, kind }) => {
	const questionContext = useContext(QuestionContext);

	useEffect(() => {
		data && questionContext.setFinalData(data);
	}, [data]);

	return (
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#f1f1f9',
				padding: '2rem',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					width: '90%',
				}}
			>
				<Row>
					<Col span={18}>
						<ShowSections />
						<CreateNewSection />
					</Col>

					<Col span={5} offset={1}>
						<Affix offsetTop={50}>
							{questionContext.finalData.length > 0 && (
								<>
									<Navigation />

									{kind === 'create' && <SaveButton />}
									{kind === 'draft' && (
										<div>
											<UpdateDraft />
											<PublishAssessment />
										</div>
									)}
								</>
							)}
						</Affix>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default Editor;
