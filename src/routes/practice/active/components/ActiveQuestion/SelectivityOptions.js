import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import {
	addQuestionToToAttemptList,
	removeQuestionFromToAttemptList,
	addQuestionToNotToAttemptList,
	removeQuestionFromNotToAttemptList,
	setActiveQuestion,
	getNewQuestion,
} from 'actions/session';
import { getAttemptListSize } from 'utils/session';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import './SelectivityOptions.scss';

const isInList = ({
	state,
	listKey,
	sessionId,
	questionId,
	numberOfQuestionsShouldSelect,
}) => {
	if (numberOfQuestionsShouldSelect > 0) {
		try {
			const session = state.session.sessionsById[sessionId];
			try {
				return session[listKey].indexOf(questionId) > -1;
			} catch (e) {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
	return true;
};

const SelectivityOptions = ({ sessionId, questionId, sessionConfig }) => {
	const dispatch = useDispatch();
	const totalQuestions = useMemo(() => sessionConfig.questions.total, [
		sessionConfig,
	]);
	const numberOfQuestionsShouldSelect = useMemo(
		() => sessionConfig.questions.shouldSelect,
		[sessionConfig]
	);
	const [
		questionIndex,
		numberOfQuestionsAddedInSession,
		nextQuestionId,
	] = useSelector(state => {
		const session = state.session.sessionsById[sessionId];
		let index = -1;
		session.questions.some((q, i) => {
			if (q.question === questionId) {
				index = i;
				return true;
			}
			return false;
		});
		let nextQuestionId;
		if (index < session.questions.length - 1) {
			nextQuestionId = session.questions[index + 1].question;
		}
		return [index, session.questions.length, nextQuestionId];
	});
	const toAttemptListSize = useSelector(state =>
		getAttemptListSize({
			state,
			listKey: 'toAttemptList',
			sessionId,
		})
	);
	const notToAttemptListSize = useSelector(state =>
		getAttemptListSize({
			state,
			listKey: 'notToAttemptList',
			sessionId,
		})
	);
	const isInToAttemptList = useSelector(state =>
		isInList({
			state,
			listKey: 'toAttemptList',
			sessionId,
			questionId,
			numberOfQuestionsShouldSelect,
		})
	);
	const isInNotToAttemptList = useSelector(state =>
		isInList({
			state,
			listKey: 'notToAttemptList',
			sessionId,
			questionId,
			numberOfQuestionsShouldSelect,
		})
	);

	const hasSelectedRequiredNumberOfQuestions =
		numberOfQuestionsShouldSelect <= toAttemptListSize;
	const isSelectToAttemptDisabled =
		hasSelectedRequiredNumberOfQuestions && !isInToAttemptList;
	const hasSelectedRequiredNumberOfQuestionsForNotToAttempt =
		totalQuestions - numberOfQuestionsShouldSelect <= notToAttemptListSize;
	const isSelectNotToAttemptDisabled =
		hasSelectedRequiredNumberOfQuestionsForNotToAttempt && !isInNotToAttemptList;

	const setNextQuestionAsActive =
		questionIndex < numberOfQuestionsAddedInSession - 1;
	const isNextButtonDisabled = questionIndex === totalQuestions - 1;
	const shouldFetchQuestion =
		questionIndex === numberOfQuestionsAddedInSession - 1;

	const handleNext = useCallback(() => {
		if (isNextButtonDisabled) {
			// Do nothing
		} else if (setNextQuestionAsActive) {
			dispatch(setActiveQuestion(sessionId, nextQuestionId));
		} else if (shouldFetchQuestion) {
			dispatch(getNewQuestion(sessionId));
		}
	}, [
		isNextButtonDisabled,
		nextQuestionId,
		sessionId,
		setNextQuestionAsActive,
		shouldFetchQuestion,
		dispatch,
	]);
	const handleNextWithAnimation = () => {
		setTimeout(() => {
			handleNext();
		}, 0);
	};
	const handleAddToToAttemptList = () => {
		dispatch(addQuestionToToAttemptList(questionId, sessionId));
		handleNextWithAnimation();
	};
	const handleRemoveFromToAttemptList = () => {
		dispatch(removeQuestionFromToAttemptList(questionId, sessionId));
	};
	const handleAddToNotToAttemptList = () => {
		dispatch(addQuestionToNotToAttemptList(questionId, sessionId));
		handleNextWithAnimation();
	};
	const handleRemoveFromNotToAttemptList = () => {
		dispatch(removeQuestionFromNotToAttemptList(questionId, sessionId));
	};
	return (
		<div className="session-selectivity-options">
			<div className="button-list">
				<Tooltip
					placement="bottomRight"
					title={
						isSelectToAttemptDisabled
							? `You have already selected ${toAttemptListSize} questions to attempt`
							: 'Select question to attempt'
					}
				>
					<span>
						<button
							onClick={
								isSelectToAttemptDisabled
									? undefined
									: isInToAttemptList
									? handleRemoveFromToAttemptList
									: handleAddToToAttemptList
							}
							className={classnames('button green', {
								selected: isInToAttemptList,
								disabled: isSelectToAttemptDisabled,
							})}
						>
							<CheckOutlined />
						</button>
					</span>
				</Tooltip>
				<Tooltip
					placement="bottomLeft"
					title={
						isSelectNotToAttemptDisabled
							? `You have already marked ${notToAttemptListSize} questions as not to attempt`
							: 'Skip question'
					}
				>
					<span>
						<button
							onClick={
								isSelectNotToAttemptDisabled
									? undefined
									: isInNotToAttemptList
									? handleRemoveFromNotToAttemptList
									: handleAddToNotToAttemptList
							}
							className={classnames('button red', {
								selected: isInNotToAttemptList,
								disabled: isSelectNotToAttemptDisabled,
							})}
						>
							<CloseOutlined />
						</button>
					</span>
				</Tooltip>
			</div>
		</div>
	);
};

const SelectivityOptionsWrapper = ({
	sessionId,
	questionId,
	sessionConfig,
}) => {
	const questionShouldAttempt = useSelector(state => {
		try {
			return state.session.sessionsById[sessionId].config.questions.shouldSelect;
		} catch (e) {
			console.error(e);
		}
		return false;
	});
	const selectedQuestionsToAttemptCount = useSelector(state => {
		try {
			return state.session.sessionsById[sessionId].selectedQuestionsToAttempt
				.length;
		} catch (e) {
			return 0;
		}
	});
	const hasSessionEnded = useSelector(
		state => state.session.sessionsById[sessionId].hasEnded
	);
	if (
		!questionShouldAttempt ||
		selectedQuestionsToAttemptCount ||
		hasSessionEnded
	) {
		return null;
	}
	return (
		<SelectivityOptions
			sessionId={sessionId}
			questionId={questionId}
			sessionConfig={sessionConfig}
		/>
	);
};

export default SelectivityOptionsWrapper;
