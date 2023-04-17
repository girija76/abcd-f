import React from 'react';
import { connect } from 'react-redux';
import List from 'antd/es/list';
// import Icon from 'antd/lib/icon'; //to be updated
import './Instructions.css';

export class PracticeInstructions extends React.Component {
	render() {
		const { instructions } = this.props;
		return (
			<List
				itemLayout="horizontal"
				dataSource={instructions}
				renderItem={item => (
					<List.Item className="custom-list" style={{ padding: 5, border: '0px' }}>
						<div style={{ display: 'flex' }}>
							<div style={item.style ? item.style : {}}>{item.text}</div>
						</div>
					</List.Item>
				)}
				style={{ flex: 1 }}
			/>
		);
	}
}

/*

{item.icon ? (
								item.icon !== 'zap' ? (
									<Icon
										type={item.icon}
										style={{
											fontSize: 20,
											padding: 2,
											marginRight: 8,
											...item.iconStyle,
										}}
									/>
								) : (
									<Zap size={32} style={{ marginRight: 8, ...item.iconStyle }} />
								)
							) : null}

*/

const mapStateToProps = state => ({ UserData: state.api.UserData });

export default connect(
	mapStateToProps,
	{}
)(PracticeInstructions);
