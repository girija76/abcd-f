import React from 'react';
import classnames from 'classnames';
import { Alert, Button, Card, Input } from 'antd';
import { LikeOutlined, WarningOutlined } from '@ant-design/icons';

import { isRawContentEmpty } from 'utils/editor';
import { URLS } from 'components/urls';
import Editor from 'components/Editor';

import Title from './components/Title';
import QuestionContent from './components/QuestionContent';
import Options from './components/Options';
import QuestionTools from './components/QuestionTools';
import Matches from './components/Matches';

import './Question.css';
import QuestionLink from './components/QuestionLink';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

const classNameMap = {
	INTEGER: 'integer',
	RANGE: 'numerical',
	MULTIPLE_CHOICE_SINGLE_CORRECT: 'single-correct',
	MULTIPLE_CHOICE_MULTIPLE_CORRECT: 'multiple-correct',
};

export class Question extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAnswers: true,
			solnRequested: false,
		};
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (
			nextProps.question &&
			this.props.question &&
			nextProps.question._id !== this.props.question._id &&
			!nextProps.attemptMode
		) {
			this.setState({ solnRequested: false });
		}
	}

	reset = () => {
		this.props.onAnswerUpdate(null);
	};

	handleAnswer = answer => {
		if (answer.target.value.length >= 10) {
		} else if (answer.target.value === '-') {
			this.props.onAnswerUpdate(answer.target.value);
		} else if (isNaN(answer.target.value)) {
		} else if (answer.target.value.indexOf('.') !== -1) {
		} else if (answer.target.value.indexOf('e') !== -1) {
		} else {
			this.props.onAnswerUpdate(answer.target.value);
		}
	};

	handleAnswer2 = answer => {
		if (answer.target.value.length < 10) {
			this.props.onAnswerUpdate(answer.target.value);
		}
	};

	showAnswers = e => this.setState({ showAnswers: e.target.checked });

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
		const {
			isViewMode,
			timeLimit,
			question: {
				_id,
				answers,
				content,
				link,
				dataType,
				type,
				options,
				multiOptions,
				integerAnswer,
				solution,
				solSubmittedBy,
				range,
				columns,
			},
			response,
			marked,
			badChoiceReason,
			isBadChoice,
			isBestChoice,
			isOptional,
			isAnswered,
			isLastQuestion,
			currQuestion,
			currSection,
			currQuestionNumber,
			isAnswerSelectionDisabled,
			answerDisableReason,
			attemptMode: attemptModeProp,
			sectionName,
			nextDisabled,
			bonus,
			reports,
			correctMark,
			incorrectMark,
			bookmarkOption,
			bookmarked,
			markAwarded,
			previouslyElapsedTime,
			discussionThread,
		} = this.props;

		const { showAnswers, solnRequested } = this.state;
		const attemptMode = attemptModeProp;

		let linked = 0;
		if (link && link.sequence_no === 0) linked = 1;
		else if (link && link.sequence_no !== undefined) linked = 2;

		const newTypeMap = {
			LINKED_MULTIPLE_CHOICE_SINGLE_CORRECT: 'MULTIPLE_CHOICE_SINGLE_CORRECT',
			LINKED_MULTIPLE_CHOICE_MULTIPLE_CORRECT: 'MULTIPLE_CHOICE_MULTIPLE_CORRECT',
			LINKED_RANGE: 'RANGE',
		};

		const newType = newTypeMap[type] ? newTypeMap[type] : type;

		const options_ =
			newType === 'MULTIPLE_CHOICE_SINGLE_CORRECT'
				? options != null
					? options
					: []
				: multiOptions;

		const optionType =
			newType === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT'
				? 'MULTIPLE_CORRECT'
				: 'SINGLE_CORRECT';

		const { testUi } = window.config;

		const integerPlaceholder =
			testUi === 'jee' ? 'Enter number only' : 'Enter integers only';

		const hasSolution = solution
			? !isRawContentEmpty(solution.rawContent)
			: false;

		return (
			<div
				style={{
					display: 'flex',
					flex: 1,
					alignItems: 'start',
				}}
				className={classnames(`test-question-wrapper-${attemptMode}`, {
					'test-question-wrapper-view-only': isViewMode,
				})}
			>
				<div className="test-question" style={{ height: '100%' }}>
					<Card
						style={{ flex: 1, overflow: 'hidden', borderRadius: 0, height: '100%' }}
						bodyStyle={{ padding: 0 }}
						bordered={false}
						headStyle={{ paddingTop: 0, paddingBottom: 0 }}
						title={
							<Title
								_id={_id}
								sectionName={sectionName}
								type={newType}
								reports={reports}
								correctMark={correctMark}
								incorrectMark={incorrectMark}
								markAwarded={attemptMode ? null : markAwarded}
								currentQuestionIndex={currQuestion}
								currentSectionIndex={currSection}
								bonus={bonus}
								showClock={!!timeLimit}
								timeLimit={timeLimit}
								bookmarkOption={bookmarkOption}
								bookmarked={bookmarked}
								onBookmarkChange={this.props.onBookmarkChange}
								previouslyElapsedTime={previouslyElapsedTime}
								onTimerEnd={this.props.onTimerEnd}
							/>
						}
						className={`question-card ${classNameMap[newType]}`}
					>
						<div className="question-link-content-options-wrapper">
							{linked ? (
								<>
									<div className="question-link-content">
										<QuestionLink
											linked={linked}
											currQuestionNumber={currQuestionNumber}
											link={link}
										/>
									</div>
								</>
							) : null}
							<div className="question-content-and-options">
								{isAnswerSelectionDisabled && answerDisableReason ? (
									<Alert
										type="warning"
										message={`You can not attempt this question because ${answerDisableReason}`}
										style={{ marginBottom: 8 }}
									/>
								) : null}
								{attemptMode ? null : !isOptional ? null : !isBestChoice ? (
									isBadChoice ? (
										badChoiceReason ? (
											<Alert
												style={{ marginBottom: '1rem' }}
												message={
													<div>
														<WarningOutlined style={{ marginRight: 8 }} />
														{badChoiceReason}
													</div>
												}
												type="error"
											/>
										) : null
									) : (
										<Alert
											type="success"
											message={
												<div>
													<LikeOutlined style={{ marginRight: 8 }} />
													Great, you correctly skipped this question.
												</div>
											}
											style={{ marginBottom: '1rem' }}
										/>
									)
								) : isAnswered ? (
									<Alert
										message={
											<div>
												<LikeOutlined style={{ marginRight: 8 }} />
												Good choice!
											</div>
										}
										type="success"
										style={{ marginBottom: '1rem' }}
									/>
								) : (
									<Alert
										message={
											<div>
												<WarningOutlined style={{ marginRight: 8 }} />
												You could have answered this question.
											</div>
										}
										type="warning"
										style={{ marginBottom: '1rem' }}
									/>
								)}
								<QuestionContent
									content={content}
									_id={_id}
									newType={newType}
									columns={columns}
								/>
								{(newType === 'MULTIPLE_CHOICE_SINGLE_CORRECT' ||
									newType === 'MULTIPLE_CHOICE_MULTIPLE_CORRECT') && (
									<Options
										answers={answers}
										dataType={dataType}
										options={options_}
										attemptMode={attemptMode}
										isAnswerSelectionDisabled={isAnswerSelectionDisabled}
										optionChecked={response}
										onAnswerUpdate={this.props.onAnswerUpdate}
										showAnswers={showAnswers}
										bonus={bonus}
										type={optionType}
									/>
								)}
								{(newType === 'INTEGER' || newType === 'RANGE') && (
									<div style={{ padding: '16px 28px' }}>
										{attemptMode ? (
											newType === 'INTEGER' ? (
												<Input
													disabled={isAnswerSelectionDisabled}
													placeholder={integerPlaceholder}
													onChange={this.handleAnswer}
													value={response}
												/>
											) : (
												<Input
													disabled={isAnswerSelectionDisabled}
													placeholder="Enter number only"
													onChange={this.handleAnswer2}
													type="number"
													value={response}
												/>
											)
										) : (
											<div>
												{showAnswers ? (
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
												) : null}
												<div style={{ display: 'flex' }}>
													<label style={{ marginRight: 10 }}>Your response: </label>
													<div style={{ fontWeight: 'bold' }}>{response}</div>
												</div>
											</div>
										)}
									</div>
								)}
								{newType === 'MATCH_THE_COLUMNS' && (
									<Matches
										columns={columns}
										onAnswerUpdate={this.props.onAnswerUpdate}
										response={response}
										attemptMode={attemptMode}
										isAnswerSelectionDisabled={isAnswerSelectionDisabled}
									/>
								)}
							</div>
						</div>
					</Card>

					{!attemptMode && !isViewMode ? (
						hasSolution ? (
							<Card
								title="Solution"
								style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
								bodyStyle={{ padding: 0 }}
								headStyle={{ borderBottom: 0 }}
								className="solution-card"
							>
								<div
									style={{
										padding: '5px 15px 30px 30px',
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
												<img alt="" src={solSubmittedBy.dp} height="100%" width="100%" />
											</div>
											<span style={{ fontWeight: 500 }}>{solSubmittedBy.username}</span>
										</div>
									) : null}
								</div>
							</Card>
						) : (
							<Card
								style={{
									borderRight: 'none',
									borderLeft: 'none',
									borderBottom: 'none',
									borderRadius: 0,
								}}
								title={
									<Button
										disabled={solnRequested}
										type="primary"
										onClick={this.requestSolution}
									>
										{solnRequested ? 'Solution Requested' : 'Request Solution'}
									</Button>
								}
							></Card>
						)
					) : null}

					{discussionThread && <div style={{ padding: 8 }}>{discussionThread}</div>}
				</div>
				{isViewMode ? null : (
					<QuestionTools
						attemptMode={attemptMode}
						marked={marked}
						isLastQuestion={isLastQuestion}
						optionChecked={response}
						toggleMark={this.props.toggleMark}
						reset={this.reset}
						skip={this.props.skip}
						nextDisabled={nextDisabled}
						onShowAnswers={this.showAnswers}
						showAnswers={showAnswers}
						moveToPrev={this.props.moveToPrev}
						moveToNext={this.props.moveToNext}
					/>
				)}
			</div>
		);
	}
}

export default Question;
