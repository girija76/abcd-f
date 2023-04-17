import { Button, Modal } from 'antd';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';
import UserGrades from '../grades';

function ViewGradesButton({ name, _id }) {
	const [areGradesVisible, showGrades, hideGrades] = useBoolean(false);
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				onClick={showGrades}
				icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />}
			>
				Grades
			</Button>
			<Modal
				width="80%"
				title={`${name}'s  Grades`}
				visible={areGradesVisible}
				onOk={hideGrades}
				onCancel={hideGrades}
				centered
				closable={false}
				bodyStyle={{ padding: 0 }}
				footer={
					<Button type="primary" onClick={hideGrades}>
						Ok
					</Button>
				}
			>
				{areGradesVisible ? (
					<UserGrades userId={_id} />
				) : (
					"Student hasn't given any assessment..."
				)}
			</Modal>
		</>
	);
}

export default ViewGradesButton;
