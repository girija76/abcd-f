import React from 'react';
import { MdCheckCircle } from 'react-icons/md';

function CalendarEvent({ event }) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
			}}
		>
			{event.isCompleted && (
				<span style={{ display: 'inline-flex', minWidth: 20 }}>
					<MdCheckCircle style={{ marginRight: 2 }} />
				</span>
			)}
			<span>{event.title}</span>
		</div>
	);
}

export default CalendarEvent;
