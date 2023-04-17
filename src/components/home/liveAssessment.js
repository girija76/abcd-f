/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Card from 'antd/es/card';
import Modal from 'antd/es/modal';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';

import { COLORS } from '../colors';
import Divider from 'antd/es/divider';
import { customSyllabus } from '../customSyllabus';

import './liveAssessment.css';

import { monthNames } from '../extra';
import { formatAMPM, parseDuration } from '../libs/lib';

import { InfoCircleTwoTone } from '@ant-design/icons';

import Instructions from '../instructions/Instructions';
import Syllabus from '../instructions/Syllabus';

class LiveAssessment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: 'tab1',
			visible: null,
		};
	}

	takeAction = id => {
		this.setState({ visible: id });
	};

	renderTabs = hideSyllabus => {
		if (hideSyllabus) {
			return [
				{
					key: 'tab1',
					tab: 'Instructions',
				},
			];
		}
		return [
			{
				key: 'tab1',
				tab: 'Instructions',
			},
			{
				key: 'tab2',
				tab: 'Syllabus',
			},
		];
	};

	renderTabContent = test => {
		const { mode } = this.props;

		let cs = null;
		if (test.customSyllabus && test.customSyllabus.length) {
			cs = test.customSyllabus;
		} else if (customSyllabus[test._id]) {
			cs = customSyllabus[test._id];
		}
		const hideSyllabus =
			Array.isArray(test.core.customInstructions) &&
			test.core.customInstructions.length;

		return [
			this.renderTabs(hideSyllabus),
			{
				tab1: (
					<Instructions
						customInstructions={test.core.customInstructions}
						instructions={test.instructions}
						sectionInstructions={test.sectionInstructions}
						id={test.id}
						cost={test.cost}
						reward={test.reward}
						status={'Live'}
						mode={mode}
					/>
				),
				tab2: <Syllabus syllabus={test.syllabus} customSyllabus={cs} />,
			},
		];
	};

	hideInstructions = () => {
		this.setState({ visible: null });
	};

	renderAssessmentLinks = (la, margin) => {
		const startDate = new Date(la.availableFrom);
		const day = startDate.getDate();
		const month = monthNames[startDate.getMonth()];
		return (
			<div
				style={{
					backgroundColor: COLORS.background,
					borderRadius: 4,
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					padding: 24,
					marginTop: margin ? 24 : 0,
				}}
				key={`home-liveassessment-${la.id}`}
			>
				<div
					style={{
						diaplay: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						minWidth: 46,
					}}
				>
					<div
						style={{
							color: COLORS.text,
							fontSize: 40,
							lineHeight: '40px',
							fontweight: 'bold',
							textAlign: 'center',
						}}
						className="number"
					>
						{day}
					</div>
					<div
						style={{ color: COLORS.text, lineHeight: '14px', textAlign: 'center' }}
					>
						{month}
					</div>
				</div>
				<Divider
					type="vertical"
					style={{
						height: 48,
						backgroundColor: COLORS.text,
						marginLeft: 24,
						marginRight: 0,
					}}
				/>
				<div style={{ flex: 1, paddingLeft: 24 }}>
					<div style={{ fontWeight: 'bolder', fontSize: 22, color: COLORS.text }}>
						{la.name}
					</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div style={{ color: COLORS.text }}>{formatAMPM(startDate)}</div>
						<Divider
							type="vertical"
							style={{ backgroundColor: COLORS.text, height: 16 }}
						/>
						<div style={{ color: COLORS.text }}>{parseDuration(la.duration)}</div>
					</div>
				</div>
				<div
					style={{ minWidth: '100%', marginTop: 12 }}
					className="home-live-assessment-divider"
				/>
				<Button
					data-ga-on="click,auxclick"
					data-ga-event-label="Attempt Now"
					data-ga-event-category="Assessment: Attempt Now"
					data-ga-event-action="click"
					style={{
						borderRadius: '1000px',
						width: 160,
						height: 45,
						fontWeight: 'bold',
					}}
					onClick={this.takeAction.bind(this, la)}
					size="large"
				>
					Attempt
				</Button>
			</div>
		);
	};

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
	};

	render() {
		const { liveAssessments } = this.props;
		const liveAssessmentLinks = liveAssessments.map((la, idx) =>
			this.renderAssessmentLinks(la, idx !== 0)
		);

		const { key, visible } = this.state;
		const [tabList, contentList] = visible
			? this.renderTabContent(visible)
			: [this.renderTabs(), {}];

		return (
			<Card
				headStyle={{
					fontSize: 18,
					fontWeight: 'bold',
					padding: '0 24px',
					borderBottom: 0,
					color: COLORS.text,
				}}
				bodyStyle={{ padding: 0, margin: '0px 24px 18px 24px' }}
				style={{ marginBottom: 24 }}
				title={
					window.config.liveTestsText
						? window.config.liveTestsText
						: 'Live Assessment'
				}
			>
				{liveAssessmentLinks}
				<Modal
					title={
						<div>
							<span style={{ fontWeight: 'bolder' }}>
								{visible ? visible.name : ''}
							</span>
							{visible && visible.description ? (
								<Tooltip
									title={visible.description}
									placement="top"
									overlayClassName="rating-description-tooltip"
								>
									<InfoCircleTwoTone style={{ fontSize: 16, marginLeft: 10 }} />
								</Tooltip>
							) : null}
						</div>
					}
					visible={visible}
					footer={null}
					onCancel={this.hideInstructions}
					bodyStyle={{ padding: 0 }}
					headStyle={{ borderBottom: '0px' }}
					style={{ color: 'blue' }}
					className="instructions-modal"
				>
					<Card
						className="instructions-card"
						headStyle={{ fontSize: 24 }}
						tabList={tabList}
						activeTabKey={key}
						onTabChange={key => {
							this.onTabChange(key, 'key');
						}}
						bordered={false}
						bodyStyle={{ padding: 18 }}
					>
						{contentList[this.state.key]}
					</Card>
				</Modal>
			</Card>
		);
	}
}

export default withRouter(LiveAssessment);
