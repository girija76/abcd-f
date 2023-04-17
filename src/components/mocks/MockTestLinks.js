import React from 'react';
import TestLink from './TestLink';

import './TestLink.css';
import './TestLink.css';

function checkAttempted(test, attemptedTests) {
	let sid = '';
	attemptedTests.map(atest => {
		if (atest.assessment._id === test._id) {
			sid = atest._id;
		}
	});
	return sid;
}

class LiveTestLinks extends React.PureComponent {
	render() {
		const { allTests, attemptedTests } = this.props;
		const labelsFound = {};
		let showLabels = false;
		allTests.forEach(t => {
			if (t.label) {
				if (labelsFound[t.label] === undefined) labelsFound[t.label] = [];
				labelsFound[t.label].push(t);
				showLabels = true;
			} else {
				if (labelsFound['Other'] === undefined) labelsFound['Other'] = [];
				labelsFound['Other'].push(t);
			}
		});

		return (
			<div className="content-and-rsb-container">
				{Object.keys(labelsFound).map((k, i) => {
					return (
						<div style={i ? { marginTop: 24 } : {}}>
							{showLabels ? (
								<div style={{ fontWeight: 'bold', fontSize: 18 }}>{k}</div>
							) : null}

							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
									{labelsFound[k].map(test => {
										return (
											<TestLink test={test} sid={checkAttempted(test, attemptedTests)} />
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}

export default LiveTestLinks;
