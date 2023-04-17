import React, { Component } from 'react';
export default class PortalFeatures extends Component {
	render = () => {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					padding: 12,
				}}
			>
				<div
					style={{
						margin: 6,
						padding: '12px 36px',
						flex: 1,
						// cursor: 'pointer',
						paddingTop: 0,
					}}
					className="product-wrapper"
					onClick={this.changeProduct.bind(this, 0)}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								borderTop: `10px solid ${c1}`,
								borderLeft: '6px solid #FAFAFA',
								borderRight: '6px solid #FAFAFA',
							}}
						></div>
					</div>
					<h3 style={{ marginBottom: 2 }}>IIT - JEE</h3>
					<span>Coming Soon</span>
				</div>
				<div
					style={{
						margin: 6,
						padding: '12px 36px',
						borderLeft: '1px solid #e3e3e3',
						flex: 1,
						// cursor: 'pointer',
						paddingTop: 0,
					}}
					className="product-wrapper"
					onClick={this.changeProduct.bind(this, 1)}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								borderTop: `10px solid ${c2}`,
								borderLeft: '6px solid #FAFAFA',
								borderRight: '6px solid #FAFAFA',
							}}
						></div>
					</div>
					<h3 style={{ marginBottom: 2 }}>CAT</h3>
					<span>5 mock tests, 10 sectional tests and over 30 tests</span>
				</div>
				<div
					style={{
						margin: 6,
						padding: '12px 36px',
						borderLeft: '1px solid #e3e3e3',
						flex: 1,
						// cursor: 'pointer',
						paddingTop: 0,
					}}
					className="product-wrapper"
					onClick={this.changeProduct.bind(this, 2)}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								borderTop: `10px solid ${c3}`,
								borderLeft: '6px solid #FAFAFA',
								borderRight: '6px solid #FAFAFA',
							}}
						></div>
					</div>
					<h3 style={{ marginBottom: 2 }}>Campus Placement</h3>
					<span>15+ mock tests</span>
				</div>
			</div>
		);
	};
}
