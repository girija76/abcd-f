import React from 'react';
import QuestionLevel from './QuestionLevel.js';
import Spin from 'antd/es/spin';
import { URLS } from '../urls.js';

import { LoadingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { createMapSubmissionMetaSection } from 'utils/assessment';
import { connect } from 'react-redux';

export class QuestionLevelWrapper extends React.Component {
	constructor(props) {
		super(props);
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		const from_ = params.get('from');
		let fetchSubmission = true;
		let submission = {};
		if (from_ === 'storage') {
			const sd = localStorage.getItem(`s-${id}`);
			submission = sd ? JSON.parse(sd) : {};
			if (submission) {
				fetchSubmission = false;
			}
		}

		this.state = {
			answerSheet: {},
			assessmentCore: {},
			assessmentWrapper: {},
			coreAnalysis: {},
			wrapperAnalysis: {},
			id,
			fetchSubmission,
		};

		this.fetchAnswerSheet(id, fetchSubmission);
	}

	refresh = () => {
		const { id, fetchSubmission } = this.state;
		this.setState({ answerSheet: {} });
		this.fetchAnswerSheet(id, fetchSubmission);
	};

	fetchAnswerSheet = (id, fetchSubmission) => {
		let toSearch = { fetchSubmission, submissionId: id };
		const params = new URLSearchParams(window.location.search);
		const { UserData } = this.props;
		if (params.get('user')) {
			toSearch.user = params.get('user');
		} else {
			toSearch.user = UserData._id;
		}
		fetch(URLS.backendAssessment + '/getGrades', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(toSearch),
		})
			.then(res => res.json())
			.then(result => {
				if (!result.wrapperAnalysis.bonus) result.wrapperAnalysis.bonus = {};
				const { bestQuestionGroupChoices, assessmentCore, submission } = result;
				const submissionMetaSectionModified = submission.meta.sections.map(
					createMapSubmissionMetaSection(
						assessmentCore,
						bestQuestionGroupChoices,
						submission
					)
				);
				const modifiedSubmission = {
					...submission,
					meta: {
						...submission.meta,
						sections: submissionMetaSectionModified,
					},
				};
				this.setState({
					answerSheet: modifiedSubmission,
					assessmentCore: assessmentCore,
					assessmentWrapper: result.assessmentWrapper,
					coreAnalysis: result.coreAnalysis,
					wrapperAnalysis: result.wrapperAnalysis,
					bestQuestionGroupChoices: bestQuestionGroupChoices,
				});
			})
			.catch(() => {
				Modal.error({
					title: 'Some error occurred, please retry!',
					onOk: this.refresh,
					okText: 'Try again',
				});
			});
	};

	render() {
		let {
			answerSheet,
			id,
			assessmentCore,
			assessmentWrapper,
			coreAnalysis,
			wrapperAnalysis,
		} = this.state;
		return (
			<div style={{ background: '#fff' }}>
				{Object.keys(answerSheet).length ? (
					<QuestionLevel
						id={id}
						answerSheet={answerSheet}
						assessmentCore={assessmentCore}
						assessmentWrapper={assessmentWrapper}
						coreAnalysis={coreAnalysis}
						wrapperAnalysis={wrapperAnalysis}
					/>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100vw',
							height: '70vh',
						}}
					>
						<Spin indicator={<LoadingOutlined style={{ fontSize: '3rem' }} spin />} />
						<div style={{ marginTop: '1rem' }}>Just a second...</div>
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

export default connect(mapStateToProps)(QuestionLevelWrapper);
