import { Button, Modal } from 'antd';
import Scoreboard from 'components/reports/components/Scoreboard';
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';

function ViewScoreboardButton({ name, _id }) {
	const [isScoreboardVisible, openScoreboard, closeScoreboard] = useBoolean(
		false
	);
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />}
				onClick={openScoreboard}
			>
				Scoreboard
			</Button>
			<Modal
				width="80%"
				closable={false}
				title={`${name}'s Scoreboard`}
				visible={isScoreboardVisible}
				onCancel={closeScoreboard}
				centered
				footer={<Button onClick={closeScoreboard}>Close</Button>}
			>
				<Scoreboard user={_id} />
			</Modal>
		</>
	);
}

export default ViewScoreboardButton;
