import React, { Component } from 'react';
import Editor from '../../Editor';
import List from 'antd/lib/list';
import Radio from 'antd/lib/radio';
import Checkbox from 'antd/lib/checkbox';

// import './Options.css';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

const col1Names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const col2Names = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Columns extends Component {
	render() {
		const { columns } = this.props;
		console.log('check columns', columns);

		return (
			<div style={{ display: 'flex' }}>
				<div style={{ flex: 1 }}>
					{columns.col1.map((c, idx) => {
						return (
							<div style={{ display: 'flex' }}>
								<div style={{ width: 32 }}>{col1Names[idx]}</div>
								<Editor
									key={c._id + Math.random()}
									rawContent={c.content.rawContent}
									customStyleMap={customStyleMap}
								/>
							</div>
						);
					})}
				</div>
				<div style={{ flex: 1 }}>
					{columns.col2.map((c, idx) => {
						return (
							<div style={{ display: 'flex' }}>
								<div style={{ width: 32 }}>{col2Names[idx]}</div>
								<Editor
									key={c._id + Math.random()}
									rawContent={c.content.rawContent}
									customStyleMap={customStyleMap}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Columns;
