import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Button, Modal, Radio, Tag, Tooltip } from 'antd';
import { BookOutlined, BookTwoTone } from '@ant-design/icons';

import { URLS } from 'components/urls.js';
import Clock from 'widgets/Clock';
import { getTotalTimeSpentInQuestion } from 'utils/flow';

import { updateBuckets } from '../../api/ApiAction';

import './style.css';

const typeMap = {
	INTEGER: 'Integer',
	RANGE: 'Numerical',
	MULTIPLE_CHOICE_SINGLE_CORRECT: 'Single Correct',
	MULTIPLE_CHOICE_MULTIPLE_CORRECT: 'Multiple Correct',
	MATCH_THE_COLUMNS: 'Match the Columns',
};

const jeeTypeMap = {
	INTEGER: 'Numerical',
	RANGE: 'Numerical',
	MULTIPLE_CHOICE_SINGLE_CORRECT: 'Single Correct',
	MULTIPLE_CHOICE_MULTIPLE_CORRECT: 'Multiple Correct',
	MATCH_THE_COLUMNS: 'Match the Columns',
};

const typeMaps = {
	jee: jeeTypeMap,
	default: typeMap,
};

function addDecimals(n) {
	if ((n * 100) % 100 === 0) return n + '.00';
	else if ((n * 1000) % 100 === 0) return n + '0';
	else return n;
}

class Title extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			selectedBucket: '',
		};
	}

	handleClick = bucket => {
		const { _id } = this.props;
		fetch(URLS.backendBucket + '/remove-from-bucket', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ bucket, question: _id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					// this.setState({ showModal: false });
					this.props.updateBuckets(responseJson.buckets);
				} else {
					//
				}
			})
			.catch(error => {});
	};

	addToBucket = () => {
		const { selectedBucket } = this.state;
		const { _id } = this.props;

		//
		fetch(URLS.backendBucket + '/add-to-bucket', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ bucket: selectedBucket, question: _id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					this.setState({ showModal: false, selectedBucket: '' });
					this.props.updateBuckets(responseJson.buckets);
				} else {
					//
				}
			})
			.catch(error => {});
	};

	componentWillMount() {
		this.getBuckets();
	}

	getBuckets = () => {
		fetch(URLS.backendUsers + '/buckets', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					this.props.updateBuckets(responseJson.buckets);
				}
			})
			.catch(error => {});
	};

	openModal = () => {
		this.setState({ showModal: true });
	};

	selectBucket = id => {
		this.setState({ selectedBucket: id });
	};

	render() {
		const {
			sectionName,
			type,
			hideMarks,
			correctMark,
			incorrectMark,
			bonus,
			bookmarkOption,
			Buckets,
			showClock,
			_id,
			currentSectionIndex,
			currentQuestionIndex,
			previouslyElapsedTime,
			timeLimit,
			startTime,
			markAwarded,
		} = this.props;

		const { showModal, selectedBucket } = this.state;

		const { testUi } = window.config;

		const typeMap_ = testUi ? typeMaps[testUi] : typeMaps['default'];

		const bucketMap = {};
		Buckets.forEach(bucket => {
			bucket.questions.forEach(q => {
				bucketMap[q._id] = { color: bucket.color, _id: bucket._id };
			});
		});

		return (
			<div className="question-header">
				<div className="question-type" style={{ flex: 1 }}>
					<span style={{ textTransformation: 'uppercase' }}>
						{sectionName} &nbsp;{'>'}&nbsp; {typeMap_[type]}
					</span>
					{bonus ? (
						<span style={{ color: 'red', paddingLeft: 12 }}>*bonus</span>
					) : null}
				</div>
				{showClock ? (
					<span style={{ marginRight: 8 }}>
						<Clock
							showIcon
							type={!timeLimit ? 'stopwatch' : 'timer'}
							key={`${currentSectionIndex}-${currentQuestionIndex}`}
							startTime={startTime}
							previouslyElapsedTime={previouslyElapsedTime}
							timerLimit={timeLimit}
							onEnd={this.props.onTimerEnd}
						/>
					</span>
				) : null}
				{!hideMarks ? (
					<div style={{ display: 'flex' }}>
						{typeof markAwarded === 'number' ? (
							<Tooltip title={'Marks awarded'}>
								<Tag
									color="blue"
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										minWidth: 30,
									}}
								>
									{markAwarded}
								</Tag>
							</Tooltip>
						) : null}
						<Tooltip
							placement="bottomRight"
							title={`${addDecimals(
								correctMark
							)} marks will be rewarded for correct answer`}
						>
							<div className="positive-marks">+ {addDecimals(correctMark)}</div>
						</Tooltip>
						<Tooltip
							placement="bottomRight"
							title={`${addDecimals(
								-incorrectMark
							)} mark will be deducted for wrong answer`}
						>
							<div className="negative-marks">- {addDecimals(-incorrectMark)}</div>
						</Tooltip>
					</div>
				) : null}
				{bookmarkOption ? (
					<Tooltip
						title={bucketMap[_id] ? 'Remove bookmark' : 'Bookmark question'}
						placement="bottom"
					>
						{bucketMap[_id] ? (
							<BookTwoTone
								onClick={this.handleClick.bind(this, bucketMap[_id]._id)}
								style={{
									marginLeft: 8,
									fontSize: 24,
									padding: '8px 6px',
								}}
								twoToneColor={bucketMap[_id].color}
							/>
						) : (
							<BookOutlined
								onClick={this.openModal}
								style={{ marginLeft: 8, fontSize: 24, padding: '8px 6px' }}
							/>
						)}
					</Tooltip>
				) : null}
				<Modal
					title="Add to Bucket"
					visible={showModal}
					footer={null}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
					bodyStyle={{ display: 'flex', flexDirection: 'column' }}
				>
					{Buckets.map((bucket, index) => {
						return (
							<Radio
								key={index}
								style={{ marginBottom: 8, fontWeight: 500, color: bucket.color }}
								checked={bucket._id === selectedBucket}
								onClick={this.selectBucket.bind(this, bucket._id)}
								className={'c-' + (bucket.color ? bucket.color.split('#')[1] : '')}
							>
								{bucket.name}
							</Radio>
						);
					})}
					<Button
						type="primary"
						disabled={!selectedBucket}
						style={{ width: 240 }}
						onClick={this.addToBucket}
					>
						Add
					</Button>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const previouslyElapsedTime = getTotalTimeSpentInQuestion(
		state,
		{
			questionIndex: ownProps.currentQuestionIndex,
			sectionIndex: ownProps.currentSectionIndex,
		},
		{ excludeCurrentStartTime: true }
	);
	const questionStartTimeFromState = state.api.QuestionStartTime;
	const startTime =
		questionStartTimeFromState && !isNaN(parseInt(questionStartTimeFromState, 10))
			? parseInt(questionStartTimeFromState, 10)
			: Date.now();
	return {
		Buckets: state.api.Buckets,
		previouslyElapsedTime1: previouslyElapsedTime,
		startTime,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateBuckets: buckets => dispatch(updateBuckets(buckets)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Title);
