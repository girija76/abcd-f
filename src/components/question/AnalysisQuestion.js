import React from 'react';
import { connect } from 'react-redux';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Radio from 'antd/es/radio';
import List from 'antd/es/list';
import Editor from '../Editor';
import Checkbox from 'antd/es/checkbox';
import Menu from 'antd/es/menu';
import Dropdown from 'antd/es/dropdown';
import Title from './components/Title';
import './Question.css';
import './AnalysisQuestion.css';
import { URLS } from '../urls.js';

import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const optionsArray = ['1)', '2)', '3)', '4)', '5)', '6)', '7)', '8)'];

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

export class AnalysisQuestion extends React.Component {
	// redundant now!!!
	constructor(props) {
		super(props);
		this.state = {
			showAnswers: true,
		};
	}

	renderImageOptions = (options, bonus) => {
		const { attemptMode } = this.props;
		const { optionChecked } = this.state;
		const correctStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					backgroundColor: '#93c572',
			  };
		const defaultStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
			  }
			: {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
			  };
		return (
			<List
				// itemLayout='vertical'
				grid={{ gutter: 16, column: 4 }}
				dataSource={options}
				renderItem={(item, idx) => (
					<List.Item
						key={item._id}
						style={item.isCorrect && !bonus ? correctStyle : defaultStyle}
					>
						<div>
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
						</div>
						<div className="question-option-content">{optionsArray[idx]}</div>
					</List.Item>
				)}
				size="large"
				style={{ paddingRight: 64 }}
			/>
		);
	};

	renderOptions = (options, bonus) => {
		let optionChecked = this.props.response.answer;
		let {
			meta: { answer },
		} = this.props;
		let { showAnswers } = this.state;
		return (
			<List
				itemLayout="horizontal"
				dataSource={options}
				renderItem={item => (
					<List.Item
						key={item._id}
						style={
							showAnswers && (item._id === answer && !bonus)
								? {
										display: 'flex',
										alignItems: 'baseline',
										padding: '16px 28px',
										backgroundColor: '#93c572',
								  }
								: {
										display: 'flex',
										alignItems: 'baseline',
										padding: '16px 28px',
								  }
						}
					>
						<div>
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

	onChange = e => this.setState({ showAnswers: e.target.checked });

	report = r => {
		let {
			UserData: { _id },
			aid,
			question,
		} = this.props;
		fetch(URLS.backendAssessment + '/report', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ aid: aid, uid: _id, qid: question._id, r: r }),
		})
			.then(res => res.json())
			.then(result => {
				//update state
			});
	};

	renderMenu = () => {
		let { reports } = this.props;
		let report = reports.length === 1 ? reports[0].kind : -1;
		return (
			<Menu>
				<Menu.Item key="0">
					<div onClick={this.report.bind(this, 0)}>
						Mark as 'incorrect question'{' '}
						{report === 0 && <CheckOutlined style={{ marginLeft: 5 }} />}
					</div>
				</Menu.Item>
				<Menu.Item key="1">
					<div onClick={this.report.bind(this, 1)}>
						Mark as 'incorrect answer'{' '}
						{report === 1 && <CheckOutlined style={{ marginLeft: 5 }} />}
					</div>
				</Menu.Item>
				<Menu.Item key="3">
					<div onClick={this.report.bind(this, 2)}>
						Mark as 'question out of syllabus'{' '}
						{report === 2 && <CheckOutlined style={{ marginLeft: 5 }} />}
					</div>
				</Menu.Item>
				{report !== -1 && (
					<Menu.Item key="4">
						<div onClick={this.report.bind(this, -1)}>Unmark question</div>
					</Menu.Item>
				)}
			</Menu>
		);
	};

	render() {
		let {
			question: { _id, content, options, link, solution, dataType },
			currQuestionNumber,
			bonus,
			meta: { answer },
		} = this.props;
		if (options == null) options = []; //show loader
		const optionsList =
			dataType === 'image'
				? this.renderImageOptions(options, bonus)
				: this.renderOptions(options, bonus);
		let menu = this.renderMenu();
		let { showAnswers } = this.state;
		let linked = 0;
		if (link && link.sequence_no === 0) linked = 1;
		else if (link && link.sequence_no !== undefined) linked = 2;

		return (
			<div
				style={{
					display: 'flex',
					margin: '20px 10px',
					flex: 1,
					alignItems: 'start',
					width: '100%',
				}}
			>
				<div style={{ width: `calc(100% - ${180}px)` }}>
					<Card
						style={{ flex: 1, marginBottom: 10 }}
						bodyStyle={{ padding: 0 }}
						title={
							<Title
								sectionName={sectionName}
								type={newType}
								reports={reports}
								correctMark={correctMark}
								incorrectMark={incorrectMark}
							/>
						}
						className={`question-card ${classnames[newType]}`}
					>
						<div style={{ width: '100%' }}>
							<div style={{ padding: '15px 30px', borderBottom: '1px solid #e0e0e0' }}>
								{linked ? (
									<div style={{ marginBottom: 12 }}>
										<span style={{ fontWeight: 'bold' }}>
											[Direction for questions: {currQuestionNumber - link.sequence_no} -{' '}
											{currQuestionNumber - link.sequence_no + link.total_questions - 1}]
										</span>
										<Editor
											key={link.id}
											rawContent={link.content.rawContent}
											customStyleMap={customStyleMap}
										/>
									</div>
								) : null}
								{content && content.rawContent && (
									<Editor
										key={_id}
										rawContent={content.rawContent}
										customStyleMap={customStyleMap}
									/>
								)}
							</div>
							{optionsList}
						</div>
					</Card>

					<Card
						style={{ marginTop: 10 }}
						title="Solution"
						bodyStyle={{ padding: 0 }}
						headStyle={{ borderBottom: 0 }}
						className="solution-card"
					>
						<div
							style={{
								padding: '5px 15px 30px 30px',
								borderBottom: '1px solid #e0e0e0',
							}}
						>
							{solution && solution.rawContent && (
								<Editor
									key={_id}
									rawContent={solution.rawContent}
									customStyleMap={customStyleMap}
								/>
							)}
						</div>
					</Card>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						paddingTop: 52,
						width: 140,
					}}
					className="question-button-container"
				>
					<Checkbox onChange={this.onChange} checked={showAnswers}>
						Show Answers
					</Checkbox>
					<Button
						style={{ margin: '10px 0px', height: 36 }}
						type="primary"
						className="gray-button"
						onClick={this.props.moveToPrev}
					>
						<LeftOutlined />
						Previous
					</Button>
					<Button
						style={{ margin: '10px 0px', height: 36 }}
						type="primary"
						className="gray-button"
						onClick={this.props.moveToNext}
					>
						Next
						<RightOutlined />
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AnalysisQuestion);
