import React, { Component } from 'react';
import { Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

export default function asyncComponent(
	importComponent,
	spinnerType = 'full',
	size
) {
	class AsyncComponent extends Component {
		constructor(props) {
			super(props);

			this.state = {
				component: null,
			};
		}

		async componentDidMount() {
			const { default: component } = await importComponent();
			this.setState({
				component: component,
			});
		}

		render() {
			const C = this.state.component;

			return C ? (
				<C {...this.props} />
			) : spinnerType === 'inline' ? (
				<Spin icon={<Loading3QuartersOutlined style={{ fontSize: size }} />} />
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '1rem',
					}}
				>
					<Spin icon={<Loading3QuartersOutlined style={{ fontSize: '4rem' }} />} />
					<div>Loading...</div>
				</div>
			);
		}
	}

	return AsyncComponent;
}
