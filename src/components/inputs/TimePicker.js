import { forwardRef } from 'react';
import DatePicker from './DatePicker';

const TimePicker = forwardRef((props, ref) => {
	return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
