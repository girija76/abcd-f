import { Form, Input, message, Modal } from 'antd';
import axios from 'axios';
import Loading from 'components/extra/Loading';
import { URLS } from 'components/urls';
import { toNumber } from 'lodash';
import React from 'react';
import { Phase } from 'utils/selector';
import { Subgroup } from 'utils/subgroups';

const { useForm } = Form;

export const AddUser = ({ isAdding, onCancel, role, refresh }) => {
	const [form] = useForm();
	const [isLoading, setIsLoading] = React.useState(false);
	const [phases, setPhases] = React.useState([]);
	const [subgroups, setSubgroups] = React.useState([]);

	const [selectedPhase, setSelectedPhase] = React.useState();
	const [selectedSubgroup, setSelectedSubgroup] = React.useState();
	const [selectedSupergroup, setSelectedSupergroup] = React.useState();

	const getPhases = React.useCallback(async () => {
		axios
			.get(`${URLS.backendClients}/phases-with-subgroups`, {
				withCredentials: true,
				headers: {
					authrization: `Token ${window.localStorage.getItem('token')}`,
				},
			})
			.then(phases => {
				if (phases.data && phases.data.phases) {
					setPhases(phases.data.phases);
				} else {
					message.error('Error while Loading phases');
				}
			})
			.catch(err => {
				message.error('Error while Loading phases');
			});
	}, [setPhases]);

	React.useEffect(() => {
		getPhases();
	}, [getPhases]);

	const onPhaseChange = value => {
		setSelectedPhase(value);
		setSelectedSubgroup(undefined);
		let ph = phases.filter(phase => phase._id === value);
		if (ph[0] && ph[0].subgroups) {
			setSubgroups(ph[0].subgroups);
		} else {
			message.error('Error while fetching subgroup, please refresh page');
		}
	};

	const onFinish = async formData => {
		setIsLoading(true);
		formData.mobileMobile = toNumber(form.mobileNumber);
		if (isNaN(formData.mobileNumber)) {
			message.error('Please enter valid mobile');
			setIsLoading(false);
			return;
		}
		await axios
			.post(
				URLS.backendQuery + '/createSingleUser',
				{
					user: {
						...formData,
						role,
					},
					subgroup: selectedSubgroup,
					phase: selectedPhase,
				},
				{
					withCredentials: true,
					headers: {
						authorization: `Token ${window.localStorage.getItem('token')}`,
					},
				}
			)
			.then(res => {
				if (res.data.success) {
					message.success('User added successfully');
					setSelectedPhase(undefined);
					setSelectedSubgroup(undefined);
					refresh();
				} else {
					message.error('Error while adding user');
				}
			})
			.catch(err => message.error('Error while adding user'));
		form.resetFields();
		setIsLoading(false);
	};

	return (
		<Modal
			visible={isAdding}
			onCancel={onCancel}
			okText={
				role === 'mentor'
					? 'Add Teacher'
					: role === 'parent'
					? 'Add Parent'
					: 'Add User'
			}
			onOk={() => form.submit()}
		>
			{isLoading && <Loading simple text="Wait, we are adding teacher" />}
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item
					name="name"
					label="Name"
					rules={[
						{
							required: true,
							message: 'This field is required...',
						},
					]}
				>
					<Input placeholder="Enter Name" />
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{
							required: true,
							message: 'Please enter valid email...',
							type: 'email',
						},
					]}
				>
					<Input placeholder="Enter Email" />
				</Form.Item>
				<Form.Item
					name="username"
					label="Username"
					rules={[
						{
							required: true,
							message: 'Username is required...',
							max: 24,
						},
					]}
				>
					<Input placeholder="Enter Username" />
				</Form.Item>
				<Form.Item
					name="mobileNumber"
					label="Mobile"
					rules={[
						{
							required: true,
							message: 'Please enter valid mobile number...',
							min: 10,
							max: 10,
						},
					]}
				>
					<Input placeholder="Enter Mobile" />
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={[
						{
							required: true,
							message: 'Password must be 6-32 characters long...',
							min: 6,
							max: 32,
						},
					]}
				>
					<Input placeholder="Enter password" />
				</Form.Item>
				<Form.Item name="phase" label="Phase" rules={[{ required: true }]}>
					<Phase
						Array={phases}
						selected={selectedPhase}
						onChange={onPhaseChange}
						placeholder="Please select Phase"
					/>
				</Form.Item>
				<Form.Item name="subgroup" label="Subgroup" rules={[{ required: true }]}>
					<Subgroup
						Array={subgroups}
						selected={selectedSubgroup}
						onChange={value => {
							setSelectedSubgroup(value);
						}}
						placeholder="Please select Subgroup"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};
