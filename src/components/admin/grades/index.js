import React from 'react';
import GradesGraph from './GradesGraph';

const UserGrades = ({ userId }) => {
	return (
		<div style={{ padding: '1rem' }}>
			<GradesGraph userId={userId} />
		</div>
	);
};

export default UserGrades;
