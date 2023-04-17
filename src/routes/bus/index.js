import { Card, Grid, Typography } from 'antd';
import { map } from 'lodash';
import React from 'react';
import { buses } from 'utils/config';

function BusRoutes() {
	const breakpoints = Grid.useBreakpoint();
	return (
		<Card
			style={{ width: '100%', borderRadius: 0 }}
			bodyStyle={{
				padding: '0',
			}}
			headStyle={{
				fontSize: '1.2rem',
			}}
			title={
				<Typography.Title level={4} style={{ margin: 0 }}>
					Bus Routes & Schedule
				</Typography.Title>
			}
			bordered={false}
		>
			<div style={{ display: 'flex', flexWrap: 'wrap', padding: '12px 0 0 12px' }}>
				{map(buses, bus => {
					return (
						<a
							href={bus.url}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								width: breakpoints.md
									? 'calc(25% - 12px)'
									: breakpoints.xs
									? '100%'
									: 'calc(50% - 12px)',
								height: 120,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: 'solid 1px #e0e0e0',
								margin: '0 12px 12px 0',
								borderRadius: 8,
								color: '#000',
							}}
						>
							<div style={{ fontWeight: 600, fontSize: '1.5rem' }}>{bus.name}</div>
						</a>
					);
				})}
			</div>
		</Card>
	);
}

export default BusRoutes;
