import { Badge, Card, Divider, List, message, Popover, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import Loading from 'components/extra/Loading';
import { URLS } from 'components/urls';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { axiosCfg } from 'utils/config';

const getApprovedLeaves = leaves => {
	let total = 0;
	leaves.forEach(leave => {
		if (leave.granted) {
			total += 1;
		}
	});
	return total;
};

const PopoverConfig = ({ arr }) => {
	const approved = arr.filter(val => val.granted === true);
	return (
		<div style={{ textAlign: 'right' }}>
			<Popover
				trigger="click"
				overlayStyle={{ width: window.innerWidth >= 768 ? '400px' : '90vw' }}
				title={
					<Title style={{ margin: '1rem 0' }} level={5}>
						Leaves you taken
					</Title>
				}
				content={
					<List>
						{approved.length > 0 ? (
							approved.map((value, key) => (
								<List.Item key={key}>
									({dayjs(value.onDate).format('MMM DD, YYYY')}) - {value.description}
								</List.Item>
							))
						) : (
							<p>No Leaves Found</p>
						)}
					</List>
				}
			>
				<Tooltip title="Click to get info">
					<HiInformationCircle />
				</Tooltip>
			</Popover>
		</div>
	);
};

export const ListLeaves = ({ reload, setReload }) => {
	const [leaves, setLeaves] = useState({
		casual: [],
		medical: [],
		unpaid: [],
	});
	const [loading, setLoading] = useState(false);

	const getLeaves = React.useCallback(async () => {
		setLoading(true);
		await axios
			.get(`${URLS.backendLeaves}/list`, axiosCfg)
			.then(res => {
				if (res.data.success === false) {
					message.error('Error while fetching leaves');
				} else {
					const temp = {
						casual: [],
						medical: [],
						unpaid: [],
					};
					res.data.forEach(leave => {
						if (leave.leaveType === 'casual') temp.casual.push(leave);
						else if (leave.leaveType === 'medical') temp.medical.push(leave);
						else temp.unpaid.push(leave);
					});
					setLeaves(temp);
				}
			})
			.catch(err => {
				message.error('Error while fetching leaves');
			});
		setLoading(false);
	}, [setLeaves, setLoading]);

	React.useEffect(() => {
		if (reload) {
			getLeaves();
			setReload(false);
		}
	}, [getLeaves, reload]);
	return (
		<>
			{loading ? (
				<Loading simple />
			) : (
				<Card style={{ margin: 5 }}>
					<div style={{ display: 'flex', width: '100%' }}>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<PopoverConfig arr={leaves.casual} />
							<Title level={2} style={{ margin: '.5rem 0' }}>
								{getApprovedLeaves(leaves.casual)} / 10
							</Title>
							<Title level={5} style={{ margin: 0 }}>
								<Badge color="green" text="Casual Leaves(Paid)" />
							</Title>
						</div>
						<Divider
							type="vertical"
							style={{
								height: 'auto',
								backgroundColor: '#dcdae0',
								width: 2,
								margin: '0 15px',
							}}
						/>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<PopoverConfig arr={leaves.medical} />
							<Title level={2} style={{ margin: '.5rem 0' }}>
								{getApprovedLeaves(leaves.medical)} / 10
							</Title>
							<Title level={5} style={{ margin: 0 }}>
								<Badge color="yellow" text="Medical Leaves" />
							</Title>
						</div>
						<Divider
							type="vertical"
							style={{
								height: 'auto',
								backgroundColor: '#dcdae0',
								width: 2,
								margin: '0 15px',
							}}
						/>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<PopoverConfig arr={leaves.unpaid} />
							<Title level={2} style={{ margin: '.5rem 0' }}>
								{getApprovedLeaves(leaves.unpaid)} / 365
							</Title>
							<Title level={5} style={{ margin: 0 }}>
								<Badge color="red" text="Unpaid Leaves" />
							</Title>
						</div>
					</div>
				</Card>
			)}
		</>
	);
};
