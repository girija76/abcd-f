import React, { Component } from 'react';
import Editor from '../../Editor';
import List from 'antd/es/list';
import Radio from 'antd/es/radio';
import Checkbox from 'antd/es/checkbox';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

const optionNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

class Options extends Component {
	renderImageOptions = (options, bonus, type) => {
		const { attemptMode, optionChecked, showAnswers } = this.props;
		const correctStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
					border: 0,
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					backgroundColor: '#93c572',
					border: 0,
			  };
		const defaultStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
					border: 0,
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					border: 0,
			  };

		const checkedOptions = {};
		if (Array.isArray(optionChecked)) {
			optionChecked.forEach(o => {
				checkedOptions[o] = true;
			});
		}
		return (
			<List
				grid={{ gutter: 16, column: 4 }}
				dataSource={options}
				renderItem={(item, idx) => (
					<List.Item
						key={item._id}
						onClick={
							attemptMode ? this.props.onAnswerUpdate.bind(this, item._id) : null
						}
						style={
							showAnswers && item.isCorrect && !bonus ? correctStyle : defaultStyle
						}
					>
						<div>
							{type === 'MULTIPLE_CORRECT' ? (
								<Checkbox checked={checkedOptions[item._id]}></Checkbox>
							) : (
								<Radio
									checked={optionChecked === item._id}
									name="option"
									classes={
										optionChecked === item._id
											? {
													root: 'custom-radio-button-active',
											  }
											: {
													root: 'custom-radio-button-inactive',
											  }
									}
									color="primary"
								/>
							)}
						</div>
						<div className="question-option-content">{optionNames[idx] + ')'}</div>
					</List.Item>
				)}
				size="large"
				style={{ paddingRight: 64 }}
			/>
		);
	};

	renderOptions = (options, bonus, type) => {
		let { attemptMode, optionChecked, showAnswers } = this.props;
		const correctStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
					border: 0,
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					backgroundColor: '#93c572',
					border: 0,
			  };
		const defaultStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
					border: 0,
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					border: 0,
			  };

		const checkedOptions = {};
		if (Array.isArray(optionChecked)) {
			optionChecked.forEach(o => {
				checkedOptions[o] = true;
			});
		}
		return (
			<List
				itemLayout="vertical"
				dataSource={options}
				renderItem={item => (
					<List.Item
						key={item._id}
						onClick={
							attemptMode ? this.props.onAnswerUpdate.bind(this, item._id) : null
						}
						style={
							showAnswers && item.isCorrect && !bonus ? correctStyle : defaultStyle
						}
					>
						<div>
							{type === 'MULTIPLE_CORRECT' ? (
								<Checkbox checked={checkedOptions[item._id]}></Checkbox>
							) : (
								<Radio
									checked={optionChecked === item._id}
									name="option"
									classes={
										optionChecked === item._id
											? {
													root: 'custom-radio-button-active',
											  }
											: {
													root: 'custom-radio-button-inactive',
											  }
									}
									color="primary"
								/>
							)}
						</div>
						<div className="question-option-content">
							{item.content && item.content.rawContent && (
								<Editor
									key={item._id}
									rawContent={item.content.rawContent}
									customStyleMap={customStyleMap}
								/>
							)}
						</div>
					</List.Item>
				)}
				size="large"
			/>
		);
	};

	render() {
		const { dataType, options, bonus, type } = this.props;

		if (dataType === 'image') {
			return this.renderImageOptions(options, bonus, type);
		} else {
			return this.renderOptions(options, bonus, type);
		}
	}
}

export default Options;
