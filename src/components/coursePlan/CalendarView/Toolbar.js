import { Button, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { map } from 'lodash-es';
import React, { useMemo } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Checkbox from './Checkbox';

dayjs.extend(advancedFormat);
const { Text } = Typography;

function CalendarToolbar({
	view,
	date,
	onNavigate,
	stateFilters,
	categoryFilters,
	selectedCategoryFilters,
	selectedStateFilters,
	onCategoryFiltersChange,
	onStateFiltersChange,
	onView,
	showViews,
}) {
	const handleNavigateLeft = () => {
		onNavigate(
			dayjs(date)
				.subtract(1, view)
				.toDate()
		);
	};
	const handleNavigateRight = () => {
		onNavigate(
			dayjs(date)
				.add(1, view)
				.toDate()
		);
	};
	const handleNavigateToday = () => {
		onNavigate(new Date());
	};
	const currentMonthText = useMemo(() => {
		return dayjs(date).format('MMM YYYY');
	}, [date]);

	const handleCategoryFiltersSelectionChange = (category, isSelected) => {
		if (isSelected) {
			onCategoryFiltersChange([...selectedCategoryFilters, category]);
		} else {
			onCategoryFiltersChange(selectedCategoryFilters.filter(c => c !== category));
		}
	};
	const handleStateFiltersSelectionChange = (state, isSelected) => {
		if (isSelected) {
			onStateFiltersChange([...selectedStateFilters, state]);
		} else {
			onStateFiltersChange(selectedStateFilters.filter(c => c !== state));
		}
	};

	return (
		<div className="calendar-toolbar">
			<div className="navigation-container">
				<Text className="navigation-current-date-text">{currentMonthText}</Text>
				{showViews ? (
					<Space>
						{map(
							[
								{ key: 'month', label: 'Month' },
								{ key: 'week', label: 'Week' },
							],
							({ key, label }) => (
								<Button
									type={view === key ? 'primary' : 'default'}
									onClick={() => onView(key)}
								>
									{label}
								</Button>
							)
						)}
					</Space>
				) : null}
				<Space className="navigation-button-list">
					<Button className="navigation-arrow-button" onClick={handleNavigateLeft}>
						<MdChevronLeft style={{ fontSize: 20 }} />
					</Button>
					<Button onClick={handleNavigateToday} className="navigation-today-button">
						Today
					</Button>
					<Button className="navigation-arrow-button" onClick={handleNavigateRight}>
						<MdChevronRight style={{ fontSize: 20 }} />
					</Button>
				</Space>
			</div>
			<div className="filters-list">
				{[
					[stateFilters, selectedStateFilters, handleStateFiltersSelectionChange],
					[
						categoryFilters,
						selectedCategoryFilters,
						handleCategoryFiltersSelectionChange,
					],
				].map(([filters, selectedFilters, onChange]) => {
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								margin: '0 -6px',
								flexWrap: 'wrap',
							}}
						>
							{filters.map(item => (
								<Checkbox
									checked={selectedFilters.includes(item.value)}
									onChange={isSelected => onChange(item.value, isSelected)}
									backgroundColor={item.style.pillColor || item.style.color}
									key={item.value}
								>
									{item.value}
								</Checkbox>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default CalendarToolbar;
