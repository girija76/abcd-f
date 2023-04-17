import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { URLS } from '../urls.js';
import Button from 'antd/es/button';
import List from 'antd/es/list';
import Radio from 'antd/es/radio';
import Checkbox from 'antd/es/checkbox';
import Input from 'antd/es/input';
import './Instructions.css';

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
			cost,
			reward,
			status,
			UserData: { xp },
			id,
			testUrl,
		} = this.props;

		const mode =
			window.location.pathname.indexOf('demo') !== -1 ? 'demo' : 'asdsad';

		const net = xp ? xp.net : 10000000;
		const { verified } = this.state;
		const notAllowed = net < cost;
		const currentSupergroup = localStorage.getItem('currentSupergroup');

		const linkUrl = testUrl ? `${testUrl}/${id}` : `${URLS.liveTest}/${id}`;

		console.log('check new instructions', instructions);

		return (
			<List
				itemLayout="vertical"
				dataSource={instructions}
				renderItem={item => (
					<List.Item
						className="custom-list"
						style={{
							padding: 5,
							border: '0px',
							borderBottom: '1px solid #dadada',
							marginBottom: 12,
						}}
					>
						<div style={{ fontWeight: 500, marginBottom: 8 }}>{item.text}</div>
						{item.markingScheme.length ? (
							<div>
								<List
									itemLayout="horizontal"
									dataSource={item.markingScheme}
									renderItem={sub_item => (
										<List.Item
											style={{ padding: '2px 0px', border: '0px', marginLeft: 10 }}
										>
											{sub_item.text}
										</List.Item>
									)}
								/>
							</div>
						) : null}
					</List.Item>
				)}
				style={{ flex: 1 }}
				className="custom-footer"
				footer={null}
			/>
		);
	}
}

const mapStateToProps = state => ({ UserData: state.api.UserData });

export default connect(
	mapStateToProps,
	{}
)(Instructions);
