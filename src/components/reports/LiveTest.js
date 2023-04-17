/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { Button, Card, Radio, Result, Table, Tooltip, Typography } from 'antd';
import Graph from './Graph';
import { URLS } from '../urls';
import './styles.scss';
import { useLoadReport } from './utils';
import { AiOutlineFrown } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const userSelector = state => state.api.UserData;

const calculatePercentage = (marks, totalMarks) =>
	parseInt((marks / totalMarks) * 100 * 100, 10) / 100;

const Reports = ({
	userId,
	refreshKey,
	isPrinting,
	printableElementRef,
	onRefresh,
}) => {
	const [items, isLoading, sectionConfigs] = useLoadReport(refreshKey, userId);
	const [selectedSectionConfig, setSelectedSectionConfig] = useState('overall');

	const { name, username, mobileNumber } = useSelector(userSelector);

	const graphData = useMemo(() => {
		return items.map((item, index) => {
			const availableFrom = item.details.filter(a => a.availableFrom)[0]
				.availableFrom;
			const percentage = calculatePercentage(
				get(item, ['user', selectedSectionConfig, 'marks'], 0),
				get(item, ['maxMarks', selectedSectionConfig])
			);
			const topperPercentage = calculatePercentage(
				get(item, ['topper', selectedSectionConfig, 'marks'], 0),
				item.maxMarks[selectedSectionConfig]
			);
			const averagePercentage = calculatePercentage(
				get(item, ['statsBySection', selectedSectionConfig, 'averageMarks'], 0),
				item.maxMarks[selectedSectionConfig]
			);
			return {
				position: index + 1,
				date: availableFrom,
				name: item.details.map(d => d.name).join(' & '),
				percentage: percentage,
				topperPercentage,
				averagePercentage,
				percentile: get(item, [
					'statsBySection',
					selectedSectionConfig,
					'percentile',
				]),
			};
		});
	}, [items, selectedSectionConfig]);

	const handleSelectedSectionConfigChange = e => {
		setSelectedSectionConfig(e.target.value);
	};

	return (
		<Card
			style={{ background: 'transparent', border: 'none', padding: 0 }}
			loading={isLoading}
		>
			{!items || !items.length ? (
				<div style={{ padding: '1rem' }}>
					<Result
						icon={<AiOutlineFrown style={{ fontSize: '4em' }} />}
						title={
							<div>
								You have not attempted any live assessments yet.
								<br />
								Attempt some assessments and come back.
							</div>
						}
						extra={[
							<Link to={URLS.compete} className="ant-btn ant-btn-primary">
								Go to assessments
							</Link>,
							<Button onClick={onRefresh}>Refresh</Button>,
						]}
					/>
				</div>
			) : (
				<div
					ref={printableElementRef}
					style={{
						padding: isPrinting ? '0 1rem' : '',
						minWidth: isPrinting ? 1200 : '',
						maxWidth: isPrinting ? 1200 : '',
					}}
				>
					{isPrinting ? (
						<div style={{ display: 'flex', marginBottom: '1rem' }}>
							<div style={{ flex: 1 }}>
								<Title level={2} style={{ marginBottom: 0 }}>
									{name || 'N/A'} ({username || 'N/A'})
								</Title>
								<Text>Phone No: {mobileNumber || 'N/A'}</Text>
							</div>
						</div>
					) : null}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexWrap: 'wrap',
							marginBottom: '2rem',
						}}
					>
						<div style={{ maxWidth: 950, width: '100%' }}>
							<Graph sectionConfigs={sectionConfigs} data={graphData} />
						</div>
						<div>
							<Radio.Group
								value={selectedSectionConfig}
								onChange={handleSelectedSectionConfigChange}
								style={{ display: 'flex', flexWrap: 'wrap' }}
							>
								{sectionConfigs.map(sectionConfig => {
									return <Radio value={sectionConfig.id}>{sectionConfig.name}</Radio>;
								})}
							</Radio.Group>
						</div>
					</div>
					<div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
						{Array.isArray(items) &&
							items.map((item, index) => (
								<AssessmentGroup
									sectionConfigs={sectionConfigs}
									data={item}
									key={index}
								/>
							))}
					</div>
				</div>
			)}
		</Card>
	);
};

