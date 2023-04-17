import { Button, Card, Col, Row, Space } from 'antd';
import cbtApi from 'apis/cbt';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { get, map } from 'lodash';
import { forEach, size } from 'lodash-es';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { activePhaseIdSelector, userSelector } from 'selectors/user';
import { logout } from 'utils/user';
import Clock from 'widgets/Clock';

dayjs.extend(relativeTime);

const AssessmentItem = ({ wrapper }) => {
	const activePhaseId = useSelector(activePhaseIdSelector);
	const wrapperName = useMemo(() => {
		let wrapperName = get(wrapper, 'name');
		forEach(get(wrapper, 'phases'), ({ name, phase }) => {
			if (activePhaseId === phase) {
				wrapperName = name;
			}
		});
		return wrapperName;
	}, [wrapper, activePhaseId]);
	const isAttempted = wrapper.isAttempted;
	const availableFrom = useMemo(() => dayjs(wrapper.availableFrom), [
		wrapper.availableFrom,
	]);
	const [now, setNow] = useState(dayjs());
	const isAvailable = now.isAfter(availableFrom);
	useEffect(() => {
		if (!isAvailable) {
			const intervalId = setInterval(() => {
				setNow(dayjs());
			}, 1000);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [isAvailable]);
	const timeRemainingInSecs = Math.floor(
		(availableFrom.toDate().getTime() - now.toDate().getTime()) / 1000
	);
	return (
		<Card
			title={<span>{wrapperName}</span>}
			size="small"
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<Space style={{ height: '100%' }}>
				{isAttempted ? (
					<div>Already attempted. You can attempt an assessment only once.</div>
				) : !isAvailable ? (
					<div>
						{timeRemainingInSecs < 600 ? (
							<div style={{ display: 'flex' }}>
								<span style={{ marginRight: 4 }}>Starts in </span>
								<Clock
									disableViewTypeChange
									timerLimit={timeRemainingInSecs}
									previouslyElapsedTime={0}
									type="timer"
									startTime={now.toDate()}
									onEnd={console.log}
									noHoursDisplay
								/>
							</div>
						) : (
							`Available ${dayjs(wrapper.availableFrom).fromNow()}`
						)}
					</div>
				) : (
					<div>
						<Link to={`/livetest/${wrapper._id}`}>
							<Button type="primary">Attempt Now</Button>
						</Link>
					</div>
				)}
			</Space>
		</Card>
	);
};

function CBTDashboard() {
	const user = useSelector(userSelector);
	const { data, isFetching } = useQuery(
		['get-cbt-assessments'],
		() => cbtApi.getAssessmentWrappers(),
		{
			staleTime: 5e6,
		}
	);
	const items = useMemo(() => (data ? data.items : []), [data]);
	return (
		<div>
			<div
				style={{
					marginBottom: 8,
					padding: 8,
					display: 'flex',
					alignItems: 'center',
					boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 12px 0px',
				}}
			>
				<div style={{ flexGrow: 1 }}>
					<div>{get(user, 'name')}</div>
					<div style={{ fontWeight: '600' }}>{get(user, 'username')}</div>
				</div>
				<Button onClick={logout}>Log Out</Button>
			</div>
			<div style={{ padding: 8 }}>
				{size(items) ? (
					<Row gutter={[8, 8]}>
						{map(items, item => {
							return (
								<Col key={item._id} xs={24} sm={12} md={8} lg={6}>
									<AssessmentItem wrapper={item} />
								</Col>
							);
						})}
					</Row>
				) : isFetching ? (
					'Loading assessments'
				) : (
					'No assessments'
				)}
			</div>
		</div>
	);
}

export default CBTDashboard;
