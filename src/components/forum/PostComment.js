import React, { useCallback, useState } from 'react';
import { Button, Form, Input } from 'antd';
import createForumApi from 'apis/forum';

const forumApi = createForumApi();

function PostComment({ item, itemType, onComplete }) {
	const [isSubmittting, setIsSubmitting] = useState(false);
	const [form] = Form.useForm();
	const handleSubmit = useCallback(
		formValues => {
			setIsSubmitting(true);
			forumApi
				.postComment(item, itemType, formValues.text)
				.then(() => {
					form.resetFields(['text']);
					onComplete();
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		},
		[form, item, itemType, onComplete]
	);
	return (
		<Form onFinish={handleSubmit} form={form}>
			<Form.Item name="text" style={{ marginBottom: 6 }}>
				<Input placeholder="Type you comment..." type="text" />
			</Form.Item>
			<Button type="primary" htmlType="submit" disabled={isSubmittting}>
				Post your comment
			</Button>
		</Form>
	);
}

export default PostComment;
