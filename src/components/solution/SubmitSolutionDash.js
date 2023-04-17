import React from 'react';
import { connect } from 'react-redux';
import ReviewQuestion from '../question/ReviewQuestion.js';
import notification from 'antd/es/notification';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Spin from 'antd/es/spin';

import { URLS } from '../urls.js';

import { LoadingOutlined } from '@ant-design/icons';

import TeXEditor from '../Editor';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export class ReviewDash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			question: {},
			solution: undefined,
			isLoading: true,
			laoding: false,
			error: '',
		};
	}

	componentDidMount() {
		this.getReviewQuestion();
	}

	getReviewQuestion = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const questionId = searchParams.get('id');

		if (questionId) {
			this.setState({ isLoading: true, error: '' });
			fetch(URLS.backendDiscussion + '/get-solution-request', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ qid: questionId }),
				credentials: 'include',
			})
				.then(res => {
					if (res.ok) {
						res.json().then(result => {
							this.setState({
								question: result.question,
								solution: result.solution,
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
		}
	};

	updateThreads = threads => this.setState({ threads });

	updateBookmark = bookmark => this.setState({ bookmark });

	solutionRef = ref => {
		this['solution-ref'] = ref;
	};

	submitSolution = () => {
		const { rawContent } = this['solution-ref'].value;
		const searchParams = new URLSearchParams(window.location.search);
		const questionId = searchParams.get('id');

		this.setState({ laoding: true });
		fetch(URLS.backendDiscussion + '/submit-solution', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ question: questionId, solution: rawContent }),
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					notification.success({
						message:
							'Thanks for submitting the solution. We will notify you if we select your solution.',
					});
				}
				this.setState({ laoding: false });
			})
			.catch(error => {
				this.setState({ laoding: false });
			});
	};

	render() {
		let {
			question,
			startTime,
			threads,
			response,
			session,
			bookmark,
			solution,
			laoding,
			isLoading,
			error,
		} = this.state;

		console.log('check soln', solution);

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
							<div
								className="review-dash"
								style={{ margin: '20px 0px', width: '100%' }}
							>
								<div style={{ paddingLeft: 20, fontSize: 24, fontWeight: 500 }}>
									Submit Solution
								</div>
								<div style={{ width: '100%' }}>
									<div style={{ margin: 10 }}>
										<ReviewQuestion
											question={question}
											startTime={startTime}
											getNextQuestion={this.getNextQuestion}
											onAnswer={this.onAnswer}
											attemptMode={false}
											response={{}}
											bookmark={bookmark}
											updateBookmark={this.updateBookmark}
											mode="review"
											hideSolution={true}
										/>
									</div>
								</div>
								<Card title="Enter Solution" style={{ margin: '20px 10px' }}>
									<TeXEditor
										readOnly={false}
										customRef={this.solutionRef}
										rawContent={solution}
									/>
									<Button
										type="primary"
										size="large"
										style={{ marginTop: 12 }}
										onClick={this.submitSolution}
										laoding={laoding}
									>
										Submit
									</Button>
								</Card>
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
						<Spin indicator={antIcon} />
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReviewDash);
