import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { Tooltip } from 'antd';

const transformData = data => {
	const total = data.reduce((accumulator, v) => accumulator + v.value, 0);
	return sortBy(data, f => -1 * f.value).map(v => ({
		...v,
		percentage: (100 * v.value) / total,
	}));
};

const PiChart = ({ data, height, tooltipTitleFn }) => {
	const transformedData = transformData(data);
	return (
		<div style={{ display: 'flex', flexWrap: 'nowrap', height }}>
			{transformedData.map(item => {
				return (
					<Tooltip key={item.label} title={tooltipTitleFn(item)}>
						<div
							style={{
								overflow: 'hidden',
								height,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#000',
								width: `${item.percentage}%`,
								background: item.color,
							}}
						>
							{tooltipTitleFn(item)}
						</div>
					</Tooltip>
				);
			})}
		</div>
	);
};

PiChart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.number,
			color: PropTypes.string,
			label: PropTypes.string,
		})
	),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	tooltipTitleFn: PropTypes.func.isRequired,
};

PiChart.defaultProps = {
	tooltipTitleFn: item => (
		<div style={{ textAlign: 'center' }}>
			<div>{item.label}</div>
			<div>
				{item.value} ({Math.round(item.percentage)}%)
			</div>
		</div>
	),
};

export default PiChart;
