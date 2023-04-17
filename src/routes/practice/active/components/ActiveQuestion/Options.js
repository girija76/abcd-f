import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { connect, useSelector } from 'react-redux';
import { Tooltip } from 'antd';

import Editor from 'components/Editor';
import { setAnswer, saveAnswer } from 'actions/session';
import { fixOptionRawContent } from 'utils/editor';

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const Option = ({
	questionId,
	sessionId,
	option,
	className,
	isSelected,
	isQuestionAnswered,
	onSelect,
	isDisabled: isDisabledByParent,
	disableReason,
}) => {
	const isDisabled = isDisabledByParent || (!isSelected && isQuestionAnswered);
	const name = `option-${sessionId}-${questionId}`;
	const id = `${name}-${option._id}`;
	const [rawContent] = useState(fixOptionRawContent(option.content.rawContent));
	const content = (
		<label
			htmlFor={id}
			tabIndex={isQuestionAnswered ? -1 : 0}
			className={classnames(className, {
				'is-correct': isQuestionAnswered && isSelected && option.isCorrect,
				'is-incorrect': isQuestionAnswered && isSelected && !option.isCorrect,
				'is-correct-option': isQuestionAnswered && option.isCorrect,
				'is-selected': isSelected,
				'is-question-answered': isQuestionAnswered,
				'can-be-answered': !isDisabled && !isQuestionAnswered,
				'is-disabled': isDisabled,
			})}
		>
			<span className="input-container">
				<input
					tabIndex={isQuestionAnswered ? -1 : 0}
					disabled={isDisabled}
					name={name}
					id={id}
					type="radio"
					checked={!!isSelected}
					onChange={onSelect}
				/>
				{isQuestionAnswered && option.isCorrect ? (
					<span className="icon correct">
						<CheckCircleFilled />
					</span>
				) : null}
				{isQuestionAnswered && !option.isCorrect && isSelected ? (
					<span className="icon incorrect">
						<CloseCircleFilled />
					</span>
				) : null}
			</span>
			<Editor rawContent={rawContent} key={option._id} />
		</label>
	);
	if (disableReason) {
		return (
			<Tooltip placement="topLeft" title={disableReason}>
				{content}
			</Tooltip>
		);
	}
	return content;
};

const ConnectedOption = connect(
	(state, ownProps) => {
		const {
			questionId,
			option: { _id: optionId },
			sessionId,
		} = ownProps;
		const attempt = state.session.attemptsByQuestionId[questionId];
		const isQuestionAnswered =
			attempt.isAnswered || state.session.sessionsById[sessionId].hasEnded;
		let isSelected = false;
		try {
			if (attempt.change && attempt.change.answer) {
				isSelected = attempt.change.answer.data === optionId;
			} else {
				isSelected = attempt.answer.data === optionId;
			}
		} catch (e) {}
		return { isSelected, isQuestionAnswered };
	},
	{ setAnswer },
	(stateProps, dispatchProps, ownProps) => {
		const {
			sessionId,
			questionId,
			option: { _id: optionId },
		} = ownProps;
		return {
			...ownProps,
			...stateProps,
			onSelect: () =>
				dispatchProps.setAnswer(sessionId, questionId, {
					type: 'option',
					data: optionId,
				}),
		};
	}
)(Option);

const OptionsView = ({
	sessionId,
	canReattempt,
	questionId,
	options,
	selectedOption,
	savedOption,
	classes,
	saveAnswer,
	sessionConfig,
	attempt,
}) => {
	const timesSaved = useRef(0);
	const enableOptionsTimeoutId = useRef(null);
	const [areOptionsDisabled, setAreOptionsDisabled] = useState(false);
	const [disableReason, setDisableReason] = useState(null);
	const hasSelectedQuestionsToAttempt = useSelector(state => {
		try {
			const session = state.session.sessionsById[sessionId];
			if (session.config.questions.shouldSelect) {
				if (isEmpty(session.selectedQuestionsToAttempt)) {
					if (session.hasEnded) {
						return true;
					}
					return false;
				}
			}
			return true;
		} catch (e) {
			console.error(e);
			return true;
		}
	});
	useEffect(() => {
		if (timesSaved.current !== 0) {
			if (canReattempt && savedOption !== selectedOption) {
				saveAnswer(sessionId, questionId, selectedOption);
			}
		} else {
			timesSaved.current = 1;
		}
	}, [
		savedOption,
		selectedOption,
		questionId,
		sessionId,
		saveAnswer,
		canReattempt,
	]);
	useEffect(() => {
		try {
			if (sessionConfig.prevent.tooFast) {
				const tooFastMultiplier = sessionConfig.tooFastMultiplier || 1;
				const minLimit =
					Math.ceil(attempt.perfectTimeLimits.min) * tooFastMultiplier;
				const timeSpent =
					Math.floor(
						(Date.now() - attempt.flow[attempt.flow.length - 1].startTime) / 1000
					) + attempt.time;
				if (timeSpent < minLimit) {
					setAreOptionsDisabled(true);
					setDisableReason(
						`You need to spend at least ${minLimit} seconds before marking answer.`
					);
					enableOptionsTimeoutId.current = setTimeout(() => {
						setDisableReason(null);
						setAreOptionsDisabled(false);
					}, 1000 * (minLimit - timeSpent));
				}
			}
		} catch (e) {}
		return () => {
			if (enableOptionsTimeoutId.current) {
				setDisableReason(null);
				clearTimeout(enableOptionsTimeoutId.current);
			}
		};
	}, [sessionConfig, attempt, areOptionsDisabled, questionId]);
	return (
		<form className={classes.root}>
			{options.map(option => {
				return (
					<ConnectedOption
						sessionId={sessionId}
						questionId={questionId}
						className={classes.option}
						key={option._id}
						option={option}
						isDisabled={areOptionsDisabled || !hasSelectedQuestionsToAttempt}
						disableReason={
							!hasSelectedQuestionsToAttempt
								? 'First, select questions you want to attempt'
								: disableReason
						}
					/>
				);
			})}
		</form>
	);
};
const mapStateToProps = (state, ownProps) => {
	const { questionId, sessionId } = ownProps;
	const options = state.session.questionsById[questionId].options;
	const attempt = state.session.attemptsByQuestionId[questionId];
	const sessionConfig = state.session.sessionsById[sessionId].config;
	let canReattempt = false;
	let selectedOption;
	let savedOption;
	try {
		canReattempt = !state.session.sessionsById[sessionId].config.prevent
			.reattempt;
	} catch (e) {}
	try {
		savedOption = attempt.answer.data;
	} catch (e) {
		savedOption = null;
	}
	try {
		selectedOption = attempt.change.answer.data;
	} catch (e) {}
	return {
		options,
		selectedOption,
		savedOption,
		canReattempt,
		sessionConfig,
		attempt,
	};
};
export default connect(
	mapStateToProps,
	{ saveAnswer }
)(OptionsView);
