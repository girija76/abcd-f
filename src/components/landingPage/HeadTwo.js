/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { URLS } from '../urls.js';
import './HeadTwo.scss';

import Registration from '../login';

class HeadTwo extends Component {
	constructor(props) {
		super(props);
		let modal = 1;
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.get('code')) {
			modal = 2;
		}
		this.state = {
			modal,
			showModal: false,
		};
	}

	changeModal = m => {
		this.setState({ modal: m });
	};

	renderMenu = () => {
		const links = window.config.headTwoLinks.links;
		return (
			<div
				style={{ backgroundColor: 'white', boxShadow: '0 1px 11px 0px #00000026' }}
			>
				{links.map(link => {
					const outboundlink = link.link.indexOf('https://') !== -1 ? true : false;
					const style = { padding: '12px 16px' };
					return (
						<div style={{ display: 'flex' }}>
							{outboundlink ? (
								<a
									style={style}
									href={link.link}
									rel="noreferrer noopener"
									target="_blank"
								>
									{link.name}
								</a>
							) : (
								<Link style={style} to={link.link}>
									{link.name}
								</Link>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	render = () => {
		return (
			<div className="sub-head-wrapper2">
				{window.config.headTwoLinks ? (
					<div
						style={{
							position: 'absolute',
							display: 'flex',
							right: 36,
							top: 44,
						}}
					>
						{window.config.headTwoLinks.links.length > 1 ? (
							<Dropdown overlay={this.renderMenu()} trigger={['click']}>
								<div
									style={{
										marginRight: 24,
										fontSize: 18,
										cursor: 'pointer',
									}}
									className="head-two-link"
								>
									{window.config.headTwoLinks.name}
									<DownOutlined style={{ fontSize: 16, marginLeft: 4 }} />
								</div>
							</Dropdown>
						) : (
							<a
								className="head-two-link-optional"
								href={window.config.headTwoLinks.links[0].link}
							>
								{window.config.headTwoLinks.links[0].name}
							</a>
						)}
						<a
							style={{
								marginRight: 24,
								display: 'none',
							}}
							className="head-two-link-optional"
							href={`${URLS.resources}`}
						>
							Notifications
						</a>
					</div>
				) : null}
				<Registration
					isFormWide={false}
					defaultView
					gaCategory="main-page-top-registration"
				/>
			</div>
		);
	};
}

export default HeadTwo;
