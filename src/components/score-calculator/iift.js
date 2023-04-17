/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Footer from '../landingPage/LandingPageFooter';
import Table from 'antd/es/table';

import { URLS } from '../urls';

import { iiftAnswers } from './iiftAnswers';

import { validateEmail } from 'utils/user';

import IIMA from '../images/resources/iima.jpg';
import Ads from '../resources/Ads';

import './style.css';

const { Search } = Input;

const column = [
	{
		title: 'Topic',
		dataIndex: 'topic',
		key: 'topic',
	},
	{
		title: 'Total',
		key: 'total',
		dataIndex: 'total',
	},
	{
		title: 'Correct',
		key: 'correct',
		dataIndex: 'correct',
	},
	{
		title: 'Incorrect',
		dataIndex: 'incorrect',
		key: 'incorrect',
	},
	{
		title: 'Unattempted',
		dataIndex: 'unattempted',
		key: 'unattempted',
	},
	{
		title: 'Score',
		dataIndex: 'score',
		key: 'score',
		render: score => <span style={{ fontWeight: 'bold' }}>{score}</span>,
	},
];

const styles = {
	Correct: { color: 'green', fontWeight: 'bold' },
	Incorrect: { color: 'red', fontWeight: 'bold' },
	Unattempted: {},
};

const columnQuestion = [
	{
		title: 'Question',
		dataIndex: 'question',
		key: 'question',
	},
	{
		title: 'Your Answer',
		key: 'response',
		dataIndex: 'response',
	},
	{
		title: 'Correct Answer',
		dataIndex: 'correct',
		key: 'correct',
	},
	{
		title: 'Result',
		dataIndex: 'result',
		key: 'result',
		render: result => <span style={styles[result]}>{result}</span>,
	},
];

class Iift extends Component {
	constructor(props) {
		super(props);
		this.state = {
			urlError: false,
			emailError: false,
			phoneError: false,
			email: '',
			phone: '',
			sections: [],
		};
	}

