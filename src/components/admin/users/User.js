import React from 'react';

import { Avatar, Button, Col, List, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function User({ user, extra, style, showButton }) {
	const { name, username, email, dp } = user;

	return (
		<>
			<List.Item style={style}>
				<Row style={{ width: '100%' }}>
					<Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
						<Link
							to={{
								pathname: `/dashboard/admin/users/profile/${user._id}`,
								state: {
									name: user.name,
									userId: user._id,
								},
							}}
							style={{
								textDecoration: 'none',
								color: '#000',
							}}
						>
							<Avatar src={dp} style={{ marginRight: 8 }} />
						</Link>

						<span style={{ flex: 1 }}>
							<div>
								<Title level={5} style={{ marginBottom: 0 }}>
									<Link
										to={{
											pathname: `/dashboard/admin/users/profile/${user._id}`,
											state: {
												name: user.name,
												userId: user._id,
											},
										}}
										style={{
											textDecoration: 'none',
											color: '#000',
										}}
									>
										{name} <span style={{ fontWeight: 'normal' }}>({username})</span>
									</Link>
								</Title>
							</div>
							<div>{email}</div>
						</span>
					</Col>
					{extra ? <Col xs={12}>{extra}</Col> : null}

					<Col xs={12}>
						<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
							{showButton && (
								<Button
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										marginLeft: 12,
									}}
									icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />}
								>
									Grades
								</Button>
							)}
						</div>
					</Col>
				</Row>
			</List.Item>
		</>
	);
}

export default User;
