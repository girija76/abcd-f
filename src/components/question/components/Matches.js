import React, { Component } from 'react';
import Checkbox from 'antd/lib/checkbox';

const col1Names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const col2Names = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Matches extends Component {
	updateMatch = (idx1, idx2) => {
		const { response } = this.props;
		const idx = response[idx1].indexOf(idx2);
		if (idx !== -1) {
			response[idx1].splice(idx, 1);
		} else {
			response[idx1].push(idx2);
		}
		this.props.onAnswerUpdate(response);
	};

	render() {
		const {
			columns,
			isAnswerSelectionDisabled,
			response,
			attemptMode,
		} = this.props;

		return (
			<div style={{ display: 'flex', padding: '16px 28px' }}>
				<div style={{ flex: 1 }}>
					{columns.col1.map((c1, idx1) => {
						return (
							<div style={{ display: 'flex' }}>
								<div style={{ width: 32 }}>{col1Names[idx1]}</div>
								<div style={{ display: 'flex' }}>
									{columns.col2.map((c2, idx2) => {
										const s =
											!attemptMode && c1.matches && c1.matches[idx2]
												? {
														margin: '0px 8px',
														backgroundColor: '#93c572',
														padding: '2px 4px',
												  }
												: {
														margin: '0px 8px',
														padding: '2px 4px',
												  };
										return (
											<div style={s}>
												<Checkbox
													key={'c2-' + idx2}
													checked={response[idx1].indexOf(idx2) !== -1}
													onClick={
														attemptMode && !isAnswerSelectionDisabled
															? this.updateMatch.bind(this, idx1, idx2)
															: null
													}
												>
													{col2Names[idx2]}
												</Checkbox>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Matches;