	catCourseDetails = color => {
		return (
			<div
				style={{
					backgroundColor: color,
					padding: 24,
					flex: 1,
					margin: 24,
					color: 'white',
					borderRadius: 4,
				}}
			>
				<div style={{ fontSize: 24, fontWeight: 500 }}>CAT Course Details</div>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Unlimited Practice Sessions
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					44 Topic Tests (15 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					10 Sectional Tests (60 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					5 Mini Mocks (60 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					3 Full Mocks (180 mins each)
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					24x7 doubt clarification on our{' '}
					<a
						href="https://t.me/joinchat/MtofdhWBY_JfEUnTIiLC8w"
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Telegram Group
					</a>
				</li>
				<li style={{ margin: '8px 0px', fontSize: 16 }}>
					Concept videos on{' '}
					<a
						href="https://www.youtube.com/channel/UCg0AJl1CbDVzrjlJuk0c4AQ"
						target="_blank"
						style={{ color: 'white', textDecoration: 'underline' }}
					>
						Youtube
					</a>
				</li>
			</div>
		);
	};

	parseData = rootElement => {
		let i = 0;
		let found = true;
		let counter = 0;
		const sections = [];
		while (1) {
			if (counter > 1000) break;
			const section = rootElement.querySelectorAll(
				`div > div.grp-cntnr > div:nth-child(${i +
					1}) > div.section-lbl > span.bold`
			);

			if (section.length) {
				sections.push({ name: section[0].innerHTML, questions: [] });
				let j = 0;
				while (1) {
					counter += 1;
					if (counter > 1000) break;
					const id = rootElement.querySelectorAll(
						`div > div.grp-cntnr > div:nth-child(${i + 1}) > div:nth-child(${j +
							2}) > table > tbody > tr > td > table.menu-tbl > tbody > tr:nth-child(2) > td.bold`
					);
					const response = rootElement.querySelectorAll(
						`div > div.grp-cntnr > div:nth-child(${i + 1}) > div:nth-child(${j +
							2}) > table > tbody > tr > td > table.menu-tbl > tbody > tr:nth-child(8) > td.bold`
					);
					if (id.length && response.length) {
						sections[i].questions.push({
							id: id[0].innerHTML,
							response: response[0].innerHTML,
						});
						j += 1;
					} else {
						break;
					}
				}
				i += 1;
			} else {
				break;
			}
		}
		this.setState({ sections });
	};

	getAggregate = sections => {
		const data = [];
		let totalCorrect = 0;
		let totalIncorrect = 0;
		let totalUnattempted = 0;
		let totalScore = 0;
		let total = 0;
		sections.forEach((section, idx) => {
			let correct = 0;
			let incorrect = 0;
			let unattempted = 0;
			let score = 0;
			section.questions.forEach((q, qidx) => {
				if (q.response === ' -- ') unattempted += 1;
				else if (iiftAnswers[q.id] == q.response) {
					correct += 1;
					score += idx === 3 ? 1.5 : 3;
				} else {
					incorrect += 1;
					score -= idx === 3 ? 0.5 : 1;
				}
			});
			data.push({
				key: idx,
				topic: section.name,
				total: section.questions.length,
				correct,
				incorrect,
				unattempted,
				score,
			});
			totalCorrect += correct;
			totalIncorrect += incorrect;
			totalUnattempted += unattempted;
			totalScore += score;
			total += section.questions.length;
		});

		data.push({
			key: data.length,
			topic: 'Overall',
			total,
			correct: totalCorrect,
			incorrect: totalIncorrect,
			unattempted: totalUnattempted,
			score: totalScore,
		});
		return data;
	};

	validURL = str => {
		if (str.indexOf('https://cdn3.digialm.com') === -1) return false;
		if (str.indexOf('touchstone') === -1) return false;
		if (str.indexOf('AssessmentQPHTMLMode1') === -1) return false;

		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // fragment locator
		return !!pattern.test(str);
	};

	validPhone = str => {
		const pattern = new RegExp(
			'^+{0,2}([-. ])?((?d{0,3}))?([-. ])?(?d{0,3})?([-. ])?d{3}([-. ])?d{4}'
		);
		return pattern.test(str);
	};

	validPhone = phone => {
		return /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(phone);
	};

	getMarks = value => {
		const { email, phone } = this.state;
		if (!validateEmail(email)) {
			this.setState({ emailError: true, phoneError: false, urlError: false });
		} else if (!this.validPhone(phone)) {
			this.setState({ phoneError: true, emailError: false, urlError: false });
		} else if (this.validURL(value)) {
			fetch(`${URLS.backendUnauthorized}/iift`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					phone,
					url: value,
				}),
			})
				.then(response => {
					if (response.ok) {
						response.json().then(responseJson => {
							if (responseJson.success) {
								const rootElement = document.createElement('div');
								rootElement.innerHTML = responseJson.body;
								this.parseData(rootElement);
							} else {
								this.setState({ urlError: true, emailError: false, phoneError: false });
							}
						});
					} else {
						this.setState({ urlError: true, emailError: false, phoneError: false });
					}
				})
				.catch(() => {
					this.setState({ urlError: true, emailError: false, phoneError: false });
				});
		} else {
			this.setState({ urlError: true, emailError: false, phoneError: false });
		}
	};

	updateEmail = e => {
		this.setState({ email: e.target.value, emailError: false });
	};

	updatePhone = e => {
		this.setState({ phone: e.target.value, phoneError: false });
	};

