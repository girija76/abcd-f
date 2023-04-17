import React, { useEffect, useMemo, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import Spin from 'antd/es/spin';
import Drawer from 'antd/es/drawer';
import Timeline from 'antd/es/timeline';

import { isEmpty } from 'lodash';

import Overview from './components/Overview';
import Note from 'components/note/Note';
import { end as endSession, getQuestionAtPosition } from 'actions/session';
import { URLS } from 'components/urls';

import ActiveQuestion from './components/ActiveQuestion';
import Header from './components/Header';
import OtherControls from './components/OtherControls';
import Alerts from './components/Alerts';
import './styles.scss';

import { LoadingOutlined } from '@ant-design/icons';

function getConceptScores(attempts, attemptsByQuestionId) {
	const conceptMap = {};
	let lastConcept = null;
	attempts.forEach(attempt => {
		const {
			question: { concepts },
		} = attempt;
		if (Array.isArray(concepts) && concepts.length === 1) {
			const c = concepts[0].concept;
			lastConcept = c;
			if (!conceptMap[c]) {
				conceptMap[c] = { answered: 0, correct: 0 };
			}
			if (attempt.isAnswered) {
				conceptMap[c].answered += 1;
			}
			if (attempt.isCorrect) {
				conceptMap[c].correct += 1;
			}
		}
	});
	return { conceptMap, lastConcept };
}

function getConcepts(
	Topics,
	subTopic,
	questionConcept,
	questions,
	attemptsByQuestionId
) {
	const attempts = questions.map(q => {
		return {
			isAnswered: q.attempt.isAnswered,
			isCorrect: q.attempt.isCorrect,
			question: { _id: q.question && q.question._id, concepts: q.concepts },
		};
	});

	const { conceptMap: conceptScores } = getConceptScores(
		attempts,
		attemptsByQuestionId
	);

	// console.log('check concept scores1', questions);

	// console.log('check concept scores', conceptScores);

	// console.log('check stuff!!!', questionConcept);
	const concepts = [];
	Topics.forEach(t => {
		t.sub_topics.forEach(st => {
			if (st._id === subTopic) {
				concepts.push(...st.concepts);
			}
		});
	});
	let status = 0;
	const conceptTimeline = concepts.map(concept => {
		if (concept.concept && concept.concept._id === questionConcept) {
			status = 2;
			return {
				_id: concept._id,
				name: concept.concept.name,
				status: 1,
			};
		} else if (concept.concept) {
			if (status === 0) {
				const c = conceptScores[concept.concept._id];
				// console.log('check ccc', conceptScores, c, concept.concept._id);
				if (c && c.answered < 3) {
					return {
						_id: concept._id,
						name: concept.concept.name,
						status: 3,
					};
				} else if (c && c.correct < 0.7 * c.answered) {
					return {
						_id: concept._id,
						name: concept.concept.name,
						status: 3,
					};
				} else {
					return {
						_id: concept._id,
						name: concept.concept.name,
						status,
					};
				}
				//
				// conceptScores[]
				// return {
				// 	_id: concept._id,
				// 	name: concept.concept.name,
				// 	status,
				// };
			} else {
				return {
					_id: concept._id,
					name: concept.concept.name,
					status,
				};
			}
		}
	});
	return conceptTimeline;
}

const ActiveSession = ({
	sessionId,
	session,
	getQuestionAtPosition,
	history,
	isReviewing,
	Topics,
	activeQuestionsBySessionId,
	questionsById,
	attemptsByQuestionId,
}) => {
	const [error, setError] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const [errorCode, setErrorCode] = useState(null);
	const hasSessionEnded =
		(session && session.hasEnded) || (errorCode && errorCode === 'session-ended');
	const sessionConfig = session ? session.config : undefined;
	const questionsShouldSelect = useMemo(() => {
		try {
			return sessionConfig.questions.shouldSelect;
		} catch (e) {
			return 0;
		}
	}, [sessionConfig]);
	const selectedQuestionsToAttempt = useSelector(state => {
		try {
			return state.session.sessionsById[sessionId].selectedQuestionsToAttempt;
		} catch (e) {
			return [];
		}
	});
	useEffect(() => {
		if (!session) {
			getQuestionAtPosition('last', true).catch(error => {
				setError(error.message || 'Error occurred while loading');
				setErrorCode(error.code);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionId, !session]);

	useEffect(() => {
		if (hasSessionEnded && !isReviewing) {
			if (
				!session.config ||
				!session.config.prevent ||
				session.config.prevent.reattempt
			) {
				window.location = `${URLS.activitySessionDetail}?s=${sessionId}`;
			} else {
				try {
					window.location = `/practice/active?s=${sessionId}&review&from=end-session`;
				} catch (e) {}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasSessionEnded, sessionId]);

	// const { filters } = session;
	const subTopic =
		session && session.filters && session.filters.length === 1
			? session.filters[0].subTopic
			: null;

	const activeQuestionId = activeQuestionsBySessionId[sessionId];
	const activeQuestion = questionsById[activeQuestionId];
	// console.log('check activeQuestionId', activeQuestion);
	// console.log('check activeQuestionId', session, sessionId);

	const questionConcept =
		activeQuestion &&
		activeQuestion.concepts &&
		activeQuestion.concepts.length === 1
			? activeQuestion.concepts[0].concept
			: null;

	const concepts = getConcepts(
		Topics,
		subTopic,
		questionConcept,
		session ? session.questions : [],
		attemptsByQuestionId
	);

	// console.log('check concepts', session);

	const enableConcepts = false;

	if (
		(session && session.hasEnded) ||
		(errorCode && errorCode === 'session-ended')
	) {
		// <Redirect to={`${URLS.activitySessionDetail}?s=${sessionId}`} />
		if (!isReviewing) {
			return (
				<div
					style={{
						height: '90vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
					}}
				>
					<div style={{ width: '64px', height: 80, marginBottom: 12 }}>
						<Spin indicator={<LoadingOutlined style={{ fontSize: '64px' }} />} />
					</div>
					<div>Analyzing your performance</div>
				</div>
			);
		}
	}
	if (!session) {
		if (error) {
			return (
				<div
					style={{
						height: '90vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
					}}
				>
					<div>{error}</div>
					<div>
						<Link to={URLS.practice}>Go to practice</Link>
					</div>
				</div>
			);
		}
		return (
			<div
				style={{
					height: '90vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				<div style={{ width: '64px', height: 80, marginBottom: 12 }}>
					<Spin indicator={<LoadingOutlined style={{ fontSize: '64px' }} />} />
				</div>
				<div>Just a moment</div>
			</div>
		);
	}
	return (
		<div className="active-session">
			<Header
				session={session}
				sessionId={sessionId}
				baseClass="active-session-header"
			/>
			<div className="active-session-content">
				<div className="left-side-container">
					<Alerts sessionId={sessionId} sessionConfig={session.config} />
					<ActiveQuestion baseClass="active-session" sessionId={sessionId} />
				</div>
				<div className="right-side-container">
					{enableConcepts ? (
						<button
							style={{
								background: 'white',
								width: '100%',
								border: 'solid 1px',
								padding: '8px',
								color: '#313131',
								borderRadius: 6,
								marginBottom: 12,
								cursor: 'pointer',
								textTransform: 'uppercase',
							}}
							data-ga-on="click"
							data-ga-event-action="Click"
							data-ga-event-category="Concept"
							data-ga-event-label="See concepts"
							onClick={() => {
								setIsDrawerOpen(true);
							}}
						>
							See concepts
						</button>
					) : null}
					<OtherControls sessionId={sessionId} />
					<Overview baseClass="active-session" session={session} />
					{questionsShouldSelect && isEmpty(selectedQuestionsToAttempt) ? null : (
						<Note viewOnly={session.hasEnded} sessionId={sessionId} />
					)}
				</div>
			</div>
			{enableConcepts ? (
				<Drawer
					title="Your journey through concepts!"
					placement="right"
					closable={true}
					onClose={() => {
						setIsDrawerOpen(false);
					}}
					visible={isDrawerOpen}
				>
					<Timeline>
						{concepts.map(c => {
							if (c.status === 0) {
								return <Timeline.Item color="green">{c.name}</Timeline.Item>;
							} else if (c.status === 1) {
								return <Timeline.Item color="blue">{c.name}</Timeline.Item>;
							} else if (c.status === 2) {
								return <Timeline.Item color="gray">{c.name}</Timeline.Item>;
							} else {
								return <Timeline.Item color="red">{c.name}</Timeline.Item>;
							}
						})}
					</Timeline>
				</Drawer>
			) : null}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const query = new URLSearchParams(ownProps.location.search);
	const sessionId = query.get('s');
	const isReviewing = query.has('review');
	const session = state.session.sessionsById[sessionId];
	return {
		sessionId,
		session,
		isReviewing,
		Topics: state.api.Topics,
		activeQuestionsBySessionId: state.session.activeQuestionsBySessionId,
		questionsById: state.session.questionsById,
		attemptsByQuestionId: state.session.attemptsByQuestionId,
	};
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { sessionId } = stateProps;
	return {
		...ownProps,
		...stateProps,
		...dispatchProps,
		getQuestionAtPosition: (...args) =>
			dispatchProps.getQuestionAtPosition(sessionId, ...args),
		end: () => dispatchProps.end(sessionId),
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		{ end: endSession, getQuestionAtPosition },
		mergeProps
	)(ActiveSession)
);
