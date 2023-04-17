import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import videoApi from 'apis/video';
import { Button, Card, Col, Row, Space, Spin, Tooltip, Typography } from 'antd';
import { forEach, get, map } from 'lodash';
import Radar from 'components/plots/Radar';
import { useBoolean } from 'use-boolean';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

const { Text, Title } = Typography;

const sanitizeScore = score => Math.min(Math.max(Math.round(score), 0), 100);
const convertToRadarData = items => {
	const data = [];
	forEach(items, item => {
		data.push({ name: item.label, value: sanitizeScore(item.score) });
	});
	return data;
};

const renameMap = {
	Attendance: 'Engagement',
	Assignment: 'Technical',
	Instructor: 'Instructor Awarded',
};

function Scorecard({ label, score, children, scoresByType }) {
	const data = useMemo(() => (children ? convertToRadarData(children) : null), [
		children,
	]);
	const sanitizedScore = sanitizeScore(score);
	const [isOpen, open, close] = useBoolean(false);
	const canOpen = Array.isArray(children) && children.length > 1;
	return (
		<Card
			size="small"
			title={
				<Title style={{ marginTop: 0 }} level={4}>
					{label}
					<Tooltip title="Your score">
						<Text style={{ marginLeft: 12, fontWeight: 400 }} type="secondary">
							{sanitizedScore}%
						</Text>
					</Tooltip>
				</Title>
			}
			extra={
				canOpen ? (
					<Button onClick={isOpen ? close : open} style={{ display: 'flex' }}>
						View Details{' '}
						<span style={{ paddingTop: 4, paddingLeft: 4, display: 'inline-flex' }}>
							{isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
						</span>
					</Button>
				) : null
			}
		>
			<Row>
				<Col>{canOpen ? <Radar width={300} height={300} data={data} /> : null}</Col>
				<Col
					xs={24}
					md={12}
					lg={18}
					style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
				>
					<Space
						size={[24, 12]}
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
						}}
					>
						{map(scoresByType, (score, type) => {
							return (
								<span key={type} style={{ padding: '2rem', textAlign: 'center' }}>
									<div>{get(renameMap, type, type)}</div>
									<Title level={3}>{sanitizeScore(score)}%</Title>
								</span>
							);
						})}
					</Space>
				</Col>
			</Row>
			<Space direction="vertical" style={{ width: '100%' }}>
				{isOpen ? map(children, scorecard => <Scorecard {...scorecard} />) : null}
			</Space>
		</Card>
	);
}

function Scoreboard({ refreshKey, printableElementRef, user }) {
	const { data: scorecards, isError, isFetching, refetch } = useQuery(
		['get-my-scoreboard', user],
		() => videoApi.getMyScorecard(user).then(res => res.scorecards),
		{
			staleTime: 1.2e6,
			retry: 2,
		}
	);
	useEffect(() => {
		refetch();
	}, [refreshKey, refetch]);
	if (isFetching) {
		return (
			<div style={{ textAlign: 'center', padding: 12 }}>
				<Spin />
				<div>Loading...</div>
			</div>
		);
	}
	if (isError) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingBottom: 12,
				}}
			>
				<div>Failed to fetch your scorecard. Please try again.</div>
				<Button onClick={refetch}>Try again</Button>
			</div>
		);
	}
	return (
		<div ref={printableElementRef} style={{ padding: '0 12px 12px' }}>
			<Space direction="vertical" style={{ width: '100%' }}>
				{map(scorecards, scorecard => (
					<Scorecard {...scorecard} />
				))}
			</Space>
		</div>
	);
}

export default Scoreboard;
