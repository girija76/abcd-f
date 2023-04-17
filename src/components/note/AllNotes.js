import React from 'react';
import { URLS } from '../urls.js';
import './AllNotes.css';

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export class AllNotes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notes: [],
		};
	}

	componentWillMount() {
		fetch(`${URLS.backendUsers}/notes`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				let notes = Object.keys(responseJson).map(key => {
					return { id: key, ...responseJson[key] };
				});
				this.setState({ notes });
			});
	}

	parseDate = date => {
		return (
			date.getDate() +
			' ' +
			months[date.getMonth()] +
			' ' +
			(date.getFullYear() - 2000)
		);
	};

	showQuestion = id => {
		localStorage.setItem('reviewQuestion', id);
		let win = window.open('http://localhost:3000/review', '_blank');
		win.focus();
	};

	renderNotes = () => {
		let { notes } = this.state;
		return notes.map(note => {
			return (
				<div
					style={{
						width: 280,
						margin: 10,
						backgroundColor: '#FDF6E3',
						boxShadow:
							'0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12)',
						cursor: 'pointer',
					}}
					onClick={this.showQuestion.bind(this, note.id)}
				>
					<div
						style={{
							display: 'flex',
							borderBottom: '1px solid #dadada',
							padding: '15px 15px 5px 15px',
						}}
					>
						<div className="question-category" style={{ flex: 1 }}>
							Quant > Time Work
						</div>
						<div style={{ fontSize: 12 }}>
							{this.parseDate(new Date(note.updated_at))}
						</div>
					</div>
					<div
						style={{
							color: '#586E75',
							padding: '10px 15px',
							fontSize: 14,
							minHeight: 170,
						}}
					>
						{note.note}
					</div>
				</div>
			);
		});
	};

	render() {
		//use card
		let notes = this.renderNotes();
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					flexWrap: 'wrap',
				}}
			>
				{notes}
			</div>
		);
	}
}

export default AllNotes;