	render = () => {
		const {
			urlError,
			phoneError,
			emailError,
			sections,
			email,
			phone,
		} = this.state;

		const courseDetails = this.catCourseDetails('#1265c7');

		const aggregate = this.getAggregate(sections);

		return (
			<div>
				<Helmet>
					<title>IIFT 2019 Score Calculator | Prepleaf</title>
				</Helmet>
				<div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
					<img src={IIMA} />
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: 280,
							zIndex: 10,
							backgroundColor: 'rgba(0, 0, 0, 0.55)',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								fontSize: 40,
								// lineHeight: '52px',
								color: 'white',
							}}
						>
							IIFT Score - 2019
						</div>
						<div
							style={{
								fontSize: 18,
								color: 'white',
								padding: '0px 24px',
								textAlign: 'center',
							}}
						>
							IIFT 2019 Score Calculator
						</div>
					</div>
				</div>
				<div
					style={{
						minHeight: 'calc(100vh - 92px)',
						display: 'flex',
						justifyContent: 'center',
						marginTop: 12,
					}}
				>
					<div className="resource-outer-wrapper">
						<div
							style={{
								margin: '0px 48px',
								paddingTop: 28,
								display: 'none',
							}}
						>
							IIFT 2019 Score Calculator - [December 03, 2019]
						</div>
						<div
							style={{
								display: 'flex',
								padding: 0,
								paddingTop: 0,
								justifyContent: 'space-evenly',
							}}
							className="course-structure-wrapper"
						>
							<div
								style={{
									flex: 2,
									backgroundColor: 'white',
									border: '1px solid #dadada',
									borderRadius: 4,
								}}
								className="resource-inner-wrapper"
							>
								<h1>Get your IIFT score by uploading attempts html link!</h1>

								<div>
									Follow these steps to get your attempts html link-
									<ol>
										<li>
											<a
												href="https://testservices.nic.in/examsys/root/DownloadAdmitCard.aspx?enc=Ei4cajBkK1gZSfgr53ImFTbkLRz6TSkszT/RJCkN7FM="
												target="_blank"
											>
												Login to IIFT 2019 official website
											</a>
										</li>
										<li>Click on "Candidate Response"</li>
										<li>
											You can see the text "Please click here to download Candidate
											Response for IIFT 2019."
										</li>
										<li>Right Click (long press in mobiles) "here" on that page</li>
										<li>Select "Copy Link Address"</li>
										<li>Paste the link in "Enter Url" and click on Submit</li>
									</ol>
								</div>

								<div style={{ display: 'flex', marginBottom: 12 }}>
									<Input
										placeholder="Email"
										style={{ width: 300 }}
										onChange={this.updateEmail}
										value={email}
									/>
									<Input
										type="number"
										placeholder="Phone"
										style={{ width: 180, marginLeft: 12 }}
										onChange={this.updatePhone}
										value={phone}
									/>
								</div>
								<Search
									placeholder="enter attempts html link"
									enterButton="Submit"
									size="large"
									onChange={() => {
										this.setState({ urlError: false });
									}}
									onSearch={value => this.getMarks(value.trim())}
								/>
								{urlError ? <span style={{ color: 'red' }}>Invalid Url</span> : null}
								{emailError ? (
									<span style={{ color: 'red' }}>Invalid Email</span>
								) : null}
								{phoneError ? (
									<span style={{ color: 'red' }}>Invalid Phone number</span>
								) : null}

								{aggregate.length > 1 ? (
									<div
										style={{
											border: '1px solid #dadada',
											borderRadius: 2,
											marginTop: 36,
										}}
									>
										<Table
											columns={column}
											dataSource={aggregate}
											style={{ backgroundColor: 'white' }}
											pagination={false}
										/>
									</div>
								) : null}

								{sections.map((section, sidx) => {
									const data = section.questions.map((q, idx) => {
										let result = 'Unattempted';
										if (q.response == iiftAnswers[q.id]) {
											result = 'Correct';
										} else if (q.response !== ' -- ') {
											result = 'Incorrect';
										}
										return {
											question: `Question ${idx + 1}`,
											response: q.response,
											correct: iiftAnswers[q.id],
											result,
										};
									});
									return (
										<div
											style={{
												marginTop: 24,
											}}
										>
											<div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
												{section.name}
											</div>
											<div
												style={{
													border: '1px solid #dadada',
													borderRadius: 2,
												}}
											>
												<Table
													columns={columnQuestion}
													dataSource={data}
													style={{ backgroundColor: 'white' }}
													pagination={false}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<Ads target="cat" />
				</div>

				<div style={{ backgroundColor: 'white' }}>
					<Footer />
				</div>
			</div>
		);
	};
}

export default Iift;
