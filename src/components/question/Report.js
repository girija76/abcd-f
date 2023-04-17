import React, { useState } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import { report as reportQuestion } from 'actions/question';
import './report.scss';

import { LikeOutlined } from '@ant-design/icons';

const Option = ({ id, name, label, isSelected, onSelect }) => {
	return (
		<label
			className={classnames('report-question-option', {
				'is-selected': isSelected,
			})}
			htmlFor={id}
		>
			<span className="input-container">
				<input
					name={name}
					id={id}
					type="radio"
					checked={!!isSelected}
					onChange={onSelect}
				/>
			</span>
			<span>{label}</span>
		</label>
	);
};
const ReportQuestion = ({
	isOpen,
	questionId,
	onRequestClose,
	reportQuestion,
}) => {
	const [submitState, setSubmitState] = useState('');
	const [error, setError] = useState(null);
	const [detail, setDetail] = useState('');
	const [selectedType, setSelectedType] = useState(null);
	const className = '';
	const options = [
		{ label: 'Question not from topic', type: 0, identifier: 'topic-incorrect' },
		{ label: 'Question not clear', type: 1, identifier: 'question-unclear' },
		{ label: 'Incorrect answer', type: 2, identifier: 'answer-incorrect' },
		{ label: 'Other', type: 9, identifier: 'other' },
	];
	const handleDetailChange = e => {
		setDetail(e.target.value);
	};

	const isSubmitDisabled =
		selectedType === null ||
		(selectedType === 9 && detail.trim().length === 0) ||
		submitState === 'submitting' ||
		submitState === 'submitted';

	const handleSubmit = () => {
		if (isSubmitDisabled) return;
		setSubmitState('submitting');
		reportQuestion({ type: selectedType, detail })
			.then(() => {
				setSubmitState('submitted');
				setTimeout(() => {
					onRequestClose();
				}, 1500);
			})
			.catch(err => {
				setSubmitState('submit-failed');
			});
	};
	return (
		<ReactModal
			className={`report-question-modal-content`}
			overlayClassName={`report-question-modal-overlay`}
			isOpen={isOpen}
			onRequestClose={onRequestClose}
		>
			{submitState === 'submitted' ? (
				<div className="body">
					<div className="thank-you">
						<div>
							<LikeOutlined style={{ fontSize: '30px' }} />
						</div>
						<h3>Thank You</h3>
						<div>Your feedback has been received.</div>
					</div>
				</div>
			) : (
				<>
					<h3 className="heading">Report question</h3>
					<div className="body">
						<div className="report-question-option-list">
							{options.map(option => {
								const id = `${option.type}-${option.identifier}`;
								return (
									<Option
										name={`report-${questionId}`}
										key={id}
										id={id}
										label={option.label}
										isSelected={option.type === selectedType}
										onSelect={() => setSelectedType(option.type)}
									/>
								);
							})}
						</div>
						{selectedType !== null ? (
							<div className="report-question-detail-container">
								<label htmlFor={`report-question-${questionId}-detail`}>
									Provide additional details (
									{selectedType === 9 ? 'required' : 'optional'})
								</label>
								<textarea
									id={`report-question-${questionId}-detail`}
									className="detail"
									value={detail}
									onChange={handleDetailChange}
								/>
							</div>
						) : null}
					</div>
					<div className="footer">
						<button onClick={onRequestClose} className="cancel-button">
							Cancel
						</button>
						<button
							disabled={isSubmitDisabled}
							onClick={handleSubmit}
							className="confirm-button"
						>
							Report
						</button>
					</div>
				</>
			)}
		</ReactModal>
	);
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { questionId } = ownProps;
	return {
		...ownProps,
		reportQuestion: report => dispatchProps.reportQuestion(questionId, report),
	};
};

export default connect(
	null,
	{ reportQuestion },
	mergeProps
)(ReportQuestion);
