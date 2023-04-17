import React from 'react';
import { filter } from 'lodash';
import { connect } from 'react-redux';
import { URLS } from 'components/urls';
import './Bookmark.css';

import { updateServicePlans } from '../api/ApiAction';

class Plans extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		const {
			ServicePlans,
			activePhase: { _id },
		} = this.props;
		if (ServicePlans === null) {
			fetch(`${URLS.backendPayments}/service/plan/list/${_id}`, {
				method: 'GET', //GET not working!?
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						if (responseJson.success) {
							this.props.updateServicePlans(responseJson);
						}
					});
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.ServicePlans === null &&
			this.props.activePhase !== nextProps.activePhase
		) {
			const {
				activePhase: { _id },
			} = nextProps;
			fetch(`${URLS.backendPayments}/service/plan/list/${_id}`, {
				method: 'POST', //GET not working!?
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						if (responseJson.success) {
							this.props.updateServicePlans(responseJson);
						}
					});
				}
			});
		}
	}

	render() {
		const { ServicePlans } = this.props;
		const filteredServicePlans = filter(ServicePlans, plan => {
			return plan.subscribed === true;
		});
		return (
			<div style={{ padding: 16, paddingTop: 0 }}>
				{filteredServicePlans.length
					? filteredServicePlans.map(servicePlan => {
							return (
								<div>
									{servicePlan.services.map(service => {
										return <div>{service.name}</div>;
									})}
								</div>
							);
					  })
					: 'You have not purchased any plans.'}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	ServicePlans: state.api.ServicePlans,
});

const mapDispatchToProps = dispatch => {
	return {
		updateServicePlans: data => dispatch(updateServicePlans(data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Plans);
