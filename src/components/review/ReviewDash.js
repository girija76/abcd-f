import React from 'react';
import ReviewQuestion from '../question/ReviewQuestion.js';
import { Button, Spin } from 'antd';
import DiscussionInput from '../discussion/DiscussionInput.js';
import DiscussionThread from '../discussion/DiscussionThread.js';

import './ReviewDash.css';

import { URLS } from '../urls.js';

import { LoadingOutlined } from '@ant-design/icons';

export class ReviewDash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			question: {},
			threads: [],
			response: {},
			note: {},
			session: {},
			bookmark: false,
			isLoading: true,
			error: '',
		};
	}

	componentDidMount() {
		this.getReviewQuestion();
	}

	getReviewQuestion = () => {
		const searchParams = new URLSearchParams(window.location.search);

		const questionId = searchParams.get('id');
		this.setState({ isLoading: true, error: '' });
		fetch(URLS.backendQuestions + '/getAttemptedResponse', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ qid: questionId, mode: 'review' }),
			credentials: 'include',
		})
			.then(res => {
				if (res.ok) {
					res.json().then(result => {
						this.setState({
							question: result.question,
							response: result.response,
							threads: result.discussion.threads ? result.discussion.threads : [],
							bookmark: result.bookmark,
							session: result.session,
							isLoading: false,
						});
					});
				} else {
					throw new Error('404 Question not found');
				}
			})
			.catch(e => {
				this.setState({ isLoading: false, error: e.message });
			});
	};

	updateThreads = threads => this.setState({ threads });

	updateBookmark = bookmark => this.setState({ bookmark });

	render() {
		let {
			question,
			startTime,
			threads,
			response,
			bookmark,
			isLoading,
			error,
		} = this.state;

		return (
			<div>
				{!isLoading ? (
					!error ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								backgroundColor: '#f0f4f4',
								minHeight: '100vh',
							}}
						>
							<div className="review-dash">
								<div className="review-dash-header">Review Question</div>
								<div style={{ width: '100%' }}>
									<div style={{ margin: 10 }}>
										<ReviewQuestion
											question={question}
											startTime={startTime}
											getNextQuestion={this.getNextQuestion}
											onAnswer={this.onAnswer}
											attemptMode={false}
											response={response}
											bookmark={bookmark}
											updateBookmark={this.updateBookmark}
											mode="review"
										/>
									</div>
									<div style={{ width: '100%' }}>
										<DiscussionInput
											aid={question._id}
											updateThreads={this.updateThreads}
											disableMaxWidth={true}
										/>
										<DiscussionThread
											aid={question._id}
											threads={threads}
											updateThreads={this.updateThreads}
											disableMaxWidth={true}
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div
							style={{
								marginTop: '20%',
								textAlign: 'center',
							}}
						>
							<div style={{ marginBottom: 12 }}>{error}</div>
							<Button onClick={this.getReviewQuestion}>Try Again</Button>
						</div>
					)
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100vw',
							height: '70vh',
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<Spin indicator={<LoadingOutlined style={{ fontSize: '3rem' }} />} />
							<div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
								Just a moment...
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default ReviewDash;
