import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { URLS } from 'components/urls';

const fetchSuperGroups = (resolve, reject) => {
	fetch(`${URLS.backendUnauthorized}/super-groups`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	})
		.then(response => {
			if (response.ok) {
				response.json().then(responseJson => {
					resolve(responseJson.groups);
				});
			} else {
				reject(new Error('Unable to fetch courses'));
			}
		})
		.catch(e => {
			reject(e);
		});
};
const SelectSuperGroup = ({ onChange, value, labelStyle, labelClassName }) => {
	const [superGroups, setSuperGroups] = useState([]);
	const [hasError, setHasError] = useState(null);
	useEffect(() => {
		fetchSuperGroups(setSuperGroups, e => {
			setHasError(e.message);
		});
	}, []);
	return (
		<>
			<label
				className={labelClassName}
				style={
					labelStyle || {
						fontSize: 13,
						fontWeight: 'bold',
						marginTop: 13,
						marginBottom: 5,
						display: 'block',
					}
				}
			>
				What do you want to prepare for?
			</label>
			<Radio.Group
				onChange={e => {
					onChange(e.target.value);
				}}
				value={value}
				style={{ display: 'flex', marginBottom: 0 }}
			>
				{superGroups &&
					superGroups.map(superGroup => {
						return (
							<Radio style={{ width: '33.3%' }} value={superGroup._id}>
								{superGroup.name}
							</Radio>
						);
					})}
			</Radio.Group>
		</>
	);
};

export default SelectSuperGroup;
