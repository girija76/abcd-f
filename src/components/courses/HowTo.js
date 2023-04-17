/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import Steps from 'antd/es/steps';
import Modal from 'antd/es/modal';

import a1 from '../images/analysis/1.png';
import a2 from '../images/analysis/2.png';
import a3 from '../images/analysis/3.png';
import a4 from '../images/analysis/4.png';

import './Course.css';

const { Step } = Steps;

const listData = [
	{
		title: 'Know Where You Stand',
		description:
			'Get a reality check by knowing where you stand among your peers and how much do you need to improve to stand out as outperformer.',
		img: a1,
	},
	{
		title: 'Roadmap',
		description:
			'Get an overview of question level analysis as a roadmap or flow, the way you attempted the questions.',
		img: a2,
	},
	{
		title: 'Time Usage',
		description: 'Compare how you used your time, relative to your peers.',
		img: a3,
	},
	{
		title: 'Topic and Difficulty Analysis',
		description: 'Identify your weak topics and difficulty level.',
		img: a4,
	},
];

class HowTo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoom: 0,
		};
	}

	updateZoom1 = () => {
		this.setState({ zoom: 1 });
	};

	updateZoom2 = () => {
		this.setState({ zoom: 2 });
	};

	updateZoom3 = () => {
		this.setState({ zoom: 3 });
	};

	updateZoom4 = () => {
		this.setState({ zoom: 4 });
	};

	render = () => {
		const { zoom } = this.state;
		return (
			<div style={{ backgroundColor: '#E7F3FF' }}>
				<div style={{ padding: '24px 96px' }}>
					<div
						style={{
							fontSize: 28,
							textAlign: 'center',
							fontWeight: 500,
							marginBottom: 24,
						}}
					>
						How to make most out of Prepleaf Preparation Portal
					</div>
					<Steps current={null} onChange={null} direction="vertical">
						<Step
							title="Know where you stand."
							description="Take a mock test and know where you stand, your weak spots and your negative test taking behaviours through our AI driven analysis tools."
						/>
						<Step
							title="Fill gaps"
							description="Practice upon your weak topics taking as much time as you need using our practice sessions."
						/>
						<Step
							title="Smart Practice"
							description="Once you are comfortable with the concepts, use our Smart Practice tool to improve upon your negative test taking behaviours."
						/>
						<Step
							title="Compete"
							description="Compete yourself with other participants via our live assessments and track your performance improvement with each live assessment."
						/>
						<Step title="Repeat" description="Repeat steps 1-4." />
					</Steps>
				</div>
				<div style={{ backgroundColor: 'white', padding: '24px 96px' }}>
					<div
						style={{
							fontSize: 28,
							textAlign: 'center',
							fontWeight: 500,
							marginTop: 24,
							marginBottom: 24,
						}}
					>
						Prepleaf Assessment Analysis
					</div>
					<div>
						Any improvement process is incomplete without proper periodic assessment
						of yourself and feedback of your progress. Following are few of robust
						analysis tools that Prepleaf offer-
					</div>
					<div style={{ display: 'flex' }} className="analysis-wrapper">
						<div
							style={{ flex: 1, overflow: 'hidden', marginTop: 48 }}
							className="analysis-sub-wrapper"
						>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<img
										alt=""
										src={listData[0].img}
										style={{ height: 196, maxWidth: '40vw' }}
										onClick={this.updateZoom1}
									/>
								</div>
								<div style={{ padding: '0px 24px', marginTop: 12 }}>
									<div style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
										{listData[0].title}
									</div>
									<div style={{ textAlign: 'center' }}>{listData[0].description}</div>
								</div>
							</div>
						</div>
						<div
							style={{ flex: 1, overflow: 'hidden', marginTop: 48 }}
							className="analysis-sub-wrapper"
						>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<img
										alt=""
										src={listData[1].img}
										style={{ height: 196, maxWidth: '40vw' }}
										onClick={this.updateZoom2}
									/>
								</div>
								<div style={{ padding: '0px 24px', marginTop: 12 }}>
									<div style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
										{listData[1].title}
									</div>
									<div style={{ textAlign: 'center' }}>{listData[1].description}</div>
								</div>
							</div>
						</div>
					</div>
					<div
						style={{ display: 'flex', marginBottom: 48 }}
						className="analysis-wrapper"
					>
						<div
							style={{ flex: 1, overflow: 'hidden', marginTop: 48 }}
							className="analysis-sub-wrapper"
						>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<img
										alt=""
										src={listData[2].img}
										style={{ height: 196, maxWidth: '40vw' }}
										onClick={this.updateZoom3}
									/>
								</div>
								<div style={{ padding: '0px 24px', marginTop: 12 }}>
									<div style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
										{listData[2].title}
									</div>
									<div style={{ textAlign: 'center' }}>{listData[2].description}</div>
								</div>
							</div>
						</div>
						<div
							style={{ flex: 1, overflow: 'hidden', marginTop: 48 }}
							className="analysis-sub-wrapper"
						>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<img
										alt=""
										src={listData[3].img}
										style={{ height: 196, maxWidth: '40vw' }}
										onClick={this.updateZoom4}
									/>
								</div>
								<div style={{ padding: '0px 24px', marginTop: 12 }}>
									<div style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
										{listData[3].title}
									</div>
									<div style={{ textAlign: 'center' }}>{listData[3].description}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Modal
					title={zoom ? listData[zoom - 1].title : ''}
					visible={zoom}
					footer={
						zoom ? (
							<div style={{ textAlign: 'left' }}>{listData[zoom - 1].description}</div>
						) : null
					}
					onCancel={function() {
						this.setState({ zoom: 0 });
					}.bind(this)}
					className="zoom-image"
					bodyStyle={{ display: 'flex', justifyContent: 'center' }}
				>
					{zoom ? (
						<img alt="" src={listData[zoom - 1].img} style={{ maxWidth: '65vw' }} />
					) : null}
				</Modal>
			</div>
		);
	};
}

export default HowTo;
