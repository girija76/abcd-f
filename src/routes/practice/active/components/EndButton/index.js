import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { Checkbox } from 'antd';
import { useSelector } from 'react-redux';

import { end } from 'actions/session';
import { getCorrectIncorrectCount } from 'utils/session';
import Clock from 'widgets/Clock';

import Performance from '../Overview/Performance';
import './style.scss';

const ConfirmEndComponent = ({
	session,
	isOpen,
	canReattempt,
	onClose,
	onConfirm,
	baseClass,
	message,
	hasCancelButton,
}) => {
	const {
		startTime: sessionStartTime,
		config: { timeLimit },
	} = session;
	const questionsAttempted = useSelector(state => {
		return session.questions
			.map(q => q.question)
			.map(questionId => state.session.attemptsByQuestionId[questionId])
			.filter(attempt => {
				return (
					(attempt.answer && attempt.answer.data) ||
					(attempt.change && attempt.change.answer && attempt.change.answer.data)
				);
			}).length;
	});
	const totalQuestions = useMemo(() => {
		try {
			return session.config.questions.total;
		} catch (e) {
			return undefined;
		}
	}, [session]);
	const getAttemptForQuestionId = useSelector(state => {
		return id => {
			try {
				return state.session.attemptsByQuestionId[id] || {};
			} catch (e) {
				return {};
			}
		};
	});
	const attemptPopulatedSession = {
		...session,
		questions: session.questions.map(q => ({
			attempt: getAttemptForQuestionId(q.question),
		})),
	};
	const {
		correct: correctCount,
		incorrect: incorrectCount,
	} = getCorrectIncorrectCount(attemptPopulatedSession);
	const handleClose = () => {
		if (hasCancelButton) {
			onClose();
		}
	};
	const [alertMessage, setAlertMessage] = useState();
	const [hasAgreed, setHasAgreed] = useState(false);
	const [showAgreement, setShowAgreement] = useState(false);
	useEffect(() => {
		setHasAgreed(true);
		setShowAgreement(false);
		if (isOpen) {
			if (totalQuestions && questionsAttempted < totalQuestions * 0.5) {
				setShowAgreement(true);
				setHasAgreed(false);
				setAlertMessage(
					'You have attempted very few questions. Try attempting more questions'
				);
			}
			if (timeLimit) {
				const timeSpent = (Date.now() - sessionStartTime) / 1000;
				if (timeSpent < timeLimit * 0.6) {
					setShowAgreement(true);
					setHasAgreed(false);
					setAlertMessage("It's too early. Try spending more time in this session.");
				}
			}
		}
	}, [isOpen, sessionStartTime, timeLimit, totalQuestions, questionsAttempted]);
	return (
		<ReactModal
			className={`${baseClass}-modal-content`}
			overlayClassName={`${baseClass}-modal-overlay`}
			isOpen={isOpen}
			onRequestClose={handleClose}
		>
			<h3 className="heading">
				{canReattempt
					? 'Are you sure you want to end this session?'
					: 'End Session'}
			</h3>
			<div className="body">
				{message || alertMessage ? (
					<div className="message warn">{message || alertMessage}</div>
				) : null}
				{!canReattempt && (
					<>
						<div className="number-list">
							<div className="item">
								<div className="content">{correctCount}</div>
								<div>Correct</div>
							</div>
							<div className="item">
								<div className="content">{incorrectCount}</div>
								<div>Incorrect</div>
							</div>
							<div className="item">
								<div className="content">{session.xpEarned}</div>
								<div>XP Earned</div>
							</div>
							<div className="item">
								<div className="content">
									<Clock
										startTime={session.startTime}
										// endTime={new Date()}
										isRunning={true}
									/>
								</div>
								<div>Total Time Spent</div>
							</div>
						</div>

						<Performance
							className="session-performance"
							correctCount={correctCount}
							incorrectCount={incorrectCount}
							session={attemptPopulatedSession}
							width={200}
							height={90}
						/>
					</>
				)}
				{canReattempt && (
					<div className="body-content">
						<div>
							If you end this session, we will take you to the Review Questions page,
							where you can review your performance.
						</div>
					</div>
				)}
			</div>
			<div className="footer">
				<div className="left">
					{showAgreement ? (
						<Checkbox
							onChange={e => {
								setHasAgreed(e.target.checked);
							}}
						>
							I still want to end this session
						</Checkbox>
					) : null}
				</div>
				<button
					disabled={!hasCancelButton}
					className="cancel-button"
					onClick={handleClose}
				>
					Cancel
				</button>
				<button
					disabled={showAgreement && !hasAgreed}
					className="confirm-button"
					onClick={onConfirm}
				>
					Yes
				</button>
			</div>
		</ReactModal>
	);
};

const ConfirmEnd = connect((state, ownProps) => {
	const { sessionId } = ownProps;
	const session = state.session.sessionsById[sessionId];
	return { session };
})(ConfirmEndComponent);

const EndSessionButton = ({
	sessionId,
	forceEnd,
	forceEndMessage,
	end,
	canReattempt,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const baseClass = 'active-session-end';
	useEffect(() => {
		if (forceEnd) {
			setIsModalOpen(true);
		}
	}, [forceEnd]);
	return (
		<React.Fragment>
			<button
				className={`${baseClass}-button`}
				onClick={() => {
					setIsModalOpen(true);
				}}
			>
				End Session
			</button>
			{isModalOpen ? (
				<ConfirmEnd
					canReattempt={canReattempt}
					sessionId={sessionId}
					isOpen={isModalOpen}
					hasCancelButton={!forceEnd || canReattempt}
					message={forceEndMessage}
					onClose={() => {
						setIsModalOpen(false);
					}}
					onConfirm={end}
					baseClass={baseClass}
				/>
			) : null}
		</React.Fragment>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { sessionId } = ownProps;
	let canReattempt = false;
	try {
		canReattempt = !state.session.sessionsById[sessionId].config.prevent
			.reattempt;
	} catch (e) {}
	const { forceEnd, forceEndMessage } = state.session.sessionsById[sessionId];
	return {
		forceEnd,
		forceEndMessage,
		canReattempt,
	};
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { sessionId } = ownProps;
	return {
		...ownProps,
		...stateProps,
		...dispatchProps,
		end: () => dispatchProps.end(sessionId, stateProps.canReattempt),
	};
};

export default connect(
	mapStateToProps,
	{ end },
	mergeProps
)(EndSessionButton);
