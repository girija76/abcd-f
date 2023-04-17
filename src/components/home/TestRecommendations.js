import React, { Component } from 'react';
import Card from 'antd/es/card';
import TestLinks from '../mocks/TestLinks';

import { COLORS } from '../colors';

import './Home.css';
import './goal.css';
import { isLite } from 'utils/config';

export default class TestRecommendations extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render = () => {
		const { recommendations } = this.props;
		return (
			<Card
				headStyle={{
					borderBottom: 0,
					color: COLORS.text,
					fontSize: 18,
				}}
				size={isLite ? 'small' : 'default'}
				bordered={!isLite}
				bodyStyle={{ paddingTop: 0, margin: -12, marginBottom: 0 }}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Test Recommendations"
			>
				<TestLinks allTests={recommendations} classname="test-card-home" />
			</Card>
		);
	};
}
