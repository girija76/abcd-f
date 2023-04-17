import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Modal, Button } from 'antd';
import LiveTest from './LiveTest.js';
import Spin from 'antd/es/spin';
import { URLS } from '../urls.js';
import message from 'antd/es/message';
import './TestWrapper.css';

import { verifyAnswerSheetIntegrity } from '../libs/lib';
import { isAccountCreationCompleted } from 'utils/user';
import { Loading3QuartersOutlined } from '@ant-design/icons';

import AlreadyAttempted from './components/AlreadyAttempted';
import { createAnswerSheetFromStorage } from 'utils/assessment';
import { syncFlow } from 'utils/flow';
import { autoUpdateFlowAsync, getUpdatedMyQuestions } from 'actions/assessment';
import { initializeAssessment } from 'components/api/ApiAction';

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />;

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}}
		/>
	);
};

class TestWrapper extends Component {
	constructor(props, context) {
		super(props, context);
		let {
			match: {
				params: { id: liveTestId },
			},
		} = props;
		this.state = {
			test: null,
			wrapper: null,
			liveTestId,
			startTime: null,
			onlyForPremium: false,
			alreadyAttempted: false,
		};
		message.destroy();
	}

	componentDidMount() {
		if (!this.props.redirectToProfileCompletion) {
			this.initialize();
		}
	}

