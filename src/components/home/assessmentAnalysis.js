/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import { COLORS } from '../colors';
import { URLS } from '../urls';

import { DotChartOutlined } from '@ant-design/icons';
import { isLite } from 'utils/config';

class lastActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	takeAction = id => {
		this.props.history.push(`${URLS.analysisId}?wid=${id}`);
	};

	renderAssessmentLinks = (la, margin) => {
		return (
			<div
				style={{
					backgroundColor: COLORS.background,
					borderRadius: 4,
					display: 'flex',
					alignItems: 'center',
					padding: 24,
					marginTop: margin ? 24 : 0,
				}}
				key={`home-liveassessment-${la._id}`}
			>
				<DotChartOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />
				<div style={{ flex: 1, paddingLeft: 24 }}>
					<div style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.text }}>
						{la.name}
					</div>
					<div style={{ color: COLORS.text }}>Click to see analysis</div>
				</div>
				<Button
					data-ga-on="click"
					data-ga-event-action="click"
					data-ga-event-category="Assessment Analysis"
					data-ga-event-label="View Analysis"
					style={{
						borderRadius: '1000px',
						width: 160,
						height: 45,
						fontWeight: 'bold',
					}}
					onClick={this.takeAction.bind(this, la._id)}
					size="large"
				>
					View Analysis
				</Button>
			</div>
		);
	};

	render = () => {
		const { assessmentAnalysis } = this.props;
		const analysisAssessmentLinks = assessmentAnalysis.map((la, idx) =>
			this.renderAssessmentLinks(la, idx !== 0)
		);
		return (
			<Card
				size={isLite ? 'small' : 'default'}
				bordered={!isLite}
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				bodyStyle={{ paddingTop: 0 }}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Assessment Analysis"
			>
				{analysisAssessmentLinks}
			</Card>
		);
	};
}

export default withRouter(lastActivity);
