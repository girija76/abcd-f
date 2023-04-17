import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
const timeFormat = 'hh:mm A';
const dateFormat = 'DD-MM-YYYY';
const defaultDate = '29-06-2020';

function DateTimePicker({ onChange, value }) {
	const [timeString, setTimeString] = useState();
	const [dateString, setDateString] = useState();
	const timeDayJsObject = useMemo(() => {
		const dateToParse = `${defaultDate} ${timeString}`;
		const parseFormat = `${dateFormat} ${timeFormat}`;
		if (!timeString) {
			return null;
		}
		return timeString ? dayjs(dateToParse, parseFormat) : null;
	}, [timeString]);
	const dateDayJsObject = useMemo(() => {
		const dateToParse = `${dateString} 00:00 AM`;
		const parseFormat = `${dateFormat} hh:mm A`;
		if (!dateString) {
			return null;
		}
		try {
			return dayjs(dateToParse, parseFormat);
		} catch (e) {
			console.log(e);
			return null;
		}
	}, [dateString]);
	const handleTimeChange = (date, formattedString) => {
		setTimeString(formattedString);
	};
	const handleDateChange = (date, formattedString) => {
		setDateString(formattedString);
	};
	useEffect(() => {
		if (dateString && timeString) {
			const dateStringProp = value && value.format(dateFormat);
			const timeStringProp = value && value.format(timeFormat);
			const dateTime = dayjs(
				`${dateString} ${timeString}`,
				`${dateFormat} ${timeFormat}`
			);
			if (dateString !== dateStringProp || timeString !== timeStringProp) {
				setTimeout(() => {
					onChange(dateTime);
				}, 10);
			}
		} else {
			onChange(null);
		}
	}, [timeString, dateString, onChange, value]);

	useEffect(() => {
		if (value) {
			const dateString = value.format(dateFormat);
			const timeString = value.format(timeFormat);
			setDateString(dateString);
			setTimeString(timeString);
		}
	}, [value]);
	return (
		<Row gutter={[8, 8]} style={{ display: 'flex' }}>
			<Col xs={24} md={12}>
				<DatePicker
					value={dateDayJsObject}
					format={dateFormat}
					onChange={handleDateChange}
					style={{ width: '100%' }}
				/>
			</Col>
			<Col xs={24} sm={12}>
				<TimePicker
					value={timeDayJsObject}
					onChange={handleTimeChange}
					format={timeFormat}
					style={{ width: '100%' }}
				/>
			</Col>
		</Row>
	);
}

export default DateTimePicker;
