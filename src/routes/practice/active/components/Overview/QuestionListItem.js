import React, { useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { isQuestionDisabled } from 'utils/session';
import { setActiveQuestion } from 'actions/session';

const useQuestionSelection = (sessionId, questionId) => {
	try {
		const session = useSelector(state => state.session.sessionsById[sessionId]);
		const selectedQuestionsToAttempt = session.selectedQuestionsToAttempt;
		if (isEmpty(selectedQuestionsToAttempt)) {
			return [false];
		}
		const questionSelectionOrder = session.questionSelectionOrder;
		const shouldNotAttempt = questionSelectionOrder.slice(
			selectedQuestionsToAttempt.length
		);
		const shouldHaveSelected = shouldNotAttempt.indexOf(questionId) === -1;
		const didSelect = selectedQuestionsToAttempt.indexOf(questionId) > -1;
		return [true, shouldHaveSelected, didSelect];
	} catch (e) {
		console.error(e);
		return [false];
	}
};

const QuestionListItem = ({
	index,
	questionItem,
	activeQuestionId,
	session,
	firstDummyQuestionIndex,
	isLastQuestionAnsweredOrSkipped,
	onNext,
}) => {
	const sessionId = session._id;
	const hasSessionEnded = session.hasEnded;
	const dispatch = useDispatch();
	const sessionConfig = session.config;
	const classNames = {};
	const isActive = questionItem && questionItem.question === activeQuestionId;
	const {
		toAttemptList,
		notToAttemptList,
		selectedQuestionsToAttempt,
	} = session;
	const [isSelectedToAttempt, isSelectedNotToAttempt] = useMemo(() => {
		if (!isEmpty(selectedQuestionsToAttempt)) {
			return [false, false];
		}
		let isSelectedToAttempt;
		let isSelectedNotToAttempt;
		try {
			isSelectedToAttempt = toAttemptList.indexOf(questionItem.question) > -1;
		} catch (e) {
			isSelectedToAttempt = false;
		}
		try {
			isSelectedNotToAttempt =
				notToAttemptList.indexOf(questionItem.question) > -1;
		} catch (e) {
			isSelectedNotToAttempt = false;
		}
		return [isSelectedToAttempt, isSelectedNotToAttempt];
	}, [
		toAttemptList,
		notToAttemptList,
		questionItem,
		selectedQuestionsToAttempt,
	]);
	let isDisabled = true;
	let isAnswerSelected = false;
	const questionId = questionItem ? questionItem.question : undefined;
	const [
		isSelectivitySession,
		shouldHaveSelected,
		didSelect,
	] = useQuestionSelection(sessionId, questionId);
	const canReattempt =
		sessionConfig && sessionConfig.prevent && !sessionConfig.prevent.reattempt;
	const handleSetActiveQuestion = useCallback(() => {
		dispatch(setActiveQuestion(sessionId, questionId));
	}, [dispatch, questionId, sessionId]);
	const attemptsByQuestionId = useSelector(
		state => state.session.attemptsByQuestionId
	);
	const getAttemptForQuestionId = useSelector(state => questionId => {
		try {
			return state.session.attemptsByQuestionId[questionId] || {};
		} catch (e) {
			return {};
		}
	});
	if (questionItem) {
		const attempt = getAttemptForQuestionId(questionItem.question);
		isDisabled = isQuestionDisabled({
			questionId: questionItem.question,
			session,
			attemptsByQuestionId,
		});
		isAnswerSelected =
			(attempt.answer && attempt.answer.data) ||
			(attempt.change && attempt.change.answer && attempt.change.answer.data);
		classNames['is-correct'] = attempt.isCorrect;
		classNames['is-incorrect'] = attempt.isCorrect === false;
		classNames['is-active'] = isActive;
	} else {
		classNames['is-dummy'] = true;
	}
	let fetchNextOnClick = false;
	if (
		!questionItem &&
		firstDummyQuestionIndex === index &&
		(!sessionConfig.prevent.reattempt ||
			!sessionConfig.prevent.skip ||
			isLastQuestionAnsweredOrSkipped)
	) {
		fetchNextOnClick = true;
		classNames['will-fetch-next'] = true;
	}
	let onClick;
	if (fetchNextOnClick) {
		onClick = () => onNext();
		isDisabled = false;
	} else if (questionItem) {
		if (!sessionConfig.prevent.goBack || isActive || hasSessionEnded) {
			onClick = () => handleSetActiveQuestion(session.id, questionItem.question);
		}
	}

	classNames['is-unclickable'] = !onClick;

	return (
		<button
			key={index}
			disabled={isDisabled}
			onClick={onClick}
			className={classnames('item', classNames, {
				'is-disabled': isDisabled,
				'show-answer-selected-mark':
					!hasSessionEnded && canReattempt && isAnswerSelected,
				'show-selected-to-attempt-mark': isSelectedToAttempt,
				'show-selected-not-to-attempt-mark': isSelectedNotToAttempt,
				'show-selectivity-symbols': session.hasEnded && isSelectivitySession,
				'was-dangerous': !shouldHaveSelected,
				'good-choice': shouldHaveSelected && didSelect,
				'good-leave': !shouldHaveSelected && !didSelect,
				'bad-leave': shouldHaveSelected && !didSelect,
				'bad-choice': !shouldHaveSelected && didSelect,
			})}
			data-ga-on="click"
			data-ga-event-action="Change Question"
			data-ga-event-category="Navigation in Session"
			data-ga-event-label={'Jump to question'}
		>
			<span className="content" key={index}>
				{index + 1}
			</span>
			<span className="colors" />
		</button>
	);
};

export default QuestionListItem;
