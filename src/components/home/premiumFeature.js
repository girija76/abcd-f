import React, { Component } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Downshift from 'downshift';
import TestSeries from './TestSeries';
import { URLS } from '../urls';

import { THEME1 } from '../colors';
import './premiumFeature.css';
import '../landingPage/VerifyDetails.css';

import { FileTextFilled, UnlockFilled } from '@ant-design/icons';
import { isLite } from 'utils/config';

const COLORS = THEME1.COLORS;

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

export default class lastActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showPlacementModal: false,
			supergroup: { name: '', subgroups: [] },
			group: '',
			groupError: false,
			collegeError: false,
		};
	}

	subscribeCat = () => {
		const { placementFound } = this.props;

		if (placementFound) {
			fetch(`${URLS.backendGroups}/subscribeCat`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}).then(response => {
				if (response.ok) {
					window.location.reload();
				}
			});

			// const supergroup = '5d10e43944c6e111d0a17d0c';
			// const subgroup = '5db1c9e160908b33b21fbfc8';
			// const phase = '5e008afc6f40c16ebaf27592';

			// fetch(`${URLS.backendUsers}/addaccount`, {
			// 	method: 'POST',
			// 	headers: {
			// 		Accept: 'application/json',
			// 		'Content-Type': 'application/json',
			// 	},
			// 	credentials: 'include',
			// 	body: JSON.stringify({ supergroup, subgroup, phase }),
			// }).then(response => {
			// 	if (response.ok) {
			// 		// window.location.reload();
			// 	}
			// });
		}
	};

	subscribePlacement = () => {
		const { group } = this.state;
		const groupMap = this.getGroupMapping();
		const college =
			groupMap[group] === 'Placement' ? this.refs.college.value : '';
		if (!group) {
			this.setState({ groupError: '*Required' });
		} else if (groupMap[group] === 'Placement' && college === '') {
			this.setState({ collegeError: '*Required' });
		} else {
			fetch(`${URLS.backendGroups}/subscribePlacement`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ group, college }),
			}).then(response => {
				if (response.ok) {
					window.location.reload();
				}
			});
		}
	};

	removeCollegeError = () => this.setState({ collegeError: false });

	fetchPlacementColleges = () => {
		const { catFound } = this.props;
		if (catFound) {
			fetch(`${URLS.backendGroups}/getColleges`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}).then(response => {
				if (response.ok) {
					response.json().then(responseJson => {
						this.setState({
							supergroup: responseJson.supergroup,
							showPlacementModal: true,
						});
					});
				}
			});
		}
	};

	viewMoreCat = () => {
		this.setState({ showModal: true });
	};

	renderCollegeSelect = () => {
		const groups = [];
		let lastGroup = {};
		const { supergroup, group } = this.state;

		supergroup.subgroups.forEach(sg => {
			if (sg.subgroup) {
				if (supergroup.name === sg.subgroup.name) {
					const tempSq = Object.assign({}, sg.subgroup);
					tempSq.name = 'Other';
					lastGroup = tempSq;
				} else {
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

		return (
			<div style={{ maxHeight: '90px' }}>
				<Downshift
					onChange={selection => {
						this.setState({ group: selection ? selection._id : group });
					}}
					itemToString={item => (item ? item.name : '')}
				>
					{({
						getInputProps,
						getItemProps,
						getLabelProps,
						getMenuProps,
						isOpen,
						inputValue,
						highlightedIndex,
						selectedItem,
						closeMenu,
						setState,
					}) => {
						const formattedInputValue = inputValue.replace(/\s+/g, ' ').toLowerCase();
						return (
							<div className="verify-details-downshift-container">
								<label {...getLabelProps()} className="verify-details-downshift-label">
									Select College
								</label>
								<input
									{...getInputProps({
										onKeyDown: event => {
											if (event.key === 'Escape') {
												event.nativeEvent.preventDownshiftDefault = true;
												closeMenu();
												setState({ inputValue: selectedItem ? selectedItem.name : '' });
											}
										},
									})}
									className={
										'custom-input' + (isOpen ? ' verify-details-downshift-open' : '')
									}
									placeholder="Search College"
								/>
								{isOpen ? (
									<ul {...getMenuProps} className="verify-details-downshift-option-list">
										{groups
											.map(item => calculateMatch(item, formattedInputValue))
											.filter(i => i.match > 0.1)
											.sort((a, b) => b.match - a.match)
											.map(i => i.item)
											.map((item, index) => (
												<li
													{...getItemProps({
														key: item.name,
														index,
														item,
														style: {
															backgroundColor: highlightedIndex === index ? '#eee' : '#fff',
															display: 'block',
															padding: '.8rem 1.1rem',
														},
													})}
												>
													{item.name}
												</li>
											))}
									</ul>
								) : null}
							</div>
						);
					}}
				</Downshift>
			</div>
		);
	};

	getGroupMapping = () => {
		const { supergroup } = this.state;
		const mapping = {};
		supergroup.subgroups.forEach(group => {
			mapping[group.subgroup._id] = group.subgroup.name;
		});
		return mapping;
	};

	render = () => {
		const { showModal, showPlacementModal, group, collegeError } = this.state;
		const { placementFound, catFound } = this.props;
		const token = localStorage.getItem('token');
		const redirectUrl = token
			? `${URLS.mentorshipPortal}/dashboard/?token=${token}`
			: URLS.mentorshipPortal;

		const groupMap = this.getGroupMapping();
		const showCollegeInput = groupMap[group] === 'Placement';

		return (
			<Card
				size={isLite ? 'small' : 'default'}
				bordered={!isLite}
				headStyle={{
					fontSize: 18,
					borderBottom: 0,
					color: COLORS.text,
				}}
				bodyStyle={{
					display: 'flex',
					alignItems: 'center',
				}}
				style={{ marginBottom: 24, borderRadius: isLite ? 0 : undefined }}
				title="Premium Features"
			>
				<Card
					style={{
						backgroundColor: COLORS.dark,
						height: 200,
						width: 200,
						borderRadius: 4,
					}}
					bodyStyle={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
						height: '100%',
					}}
				>
					<FileTextFilled style={{ color: 'white', fontSize: 52 }} />
					<div
						style={{
							fontWeight: 'bolder',
							color: 'white',
							marginTop: 10,
							marginBottom: 3,
						}}
					>
						Resume Review
					</div>
					<div
						style={{ color: 'white', fontSize: 12, marginTop: 3, marginBottom: 10 }}
					>
						2000 XP
					</div>

					<a rel="noreferrer" target="_blank" href={redirectUrl}>
						<Button
							data-ga-on="click,auxclick"
							data-ga-event-action="click"
							data-ga-event-category="Premium Feature"
							data-ga-event-label="Resume Review"
							style={{
								borderRadius: '1000px',
								width: 130, // 110
								height: 40,
								fontWeight: 'bold',
							}}
							disabled={false}
						>
							Unlock Now
						</Button>
					</a>
				</Card>

				{placementFound && !catFound ? (
					<Card
						style={{
							backgroundColor: COLORS.dark,
							height: 200,
							width: 606,
							borderRadius: 4,
							marginLeft: 12,
						}}
						bodyStyle={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							height: '100%',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							<UnlockFilled style={{ color: 'white', fontSize: 52 }} />
							<div
								style={{
									fontWeight: 'bolder',
									color: 'white',
									marginTop: 10,
									marginBottom: 3,
								}}
							>
								CAT
							</div>
							<div
								style={{ color: 'white', fontSize: 12, marginTop: 3, marginBottom: 10 }}
							>
								{1 ? 'FREE' : '2000 XP'}
							</div>

							<Button
								style={{
									borderRadius: '1000px',
									width: 130, // 110
									height: 40,
									fontWeight: 'bold',
								}}
								disabled={false}
								data-ga-on="click"
								data-ga-event-action="click"
								data-ga-event-category="Premium Feature"
								data-ga-event-label="Subscribe to CAT"
								onClick={this.subscribeCat}
							>
								Subscribe
							</Button>
						</div>
						<div
							style={{
								color: 'white',
								padding: '0px 12px',
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
							}}
						>
							<div
								style={{
									flex: 1,
									display: 'flex',
									justifyContent: 'center',
									flexDirection: 'column',
								}}
							>
								<div style={{ fontWeight: 'bolder', marginBottom: 8, fontSize: 18 }}>
									CAT TEST SERIES
								</div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div
										style={{
											width: 8,
											height: 8,
											backgroundColor: 'white',
											borderRadius: 1000,
											marginRight: 8,
										}}
									></div>
									<span>500+ Practice Sessions</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div
										style={{
											width: 8,
											height: 8,
											backgroundColor: 'white',
											borderRadius: 1000,
											marginRight: 8,
										}}
									></div>
									<span>40+ Topic Tests, 10+ Sectional Tests</span>
								</div>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div
										style={{
											width: 8,
											height: 8,
											backgroundColor: 'white',
											borderRadius: 1000,
											marginRight: 8,
										}}
									></div>
									<span>5+ Personalized Tests, 5 Complete Mock Tests</span>
								</div>
							</div>
							<div style={{ display: 'flex' }}>
								<div style={{ flex: 1 }}></div>
								<Button
									size="small"
									type="dashed"
									style={{
										borderRadius: 1000,
										// color: 'white',
										padding: '0px 12px',
										backgroundColor: 'transparent',
									}}
									className="white-button"
									onClick={this.viewMoreCat}
								>
									View more
								</Button>
							</div>
						</div>
					</Card>
				) : null}

				{catFound && !placementFound ? (
					<Card
						style={{
							backgroundColor: COLORS.dark,
							height: 200,
							width: 606,
							borderRadius: 4,
							marginLeft: 12,
						}}
						bodyStyle={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							height: '100%',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
								justifyContent: 'center',
							}}
						>
							<UnlockFilled style={{ color: 'white', fontSize: 52 }} />
							<div
								style={{
									fontWeight: 'bolder',
									color: 'white',
									marginTop: 10,
									marginBottom: 3,
								}}
							>
								PLACEMENT
							</div>
							<div
								style={{ color: 'white', fontSize: 12, marginTop: 3, marginBottom: 10 }}
							>
								2000 XP
							</div>

							<Button
								style={{
									borderRadius: '1000px',
									width: 130, // 110
									height: 40,
									fontWeight: 'bold',
								}}
								disabled={false}
								onClick={this.fetchPlacementColleges}
							>
								Subscribe
							</Button>
						</div>
						<div style={{ color: 'white', padding: 12 }}>
							<div style={{ fontWeight: 'bolder', marginBottom: 8, fontSize: 18 }}>
								PLACEMENT TEST SERIES
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{
										width: 8,
										height: 8,
										backgroundColor: 'white',
										borderRadius: 1000,
										marginRight: 8,
									}}
								></div>
								<span>1 Mock Test with projected ranking and analysis</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{
										width: 8,
										height: 8,
										backgroundColor: 'white',
										borderRadius: 1000,
										marginRight: 8,
									}}
								></div>
								<span>18 Section Practice Tests</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									style={{
										width: 8,
										height: 8,
										backgroundColor: 'white',
										borderRadius: 1000,
										marginRight: 8,
									}}
								></div>
								<span>12 Live Assessments</span>
							</div>
						</div>
					</Card>
				) : null}
				<Modal
					visible={showModal}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
					footer={null}
					title="CAT Test Series"
					className="test-series-modal"
				>
					<TestSeries />
				</Modal>
				<Modal
					visible={showPlacementModal}
					onCancel={() => {
						this.setState({ showPlacementModal: false });
					}}
					footer={
						<Button
							type="primary"
							onClick={this.subscribePlacement}
							disabled={!group}
						>
							Confirm
						</Button>
					}
					title="College Details"
				>
					{this.renderCollegeSelect()}
					{showCollegeInput ? (
						<input
							className="custom-input"
							placeholder="Enter college name"
							ref="college"
							onChange={this.removeCollegeError}
							style={{ marginTop: 8 }}
						/>
					) : null}
					{showCollegeInput ? (
						collegeError ? (
							<div style={{ fontSize: 10, color: 'red', height: 13, marginTop: 2 }}>
								{collegeError}
							</div>
						) : null
					) : null}
				</Modal>
			</Card>
		);
	};
}
