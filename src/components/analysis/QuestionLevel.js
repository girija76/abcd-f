import React from 'react';
import { Link } from 'react-router-dom';
import message from 'antd/es/message';
import { get } from 'lodash';

import Question from '../question/Question';
import SidebarAnalysis from '../sidebar/SidebarAnalysis.js';
import QuestionStats from '../sidebar/QuestionStats.js';
import DiscussionInput from '../discussion/DiscussionInput.js';
import DiscussionThread from '../discussion/DiscussionThread.js';
import { Button, Grid } from 'antd';
import './QuestionLevel.css';
import { URLS } from '../urls.js';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const BackButton = () => {
	const screens = useBreakpoint();
	return (
		<Button
			type={screens.xs ? 'default' : 'primary'}
			size="large"
			icon={<ArrowLeftOutlined />}
			className="back-button"
			style={{
				width: screens.xs ? undefined : '100%',
				height: '100%',
				border: screens.xs ? 'none' : '',
			}}
		>
			{screens.xs ? null : 'Back to Analysis'}
		</Button>
	);
};

export class QuestionLevel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currSection: 0,
			currQuestion: 0,
			threads: [],
			bookmarks: {},
		};
	}

	componentWillMount() {
		const { currSection, currQuestion } = this.state;
		const { assessmentCore } = this.props;

		fetch(URLS.backendUsers + '/bookmarks', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				const bookmarks = {};
				responseJson.forEach(rj => {
					bookmarks[rj.qid] = true;
				});
				this.setState({ bookmarks });
			})
			.catch(error => {});

		const question =
			assessmentCore.sections[currSection].questions[currQuestion].question;
		this.getThreads(question._id);
	}

	onBookmarkChange = () => {
		const { assessmentCore } = this.props;

		const { currSection, currQuestion, bookmarks } = this.state;
		const section = assessmentCore.sections[currSection];
		const question = section.questions[currQuestion].question;

		if (bookmarks[question._id]) {
			bookmarks[question._id] = false;
		} else {
			bookmarks[question._id] = true;
		}
		this.setState({ bookmarks });
	};

	componentDidMount() {
		const {
			assessmentWrapper: { messages },
		} = this.props;
		messages.forEach(message => {
			if (message.type === 'warning') this.showWarning(message.message);
		});
	}

	componentWillUnmount() {
		message.destroy();
	}

	showWarning = warning => {
		message.warning(warning, 10000);
	};

	getThreads = id => {
		fetch(`${URLS.backendDiscussion}/${id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({ threads: responseJson.threads });
			});
	};

	updateThreads = threads => this.setState({ threads });

	moveToQuestion = (section, question) => {
		this.setState({ currSection: section, currQuestion: question });
		const {
			assessmentCore: { sections },
		} = this.props;
		const question_ = sections[section].questions[question].question;
		this.getThreads(question_._id);
	};

	moveToNext = () => {
		let { currSection, currQuestion } = this.state;
		const {
			assessmentCore: { sections },
		} = this.props;
		if (currQuestion + 1 < sections[currSection].questions.length) {
			this.moveToQuestion(currSection, currQuestion + 1);
		} else if (currSection + 1 < sections.length) {
			this.moveToQuestion(currSection + 1, 0);
		} else {
		}
	};

	moveToPrev = () => {
		let { currSection, currQuestion } = this.state;
		const {
			assessmentCore: { sections },
		} = this.props;
		if (currQuestion > 0) {
			this.moveToQuestion(currSection, currQuestion - 1);
		} else if (currSection > 0) {
			this.moveToQuestion(
				currSection - 1,
				sections[currSection - 1].questions.length - 1
			);
		} else {
		}
	};

	getSidebarLinks = () => {
		let {
			answerSheet: { meta },
			assessmentCore,
			answerSheet,
		} = this.props;
		let sections = assessmentCore.sections;
		let offset = 0;
		return sections.map((sec, id_sec) => {
			offset += sec.questions.length;
			return {
				name: sec.name,
				questions: sec.questions.map((que, id_que) => {
					let correct = 0; //encode marked too!
					// if (meta.sections[id_sec].questions[id_que].answer === '') {
					// 	// can be removed
					// 	//bonus, show diff color
					// 	correct = 1;
					// } else
					// mark bonus question differently!!
					if (meta.sections[id_sec].questions[id_que].correct === 1) {
						correct = 1;
					} else if (meta.sections[id_sec].questions[id_que].correct === 0) {
						correct = 2;
					}
					const questionMeta = get(answerSheet, [
						'meta',
						'sections',
						id_sec,
						'questions',
						id_que,
					]);
					return {
						qNo: id_que,
						correct: correct,
						isBadChoice: questionMeta.isBadChoice,
						isOptional: questionMeta.isOptional,
						isWorstChoice: questionMeta.isWorstChoice,
					};
				}),
				offset: offset - sec.questions.length,
			};
		});
	};

	render() {
		let { currSection, currQuestion, threads, bookmarks } = this.state;
		let {
			answerSheet,
			assessmentCore,
			coreAnalysis,
			wrapperAnalysis,
			assessmentWrapper,
		} = this.props;

		const section = assessmentCore.sections[currSection];
		let question = section.questions[currQuestion].question;

		let reports = section.questions[currQuestion].reports; //why reports here!
		let meta = answerSheet.meta.sections[currSection].questions[currQuestion];
		let response =
			answerSheet.response.sections[currSection].questions[currQuestion];
		const totalTestAttempts = coreAnalysis.totalAttempts;
		let stats = coreAnalysis.sections[currSection].questions[currQuestion];

		let bonus = false;
		if (wrapperAnalysis.bonus[question._id]) {
			const bt = new Date(wrapperAnalysis.bonus[question._id]).getTime();
			const tt = new Date(answerSheet.createdAt).getTime();
			if (bt > tt) bonus = true;
		}

		// answerSheet.assessment.sections[currSection].questions[currQuestion].bonus;
		let sidebarLinks = this.getSidebarLinks();

		const correctMark = section.questions[currQuestion].correctMark;

		const incorrectMark = section.questions[currQuestion].incorrectMark;

		const autoGrade = assessmentWrapper.type !== 'LIVE-TEST';

		const currQuestionNumber =
			sidebarLinks[currSection].offset +
			sidebarLinks[currSection].questions[currQuestion].qNo +
			1;

		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					minHeight: '100vh',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						width: '100%',
						justifyContent: 'center',
					}}
					className="review-test-wrapper"
				>
					<div className="question-stats-wrapper">
						<div className="back-stats-wrapper">
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
								}}
								className="back-wrapper"
							>
								<Link
									to={`${URLS.analysisId}?wid=${assessmentWrapper._id}`}
									style={{ width: '100%' }}
								>
									<BackButton />
								</Link>
							</div>
							<QuestionStats
								currSection={currSection}
								currQuestion={currQuestion}
								sidebarLinks={sidebarLinks}
								moveToQuestion={this.moveToQuestion}
								question={question}
								meta={meta}
								response={response}
								stats={stats}
								totalUsers={totalTestAttempts}
								bonus={bonus}
								autoGrade={autoGrade && totalTestAttempts < 10}
							/>
						</div>
						<SidebarAnalysis
							currSection={currSection}
							currQuestion={currQuestion}
							sidebarLinks={sidebarLinks}
							moveToQuestion={this.moveToQuestion}
							question={question}
							meta={meta}
							response={response}
							stats={stats}
						/>
					</div>
					<div
						className="question-discussion-wrapper"
						style={{
							borderLeft: 'solid 1px #cfd8db',
						}}
					>
						{question ? (
							<Question
								isBadChoice={meta.isBadChoice}
								isOptional={meta.isOptional}
								isAnswered={meta.isAnswered}
								isBestChoice={meta.isBestChoice}
								badChoiceReason={meta.badChoiceReason}
								markAwarded={meta.mark}
								attemptMode={false}
								question={question}
								response={response.answer}
								correctMark={correctMark}
								incorrectMark={incorrectMark}
								sectionName={section.name}
								moveToPrev={this.moveToPrev}
								moveToNext={this.moveToNext}
								aid={assessmentWrapper._id}
								reports={reports}
								currQuestionNumber={currQuestionNumber}
								bonus={bonus}
								bookmarkOption={true}
								bookmarked={bookmarks[question._id]}
								onBookmarkChange={this.onBookmarkChange}
								discussionThread={
									<div className="discussion-wrapper">
										<DiscussionInput
											aid={question._id}
											updateThreads={this.updateThreads}
										/>
										<DiscussionThread
											aid={question._id}
											threads={threads}
											updateThreads={this.updateThreads}
										/>
									</div>
								}
							/>
						) : (
							<div
								style={{
									display: 'flex',
									margin: '20px 10px',
									flex: 1,
									alignItems: 'center',
									justifyContent: 'center',
									height: `calc(50vh - ${20}px)`,
									fontSize: 18,
									fontWeight: 'bold',
								}}
							>
								Error!! Question not found. Please contact support team
								(support@prepleaf.com).
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default QuestionLevel;
