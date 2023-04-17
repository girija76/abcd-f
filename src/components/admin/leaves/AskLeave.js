import {
	DatePicker,
	Form,
	Modal,
	Button,
	Select,
	Badge,
	Input,
	message,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import { URLS } from 'components/urls';
import React from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsPlusLg } from 'react-icons/bs';
import { axiosCfg, clientId } from 'utils/config';

const { useForm } = Form;
const { Option } = Select;

export const AskLeave = ({ setReload }) => {
	const [leaveForm] = useForm();
	const [showLeaveModal, setShowLeaveModal] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const onFinish = async formData => {
		setLoading(true);
		await axios
			.post(URLS.backendLeaves + '/request-leave', formData, axiosCfg)
			.then(res => {
				if (res.data.success === true) {
					message.success('Leave is requested! Please wait for response');
					leaveForm.resetFields();
					setReload(true);
					setShowLeaveModal(false);
				} else {
					message.error(res.data.msg);
				}
			})
			.catch(err => console.log(err));
		setLoading(false);
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'end',
					margin: '8px 5px',
				}}
			>
				<Button
					type="primary"
					style={{ display: 'flex', alignItems: 'center' }}
					icon={<BsPlusLg style={{ marginRight: 6 }} />}
					onClick={() => setShowLeaveModal(true)}
				>
					Add Leave
				</Button>
				<Button
					type="primary"
					style={{ display: 'flex', alignItems: 'center', margin: '0 1rem' }}
					icon={<BiRefresh style={{ marginRight: 6 }} />}
					onClick={() => setReload(true)}
				>
					Refresh
				</Button>
			</div>
			<Modal
				onCancel={() => setShowLeaveModal(false)}
				okText="Request Leave"
				okButtonProps={{ loading }}
				onOk={() => leaveForm.submit()}
				visible={showLeaveModal}
				title={
					<Title level={5} style={{}}>
						Request Leave
					</Title>
				}
			>
				<Form
					form={leaveForm}
					colon
					layout="vertical"
					onFinish={onFinish}
					style={{ width: '100%' }}
				>
					<Form.Item
						name="onDate"
						label="Date"
						rules={[
							{
								required: true,
								message: 'Please select date of the leave',
							},
						]}
					>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name="type"
						label="Leave type"
						rules={[
							{
								required: true,
								message: 'Please Type of leave',
							},
						]}
					>
						<Select initialValue="casual">
							<Option value="casual">
								<Badge
									style={{ display: 'flex', alignItems: 'center' }}
									color="green"
									text="Casual (Paid)"
								/>
							</Option>
							<Option value="medical">
								<Badge
									style={{ display: 'flex', alignItems: 'center' }}
									color="yellow"
									text="Medical"
								/>
							</Option>
							<Option value="unpaid">
								<Badge
									style={{ display: 'flex', alignItems: 'center' }}
									color="red"
									text="UnPaid"
								/>
							</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="For"
						name="fullDay"
						rules={[
							{
								required: true,
								message: 'Please select Leave for',
							},
						]}
					>
						<Select initialValue={true}>
							<Option value={true}>Full-Day</Option>
							<Option value={false}>Half-Day</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{
								required: true,
								message: 'Leave Description is required',
							},
						]}
					>
						<Input.TextArea
							placeholder="Valid Leave Description"
							rows={3}
							style={{ resize: 'none' }}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