const AssessmentGroup = ({ data, sectionConfigs }) => {
	const { details, statsBySection, topper, user, maxMarks } = data;
	const columns = [
		{ dataIndex: 'subject', title: 'Subject' },
		{
			dataIndex: 'userMarks',
			title: 'Your Marks',
			align: 'right',
			render: (marks, record) => {
				let message = null;
				let type = undefined;
				if (marks < record.averageMarks) {
					type = 'danger';
					message = 'You have scored below average';
				} else if (marks < record.topperMarks) {
					type = 'warning';
					message = 'You have scored less than the topper';
				} else if (marks >= record.topperMarks) {
					type = 'success';
					message = 'You have scored more than or equal the topper';
				}
				return (
					<Tooltip title={message}>
						<Text style={{ paddingLeft: '1rem' }} type={type}>
							{marks}
							<span style={{ color: '#676869' }}>/{record.maxMarks}</span>
						</Text>
					</Tooltip>
				);
			},
		},
		{
			dataIndex: 'percentage',
			title: 'Percentage',
			align: 'right',
		},
		{ dataIndex: 'averageMarks', title: 'Average Marks', align: 'right' },
		{ dataIndex: 'highestMarks', title: 'Highest Marks', align: 'right' },
		{ dataIndex: 'topperMarks', title: 'Topper Marks', align: 'right' },
		{ dataIndex: 'percentile', title: 'Percentile', align: 'right' },
		{
			dataIndex: 'cumulativePercentile',
			title: 'Cumulative Percentile',
			align: 'right',
		},
	];
	const dataSource = useMemo(() => {
		return sectionConfigs.map((sectionConfig, index) => {
			const stats = get(statsBySection, [sectionConfig.id], {
				averageMarks: 0,
				highestMarks: 0,
				cumulativePercentile: 0,
				percentile: 0,
			});
			const {
				averageMarks,
				highestMarks,
				cumulativePercentile,
				percentile,
			} = stats;
			return {
				key: index,
				subject: sectionConfig.name,
				userMarks: get(user, [sectionConfig.id, 'marks'], 0),
				topperMarks: get(topper, [sectionConfig.id, 'marks'], 0),
				averageMarks,
				highestMarks,
				cumulativePercentile,
				percentile,
				maxMarks: maxMarks[sectionConfig.id],
				percentage:
					parseInt(
						(100 * 100 * get(user, [sectionConfig.id, 'marks'], 0)) /
							maxMarks[sectionConfig.id],
						10
					) / 100,
			};
		});
	}, [maxMarks, sectionConfigs, statsBySection, topper, user]);
	const dates = useMemo(() => {
		const allAvailableFroms = details.map(d => d.availableFrom);
		const nonNullDates = allAvailableFroms.filter(d => d);
		const formattedDates = nonNullDates.map(d => dayjs(d).format('DD MMM YYYY'));
		let areAllSame = true;
		formattedDates.forEach((d, index) => {
			if (index !== 0 && formattedDates[index - 1] !== d) {
				areAllSame = false;
			}
		});
		if (areAllSame) {
			return formattedDates[0];
		} else {
			return formattedDates.join(', ');
		}
	}, [details]);
	return (
		<div style={{ marginBottom: '1rem' }}>
			<Title style={{ marginBottom: 0 }} level={4}>
				{details.map(group => group.name).join(' & ')}
			</Title>
			<div style={{ marginBottom: '0.5rem' }}>{dates}</div>
			<div style={{ maxWidth: '100%', overflowX: 'auto' }}>
				<Table
					size="small"
					pagination={false}
					bordered
					columns={columns}
					dataSource={dataSource}
				/>
			</div>
		</div>
	);
};

export default Reports;
