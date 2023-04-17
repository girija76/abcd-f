import { Card, Col, Divider, message, Modal, Popover, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import Loading from 'components/extra/Loading';
import LazyLoadImageNativeDetector from 'components/LazyLoadImage';
import { URLS } from 'components/urls';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useEffect, useCallback, useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { MdApproval, MdClose } from 'react-icons/md';
import { axiosCfg } from 'utils/config';

const ApproveModal = ({ data, show, onClose, action, onReload }) => {
	const [loading, setLoading] = useState(false);
	const onOk = async () => {
		setLoading(true);
		await axios
			.get(`${URLS.backendLeaves}/react/${data._id}?action=${action}`, axiosCfg)
			.then(res => {
				if (res.data.success) {
					onReload({ peopleOnLeave: true, leaveRequest: true });
					message.success(res.data.msg);
					onClose();
				} else {
					message.error(res.data.msg);
				}
			});
		setLoading(false);
	};
	return (
		<Modal visible={show} onCancel={onClose} onOk={onOk}>
			<p>
				Do you want to {action} the request for {data.user.name} (
				{dayjs(data.onDate).format('DD MMM YYYY')})
			</p>
		</Modal>
	);
};

export const LeaveRequests = ({ reload, onReload }) => {
	const [loading, setLoading] = useState(false);
	const [requests, setRequests] = useState([]);
	const [approveModal, setApproveModal] = useState(false);
	const [modalData, setModalData] = useState();
	const [action, setAction] = useState();

	const getData = useCallback(async () => {
		setLoading(true);
		await axios
			.post(URLS.backendLeaves + '/listRequests', {}, axiosCfg)
			.then(res => {
				if (!res.data.success) {
					setRequests(res.data);
				} else {
					message.error('Error while loading leaves');
				}
			});
		setLoading(false);
	}, [setRequests]);

	const onApproveClick = (data, action) => {
		setModalData(data);
		setAction(action);
		setApproveModal(true);
	};

	useEffect(() => {
		if (reload.leaveRequest) {
			getData();
			onReload({ ...reload, leaveRequest: false });
		}
	}, [getData, reload]);

	return (
		<div style={{ padding: 0, margin: 0 }}>
			{approveModal && (action === 'grant' || action === 'reject') && (
				<ApproveModal
					data={modalData}
					show={approveModal}
					onClose={() => {
						setApproveModal(false);
					}}
					action={action}
					onReload={onReload}
				/>
			)}
			{requests.length > 0 ? (
				<Card style={{ margin: 5 }}>
					<Title style={{ marginBottom: '2rem' }} level={3}>
						Leave Requests
					</Title>
					{loading ? (
						<Loading simple />
					) : (
						<Row>
							{requests.map((leave, key) => (
								<Col xs={12} lg={6} xl={6} xxl={4} key={key}>
									<Card style={{ margin: '0 1rem', padding: '0' }}>
										<p style={{ textAlign: 'right' }}>
											<Popover
												title="Leave Description"
												content={<p>{leave.description}</p>}
											>
												<BsInfoCircle />
											</Popover>
										</p>
										<LazyLoadImageNativeDetector
											src={leave.user.dp}
											style={{ padding: 0 }}
										/>
										<Divider />
										<p
											style={{
												textAlign: 'center',
												padding: 0,
												margin: 0,
												fontWeight: 600,
											}}
										>
											{leave.user.name} (
											{capitalize(leave.leaveType) +
												' - ' +
												(leave.fullDay ? 'Full' : 'Half')}
											) {dayjs(leave.onDate).format('MMM DD, YYYY')}
										</p>
										<div
											style={{
												display: 'flex',
												marginTop: '.5rem',
												marginBottom: '0',
											}}
										>
											<p
												style={{
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: '100%',
													fontWeight: 600,
													color: 'green',
												}}
												onClick={() => {
													onApproveClick(leave, 'grant');
												}}
											>
												<MdApproval /> &nbsp;Approve
											</p>
											<p
												style={{
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: '100%',
													fontWeight: 600,
													color: 'red',
												}}
												onClick={() => {
													onApproveClick(leave, 'reject');
												}}
											>
												<MdClose /> &nbsp;Decline
											</p>
										</div>
									</Card>
								</Col>
							))}
						</Row>
					)}
				</Card>
			) : (
				<Card style={{ margin: 5 }}>
					<Title style={{ textAlign: 'center', margin: 0 }} level={4}>
						No Leave requests are pending...
					</Title>
				</Card>
			)}
		</div>
	);
};
