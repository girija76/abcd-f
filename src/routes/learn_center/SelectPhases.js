import React, { useEffect, useMemo, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Card, Input } from 'antd';
import { useSelector } from 'react-redux';
import { URLS } from 'components/urls';
import { filter, includes, toLower } from 'lodash';

const getPhases = () => {
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	return fetch(`${URLS.backendPhases}/get`, {
		credentials: 'include',
		headers,
	});
};

const userRoleSelector = state => {
	try {
		return state.api.UserData.role;
	} catch (e) {
		return null;
	}
};

const SelectPhases = () => {
	const role = useSelector(userRoleSelector);
	const [phases, setPhases] = useState([]);
	const [query, setQuery] = useState('');

	const refresh = () => {
		getPhases().then(response => {
			if (response.ok) {
				response.json().then(body => {
					setPhases(body.phases);
				});
			}
		});
	};
	const filteredPhases = useMemo(
		() =>
			filter(phases, phase => {
				if (
					!includes(toLower(phase.name), toLower(query)) &&
					toLower(phase._id) !== toLower(query)
				) {
					return false;
				}
				return true;
			}),
		[phases, query]
	);
	useEffect(() => {
		refresh();
	}, []);
	return role === 'user' ? (
		<Redirect to="./" />
	) : (
		<div className="content-wrapper">
			<Card title="Select a phase">
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
					}}
				>
					<Input
						type="text"
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
					{filteredPhases.map(phase => {
						return (
							<Link
								style={{ color: '#1890ff', padding: 12 }}
								key={phase._id}
								to={`./playlists?viewAs=userOf&phases=${encodeURIComponent(
									JSON.stringify([phase._id])
								)}`}
								onClick={() => {
									localStorage.setItem('viewAs', 'userOf');
									localStorage.setItem('phases', JSON.stringify([phase._id]));
								}}
							>
								{phase.name}
							</Link>
						);
					})}
				</div>
			</Card>
		</div>
	);
};

export default SelectPhases;
