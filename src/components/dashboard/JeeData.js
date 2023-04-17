import { EditOutlined } from '@ant-design/icons';
import { Form, Input, Modal, notification, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import userApi from 'apis/user';
import { get } from 'lodash';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { userSelector } from 'selectors/user';
import { logout } from 'utils/user';

const phasesToShow = [
	// vijeta
	'61efd8e9e902c90cf2d38fac',
	'620736d03357e20d01040811',
	'6221d827851a680d4a026138',
	'626242e46d1aba1468e2823b',
	'62f7394e3a454c2081df4485',
	// vishesh
	'62749d9769e36c3c4e663800',
	'627cb7b98316a427aad2c027',
	'628cc59f89a50e3b0fbf5624',
	'62a4470d7a6b3e3155bc11f3',
	'62a44722e42abe0ec1de1e3b',
	'62c7dac7f2a1910ea4fd35e8',
	// vijay
	'62c7e9e18ccec4209a8ed4c3',
	'62ed314604df0d1511005bfb',
	'62ed31f51f993f3b5b11eb2f',
	'631e11a2e100bf1129ec2674',
	'63246245cd6ab70ec628ca29',
	// vikrant
	'633848547ea3a343279058a0',
	'6340040bc82c982091ebed30',
	'63636266b2bb671226aa3da4',
	// vyapak
	'618cb7ce4d209432245afb00',
	'61977281725f160cbee33f1f',
	'61b18a010e27e90c9f29de88',
	'61c6db80c8901a0ead66859c',
	'62f3498c5286a01d871a1fe7',
	// vishwaas
	'61e28851bb61c70cf79b10d7',
	'6207367be6ab370cfc189c11',
	'62355fa09108780f5989ea46',
	'62355fea516ff70f52dfc11a',
	'625a5b0cde75c80f55c7d87a',
];

export const UpdateJeeData = ({}) => {
	const [jeeData, setJeeData] = useState({});
	const [loading, setLoading] = useState(false);

	const [form] = useForm();
	const UserData = useSelector(userSelector);

	useEffect(() => {
		setVisible(
			phasesToShow.includes(
				get(UserData, 'subscriptions[0].subgroups[0].phases[0].phase._id', null)
			) &&
				(!get(jeeData, 'studentName', null) ||
					!get(jeeData, 'fatherName', null) ||
					!get(jeeData, 'motherName', null) ||
					!get(jeeData, 'instituteRollNo', null) ||
					!get(jeeData, 'jeeMainsRegNo', null) ||
					!get(jeeData, 'jeeMainsRollNo', null) ||
					!get(jeeData, 'jeeMainsDOB', null) ||
					!get(jeeData, 'jeeMainsMobile', null) ||
					!get(jeeData, 'jeeMainsEmail', null))
		);
	}, [jeeData]);

	const [visible, setVisible] = useState(false);

	const onFinish = formData => {
		setLoading(true);
		userApi
			.updateJeeData(UserData._id, formData)
			.then(res => {
				if (res.success) {
					notification.success({ message: 'Successfully updated!' });
					onCancel();
				} else {
					notification.warning({ message: res.msg });
				}
			})
			.catch(err => notification.error({ message: 'Error while reaching server' }))
			.finally(() => setLoading(false));
	};

	const onCancel = () => {
		setLoading(false);
		setVisible(false);
		setJeeData({});
		window.location.reload();
	};

	useEffect(() => {
		if (visible) {
			setLoading(true);
			userApi
				.getJeeData(UserData._id)
				.then(res => {
					if (res.success) {
						setJeeData(res.jeeData);
					} else {
						notification.warning({ message: res.msg });
					}
				})
				.catch(err => {
					notification.error({ message: 'Error while reaching server!' });
				})
				.finally(() => setLoading(false));
		}
	}, [visible]);

	return (
		<Modal
			visible={visible}
			title="Update JEE Data"
			onOk={() => form.submit()}
			okText="Update"
			okButtonProps={{ loading, icon: <EditOutlined /> }}
			centered
			closable={false}
			cancelButtonProps={{ style: { display: 'none' } }}
		>
			{loading ? (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Spin />
				</div>
			) : (
				<Form form={form} onFinish={onFinish} layout="vertical">
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<button
							data-ga-on="click,auxclick"
							data-ga-event-action="click"
							data-ga-event-category="Topbar"
							data-ga-event-label="Logout"
							className="topbar-account-dropdown-button"
							style={{ width: 'auto' }}
							onClick={() => {
								logout();
								onCancel();
							}}
						>
							<span className="text">Sign Out</span>
							<AiOutlineLogout className="icon" />
						</button>
					</div>
					<Form.Item
						label="Student Name"
						name="studentName"
						initialValue={jeeData.studentName}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter Student Name" />
					</Form.Item>
					<Form.Item
						label="Father Name"
						name="fatherName"
						initialValue={jeeData.fatherName}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter Father Name" />
					</Form.Item>
					<Form.Item
						label="Mother Name"
						name="motherName"
						initialValue={jeeData.motherName}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter Mother Name" />
					</Form.Item>
					<Form.Item
						label="Institute Roll no"
						name="instituteRollNo"
						initialValue={jeeData.instituteRollNo || jeeData.username}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter Institute Roll no" />
					</Form.Item>
					<Form.Item
						label="JEE Registration Number"
						name="jeeMainsRegNo"
						initialValue={jeeData.jeeMainsRegNo}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter JEE Mains Reg No" />
					</Form.Item>
					<Form.Item
						label="JEE Mains Roll no"
						name="jeeMainsRollNo"
						initialValue={jeeData.jeeMainsRollNo}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter JEE Mains Roll no" />
					</Form.Item>
					<Form.Item
						label="JEE Mains DOB"
						name="jeeMainsDOB"
						initialValue={jeeData.jeeMainsDOB}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter JEE Mains DOB" />
					</Form.Item>
					<Form.Item
						label="JEE Mains Mobile"
						name="jeeMainsMobile"
						initialValue={jeeData.jeeMainsMobile}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter JEE Mains Mobile" />
					</Form.Item>
					<Form.Item
						label="JEE Mains Email"
						name="jeeMainsEmail"
						initialValue={jeeData.jeeMainsEmail}
						rules={[{ required: true, message: 'This field is required!' }]}
					>
						<Input placeholder="Enter JEE Mains Email" />
					</Form.Item>

					{/* <Form.Item
						label="JEE Advanced Roll no"
						name="jeeAdvancedRollNo"
						initialValue={jeeData.jeeAdvancedRollNo}
					>
						<Input placeholder="Enter JEE Advanced Roll no" />
					</Form.Item>
					<Form.Item
						label="JEE Advanced DOB"
						name="jeeAdvancedDOB"
						initialValue={jeeData.jeeAdvancedDOB}
					>
						<Input placeholder="Enter JEE Advanced DOB" />
					</Form.Item>
					<Form.Item
						label="JEE Advanced Mobile"
						name="jeeAdvancedMobile"
						initialValue={jeeData.jeeAdvancedMobile}
					>
						<Input placeholder="Enter JEE Advanced Mobile" />
					</Form.Item>
					<Form.Item
						label="JEE Advanced Email"
						name="jeeAdvancedEmail"
						initialValue={jeeData.jeeAdvancedEmail}
					>
						<Input placeholder="Enter JEE Advanced Email" />
					</Form.Item> */}
				</Form>
			)}
		</Modal>
	);
};
