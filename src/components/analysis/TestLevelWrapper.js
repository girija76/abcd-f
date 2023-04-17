import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { URLS } from 'components/urls.js';
import TestLevel from './TestLevel.js';
import TestLevelPreview from './TestLevelPreview.js';
import {
	flushSubmissionsFromLocalStorage,
	renameWrapper,
} from '../libs/lib.js';

import './TestLevelWrapper.css';
import { connect } from 'react-redux';
import { isAtLeastMentor } from 'utils/auth.js';

function fetchGrades(wid, fetchSubmission, activePhase, userId) {
	return new Promise((resolve, reject) => {
		let res1 = null;
		let res2 = null;
		let completed = false;
		fetch(`${URLS.backendCFAssessment}/getwrapper/${wid}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(res => {
				console.log(res);
				res1 = res;
				if (!completed && res2) {
					if (res1.ok && res2.ok) {
						res1.json().then(resJson1 => {
							res2.json().then(resJson2 => {
								if (resJson1.success && resJson2.success) {
									resolve({
										assessmentWrapper: renameWrapper(
											resJson1.assessmentWrapper,
											activePhase._id
										),
										assessmentCore: resJson1.assessmentCore,
										coreAnalysis: resJson2.coreAnalysis,
										wrapperAnalysis: resJson2.wrapperAnalysis,
										submission: resJson2.submission,
									});
								} else {
									reject({ err: 'failed' });
								}
							});
						});
					} else {
						reject({ err: 'res not ok' });
					}
				}
			})
			.catch(err => {
				if (!completed) {
					completed = true;
					reject({ err });
				}
			});

		fetch(URLS.backendCFAssessment + '/getAnalysis', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				fetchSubmission,
				userId: userId,
				wrapperId: wid,
			}),
		})
			.then(res => {
				console.log(res);
				res2 = res;
				if (!completed && res1) {
					if (res1.ok && res2.ok) {
						res1.json().then(resJson1 => {
							res2.json().then(resJson2 => {
								if (resJson1.success && resJson2.success) {
									resolve({
										assessmentWrapper: renameWrapper(
											resJson1.assessmentWrapper,
											activePhase._id
										),
										assessmentCore: resJson1.assessmentCore,
										coreAnalysis: resJson2.coreAnalysis,
										wrapperAnalysis: resJson2.wrapperAnalysis,
										submission: resJson2.submission,
										bestQuestionGroupChoices: resJson2.bestQuestionGroupChoices,
									});
								} else {
									reject({ err: 'failed' });
								}
							});
						});
					} else {
						reject({ err: 'res not ok' });
					}
				}
			})
			.catch(err => {
				if (!completed) {
					completed = true;
					reject({ err });
				}
			});
	});
}

class TestLevelWrapper extends Component {
	constructor(props) {
		super(props);
		const params = new URLSearchParams(window.location.search);
		let wid = params.get('wid');
		let userId;
		const from_ = params.get('from');

		const { UserData } = this.props;

		if (isAtLeastMentor(UserData.role)) userId = params.get('uid');
		else userId = UserData._id;

		console.log(isAtLeastMentor(UserData.role));

		let fetchSubmission = true;
		let submission = {};
		if (from_ === 'storage') {
			const sd = localStorage.getItem(`s-${wid}`);
			const exp = parseInt(localStorage.getItem(`exp-${wid}`), 10);
			const tn = new Date().getTime();
			if (sd && sd !== 'undefined' && exp && tn < exp + 60 * 1000) {
				submission = sd ? JSON.parse(sd) : {};
				if (submission && submission.graded) {
					fetchSubmission = false;
				}
			}
		}
		if (!fetchSubmission) {
			flushSubmissionsFromLocalStorage(wid);
		} else {
			flushSubmissionsFromLocalStorage('000000000000000000000000');
		}

		this.state = {
			answerSheet: submission,
			assessmentWrapper: {},
			assessmentCore: {},
			coreAnalysis: {},
			wrapperAnalysis: {},
			isGraphReady: false,
			loading: true,
			height: window.screen.height,
			fetchSubmission,
		};
		if (wid) {
			this.fetchAnswerSheet(wid, props, fetchSubmission, userId);
		} else {
			props.history.push(URLS.analysisTest);
		}
	}

	fetchAnswerSheet = (wid, props, fetchSubmission, userId) => {
		const { activePhase } = this.props;
		fetchGrades(wid, fetchSubmission, activePhase, userId)
			.then(data => {
				if (fetchSubmission) {
					this.setState({
						answerSheet: data.submission,
						assessmentWrapper: data.assessmentWrapper,
						assessmentCore: data.assessmentCore,
						coreAnalysis: data.coreAnalysis,
						wrapperAnalysis: data.wrapperAnalysis,
						id: data.submission._id,
						bestQuestionGroupChoices: data.bestQuestionGroupChoices,
					});
				} else {
					this.setState({
						assessmentWrapper: data.assessmentWrapper,
						assessmentCore: data.assessmentCore,
						coreAnalysis: data.coreAnalysis,
						wrapperAnalysis: data.wrapperAnalysis,
					});
				}
				this.setState({ loading: false });
			})
			.catch(err => {
				console.log('check err', err);
				props.history.push(URLS.analysisTest);
			});
	};

	isGraphReady = () => {
		this.setState({ isGraphReady: true });
	};

	updateHeight = height => {
		this.setState({ height: height });
	};

	render() {
		let {
			assessmentCore,
			coreAnalysis,
			assessmentWrapper,
			wrapperAnalysis,
			answerSheet,
			loading,
			bestQuestionGroupChoices,
		} = this.state;

		const id = answerSheet ? answerSheet._id : '';

		const { analysis } = window.config;

		const limit =
			analysis && analysis.minimumAttempts ? analysis.minimumAttempts : 0;

		const showFullAnalysis =
			(assessmentWrapper.type === 'LIVE-TEST' ||
				wrapperAnalysis.liveAttempts > limit) &&
			!assessmentWrapper.hideDetailedAnalysis
				? true
				: false;

		return (
			<div
				style={{
					display: 'flex',
					width: '100%',
					minHeight: 300,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{!loading ? (
					<div className="test-level-wrapper" style={{ width: '100%' }}>
						{Object.keys(assessmentWrapper).length ? (
							assessmentWrapper.hideResults ? (
								<div
									style={{
										background: '#fff',
										borderRadius: 8,
										padding: 12,
										border: 'solid 1px #e0e0e0',
										fontSize: '1.2rem',
									}}
								>
									Result will be declared soon.
								</div>
							) : answerSheet.graded && showFullAnalysis ? ( //20
								<div>
									<TestLevel
										id={id}
										isGraphReady={this.isGraphReady}
										updateHeight={this.updateHeight}
										answerSheet={answerSheet}
										assessmentCore={assessmentCore}
										coreAnalysis={coreAnalysis}
										assessmentWrapper={assessmentWrapper}
										wrapperAnalysis={wrapperAnalysis}
										bestQuestionGroupChoices={bestQuestionGroupChoices}
									/>
								</div>
							) : (
								<TestLevelPreview
									id={id}
									answerSheet={answerSheet}
									assessmentWrapper={assessmentWrapper}
									autoGrade={answerSheet.graded}
									name={assessmentWrapper.name}
									maxMarks={coreAnalysis.maxMarks}
								/>
							)
						) : (
							<div style={{ minHeight: '100vh' }}></div>
						)}
						{window.config.postSubmissionMessage ? (
							<div style={{ marginTop: 12, textAlign: 'center', color: 'green' }}>
								{window.config.postSubmissionMessage}
							</div>
						) : null}
					</div>
				) : (
					<Spin />
				)}
			</div>
		);
	}
}
const mapStateToProps = state => ({
	UserData: state.api.UserData,
});

export default connect(mapStateToProps)(withRouter(TestLevelWrapper));
