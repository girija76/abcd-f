import React from 'react';
import { Skeleton } from 'antd';
import Collapse from 'antd/es/collapse';

import TestLink from './TestLink';

import { getTopicParentNameMapping } from '../libs/lib';

import './TestLink.css';
import './TestLink.css';

const { Panel } = Collapse;

function getTotalAttempted(allTests) {
	let count = 0;
	allTests.forEach(at => {
		if (at.submission) count += 1;
	});
	return count;
}

class SectionTestLinks extends React.PureComponent {
	render() {
		const { allTests, Topics, attemptedTests, mode, loading } = this.props;
		const tpMap = getTopicParentNameMapping(Topics);
		const subTopicsFound = {};
		const topicsFound = {};

		allTests.sort(function(a, b) {
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			return 0;
		});

		allTests.forEach(t => {
			if (tpMap[t.topic]) {
				if (topicsFound[tpMap[t.topic].pid] === undefined) {
					topicsFound[tpMap[t.topic].pid] = {
						name: tpMap[t.topic].parent,
						subTopics: {},
					};
				}
				if (topicsFound[tpMap[t.topic].pid].subTopics[t.topic] === undefined) {
					topicsFound[tpMap[t.topic].pid].subTopics[t.topic] = [];
				}
				topicsFound[tpMap[t.topic].pid].subTopics[t.topic].push(t);
			}
		});

		return (
			<div
				className="content-and-rsb-container"
				style={{ display: 'flex', flexWrap: 'wrap' }}
			>
				<Skeleton loading={loading}>
					{allTests.length
						? allTests.map(at => {
								return <TestLink test={at} sid={at.submission} mode={mode} />;
						  })
						: 'No tests available yet.'}
				</Skeleton>
			</div>
		);
	}
}

export default SectionTestLinks;
