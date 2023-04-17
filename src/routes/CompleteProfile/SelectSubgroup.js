import React, { useState, useEffect } from 'react';
import { size, map } from 'lodash';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { URLS } from 'components/urls';
import 'components/landingPage/VerifyDetails.css';
import 'components/login/styles.scss';

const namePossilitiesCache = {};

const isCap = char => {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90;
};

const createCacheForName = name => {
	const keywords = {};
	const initialChars = name
		.split(' ')
		.filter(word => word[0] && isCap(word[0]))
		.map(word => word[0].toLowerCase());
	for (let i = 1; i <= initialChars.length; i++) {
		keywords[initialChars.slice(0, i).join('')] = true;
	}
	namePossilitiesCache[name] = {
		keywords,
		mkl: initialChars.length, // maxKeywordLength
	};
};

const isSubSequence = (name, inputValue) => {
	const inputValueLength = inputValue.length;
	let matchedLength = 0;
	for (let i = 0; i < name.length && matchedLength < inputValueLength; i++) {
		if (name[i] === inputValue[matchedLength]) {
			matchedLength += 1;
		}
	}
	return matchedLength === inputValueLength;
};

function filterSubgroup(groups) {
	const allowedSubgroup = window.config.subgroups;
	if (!allowedSubgroup || !allowedSubgroup.length) return groups;
	const aSg = allowedSubgroup.map(s => {
		return s._id;
	});

	return groups.filter(g => {
		if (aSg.indexOf(g.subgroup._id) !== -1) return true;
		return false;
	});
}

function removeDuplicates(allPhases) {
	const selectedPhases = [];
	const alreadyAddedPhasesByKey = {};
	allPhases.forEach(phase => {
		if (!alreadyAddedPhasesByKey[phase.phase._id]) {
			alreadyAddedPhasesByKey[phase.phase._id] = true;
			selectedPhases.push(phase);
		}
	});
	return selectedPhases;
}

