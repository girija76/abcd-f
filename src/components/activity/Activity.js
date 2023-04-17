import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default
import Card from 'antd/es/card';
// eslint-disable-next-line no-unused-vars
import GoalPlotWeek from '../plots/GoalPlotWeek';
import ActivityMap from '../plots/ActivityMap';
import './Activity.scss';
import { URLS } from '../urls';
import {
	fillData,
	nextDateFunc,
	lastDateFunc,
	getContentWidthFull,
} from '../libs/lib';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export class Activity extends React.Component {
	constructor(props) {
		super(props);
		const url = window.location.pathname;
		let key = 'tab1';
		if (url.indexOf(URLS.activitySession) > -1) key = 'tab2';

		this.state = {
			key,
			user: null,
			width: window.screen.width,
		};
	}

	componentWillMount() {
		window.addEventListener('resize', this.setWidth, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setWidth, false);
	}

	setWidth = () => {
		this.setState({ width: window.screen.width });
	};

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
		if (key === 'tab1') this.props.history.push(URLS.activityActivity);
		else if (key === 'tab2') this.props.history.push(URLS.activitySession);
	};

	dateToNumber = k =>
		parseInt(k[0], 10) * 366 + parseInt(k[1] * 31, 10) + parseInt(k[2], 10);

	dayofweek = (d, m, y) => {
		const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
		y -= m < 3;
		return (
			(y +
				Math.floor(y / 4) -
				Math.floor(y / 100) +
				Math.floor(y / 400) +
				t[m - 1] +
				d) %
			7
		);
	};

	getDay = date => {
		const day = date.split('-')[0];
		const month = date.split('-')[1];
		const year = date.split('-')[2];
		return days[
			this.dayofweek(parseInt(day, 10), parseInt(month, 10), parseInt(year, 10))
		];
	};

	getProperDate = d => {
		// use map/dict
		const day = d.split('-')[0];
		const month = d.split('-')[1];
		const year = d.split('-')[2];
		if (month === '1') {
			return `Jan ${day}, ${year}`;
		}
		if (month === '2') {
			return `Feb ${day}, ${year}`;
		}
		if (month === '3') {
			return `Mar ${day}, ${year}`;
		}
		if (month === '4') {
			return `Apr ${day}, ${year}`;
		}
		if (month === '5') {
			return `May ${day}, ${year}`;
		}
		if (month === '6') {
			return `Jun ${day}, ${year}`;
		}
		if (month === '7') {
			return `Jul ${day}, ${year}`;
		}
		if (month === '8') {
			return `Aug ${day}, ${year}`;
		}
		if (month === '9') {
			return `Sep ${day}, ${year}`;
		}
		if (month === '10') {
			return `Oct ${day}, ${year}`;
		}
		if (month === '11') {
			return `Nov ${day}, ${year}`;
		}
		return `Dec ${day}, ${year}`;
	};

	binData = dailyData => {
		const { width } = this.state;
		const binData = [];
		let bins = [];
		let bin = 0;
		const binheight = 150;
		if (dailyData.length && this.getDay(dailyData[0].date) === 'Tue') {
			const lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
		} else if (dailyData.length && this.getDay(dailyData[0].date) === 'Wed') {
			let lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 1 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			bins.reverse();
		} else if (dailyData.length && this.getDay(dailyData[0].date) === 'Thu') {
			let lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 1 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 2 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			bins.reverse();
		} else if (dailyData.length && this.getDay(dailyData[0].date) === 'Fri') {
			let lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 1 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 2 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 3 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			bins.reverse();
		} else if (dailyData.length && this.getDay(dailyData[0].date) === 'Sat') {
			let lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 1 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 2 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 3 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 4 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			bins.reverse();
		} else if (dailyData.length && this.getDay(dailyData[0].date) === 'Sun') {
			let lastDate = lastDateFunc(dailyData[0].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 1 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 2 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 3 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 4 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			lastDate = lastDateFunc(lastDate);
			bins.push({
				bin: 5 * binheight,
				count: 0,
				text: `${this.getProperDate(lastDate)}`,
			});
			bins.reverse();
		}
		dailyData.forEach(dd => {
			if (bins.length === 7 && bins.length) {
				binData.push({ bin, bins: bins.reverse() });
				bins = [];
				bin += 1;
			}
			bins.push({
				bin: bins.length * binheight,
				count: dd.todays_count,
				text: `${this.getProperDate(dd.date)}`,
			});
		});

		let lastDateFilled = '';
		if (dailyData.length) lastDateFilled = dailyData[dailyData.length - 1].date;
		if (bins.length === 1) {
			let nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		} else if (bins.length === 2) {
			let nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		} else if (bins.length === 3) {
			let nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		} else if (bins.length === 4) {
			let nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		} else if (bins.length === 5) {
			let nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		} else if (bins.length === 6) {
			const nextDate = nextDateFunc(dailyData[dailyData.length - 1].date);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			lastDateFilled = nextDate;
		}

		let nextDate;
		if (lastDateFilled) {
			nextDate = nextDateFunc(lastDateFilled);
			binData.push({ bin, bins: bins.reverse() });
		} else {
			const tempDate = new Date();
			if ((tempDate.getDay() + 6) % 7) {
				tempDate.setDate(tempDate.getDate() - ((tempDate.getDay() + 6) % 7));
			}
			nextDate = nextDateFunc(
				`${tempDate.getDate()}-${tempDate.getMonth() + 1}_${tempDate.getFullYear()}`
			);
		}

		while (binData.length < 13) {
			bins = [];
			bin += 1;
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			bins.push({
				bin: 0 * binheight,
				count: 0,
				text: `${this.getProperDate(nextDate)}`,
			});
			nextDate = nextDateFunc(nextDate);
			binData.push({ bin, bins: bins.reverse() });
		}

		if (width < 600 && binData.length > 13) {
			return binData.splice(binData.length - 13, 13);
		}
		return binData;
	};

	fillGoals = dailyActivity => {
		const {
			UserData: {
				settings: { goal },
			},
		} = this.props;
		let j = 0;
		// eslint-disable-next-line no-nested-ternary
		let lastGoal = goal.length
			? goal[0].goal === 1
				? 5
				: // eslint-disable-next-line no-nested-ternary
				goal[0].goal === 2
				? 10
				: goal[0].goal === 3
				? 20
				: 0
			: 0;
		// eslint-disable-next-line prefer-const
		let data = [];
		for (let i = 0; i < goal.length; i += 1) {
			const tempDate = new Date(goal[i].date);
			const nextDate = `${tempDate.getDate()}-${tempDate.getMonth()}-${tempDate.getFullYear()}`;
			while (j < dailyActivity.length - 1 && dailyActivity[j].date !== nextDate) {
				data.push({
					goal: lastGoal,
					date: dailyActivity[j].date,
					id: dailyActivity[j].id,
				});
				j += 1;
			}
			// eslint-disable-next-line no-nested-ternary
			lastGoal =
				goal[i].goal === 1
					? 5
					: goal[i].goal === 2
					? 10
					: goal[i].goal === 3
					? 20
					: 0;
		}
		while (j < dailyActivity.length) {
			data.push({
				goal: lastGoal,
				date: dailyActivity[j].date,
				id: dailyActivity[j].id,
			});
			j += 1;
		}
		return data;
	};

	renderTabContent = () => {
		const { UserData } = this.props;
		const dailyActivityTemp = UserData.stats.daily_activity;
		const dailyActivity = fillData(dailyActivityTemp);
		const goals = this.fillGoals(dailyActivity);
		const percentData = [];
		let count = 0;
		for (let i = 0, j = 0; i < dailyActivity.length; ) {
			if (dailyActivity[i].date === goals[j].date) {
				percentData.push({
					date: dailyActivity[i].date,
					id: count,
					percent: goals[j].goal
						? Math.min(
								100,
								Math.round((10000 * dailyActivity[i].todays_count) / goals[j].goal) /
									100
						  )
						: 100,
				});
				i += 1;
				j += 1;
				count += 1;
			} else if (
				this.dateToNumber(dailyActivity[i].date.split('-')) >
				this.dateToNumber(goals[j].date.split('-'))
			) {
				j += 1;
			} else {
				i += 1;
			}
		}

		return (
			<div style={{ padding: '12px 0px' }}>
				<GoalPlotWeek width={getContentWidthFull()} data={percentData} />
				<ActivityMap data={this.binData(dailyActivity)} />
			</div>
		);
	};

	render() {
		const contentList = this.renderTabContent();
		return (
			<div
				className="content-wrapper activity-wrapper-mobile"
				bodyStyle={{ padding: 0 }}
			>
				<Card title="Activity">{contentList}</Card>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	UserData: state.api.UserData,
});

export default connect(
	mapStateToProps,
	{}
)(withRouter(Activity));