	initialize = () => {
		const {
			match: {
				params: { id: liveTestId },
			},
		} = this.props;
		this.setState({ error: null });
		if (liveTestId) {
			const t1 = new Date().getTime();
			fetch(`${URLS.backendAssessment}/${liveTestId}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => {
					const t3 = new Date().getTime();
					if (response.ok) {
						response
							.json()
							.then(responseJson => {
								let offset = 0;
								if (responseJson.currTime > t3) {
									offset = responseJson.currTime - t3;
								} else if (responseJson.currTime < t1) {
									offset = responseJson.currTime - t1;
								}

								const assessmentCore = responseJson.core;
								const wrapper = responseJson.wrapper;

								const calibratedStartTime =
									new Date(responseJson.startTime).getTime() - offset;
								const onSyncSuccess = res => {
									const answerSheet = createAnswerSheetFromStorage(assessmentCore);
									const newMyQuestions = getUpdatedMyQuestions(
										answerSheet.myQuestions,
										res.newFlow,
										answerSheet.flow
									);
									this.props.initializeAssessment({
										flow: answerSheet.flow,
										myQuestions: newMyQuestions,
										currSection: answerSheet.currSection,
										currQuestion: answerSheet.currQuestion,
										questionStartTime: answerSheet.questionStartTime,
									});
									setTimeout(() => {
										this.props.autoUpdateFlowAsync();
										setTimeout(() => {
											this.setState({
												startTime: calibratedStartTime,
												test: assessmentCore,
												liveTestId,
												wrapper: wrapper,
											});
										}, 200);
									}, 1000);
								};
								const onSyncError = error => {
									try {
										if (error.code === 'live-assessment-not-found') {
											console.log('assessment has ended');
											Modal.error({
												content: 'Could not load assessment progress. Please try again.',
												onOk: close => {
													window.location = '';
												},
												okText: 'Retry',
												cancelButtonProps: { style: { display: 'none' } },
											});
										} else {
											onSyncSuccess({ newFlow: [] });
										}
										// } else if (error.code === 'assessment-time-exceeded') {
										// 	console.log('assessment time has exceeded');
										// } else if (error.code === 'possibly-network-error') {
										// }
									} catch (e) {}
								};
								const flowToSync = [];
								// try 2 times if sync fails
								syncFlow(flowToSync)
									.then(onSyncSuccess)
									.catch(() => {
										syncFlow(flowToSync, { useBaseApi: true })
											.then(onSyncSuccess)
											.catch(onSyncError);
									});
							})
							.catch(() => {
								this.setState({
									error: 'Unknown error occurred. Code: RES_PARSE_ERR.',
								});
							});
					} else {
						if (response.status === 422) {
							response.json().then(responseJson => {
								const errorCode =
									responseJson && responseJson.error && responseJson.error.code;
								if (errorCode === 'assessment-different') {
									// TODO: what if user was attempting it from another system
									// wtf - this is not handled!
									// submit old assessment. but for now just
									const { flow, answerSheet } = this.getAnswerSheet(responseJson.core);

									fetch(`${URLS.backendAssessment}/submit`, {
										method: 'POST',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json',
										},
										credentials: 'include',
										body: JSON.stringify({
											assessmentId: liveTestId,
											response: answerSheet,
											flow,
											sEvent: 'assessment',
										}),
									})
										.then(res => res.json())
										.then(result => {
											localStorage.removeItem('answerSheet');
											localStorage.removeItem('flow');
											localStorage.removeItem('startTime');
											localStorage.removeItem('questionStartTime');
											this.initialize();
										});
								} else if (errorCode === 'assessment-available-only-for-premium') {
									this.setState({ onlyForPremium: true });
								} else if (errorCode === 'assessment-already-attempted') {
									this.setState({ alreadyAttempted: true });
								} else {
									this.setState({
										error: "Some error occurred. Maybe this assessment doesn't exist.",
									});
								}
							});
						} else {
							this.setState({ error: 'Some error occurred.' });
						}
					}
				})
				.catch(error => {
					this.setState({ error: 'Some error occurred.' });
				});
		} else {
			//redirect to dashboard
			window.location.pathname = URLS.dashboard;
		}
	};

	getAnswerSheet = assessmentCore => {
		const savedAnswerSheet = JSON.parse(localStorage.getItem('answerSheet'));
		let flow = JSON.parse(localStorage.getItem('flow'));
		if (!flow) {
			flow = [];
		}
		if (!verifyAnswerSheetIntegrity(assessmentCore, savedAnswerSheet)) {
			const answerSheet = {};
			answerSheet._id = assessmentCore._id;
			answerSheet.sections = assessmentCore.sections.map(section => {
				return {
					_id: section._id,
					name: section.name,
					total_questions: section.questions.length,
					questions: section.questions.map(question => ({
						_id: question._id,
						time: 0,
						answer: null,
						state: 0,
					})),
				};
			});
			return { flow, answerSheet };
		} else {
			return { flow, answerSheet: savedAnswerSheet };
		}
	};

	render() {
		const {
			test,
			wrapper,
			flow,
			startTime,
			offset,
			liveTestId,
			onlyForPremium,
			alreadyAttempted,
			error,
		} = this.state;
		const { redirectToProfileCompletion } = this.props;

		if (redirectToProfileCompletion) {
			return (
				<Redirect
					to={`${URLS.completeProfile}?next=${encodeURIComponent(
						window.location.href
					)}`}
				/>
			);
		}

		return (
			<div>
				{error ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							paddingTop: '10%',
						}}
					>
						<div style={{ marginBottom: 12, color: '#fe1a1a' }}>{error}</div>
						<div>
							<Button type="primary" onClick={this.initialize}>
								Try again
							</Button>
						</div>
					</div>
				) : test ? (
					<Switch>
						<PropsRoute
							path={URLS.liveTest}
							component={LiveTest}
							id={liveTestId}
							test={test}
							wrapper={wrapper}
							flow={flow}
							duration={test.duration}
							startTime={startTime}
							offset={offset}
						/>
					</Switch>
				) : onlyForPremium ? (
					<div className="loader-image-wrapper">Only For Premium Users</div>
				) : alreadyAttempted ? (
					<AlreadyAttempted liveTestId={liveTestId} />
				) : (
					<div className="loader-image-wrapper">
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Spin
								indicator={<Loading3QuartersOutlined spin style={{ fontSize: 36 }} />}
							/>
							<div style={{ fontSize: 20, marginTop: 12 }}>Just a moment...</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const EnsureSupergroup = props => {
	return props.isSupergroupDataFetched ? (
		<TestWrapper {...props} />
	) : (
		<div className="loader-image-wrapper">
			<Spin indicator={antIcon} />
		</div>
	);
};

const mapStateToProps = state => {
	const {
		api: { UserData: userData },
	} = state;
	const currentSupergroupId = localStorage.getItem('currentSupergroup');
	const allSuperGroups = state.api.SuperGroups;
	let currentSupergroup;
	try {
		state.api.SuperGroups.forEach(superGroup => {
			if (currentSupergroupId === superGroup._id) {
				currentSupergroup = superGroup;
			}
		});
	} catch (e) {}

	return {
		isSupergroupDataFetched: !!currentSupergroup,
		redirectToProfileCompletion: !isAccountCreationCompleted(
			userData,
			currentSupergroupId,
			allSuperGroups
		),
	};
};

export default connect(mapStateToProps, {
	autoUpdateFlowAsync,
	initializeAssessment,
})(EnsureSupergroup);
