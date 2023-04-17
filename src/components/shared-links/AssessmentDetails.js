import React from 'react';
import { URLS } from '../urls';

import { ClockCircleTwoTone, CheckSquareTwoTone } from '@ant-design/icons';

import { parseTimeString } from '../libs/lib';

import Instructions from '../instructions/Instructions';

function getTotalQuestions(instructions) {
	let total = null;
	instructions.forEach(i => {
		if (total === null && i.type === 'text' && i.instruction) {
			if (i.instruction.indexOf(' questions)') >= 0) {
				const data = i.instruction.split(' questions)')[0].split(' (');
				if (data.length === 2) total = data[1];
			}
		}
	});
	if (total === null) return 'N/A';
	return total;
}

class Assessment extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		const { assessmentWrapper, assessmentCore } = this.props;

		return (
			<div style={{ padding: '0px 12px' }}>
				<h1>{assessmentWrapper.name}</h1>
				<div style={{ display: 'flex' }}>
					<div
						style={{
							marginRight: 12,
							fontWeight: 500,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ClockCircleTwoTone style={{ fontSize: 18, marginRight: 4 }} />
						Duration: {parseTimeString(assessmentCore.duration)}
					</div>
					<div
						style={{
							marginLeft: 12,
							fontWeight: 500,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<CheckSquareTwoTone style={{ fontSize: 18, marginRight: 4 }} />
						Total Questions: {getTotalQuestions(assessmentCore.instructions)}
					</div>
				</div>
				<div style={{ marginTop: 24, maxWidth: 600 }}>
					<h3>Instructions</h3>
					<Instructions
						instructions={assessmentCore.instructions}
						sectionInstructions={assessmentCore.sectionInstructions}
						customInstructions={assessmentCore.customInstructions}
						hideButton={true}
					/>
				</div>
			</div>
		);
	}
}

export default Assessment;
