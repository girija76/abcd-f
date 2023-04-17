import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import feedbackApi from 'apis/feedbackForm';
import { useQuery } from 'react-query';
import {
	BiAngry,
	BiHappyBeaming,
	BiHappyHeartEyes,
	BiSad,
	BiSmile,
} from 'react-icons/bi';
import { get, isEmpty } from 'lodash';
import './style.scss';
import classNames from 'classnames';

const { Text, Title } = Typography;

const ratingsWithIcon = [
	{
		value: 1,
		icon: <BiAngry />,
		color: '#ec4646',
		text: 'Very bad',
		selectionBackground: 'rgb(236,70,70,.17)',
	},
	{
		value: 2,
		icon: <BiSad />,
		color: '#ff7f0e',
		text: 'Bad',
		selectionBackground: 'rgba(255, 127, 14,.17)',
	},
	{
		value: 3,
		icon: <BiSmile />,
		color: '#808080',
		selectionBackground: '#8080802b',
		text: 'Okayish',
	},
	{
		value: 4,
		icon: <BiHappyBeaming />,
		color: '#9bbb5d',
		text: 'Good',
		selectionBackground: '#9bbb5d2b',
	},
	{
		value: 5,
		icon: <BiHappyHeartEyes />,
		color: 'green',
		text: 'Awesome',
		selectionBackground: '#0080002b',
	},
].reverse();
function Rating({ value: selectedValue, onChange }) {
	return (
		<Space direction="horizontal" style={{ flexWrap: 'wrap' }}>
			{ratingsWithIcon.map(({ color, icon, selectionBackground, text, value }) => {
				const isSelected = value === selectedValue;
				return (
					<button
						style={{
							background: isSelected ? selectionBackground : '',
							color,
						}}
						className={classNames('feedback-form-rating-button', {
							'is-selected': isSelected,
						})}
						onClick={() => onChange(value)}
					>
						<div>{icon}</div>
						<div style={{ fontSize: '.3em' }}>{text}</div>
					</button>
				);
			})}
		</Space>
	);
}

function FeedbackQuestion({
	_id,
	text,
	disableTypedAnswer,
	disableRating,
	onChange,
	response,
}) {
	const setTypedText = text => {
		onChange({ ...(response || {}), typedAnswer: text });
	};
	const setRating = rating => {
		onChange({ ...(response || {}), rating });
	};
	const rating = get(response, ['rating'], null);
	const typedAnswer = get(response, ['typedAnswer'], '');
	return (
		<div>
			<Title level={4} style={{ padding: 0, marginBottom: 0 }}>
				{text}
			</Title>
			{!disableRating ? <Rating value={rating} onChange={setRating} /> : null}
			{!disableTypedAnswer ? (
				<Input.TextArea
					style={{ minHeight: 120, marginTop: !disableRating ? 8 : 0 }}
					placeholder="Type your feedback here..."
					value={typedAnswer}
					onChange={e => setTypedText(e.target.value)}
				/>
			) : null}
		</div>
	);
}

function FeedbackFormCore({ formWrapper, otherRefs }) {
	const questionItems = useMemo(
		() => get(formWrapper, ['form', 'questionItems'], []),
		[formWrapper]
	);
	const [isPartialAnswerSaved, setIsPartialAnswerSaved] = useState(false);
	const canShowOnlyFirstRating = useMemo(
		() =>
			!questionItems[0].disableRating &&
			(!questionItems[0].disableTypedAnswer || questionItems.length > 1),
		[questionItems]
	);
	const [showOnlyFirstRating, setShowOnlyFirstRating] = useState(
		canShowOnlyFirstRating
	);
	const [responseByQuestionItemId, setResponseByQuestionItemId] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const setResponse = (questionId, response) => {
		setResponseByQuestionItemId({
			...responseByQuestionItemId,
			[questionId]: response,
		});
		if (showOnlyFirstRating) {
			setShowOnlyFirstRating(false);
			handleSubmit(true);
		}
	};
	const handleSubmit = useCallback(
		isPartialSubmission => {
			setIsSubmitting(true);
			feedbackApi
				.submitResponse({
					responseByQuestionItemId,
					formWrapper: formWrapper._id,
					otherRefs,
				})
				.then(() => {
					if (!isPartialSubmission) {
						setIsSubmitted(true);
					} else {
						setIsPartialAnswerSaved(true);
					}
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		},
		[formWrapper._id, otherRefs, responseByQuestionItemId]
	);
	if (isSubmitted) {
		return (
			<Text style={{ padding: 12 }} type="success">
				Thank you for your feedback. Your feedback is important to us.
			</Text>
		);
	}
	return (
		<div style={{ padding: 12, backgroundColor: '#fafafa' }}>
			<Space
				direction="vertical"
				size="large"
				style={{ display: 'flex', maxWidth: 600 }}
			>
				{formWrapper.form.questionItems.map((question, index) => {
					if (showOnlyFirstRating && index > 0) {
						return null;
					}
					return (
						<FeedbackQuestion
							key={question._id}
							{...question}
							disableTypedAnswer={
								showOnlyFirstRating ? true : question.disableTypedAnswer
							}
							response={get(responseByQuestionItemId, question._id)}
							onChange={response => setResponse(question._id, response)}
						/>
					);
				})}
				{!showOnlyFirstRating ? (
					<div>
						<Button
							loading={isSubmitting}
							onClick={() => handleSubmit(false)}
							type="primary"
						>
							Submit Feedback
						</Button>
					</div>
				) : null}
			</Space>
		</div>
	);
}

function FeedbackForm({ item, itemRef, formFor, otherRefs }) {
	const { data: feedbackFormWrapper, isSuccess } = useQuery(
		['get-feedback-form', item, itemRef, formFor, otherRefs],
		() => feedbackApi.getFormWrapper({ item, itemRef, formFor, otherRefs }),
		{ staleTime: 6e5 }
	);

	if (isSuccess && !isEmpty(feedbackFormWrapper)) {
		return (
			<FeedbackFormCore otherRefs={otherRefs} formWrapper={feedbackFormWrapper} />
		);
	}
	return null;
}

export default FeedbackForm;
