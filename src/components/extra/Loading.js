import { Spin } from 'antd';
import React from 'react';

function Loading({ simple, text }) {
	const width = window.innerWidth;
	return (
		<>
			{simple ? (
				<div
					style={{
						textAlign: 'center',
						margin: '1rem 0',
					}}
				>
					<Spin size="large" />
					<h2
						style={{
							fontWeight: 'normal',
						}}
					>
						{text ? text : 'Loading...'}
					</h2>
				</div>
			) : (
				<div
					style={{
						width: '100%',
						height: '100vh',
						position: 'fixed',
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
						top: 0,
						left: 0,
						backgroundColor: '#44444455',
						zIndex: 999,
					}}
				>
					<div
						style={{
							width: width > 1200 ? '40%' : width > 600 ? '75%' : '90%',
							height: '50%',
							background: '#FFFFFF',
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Spin size="large" />
						<h2
							style={{
								fontWeight: 'normal',
							}}
						>
							{text ? text : 'Loading...'}
						</h2>
					</div>
				</div>
			)}
		</>
	);
}

export default Loading;
