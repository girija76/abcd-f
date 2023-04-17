/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { AuditOutlined } from '@ant-design/icons';

class CourseCard extends Component {
	render = () => {
		const { title, features, color, demo, url } = this.props;
		return (
			<div style={{ marginBottom: 36 }}>
				<Link
					style={{
						width: 300,
						backgroundColor: color,
						padding: 24,
						borderRadius: 3,
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						color: 'white',
						cursor: 'pointer',
					}}
					to={url}
				>
					<AuditOutlined
						style={{ color: 'white', fontSize: 64, marginBottom: 24, marginTop: 12 }}
					/>
					<div style={{ color: 'white' }}>
						<div style={{ textAlign: 'center', fontSize: 18 }}>{title}</div>
					</div>
					<div style={{ marginTop: 12 }}>
						<div style={{ fontSize: 16 }}>Features-</div>
						{features.map(f => {
							return <div>{f}</div>;
						})}
					</div>
				</Link>

				{demo ? (
					<div
						style={{ width: '100%', textAlign: 'center', padding: 8, marginTop: 24 }}
					>
						<a
							href={demo}
							style={{
								color,
								fontSize: 16,
								border: `1px solid ${color}`,
								padding: '12px 24px',
								borderRadius: 100,
							}}
						>
							Get Demo
						</a>
					</div>
				) : null}
			</div>
		);
	};
}

export default CourseCard;
