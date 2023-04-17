import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { Table, Typography } from 'antd';
import { useLoadReport } from './utils';

const { Text } = Typography;

function CompactReport() {
	const [items, isLoading, sectionConfigs] = useLoadReport();

	const dataSource = useMemo(() => {
		return items.map(data => {
			const { details, statsBySection, topper, user, maxMarks } = data;
			const d = {};
			sectionConfigs
				.map((sectionConfig, index) => {
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
						sectionId: sectionConfig.id,
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
				})
				.forEach(item => {
					Object.keys(item).forEach(key => {
						d[`${item.sectionId}-${key}`] = item[key];
					});
				});
			const allAvailableFroms = details.map(d => d.availableFrom);
			const nonNullDates = allAvailableFroms.filter(d => d);
			const formattedDates = nonNullDates.map(d => dayjs(d).format('DD MMM YYYY'));
			let areAllSame = true;
			formattedDates.forEach((d, index) => {
				if (index !== 0 && formattedDates[index - 1] !== d) {
					areAllSame = false;
				}
			});
			let dates = null;
			if (areAllSame) {
				dates = formattedDates[0];
			} else {
				dates = formattedDates.join(', ');
			}
			return {
				name: details.map(group => group.name).join(' & '),
				date: dates,
				...d,
			};
		});
	}, [items, sectionConfigs]);

	const sectionColumns = useMemo(() => {
		return sectionConfigs.map(config => {
			const children = [
				{
					title: 'Self',
					dataIndex: `${config.id}-userMarks`,
					align: 'right',
					width: 80,
				},
				{
					title: 'High',
					dataIndex: `${config.id}-highestMarks`,
					align: 'right',
					width: 80,
				},
				// {
				// 	title: 'Topper',
				// 	dataIndex: `${config.id}-topperMarks`,
				// 	align: 'right',
				// 	width: 80,
				// },
				{
					title: 'Avg',
					dataIndex: `${config.id}-averageMarks`,
					align: 'right',
					width: 80,
				},
			];
			if (config.id === 'overall') {
				children.push({
					title: 'Max',
					dataIndex: `${config.id}-maxMarks`,
					align: 'right',
					width: 80,
				});
			}
			return {
				title: config.name,
				children,
			};
		});
	}, [sectionConfigs]);
	const cumulativeColumns = useMemo(() => {
		return sectionConfigs.map(config => {
			return {
				title: config.name,
				dataIndex: `${config.id}-percentile`,
			};
		});
	}, [sectionConfigs]);

	const columns = [
		{
			title: 'Test Details',
			children: [
				{
					title: 'Name',
					dataIndex: 'name',
					render: name => <Text ellipsis>{name}</Text>,
				},
				{
					title: 'Date',
					dataIndex: 'date',
					render: name => <Text ellipsis>{name}</Text>,
				},
			],
		},
		...sectionColumns,
		{
			title: 'Current',
			children: [
				{
					title: '%age',
					dataIndex: 'overall-percentage',
				},
				{
					title: '%tile',
					dataIndex: 'overall-percentile',
				},
			],
		},
		{
			title: 'Cumulative Percentile',
			children: cumulativeColumns,
		},
	];
	if (!dataSource || !dataSource.length) {
		return null;
	}
	return (
		<div style={{ overflow: 'hidden', maxWidth: '100%' }}>
			<div style={{ width: '100%', overflowX: 'auto', background: 'transparent' }}>
				<Table
					bordered
					pagination={false}
					loading={isLoading}
					columns={columns}
					dataSource={dataSource}
				/>
			</div>
		</div>
	);
}

export default CompactReport;
