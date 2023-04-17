import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, List, Radio, Checkbox, Input } from 'antd';
import { URLS } from '../urls.js';
import './Instructions.css';
import { map } from 'lodash';

export class Instructions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			verified: !props.cost,
		};
	}

	noteTime = () => {
		// store time, live test id in local storage and server
		const { id } = this.props;
		localStorage.setItem('currSection', 0);
		localStorage.setItem('currQuestion', 0);
		localStorage.setItem('liveTestId', id); // if live test id is not same, remove other ...
	};

	renderIcon = icon => {
		//'not-visited-icon'?{}not-answered-icon answered-icon not-answered-marked-icon answered-marked-icon
		switch (icon.type) {
			case 'not-visited-icon':
				return (
					<div
						style={{ display: 'flex', alignItems: 'flex-start', padding: '2px 0px' }}
					>
						<div
							className="color-not-visited"
							style={{ width: 32, height: 16 }}
						></div>
						<span style={{ lineHeight: '16px' }}>
							You have not visited the question yet
						</span>
					</div>
				);
			case 'not-answered-icon':
				return (
					<div
						style={{ display: 'flex', alignItems: 'flex-start', padding: '2px 0px' }}
					>
						<div
							className="color-not-answered"
							style={{ width: 32, height: 16 }}
						></div>
						<span style={{ lineHeight: '16px' }}>
							You have not answered the question
						</span>
					</div>
				);
			case 'answered-icon':
				return (
					<div
						style={{ display: 'flex', alignItems: 'flex-start', padding: '2px 0px' }}
					>
						<div className="color-answered" style={{ width: 32, height: 16 }}></div>
						<span style={{ lineHeight: '16px' }}>You have answered the question</span>
					</div>
				);
			case 'not-answered-marked-icon':
				return (
					<div
						style={{ display: 'flex', alignItems: 'flex-start', padding: '2px 0px' }}
					>
						<div
							className="color-not-answered-bookmarked"
							style={{ width: 32, height: 16 }}
						></div>
						<span style={{ lineHeight: '16px' }}>
							You have not answered the question, but have marked it for review
						</span>
					</div>
				);
			case 'answered-marked-icon':
				return (
					<div
						style={{ display: 'flex', alignItems: 'flex-start', padding: '2px 0px' }}
					>
						<div
							className="color-answered-bookmarked"
							style={{ width: 32, height: 16 }}
						></div>
						<span style={{ lineHeight: '16px' }}>
							You have answered the question, but marked it for review
						</span>
					</div>
				);
			case 'single-correct':
				return (
					<div style={{ display: 'flex', alignItems: 'center', padding: '2px 0px' }}>
						<Radio
							style={{ width: 32, display: 'flex', justifyContent: 'center' }}
							checked={true}
							disabled
						/>
						<span style={{ lineHeight: '16px' }}>Single Correct</span>
					</div>
				);
			case 'multiple-correct':
				return (
					<div style={{ display: 'flex', alignItems: 'center', padding: '2px 0px' }}>
						<Checkbox
							style={{ width: 32, display: 'flex', justifyContent: 'center' }}
							checked={true}
							disabled
						/>
						<span style={{ lineHeight: '16px' }}>Multiple Correct</span>
					</div>
				);
			case 'integer-type':
				return (
					<div style={{ display: 'flex', alignItems: 'center', padding: '2px 0px' }}>
						<Input
							style={{
								width: 32,
								height: 20,
								padding: 3,
								fontSize: 14,
								borderRadius: 0,
								marginRight: 8,
							}}
							// value=""
							placeholder={25}
							disabled
						/>
						<span style={{ lineHeight: '16px' }}>Integer Type</span>
					</div>
				);
			default:
				return <div>Not found</div>;
		}
	};

	agreeTerms = () => {
		this.setState({ verified: !this.state.verified }); // check if he has 100 xp??
	};

	render() {
		const {
			instructions,
			sectionInstructions,
			cost,
			reward,
			status,
			UserData,
			id,
			testUrl,
			disableBegin,
		} = this.props;

		const mode =
			window.location.pathname.indexOf('demo') !== -1 ? 'demo' : 'asdsad';

		const xp = UserData ? UserData.xp : null;
		const net = xp ? xp.net : 10000000;
		const { verified } = this.state;
		const notAllowed = net < cost;
		const newInstructions = [];

		if (instructions.length > 2 && sectionInstructions) {
			newInstructions.push(instructions[0]);
			newInstructions.push(instructions[1]);
			sectionInstructions.forEach(si => {
				newInstructions.push({
					type: 'text',
					instruction: si.text,
					sub_instructions: si.markingScheme.map(ms => {
						return { type: 'text', instruction: ms.text };
					}),
				});
			});
			for (let i = 2; i < instructions.length; i++) {
				newInstructions.push(instructions[i]);
			}
		} else {
			instructions.forEach(i => {
				newInstructions.push(i);
			});
		}

		const currentSupergroup = localStorage.getItem('currentSupergroup');
		if (currentSupergroup === '5dd95e8097bc204881be3f2c') {
			newInstructions.push({
				type: 'text',
				instruction:
					'Following are the type of questions that can be found in the assessment:',
				sub_instructions: [
					{
						type: 'single-correct',
						instruction: 'Single Correct',
					},
					{
						type: 'multiple-correct',
						instruction: 'Multiple Correct',
					},
					{
						type: 'integer-type',
						instruction: 'Integer Type',
					},
				],
			});
		} else if (currentSupergroup === '5d10e43944c6e111d0a17d0c') {
			newInstructions.push({
				type: 'text',
				instruction:
					'Following are the type of questions that can be found in the assessment:',
				sub_instructions: [
					{
						type: 'single-correct',
						instruction: 'Single Correct',
					},
					{
						type: 'integer-type',
						instruction: 'Integer Type',
					},
				],
			});
		}

		const linkUrl = testUrl ? `${testUrl}/${id}` : `${URLS.liveTest}/${id}`;

		return (
			<List
				itemLayout="vertical"
				dataSource={newInstructions}
				renderItem={item => (
					<List.Item className="custom-list" style={{ padding: 5, border: '0px' }}>
						{item.type === 'text' && (
							<div style={{ fontWeight: 'bold' }}>{item.instruction}</div>
						)}
						{item.sub_instructions && item.sub_instructions.length ? (
							<List
								itemLayout="horizontal"
								dataSource={item.sub_instructions}
								renderItem={sub_item => (
									<List.Item
										style={{ padding: '2px 0px', border: '0px', marginLeft: 10 }}
									>
										{sub_item.type === 'text'
											? sub_item.instruction
											: this.renderIcon(sub_item)}
									</List.Item>
								)}
							/>
						) : null}
					</List.Item>
				)}
				style={{ flex: 1 }}
				className="custom-footer"
				footer={
					!this.props.hideButton ? (
						<div style={{ padding: '0px 5px' }}>
							{status === 'Live' && reward ? (
								<div style={{ fontWeight: 'bold', marginBottom: 8 }}>
									You can earn upto {reward} xp, as per your performance in the
									assessment.
								</div>
							) : null}
							<div style={{ display: 'flex', alignItems: 'center' }}>
								{mode === 'demo' ? (
									<div style={{ flex: 1, color: 'red' }}>
										You need to sign in to attempt this assessment.
									</div>
								) : (
									<div style={{ flex: 1 }}>
										{cost ? (
											<Checkbox
												disabled={notAllowed}
												checked={verified}
												onChange={this.agreeTerms}
											>
												{cost
													? `I agree to spend ${cost} xp to attempt this assessment.`
													: 'No xp is required to attempt this assessment.'}
											</Checkbox>
										) : null}
										{notAllowed ? (
											<div style={{ fontSize: 11, color: 'red' }}>
												(You don't have enough xp)
											</div>
										) : null}
										{disableBegin ? <div>Assessment will be available soon.</div> : null}
									</div>
								)}
								{mode === 'demo' ? (
									<Link to="/registration" style={{ float: 'right' }}>
										<Button type="primary" style={{ marginRight: 20 }} size="large">
											Sign In
										</Button>
									</Link>
								) : (
									<Link
										to={linkUrl}
										style={{ float: 'right' }}
										disabled={!verified || mode === 'demo'}
									>
										<Button
											type="primary"
											style={{ marginRight: 20 }}
											size="large"
											onClick={this.noteTime}
											disabled={!verified || mode === 'demo' || disableBegin}
										>
											Begin Test
										</Button>
									</Link>
								)}
							</div>
						</div>
					) : null
				}
			/>
		);
	}
}

const mapStateToProps = state => ({ UserData: state.api.UserData });

const InstructionsWrapper = ({ customInstructions, ...otherProps }) => {
	if (Array.isArray(customInstructions) && customInstructions.length) {
		const { testUrl, id, hideButton } = otherProps;
		const linkUrl = testUrl ? `${testUrl}/${id}` : `${URLS.liveTest}/${id}`;
		return (
			<div>
				<ul>
					{map(customInstructions, (text, index) => {
						return <li key={index}>{text}</li>;
					})}
				</ul>
				{hideButton ? null : (
					<div>
						<Link to={linkUrl} style={{ float: 'right' }}>
							<Button type="primary" size="large">
								Begin Test
							</Button>
						</Link>
					</div>
				)}
			</div>
		);
	}
	return <Instructions {...otherProps} />;
};

export default connect(mapStateToProps)(InstructionsWrapper);
