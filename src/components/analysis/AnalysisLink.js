import React from 'react';
import { Card, Divider } from 'antd';
import './AnalysisLink.css';

export class AnalysisLink extends React.Component {
	render() {
		let { name, onClick, startDate, endDate, mock } = this.props;
		return (
			<Card
				style={{
					margin: '20px 0px',
					border: '1px solid #c8c8c8',
				}}
				bodyStyle={{ padding: '12px 16px' }}
				className="test-analysis-link-wrapper"
			>
				<div style={{ display: 'flex', cursor: 'pointer' }} onClick={onClick}>
					{!mock ? (
						<div>
							<div style={{ fontWeight: 'bold' }}>{startDate}</div>
							<div style={{ fontWeight: 'bold' }}>{endDate}</div>
						</div>
					) : (
						<div>
							<div style={{ fontWeight: 'bold' }}>Mock</div>
							<div style={{ fontWeight: 'bold' }}>Test</div>
						</div>
					)}
					<Divider
						type="vertical"
						style={{
							height: 48,
							backgroundColor: '#a0a0a0',
							width: 2,
							margin: '0 15px',
						}}
					/>
					<div style={{ display: 'flex', flex: 1 }}>
						<div style={{ flex: 1, lineHeight: '24px' }}>
							<span style={{ fontWeight: 'bolder' }}>{name}</span>
							<div style={{ lineHeight: '24px' }}>Click to see analysis</div>
						</div>
					</div>
				</div>
			</Card>
		);
	}
}

export default AnalysisLink;
