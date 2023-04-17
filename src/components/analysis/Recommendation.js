import React from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import { withRouter } from 'react-router-dom';
import { URLS } from '../urls';
import { COLORS } from '../colors';

class Recommendation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmation: false,
			category: '',
			key: '',
			subtopic: '',
			difficulty: '',
		};
	}

	newSession = () => {
		localStorage.removeItem('lastPracticeQuestion');
		const { subtopic, difficulty } = this.state;
		if ((subtopic && difficulty) || (!subtopic && !difficulty)) {
		} else if (subtopic) {
			fetch(`${URLS.backendUsers}/startSession`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ category: 'topic', key: subtopic, force: true }),
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.setState({ confirmation: false });
						this.props.history.push(
							`${URLS.practiceQuestions}/${responseJson.sessionId}`
						);
					});
				}
			});
		} else {
			fetch(`${URLS.backendUsers}/startSession`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					category: 'difficulty',
					key: difficulty,
					force: true,
				}),
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.setState({ confirmation: false });
						this.props.history.push(
							`${URLS.practiceQuestions}/${responseJson.sessionId}`
						);
					});
				}
			});
		}
	};

	resumeSession = () => {
		fetch(`${URLS.backendUsers}/resumeSession`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					this.setState({ confirmation: false });
					this.props.history.push(
						`${URLS.practiceQuestions}/${responseJson.session}`
					);
				});
			}
		});
	};

	gotoPractice = () => {
		// disable if no more questions!! give reco accordingly...
		const {
			recommendation: { id },
		} = this.props;
		if (id === 'easy' || id === 'medium' || id === 'hard') {
			fetch(`${URLS.backendUsers}/startSession`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ category: 'difficulty', key: id, force: false }),
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.props.history.push(
							`${URLS.practiceQuestions}/${responseJson.sessionId}`
						);
					});
				} else {
					response.json().then(responseJson => {
						const e = responseJson.error.code.split('/');
						if (e[0] === 'session-live') {
							this.setState({
								confirmation: true,
								category: e[1].split('-')[0],
								key: e[1].split('-')[1],
								difficulty: id,
								subtopic: '',
							});
						}
					});
				}
			});
		} else {
			fetch(`${URLS.backendUsers}/startSession`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ category: 'topic', key: id, force: false }),
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.props.history.push(
							`${URLS.practiceQuestions}/${responseJson.sessionId}`
						);
					});
				} else {
					response.json().then(responseJson => {
						const e = responseJson.error.code.split('/');
						if (e[0] === 'session-live') {
							this.setState({
								confirmation: true,
								category: e[1].split('-')[0],
								key: e[1].split('-')[1],
								subtopic: id,
								difficulty: '',
							});
						}
					});
				}
			});
		}
	};

	render() {
		const { confirmation, category, key } = this.state;
		const {
			recommendation: { text },
		} = this.props;
		return (
			<Card
				headStyle={{
					fontSize: 18,
					fontWeight: 'bold',
					padding: '0 24px',
					borderBottom: 0,
					color: COLORS.text,
				}}
				bodyStyle={{
					backgroundColor: COLORS.background,
					margin: 0,
					borderRadius: 4,
					display: 'flex',
					alignItems: 'center',
				}}
				style={{ marginBottom: 24 }}
			>
				<div style={{ flex: 1 }}>{text}</div>
				<Button
					style={{
						borderRadius: '1000px',
						width: 160,
						height: 45,
						fontWeight: 'bold',
					}}
					onClick={this.gotoPractice}
					size="large"
				>
					Practice Now
				</Button>
				<Modal
					title="Resume Session"
					visible={confirmation}
					onCancel={() => {
						this.setState({ confirmation: false });
					}}
					footer={null}
					style={{ width: 840 }}
				>
					You already have a practice session running. Do you want to resume that
					session?
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: 4,
							paddingTop: 12,
						}}
					>
						<Button
							type="primary"
							onClick={this.resumeSession}
							style={{ margin: '0px 10px' }}
						>
							Resume Session
						</Button>
						<Button onClick={this.newSession} style={{ marginLeft: 10 }}>
							Start New Session
						</Button>
					</div>
				</Modal>
			</Card>
		);
	}
}

export default withRouter(Recommendation);
