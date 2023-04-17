import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Card, Modal, Table } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { updateSubtopic } from '../api/ApiAction';
import { parseTestDate } from '../libs/lib';
import { isLite } from 'utils/config';
import './lastActivity.css';

class CoursePlanMini extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updatedAt: '',
			columns: null,
			data: [],
			showCoursePlan: false,
			showCertificationModal: false,
		};
	}

	componentWillMount() {
		const { activePhase, createdAt } = this.props;
		if (activePhase && activePhase._id) {
			const link = `https://static-prepleaf.s3.ap-south-1.amazonaws.com/course-plan/${activePhase._id}.tsv`;
			this.getcourseplan(link, createdAt);
		}
	}

	getcourseplan = (link, createdAt) => {
		const self = this;
		fetch(link).then(function(response) {
			let reader = response.body.getReader();
			let decoder = new TextDecoder('utf-8');

			reader.read().then(function(result) {
				const data = decoder.decode(result.value);
				const rows = data.split('\n');

				if (rows.length > 2) {
					const updatedAt = rows[0].split('\t')[0];
					const isRelative =
						rows[0].split('\t')[1] &&
						rows[0].split('\t')[1].substr(0, 8) === 'relative'
							? true
							: false;

					const columns = [];
					const colKeys = {};
					let colorIdx = -1;
					rows[1].split('\t').forEach((c, i) => {
						if (c.substr(0, 6) !== '_color') {
							if (isRelative && c.substr(0, 3) === 'Day') {
								columns.push({
									title: 'Date',
									dataIndex: 'date',
									key: 'date',
								});
								colKeys[i] = 'date';
							} else {
								columns.push({
									title: c,
									dataIndex: c,
									key: c,
								});
								colKeys[i] = c;
							}
						} else {
							colorIdx = i;
						}
					});

					const data = [];
					for (let i = 2; i < rows.length; i++) {
						const cs = rows[i].split('\t');
						const tempData = {};
						Object.keys(colKeys).forEach(k => {
							if (k < cs.length) {
								if (colKeys[k] === 'date' && isRelative) {
									const testDate = parseTestDate(
										new Date(
											createdAt.getTime() + parseInt(cs[k], 10) * 24 * 60 * 60 * 1000
										)
									);

									tempData[colKeys[k]] = testDate;
								} else {
									tempData[colKeys[k]] = cs[k];
								}
							}
						});
						if (colorIdx < cs.length && cs[colorIdx]) {
							tempData['color'] = cs[colorIdx];
						}
						data.push(tempData);
					}
					self.setState({ columns, data, updatedAt });
				}
			});
		});
	};

	takeAction = () => {
		this.setState({ showCoursePlan: true });
	};

	certificationModal = () => {
		this.setState({ showCertificationModal: true });
	};

	render = () => {
		const { activePhase } = this.props;

		const { showCertificationModal, showCoursePlan, columns, data } = this.state;
		const externalScheduleLink = activePhase.externalScheduleLink;

		return (
			<Card
				size="small"
				title="Course Plan"
				className="course-plan-mini"
				bordered={!isLite}
				style={{ borderRadius: isLite ? 0 : '' }}
			>
				<div>Checkout course plan and stay committed to your goals!</div>
				<div style={{ marginTop: 8 }}>
					{externalScheduleLink ? (
						<a href={externalScheduleLink} target="_blank" rel="noreferrer">
							<Button
								data-ga-on="click"
								data-ga-event-action="Click CTA"
								data-ga-event-category="Homepage"
								data-ga-event-label={'Checkout course plan'}
								type="primary"
								icon={<CalendarOutlined />}
							>
								Open Schedule
							</Button>
						</a>
					) : (
						<Button
							data-ga-on="click"
							data-ga-event-action="Click CTA"
							data-ga-event-category="Homepage"
							data-ga-event-label={'Checkout course plan'}
							type="primary"
							onClick={this.takeAction}
							icon={<CalendarOutlined />}
						>
							Open Schedule
						</Button>
					)}
				</div>
				{activePhase && activePhase._id === '5ed8489d805b8561a106a9f0' ? (
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
						<Button type="link" onClick={this.certificationModal}>
							Certification & Prizes
						</Button>
					</div>
				) : null}
				<Modal
					title="Course Plan"
					visible={showCoursePlan}
					onCancel={() => {
						this.setState({ showCoursePlan: false });
					}}
					footer={null}
					className="course-plan-modal"
				>
					<Table
						columns={columns}
						loading={!columns}
						size="small"
						dataSource={data}
						style={{ backgroundColor: 'white' }}
						pagination={false}
						className="course-plan-table"
						rowClassName={(record, index) => {
							if (record.color) {
								return 'colored-row-' + record.color.substr(1, 7);
							}
							return '';
						}}
					/>
				</Modal>
				<Modal
					title="Certification & Prizes"
					visible={showCertificationModal}
					onCancel={() => {
						this.setState({ showCertificationModal: false });
					}}
					footer={null}
				>
					<div>Certification Criteria</div>
					<ul>
						<li>You need to attempt at least 70% of the tests before deadline.</li>
						<li>You need to spend at least 50% of alloted time in each test.</li>
						<li>
							You need to pass the final assessment with at least the minimum cutoff.
						</li>
					</ul>

					<div>Prizes</div>
					<ul>
						<li>
							Prizes worth Rs 1L will be given to top rankers of the final assessment.
						</li>
						<li>
							Toppers of each college (with atleast 100 users) will be considered too.
						</li>
						<li>
							Only those candidates who fall under certifcation criteria will be
							considered to prize.
						</li>
					</ul>
				</Modal>
			</Card>
		);
	};
}

const mapStateToProps = state => ({ Topics: state.api.Topics });

const mapDispatchToProps = dispatch => ({
	updateSubtopic: topic => {
		dispatch(updateSubtopic(topic));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(CoursePlanMini));
