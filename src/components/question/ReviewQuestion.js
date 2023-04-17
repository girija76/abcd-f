import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { URLS } from '../urls.js';
import Editor from '../Editor';
import { Button, Card, Menu, List } from 'antd';
import Title from './components/Title';
import Options from './components/Options';
import { isRawContentEmpty } from 'utils/editor';
import './PracticeQuestion.css';

import { CheckOutlined } from '@ant-design/icons';

const optionsArray = ['1)', '2)', '3)', '4)', '5)', '6)', '7)', '8)'];

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

export class ReviewQuestion extends React.Component {
	static defaultProps = {
		question: {},
	};
	static propTypes = {
		question: PropTypes.object,
	};

	constructor(props) {
		super(props);
		let { attemptMode, response } = this.props;
		this.state = {
			optionChecked: '',
			timeElapsed: attemptMode ? 0 : response.time ? response.time : 0,
			timer: null,
			solnRequested: false,
		};
		if (this.props.startTime && this.props.attemptMode)
			this.getElapsedTime(this.props.startTime);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.response !== nextProps.response && nextProps.response) {
			this.setState({
				optionChecked: nextProps.response.oid,
				timeElapsed: nextProps.response.time,
			});
		}
		if (this.props.currQuestion !== nextProps.currQuestion)
			this.setState({ optionChecked: '' });
		if (
			this.props.startTime !== nextProps.startTime &&
			nextProps.startTime &&
			nextProps.attemptMode
		)
			this.getElapsedTime(nextProps.startTime);
	}

	handleChange = option => {
		let { attemptMode } = this.props;
		if (attemptMode) this.setState({ optionChecked: option });
	};

	getTopic = subtopicId => {
		const { Topics } = this.props;
		const topicMap = {};
		Topics.forEach(topic => {
			topicMap[topic._id] = topic.name;
			topic.sub_topics.forEach(subtopic => {
				topicMap[subtopic._id] = subtopic.name;
			});
		});
		return topicMap[subtopicId] ? topicMap[subtopicId] : 'Topic name not found';
	};

	padZeros = number => {
		let num = number.toString();
		while (num.length < 2) num = '0' + num;
		return num;
	};

	parseTime = s => {
		//common functions
		let hours = Math.floor(s / 3600);
		let mins = Math.floor((s % 3600) / 60);
		let secs = s % 60;
		return (
			this.padZeros(hours) +
			' : ' +
			this.padZeros(mins) +
			' : ' +
			this.padZeros(secs)
		);
	};

	getElapsedTime = startTime => {
		let oldTimer = this.state.timer;
		if (oldTimer) clearInterval(oldTimer);
		let timeDiff = Math.floor(new Date().getTime() - startTime.getTime()) / 1000;
		this.setState({ timeElapsed: Math.round(timeDiff) });
		let timer = setInterval(() => {
			this.setState({ timeElapsed: this.state.timeElapsed + 1 });
		}, 1000);
		this.setState({ timer });
	};

	renderImageOptions = options => {
		const { attemptMode } = this.props;
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
						onClick={this.handleChange.bind(this, item._id)}
						style={item.isCorrect ? correctStyle : defaultStyle}
					>
						<div className="question-option-content">{optionsArray[idx]}</div>
					</List.Item>
				)}
				size="large"
				style={{ paddingRight: 64 }}
			/>
		);
	};

	renderOptions = options => {
		let { attemptMode } = this.props;
		let correctStyle = attemptMode
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
		let defaultStyle = attemptMode
			? {
					display: 'flex',
					alignItems: 'baseline',
					padding: '16px 28px',
					cursor: 'pointer',
			  }
			: { display: 'flex', alignItems: 'baseline', padding: '16px 28px' };
		return (
			<List
				itemLayout="horizontal"
				dataSource={options}
				renderItem={item => (
					<List.Item
						key={item._id}
						onClick={this.handleChange.bind(this, item._id)}
						style={item.isCorrect ? correctStyle : defaultStyle}
					>
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

	report = r => {
		let {
			UserData: { _id },
			question,
		} = this.props;
		fetch(URLS.backendQuestions + '/report', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ uid: _id, qid: question._id, r: r }),
		})
			.then(res => res.json())
			.then(result => {
				//update state
			});
	};

	renderMenu = () => {
		let {
			question: { reports },
		} = this.props;
		let report = reports && reports.length === 1 ? reports[0].kind : -1;
		return (
			<Menu>
				<Menu.Item key="0">
					<div onClick={this.report.bind(this, 0)}>
						Question not from this topic{' '}
						{report === 0 && <CheckOutlined style={{ marginLeft: 5 }} />}
					</div>
				</Menu.Item>
				<Menu.Item key="1">
					<div onClick={this.report.bind(this, 1)}>
						Question not clear{' '}
						{report === 1 && <CheckOutlined style={{ marginLeft: 5 }} />}
					</div>
				</Menu.Item>
				<Menu.Item key="2">
					<div onClick={this.report.bind(this, 2)}>
						Incorrect answer{' '}
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

	bookmark = () => {
		let {
			question: { _id },
			UserData,
		} = this.props;
		fetch(URLS.backendUsers + '/bookmark', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ id: UserData._id, qid: _id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateBookmark(responseJson.bookmark);
			})
			.catch(error => {});
	};

	requestSolution = () => {
		const {
			question: { _id },
		} = this.props;
		fetch(`${URLS.backendDiscussion}/requestSolution`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				question: _id,
			}),
		})
			.then(res => res.json())
			.then(result => {
				this.setState({ solnRequested: true });
			});
	};

	render() {
		let {
			question: {
				_id,
				sub_topic,
				content,
				options,
				multiOptions,
				dataType,
				type,
				solution,
				solSubmittedBy,
				integerAnswer,
				range,
			},
			attemptMode,
			hideSolution,
		} = this.props;

		const { solnRequested } = this.state;

		if (options == null) options = [];

		const sectionName = this.getTopic(sub_topic);
		const newType =
			type === 'LINKED_MULTIPLE_CHOICE_SINGLE_CORRECT'
				? 'MULTIPLE_CHOICE_SINGLE_CORRECT'
				: type;

		const options_ =
			newType === 'MULTIPLE_CHOICE_SINGLE_CORRECT'
				? options != null
					? options
					: []
				: multiOptions;

		const optionType =
			type === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT'
				? 'MULTIPLE_CORRECT'
				: 'SINGLE_CORRECT';

		const isEmpty = solution ? isRawContentEmpty(solution.rawContent) : true;

		return (
			<div>
				<Card
					style={{ flex: 1 }}
					bodyStyle={{ padding: 0 }}
					title={
						<Title
							sectionName={sectionName}
							type={newType}
							reports={[]}
							hideMarks={true}
						/>
					}
					className="question-card"
				>
					<div style={{ width: '100%' }}>
						<div style={{ padding: '15px 30px', borderBottom: '1px solid #e0e0e0' }}>
							{content && content.rawContent && (
								<Editor
									key={_id}
									rawContent={content.rawContent}
									customStyleMap={customStyleMap}
								/>
							)}
						</div>
						{(newType === 'MULTIPLE_CHOICE_SINGLE_CORRECT' ||
							newType === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT') && (
							<Options
								dataType={dataType}
								options={options_}
								attemptMode={attemptMode}
								optionChecked={null}
								onAnswerUpdate={this.props.onAnswerUpdate}
								showAnswers={true}
								bonus={false}
								type={optionType}
							/>
						)}
						{(newType === 'INTEGER' || newType === 'RANGE') && (
							<div style={{ padding: '16px 28px' }}>
								<div style={{ display: 'flex', marginTop: 12 }}>
									<label style={{ marginRight: 10 }}>Answer: </label>
									{newType === 'INTEGER' ? (
										<div style={{ fontWeight: 'bold' }}>{integerAnswer}</div>
									) : range ? (
										<div>
											{range.start === range.end
												? range.start
												: range.start + ' to ' + range.end}
										</div>
									) : null}
								</div>
							</div>
						)}
					</div>
				</Card>
				{!hideSolution ? (
					<Card
						style={{ marginTop: 10 }}
						title="Solution"
						bodyStyle={{ padding: 0 }}
						headStyle={{ borderBottom: 0 }}
						className="solution-card"
					>
						{!isEmpty ? (
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
								{solution && solSubmittedBy ? (
									<div
										style={{ display: 'flex', alignItems: 'center', marginBottom: -18 }}
									>
										Solution submitted by:
										<div
											style={{
												marginTop: 8,
												marginBottom: 3,
												marginLeft: 12,
												marginRight: 4,
												borderRadius: 100,
												width: 32,
												height: 32,
												overflow: 'hidden',
											}}
										>
											<img
												alt="profile"
												src={solSubmittedBy.dp}
												height="100%"
												width="100%"
											/>
										</div>
										<span style={{ fontWeight: 500 }}>{solSubmittedBy.username}</span>
									</div>
								) : null}
							</div>
						) : (
							<Button
								disabled={solnRequested}
								type="primary"
								onClick={this.requestSolution}
							>
								{solnRequested ? 'Solution Requested' : 'Request Solution'}
							</Button>
						)}
					</Card>
				) : null}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
		Topics: state.api.Topics,
	};
};

export default connect(mapStateToProps)(ReviewQuestion);
