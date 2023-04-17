import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Skeleton from 'antd/es/skeleton';
import AnalysisLink from './AnalysisLink.js';
import { URLS } from '../urls.js';

import { LockTwoTone } from '@ant-design/icons';

import './styles.css';

const monthNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

class TestAnalysisLinks extends Component {
	showAnalysis = id => {
		// this.props.showAnalysis(true);
		this.props.history.push(`${URLS.analysisId}?wid=${id}`);
	};

	parseTestDate = date => {
		const startDate = new Date(date);
		return startDate.getDate() + ' ' + monthNames[startDate.getMonth()];
	};

	render() {
		let { attemptedTests, locked, loading } = this.props;
		let testAnalysisLinks = attemptedTests.map(test => {
			return (
				<AnalysisLink
					key={test._id}
					onClick={this.showAnalysis.bind(this, test._id)}
					name={test.name}
					mock={test.type !== 'LIVE-TEST'}
					startDate={this.parseTestDate(test.availableFrom)}
					endDate={this.parseTestDate(test.availableTill)}
				/>
			);
		});
		return (
			<Skeleton loading={loading}>
				{locked ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'flex-start',
						}}
						className="testlevel-na"
					>
						<LockTwoTone style={{ fontSize: 18, margin: '0px 5px' }} />
						<div style={{ fontWeight: 'bold' }}>
							Attempt atleast one live assessment to unlock assessment level analysis.
						</div>
					</div>
				) : (
					testAnalysisLinks
				)}
			</Skeleton>
		);
	}
}

export default withRouter(TestAnalysisLinks);
