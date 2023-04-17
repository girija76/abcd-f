import React from 'react';
import Checkbox from 'antd/es/checkbox';
import Button from 'antd/es/button';
import { URLS } from '../urls';

export default class Categories extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
		};
	}

	// eslint-disable-next-line class-methods-use-this
	componentWillMount() {
		fetch(URLS.backendCategories, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(response => {
			if (response.ok) {
				response
					.json()
					.then(responseJson => this.setState({ categories: responseJson }));
			}
		});
	}

	onChange = idx => {
		const { categories } = this.state;
		categories[idx].subscribed = !categories[idx].subscribed;
		this.setState({ categories });
	};

	subscribe = () => {
		const { categories } = this.state;
		fetch(`${URLS.backendCategories}/subscribe`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ categories }),
		}).then(response => {
			// if (response.ok) {
			//     response.json().then(responseJson => this.setState({ categories: responseJson }));
			// }
		});
	};

	// eslint-disable-next-line class-methods-use-this
	render() {
		const { categories } = this.state;
		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{categories.map((category, idx) => (
						<Checkbox
							onChange={() => this.onChange(idx)}
							style={{ marginLeft: 0 }}
							key={category._id}
							checked={category.subscribed}
						>
							{category.name}
						</Checkbox>
					))}
				</div>
				<Button type="primary" onClick={this.subscribe}>
					Subscribe
				</Button>
			</div>
		);
	}
}
