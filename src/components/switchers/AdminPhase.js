import React, { useMemo } from 'react';
import { forEach, get, map } from 'lodash';
import { Card, Col, Row, Typography } from 'antd';
import SwitchPhaseForAdmin from 'components/inputs/SwitchPhaseForAdmin';

const { Title } = Typography;

function groupSorter({ name: name1 }, { name: name2 }) {
	if (name1 === name2) {
		return 0;
	}
	if (name1 === 'Others') {
		return 1;
	}
	if (name2 === 'Others') {
		return -1;
	}
	return name1 > name2 ? 1 : -1;
}

function SwitcherPhaseSelectAdmin({ onChange, options }) {
	const groups = useMemo(() => {
		const optionsByGroup = {};
		forEach(options, phase => {
			const group = get(phase, 'group', 'Others');
			if (!optionsByGroup[group]) {
				optionsByGroup[group] = [];
			}
			optionsByGroup[group].push(phase);
		});
		return map(optionsByGroup, (options, groupName) => ({
			name: groupName,
			options,
		})).sort(groupSorter);
	}, [options]);
	return (
		<div className="admin-phase-switcher">
			{map(groups, ({ name, options }) => {
				return (
					<Card
						style={{
							marginTop: '1rem',
						}}
						key={name}
						title={<Title level={3}>{name}</Title>}
					>
						<Row>
							{map(options, ({ label, search, value }) => {
								return (
									<Col
										sm={12}
										lg={4}
										xl={3}
										style={{
											paddingRight: '1rem',
											paddingTop: '1rem',
										}}
										onClick={() => onChange(value)}
										key={value}
									>
										<Card
											hoverable
											style={{
												backgroundColor: '#eee',
											}}
										>
											<Typography
												style={{
													fontSize: '1.3rem',
													fontWeight: 'bold',
												}}
											>
												{label}
											</Typography>
										</Card>
									</Col>
								);
							})}
						</Row>
					</Card>
				);
			})}
		</div>
	);
}

function AdminPhase() {
	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>Select a Class</Title>
			<SwitchPhaseForAdmin component={SwitcherPhaseSelectAdmin} />
		</div>
	);
}

export default AdminPhase;
