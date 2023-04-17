import React from 'react';
import Card from 'antd/es/card';
import Editor from '../Editor';

export default class Goal extends React.Component {
	render() {
		const { qid, solution } = this.props;
		return (
			<div
				style={{
					display: 'flex',
					margin: '10px 10px',
					flex: 1,
					alignItems: 'start',
					maxWidth: 940,
				}}
			>
				<Card
					style={{ marginTop: 10, width: '100%' }}
					title="Solution"
					bodyStyle={{ paddingTop: 5, paddingBottom: 18 }}
					headStyle={{ borderBottom: 0 }}
					className="solution-card"
				>
					{solution && solution.rawContent && (
						<Editor key={qid} rawContent={solution.rawContent} />
					)}
				</Card>
			</div>
		);
	}
}