const calculateMatch = (item, inputValue) => {
	let match = 0;
	const name = item.name;
	const lName = item.name.toLowerCase();
	const firstKeyword = inputValue.split(' ').length > 1;
	const fullKeyword = inputValue.replace(/\s/g, '');
	if (!inputValue || lName === 'other') {
		match = 0.10001;
	}

	if (!namePossilitiesCache[name]) {
		createCacheForName(name);
	}

	// keyword search
	if (namePossilitiesCache[name].keywords[fullKeyword]) {
		match += 0.8 * (inputValue.length / namePossilitiesCache[name].mkl);
	} else {
		// if multiple tokens
		if (firstKeyword && namePossilitiesCache[name].keywords[firstKeyword]) {
			match += 0.3 * (inputValue.length / namePossilitiesCache[name].mkl);
		}
	}

	// substring search
	if (lName.includes(inputValue)) {
		const foundAt = lName.indexOf(inputValue);
		// substring match
		match += 0.2;
		// score based on substring match position
		// (foundAt + 1) is used because lName.length is not 0 based
		match += 0.06 * (1 - (foundAt + 1) / lName.length);
		// if it matches start of a word
		match += 0.04 * (foundAt === 0 || lName[foundAt - 1] === ' ');
	}

	// subsequence search
	if (isSubSequence(lName, inputValue)) {
		match += 0.15 + 0.05 * (inputValue.length / lName.length);
	}

	return {
		item,
		match,
	};
};
const SelectSubgroup = ({
	supergroup: supergroupId,
	onChange,
	labelClassName,
	courseLabel,
}) => {
	/* States */
	const [group, setGroup] = useState({});
	const [searchQuery, setSearchQuery] = useState('');
	const [subgroups, setSubgroups] = useState([]);
	const [superGroup, setSuperGroup] = useState({ _id: supergroupId });
	const formattedInputValue = searchQuery.replace(/\s+/g, ' ').toLowerCase();
	/* -------------------- */

	/* Effects */
	useEffect(() => {
		const { clientId } = window.config;
		const url = clientId
			? `${URLS.backendGroups}/getSuperGroupWithAllSubgroups?id=${supergroupId}&clientId=${clientId}`
			: `${URLS.backendGroups}/getSuperGroupWithAllSubgroups?id=${supergroupId}`;
		fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		}).then(res => {
			if (res.ok) {
				res.json().then(resBody => {
					setSuperGroup({
						_id: resBody.item._id,
						name: resBody.item.name,
						isCollegeRequired: resBody.item.isCollegeRequired,
					});

					if (
						supergroupId === '5dd95e8097bc204881be3f2c' ||
						supergroupId === '5ef239b8961414160f0a8da3'
					) {
						const filteredSubGroups = clientId
							? resBody.item.subgroups
							: filterSubgroup(resBody.item.subgroups);

						setSubgroups(
							map(filteredSubGroups, subGroup => ({
								...subGroup,
								subgroup: {
									...subGroup.subgroup,
									phases: removeDuplicates(subGroup.subgroup.phases),
								},
							}))
						);
					} else {
						setSubgroups(resBody.item.subgroups);
					}
				});
			}
		});
	}, [supergroupId]);

	useEffect(() => {
		onChange(group);
	}, [group, onChange]);

	useEffect(() => {
		if (
			!superGroup.isCollegeRequired &&
			size(superGroup.subgroups) < 2 &&
			size(subgroups) < 2 &&
			subgroups[0]
		) {
			onChange(subgroups[0].subgroup);
		}
	}, [superGroup, subgroups, onChange]);
	/* -------------------- */

	if (superGroup.isCollegeRequired === false && size(subgroups) < 2) {
		return null;
	}
	const groups = [];
	let lastGroup = {};

	subgroups.forEach(sg => {
		if (sg.subgroup) {
			if (superGroup.name === sg.subgroup.name) {
				const tempSq = Object.assign({}, sg.subgroup);
				tempSq.name = 'Other';
				lastGroup = tempSq;
			} else if (sg.subgroup.name !== 'NOT_SET') {
				groups.push(sg.subgroup);
			}
		}
	});

	groups.sort(function(a, b) {
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return -1;
		}
		if (a.name.toLowerCase() > b.name.toLowerCase()) {
			return 1;
		}
		return 0;
	});

	if (Object.keys(lastGroup).length) groups.push(lastGroup);

	const selectText =
		'Select ' +
		(courseLabel
			? courseLabel
			: supergroupId === '5dd95e8097bc204881be3f2c' ||
			  supergroupId === '5e6084a7db44fb64668a8bf1'
			? 'Course'
			: 'College');

	const searchText =
		'Search ' +
		(courseLabel
			? courseLabel
			: supergroupId === '5dd95e8097bc204881be3f2c' ||
			  supergroupId === '5e6084a7db44fb64668a8bf1'
			? 'Course'
			: 'College');

	// console.log('check courseLabel', courseLabel, selectText, searchText);

	// console.log('check groupsxxx', groups);

	const selectGroup = groupId => {
		if (!groupId) {
			setGroup(null);
		} else {
			groups.forEach(g => {
				if (g._id === groupId) {
					setGroup(g);
				}
			});
		}
	};

	return (
		<>
			<label className={labelClassName || 'verify-details-downshift-label'}>
				{selectText}
			</label>
			<Select
				showSearch
				value={group && group._id}
				onChange={groupId => {
					setSearchQuery('');
					selectGroup(groupId);
				}}
				size="large"
				filterOption={e => true}
				placeholder={searchText}
				allowClear
				style={{ width: '100%' }}
				onSearch={setSearchQuery}
			>
				{groups
					.map(item => calculateMatch(item, formattedInputValue))
					.filter(i => i.match > 0.1)
					.sort((a, b) => b.match - a.match)
					.map(i => i.item)
					.map((item, index) => (
						<Select.Option key={item._id} value={item._id}>
							{item.name}
						</Select.Option>
					))}
			</Select>
		</>
	);
};

const mapStateToProps = state => ({ SuperGroups: state.api.SuperGroups });
export default connect(mapStateToProps)(SelectSubgroup);
