import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Button, Card, Modal, Table } from 'antd';
import { updateSubtopic } from '../api/ApiAction';
import { COLORS } from '../colors';
import { URLS } from '../urls';

import { column1, data1, column2, data2 } from './Data';

import {
	CalendarOutlined,
	SelectOutlined,
	AlertOutlined,
	GiftOutlined,
	CalculatorOutlined,
	FacebookOutlined,
	TrophyOutlined,
} from '@ant-design/icons';

import './lastActivity.css';
import { isLite, clientAlias } from 'utils/config';

const icons = {
	calendar: (
		<CalendarOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />
	),
	select: (
		<SelectOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />
	),
	alert: <AlertOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />,
	gift: <GiftOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />,
	calc: (
		<CalculatorOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />
	),
	fb: <FacebookOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />,
	trophy: (
		<TrophyOutlined style={{ fontSize: 48, color: 'rgb(24, 144, 255)' }} />
	),
};

const prizeColumns = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Username', dataIndex: 'username', key: 'username' },
	// { title: 'Score', dataIndex: 'score', key: 'score' },
	// { title: 'Rank', dataIndex: 'rank', key: 'rank' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

class Dummy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showCoursePlan: false,
			openModal: false,
			performers: [],
		};
	}

	takeAction = () => {
		const { coursePlan, url, onClick, mode } = this.props;
		if (coursePlan) {
			this.setState({ showCoursePlan: true });
		} else if (mode === 'demo') {
			this.setState({ showModal: true });
		} else if (url) {
			this.props.history.push(url);
		} else if (this.props.openModal) {
			this.setState({ openModal: true });
		} else if (onClick) {
			this.props.onClick();
		}
	};

	renderDummy = () => {
		const { detail, subdetail, btnTxt, icon, url, target } = this.props;

		return (
			<div
				style={{
					backgroundColor: COLORS.background,
					borderRadius: 4,
					display: 'flex',
					alignItems: 'center',
					padding: 24,
					marginTop: 0,
				}}
				className="dummy"
			>
				{icons[icon]}
				<div style={{ flex: 1, paddingLeft: 24, paddingRight: 10 }}>
					<div
						style={{
							fontWeight: 500,
							fontSize: 22,
							marginBottom: 12,
							color: COLORS.text,
						}}
					>
						{detail}
					</div>
					<div style={{ color: COLORS.text }}>{subdetail}</div>
				</div>
				{btnTxt ? (
					target === '_blank' ? (
						<a href={url} target="_blank" rel="noreferrer">
							<Button
								data-ga-on="click"
								data-ga-event-action="Click CTA"
								data-ga-event-category="Homepage"
								data-ga-event-label={typeof detail === 'string' ? detail : btnTxt}
								style={{
									borderRadius: '1000px',
									width: 160,
									height: 45,
									fontWeight: 'bold',
								}}
								size="large"
							>
								{btnTxt}
							</Button>
						</a>
					) : url ? (
						<Link to={url}>
							<Button
								data-ga-on="click"
								data-ga-event-action="Click CTA"
								data-ga-event-category="Homepage"
								data-ga-event-label={typeof detail === 'string' ? detail : btnTxt}
								style={{
									borderRadius: '1000px',
									width: 160,
									height: 45,
									fontWeight: 'bold',
								}}
								size="large"
							>
								{btnTxt}
							</Button>
						</Link>
					) : (
						<Button
							data-ga-on="click"
							data-ga-event-action="Click CTA"
							data-ga-event-category="Homepage"
							data-ga-event-label={typeof detail === 'string' ? detail : btnTxt}
							style={{
								borderRadius: '1000px',
								width: 160,
								height: 45,
								margin: '10px 0px',
								fontWeight: 'bold',
							}}
							onClick={this.takeAction}
							size="large"
						>
							{btnTxt}
						</Button>
					)
				) : null}
			</div>
		);
	};

	downloadCertificate = () => {
		window.open(`${URLS.backendUsers}/certificate`);
	};

	render = () => {
		const { title, c2020Found } = this.props;
		const { showModal, showCoursePlan, openModal } = this.state;

		const cashPrizeWinners = [
			{
				name: 'M SIVARAJ',
				username: 'Siva111',
				rank: '1',
				amount: '500 Rs',
			},
			{
				name: 'J.Partha sarathy',
				username: 'ParthasarathyJ',
				rank: '2',
				amount: '200 Rs',
			},
			{
				name: 'Balaganesh',
				username: 'Balaganesh',
				rank: '4',
				amount: '100 Rs',
			},
			{
				name: 'N Shane Richard Vignesh',
				username: 'shanerichard19',
				rank: '8',
				amount: '100 Rs',
			},
			{
				name: 'Ram',
				username: 'Ramsiva',
				rank: '11',
				amount: '100 Rs',
			},
		];

		return (
			<Card
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				size={isLite ? 'small' : 'default'}
				bordered={!isLite}
				bodyStyle={{ paddingTop: 0 }}
				style={{
					marginBottom: 24,
					background: '#fff',
					borderRadius: isLite ? 0 : undefined,
				}}
				title={title}
			>
				{this.renderDummy()}
				<Modal
					title="Authentication Required"
					visible={showModal}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
					footer={null}
				>
					You need to sign in to use this feature.
				</Modal>
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
						columns={c2020Found ? column1 : column2}
						dataSource={c2020Found ? data1 : data2}
						style={{ backgroundColor: 'white' }}
						pagination={false}
						className="course-plan-table"
						rowClassName={
							c2020Found ? 'course-plan-2020-row' : 'course-plan-2021-row'
						}
					/>
				</Modal>

				{clientAlias === 'onlinetangedco' ? (
					<Modal
						title="Wall of Fame"
						visible={openModal}
						onCancel={() => {
							this.setState({ openModal: false });
						}}
						footer={null}
					>
						<div style={{ fontWeight: 500 }}>
							Following are the Mock 02 cash prize winners -{' '}
						</div>
						<div style={{ marginTop: 18, border: '1px solid #dadada' }}>
							<Table
								columns={prizeColumns}
								dataSource={cashPrizeWinners}
								style={{ backgroundColor: 'white' }}
								pagination={false}
								size="small"
								className="prize-winner-table"
							/>
						</div>
					</Modal>
				) : clientAlias === 'cat' ? (
					<Modal
						title="Wall of Fame - PrepZone"
						visible={openModal}
						onCancel={() => {
							this.setState({ openModal: false });
						}}
						footer={null}
					>
						<img
							alt=""
							src="https://static.prepleaf.com/brand/prepzone/wall-of-fame-cat-19.jpeg"
							width="100%"
						/>
						<img
							alt=""
							src="https://static.prepleaf.com/brand/prepzone/wall-of-fame-cat-19-gdpi.jpeg"
							width="100%"
						/>
					</Modal>
				) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dummy));
