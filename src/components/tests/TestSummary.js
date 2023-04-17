import React from 'react';
import { connect } from 'react-redux';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Checkbox from 'antd/es/checkbox';

const columns1 = [
	{
		title: 'Section',
		dataIndex: 'section_name',
		key: 'section_name',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'No of Questions',
		dataIndex: 'total_questions',
		key: 'total_questions',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Answered',
		dataIndex: 'answered',
		key: 'answered',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Marked for Review',
		key: 'market',
		dataIndex: 'marked',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Not Visited',
		dataIndex: 'not_visited',
		key: 'not_visited',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
];

const columns2 = [
	{
		title: 'Section',
		dataIndex: 'section_name',
		key: 'section_name',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'No of Questions',
		dataIndex: 'total_questions',
		key: 'total_questions',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
	{
		title: 'Answered',
		dataIndex: 'answered',
		key: 'answered',
		className: 'prepleaf-column',
		render: text => <span>{text}</span>,
	},
];

export class TestSummary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			verified: true,
		};
	}

	getAnsweredQuestions = section => {
		let count = 0;
		section.questions.map(question => {
			console.log('checking answered', question.answer);
			if (question.answer === null) {
				//
			} else if (Array.isArray(question.answer) && question.answer.length === 0) {
			} else if (question.answer != null) count += 1;
		});
		return count;
	};

	getMarkedQuestions = section => {
		let count = 0;
		section.questions.map(question => {
			if (question.state === 2 || question.state === 4) count += 1;
		});
		return count;
	};

	getNotVisitedQuestions = section => {
		let count = 0;
		section.questions.map(question => {
			if (question.state === 0) count += 1;
		});
		return count;
	};

	createData = section => {
		return {
			id: section._id,
			section_name: section.name,
			total_questions: section.total_questions,
			answered: this.getAnsweredQuestions(section),
			marked: this.getMarkedQuestions(section),
			not_visited: this.getNotVisitedQuestions(section),
		};
	};

	getRows = () => {
		let { MyQuestions } = this.props;
		return Object.keys(MyQuestions.sections).map((section, index) => {
			return this.createData(MyQuestions.sections[index]);
		});
	};

	verifySummary = status => {
		this.setState({ verified: status.target.checked });
	};

	render() {
		const rows = this.getRows();
		const { classes, submitting } = this.props;
		let { verified } = this.state;

		const columns = window.screen.width <= 1024 ? columns2 : columns1;

		return (
			<div style={{ padding: 16 }}>
				<div style={{ border: '1px solid #e8e8e8' }}>
					<Table columns={columns} dataSource={rows} pagination={false} />
				</div>
				<div className="confirm-text">Are you sure you want to submit answers?</div>
				<div style={{ display: 'flex', alignItems: 'center', padding: '0px 5px' }}>
					<Checkbox
						checked={verified}
						onChange={this.verifySummary}
						style={{ flex: 1 }}
					>
						I have verified that the test summary shown above is correct.
					</Checkbox>
					<Button
						type="primary"
						loading={submitting === 1}
						disabled={!verified}
						onClick={this.props.submitAnswers.bind(this, true)}
						style={{ margin: '0px 10px' }}
					>
						Yes
					</Button>
					<Button onClick={this.props.cancelSubmit} style={{ marginLeft: 10 }}>
						No
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	MyQuestions: state.api.MyQuestions,
});

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TestSummary);
