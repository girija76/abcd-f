import { groupTopics } from '../extra';
import { forEach, get, isEqual } from 'lodash';

export function todaysDateFunc(d) {
	return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export function yesterdaysDateFunc(d) {
	const date = new Date(d.getTime() - 24 * 60 * 60 * 1000);
	return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function nDayBackDateFunc(d, n) {
	const date = new Date(d.getTime() - n * 24 * 60 * 60 * 1000);
	return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function getStreakData(date, day, todaysCorrect) {
	let streakDay = day;
	let streakCorrect = todaysCorrect;
	if (date !== todaysDateFunc(new Date())) {
		if (date !== yesterdaysDateFunc(new Date())) streakDay = 0;
		streakCorrect = 0;
	}
	return { day: streakDay, score: streakCorrect };
}

export function getTarget(goal) {
	if (!goal.length) return 0;
	const Goals = [0, 5, 10, 20];
	return Goals[goal[goal.length - 1].goal];
}

export function nextDateFunc(date) {
	const day = parseInt(date.split('-')[0], 10);
	const month = parseInt(date.split('-')[1], 10);
	const year = parseInt(date.split('-')[2], 10);
	if (month === 12 && day === 31) {
		return `1-1-${year + 1}`;
	}
	if (
		(month === 1 ||
			month === 3 ||
			month === 5 ||
			month === 7 ||
			month === 8 ||
			month === 10 ||
			month === 12) &&
		day === 31
	) {
		return `1-${month + 1}-${year}`;
	}
	if (
		(month === 4 || month === 6 || month === 9 || month === 11) &&
		day === 30
	) {
		return `1-${month + 1}-${year}`;
	}
	if (month === 2 && day === 29 && year % 4 === 0) {
		return `1-${month + 1}-${year}`;
	}
	if (month === 2 && day === 28) {
		return `1-${month + 1}-${year}`;
	}
	return `${day + 1}-${month}-${year}`;
}

export function lastDateFunc(date) {
	const day = parseInt(date.split('-')[0], 10);
	const month = parseInt(date.split('-')[1], 10);
	const year = parseInt(date.split('-')[2], 10);
	if (month === 1 && day === 1) {
		// year change
		return `31-${12}-${year - 1}`;
	}
	if (
		(month === 2 ||
			month === 4 ||
			month === 6 ||
			month === 8 ||
			month === 9 ||
			month === 11) &&
		day === 1
	) {
		// month change
		return `31-${month - 1}-${year}`;
	}
	if (
		(month === 5 || month === 7 || month === 10 || month === 12) &&
		day === 1
	) {
		return `30-${month - 1}-${year}`;
	}
	if (month === 3 && day === 1 && year % 4 === 0) {
		return `29-${month - 1}-${year}`;
	}
	if (month === 3 && day === 1) {
		return `28-${month - 1}-${year}`;
	}
	return `${day - 1}-${month}-${year}`;
}

export function padZeros(number) {
	let num = number.toString();
	while (num.length < 2) num = `0${num}`;
	return num;
}

export function getRsbWidth() {
	if (window.screen.width < 1280) return 250;
	return 300;
}

export function getContentWidthFull() {
	if (window.screen.width < 900) return window.screen.width - 16 - 28;
	if (window.screen.width < 1280) return window.screen.width - 160 - 64 - 28; //including margin and padding
	return window.screen.width - 200 - 64 - 28;
}

export function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'pm' : 'am';
	hours %= 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${hours}:${minutes} ${ampm}`;
}

export function parseTestDateTime(date) {
	const startDate = new Date(date);
	return (
		startDate.getDate() +
		' ' +
		monthNames[startDate.getMonth()] +
		' - ' +
		formatAMPM(new Date(date))
	);
}

export function parseTestDateTime2(date) {
	const startDate = new Date(date);
	return (
		startDate.getDate() +
		' ' +
		monthNames[startDate.getMonth()] +
		' ' +
		formatAMPM(new Date(date))
	);
}

export function parseTestDate(date) {
	const startDate = new Date(date);
	return startDate.getDate() + ' ' + monthNames[startDate.getMonth()];
}

export function parseFullDate(date) {
	const startDate = new Date(date);
	return (
		startDate.getDate() +
		' ' +
		monthNames[startDate.getMonth()] +
		' ' +
		startDate.getFullYear()
	);
}

export function fillData(dailyActivity) {
	const todaysDate = todaysDateFunc(new Date());
	let data = [];
	if (dailyActivity.length) {
		data.push(dailyActivity[0]);
		let nextDate = dailyActivity[0].date;
		for (let i = 1; i < dailyActivity.length; i += 1) {
			nextDate = nextDateFunc(data[data.length - 1].date);
			const { date } = dailyActivity[i];
			let count = 0;
			while (nextDate !== date) {
				data.push({ todays_correct: 0, todays_count: 0, date: nextDate });
				nextDate = nextDateFunc(data[data.length - 1].date);
				count += 1;
				if (count > 50) break;
			}
			data.push(dailyActivity[i]);
		}
		if (data[data.length - 1].date !== todaysDate) {
			nextDate = nextDateFunc(data[data.length - 1].date);
			let count = 0;
			while (nextDate !== todaysDate) {
				data.push({ todays_correct: 0, todays_count: 0, date: nextDate });
				nextDate = nextDateFunc(data[data.length - 1].date);
				count += 1;
				if (count > 50) break;
			}
			data.push({ todays_correct: 0, todays_count: 0, date: nextDate });
		}
	}
	data = data.map((activity, idx) => ({ ...activity, id: idx }));
	return data;
}

export function parseTime(s, options) {
	const hours = Math.floor(s / 3600);
	const mins =
		options && options.noHours ? Math.floor(s / 60) : Math.floor((s % 3600) / 60);
	const secs = s % 60;
	if (options && options.noHours) {
		if (options.noMinutes) {
			return padZeros(s);
		}
		return `${padZeros(mins)} : ${padZeros(secs)}`;
	}
	return `${padZeros(hours)} : ${padZeros(mins)} : ${padZeros(secs)}`;
}
export function parseTimeString(s) {
	const hours = Math.floor(s / 3600);
	const mins = Math.floor((s % 3600) / 60);
	const secs = Math.floor(s % 60);
	let t = '';
	if (hours) {
		t += `${hours} hrs`;
		if (mins) t += ` ${mins} mins`;
	} else if (mins) {
		t += `${mins} mins`;
		if (secs) t += ` ${secs} secs`;
	} else {
		t += `${secs} secs`;
	}
	return t;
}

export const getAllSubTopics = topics => {
	const subTopics = [];
	topics.forEach(topic => {
		topic.sub_topics.forEach(subTopic => {
			subTopics.push(subTopic._id);
		});
	});
	return subTopics;
};

export function getTopicNameMapping(Topics) {
	const mapping = {};
	forEach(Topics, topic => {
		mapping[topic._id] = topic.name;
		forEach(topic.sub_topics, subTopic => {
			mapping[subTopic._id] = subTopic.name;
			if (subTopic.concepts) {
				subTopic.concepts.forEach(concept => {
					if (concept.concept) {
						mapping[concept.concept._id] = concept.concept.name;
					}
				});
			}
		});
	});
	return mapping;
}

export function getTopicParentNameMapping(Topics) {
	const mapping = {};
	Topics.forEach(topic => {
		mapping[topic._id] = { name: topic.name, parent: topic.name, pid: topic._id };
		topic.sub_topics.forEach(subTopic => {
			mapping[subTopic._id] = {
				name: subTopic.name,
				parent: topic.name,
				pid: topic._id,
			};
		});
	});
	return mapping;
}

export function parseDuration(duration) {
	const hours = Math.floor(duration / 3600);
	const mins = Math.floor((duration - 3600 * hours) / 60);
	if (hours > 0) {
		if (mins > 0) return `${hours} hr ${mins} mins`;
		return `${hours} Hours`;
	}
	return `${mins} Minutes`;
}

export const monthNames = [
	// this is now in extra.js
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export function checkLastQuestion(test, currSection, currQuestion) {
	if (test != null && currSection != null && currQuestion != null) {
		if (
			test.sections.length - 1 === currSection &&
			test.sections[currSection].questions.length - 1 === currQuestion
		)
			return true;
		return false;
	}
	return false;
}

export function checkLastQuestionOfSection(test, currSection, currQuestion) {
	if (test != null && currSection != null && currQuestion != null) {
		if (test.sections[currSection].questions.length - 1 === currQuestion)
			return true;
		return false;
	}
	return false;
}

/**
 * Does format of answerSheet matches with that of assessmentCore
 */
export function verifyAnswerSheetIntegrity(assessmentCore, answerSheet) {
	if (answerSheet == null) return false;
	if (assessmentCore._id !== answerSheet._id) return false;
	if (assessmentCore.sections && !answerSheet.sections) return false;
	if (assessmentCore.sections.length !== answerSheet.sections.length)
		return false;
	for (let i = 0; i < assessmentCore.sections.length; i++) {
		if (assessmentCore.sections[i]._id !== answerSheet.sections[i]._id)
			return false;
		if (assessmentCore.sections[i].name !== answerSheet.sections[i].name)
			return false;
		if (
			answerSheet.sections[i].total_questions !==
			answerSheet.sections[i].questions.length
		)
			return false;
		if (
			assessmentCore.sections[i].questions &&
			!answerSheet.sections[i].questions
		)
			return false;
		if (
			assessmentCore.sections[i].questions.length !==
			answerSheet.sections[i].questions.length
		)
			return false;
		for (let j = 0; j < assessmentCore.sections[i].questions.length; j++) {
			if (
				assessmentCore.sections[i].questions[j].question._id !==
				answerSheet.sections[i].questions[j]._id
			)
				return false;
			if (answerSheet.sections[i].questions[j].time == null) return false;
			if (answerSheet.sections[i].questions[j].state == null) return false;
		}
	}
	return true;
}

export function removeRedundantFlow(flow) {
	const newFlow = [];
	flow.forEach(f => {
		if (newFlow.length) {
			const lastFlow = newFlow[newFlow.length - 1];
			if (lastFlow.section === f.section && lastFlow.question === f.question) {
				newFlow[newFlow.length - 1].time += f.time;
				newFlow[newFlow.length - 1].id = f.id;
				newFlow[newFlow.length - 1].action = f.action;
				newFlow[newFlow.length - 1].state = f.state;
				newFlow[newFlow.length - 1].response = f.response;
			} else {
				newFlow.push(f);
			}
		} else {
			newFlow.push(f);
		}
	});
	return newFlow;
}

export function removeOverlap(flow1, flow2) {
	const flowMap = {};
	flow1.forEach(f => {
		flowMap[f.id] = f;
	});

	const newFlow = [];
	flow2.forEach(f => {
		if (
			!flowMap[f.id] ||
			!isEqual(f.response, get(flowMap, [f.id, 'response']))
		) {
			newFlow.push(f);
		}
	});
	return newFlow;
}

export function filterAssessmentsBySupergroup(assessments, supergroup) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (!supergroup || assessment.supergroup === supergroup)
			filteredAssessments.push(assessment);
	});
	return filteredAssessments;
}

export function filterSubmissionsBySupergroup(submissions, supergroup) {
	const filteredSubmissions = [];
	submissions.forEach(submission => {
		if (!supergroup || submission.assessment.supergroup === supergroup)
			filteredSubmissions.push(submission);
	});
	return filteredSubmissions;
}

export function filterAssessmentsByTopic(assessments) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (assessment.topic) filteredAssessments.push(assessment);
	});
	return filteredAssessments;
}

export function filterAssessmentsBySection(assessments) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (assessment.section) filteredAssessments.push(assessment);
	});
	return filteredAssessments;
}

export function filterAssessmentsByCompete(assessments) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (!assessment.section && !assessment.topic)
			filteredAssessments.push(assessment);
	});
	return filteredAssessments;
}

export function filterAssessmentsByLabel(assessments, label) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (!label || assessment.label === label) {
			filteredAssessments.push(assessment);
		}
	});
	return filteredAssessments;
}

export function filterAssessmentsByLive(assessments, label) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (!assessment.autoGrade) {
			filteredAssessments.push(assessment);
		}
	});
	return filteredAssessments;
}

export function filterAssessmentsByMock(assessments, label) {
	const filteredAssessments = [];
	assessments.forEach(assessment => {
		if (assessment.autoGrade) {
			filteredAssessments.push(assessment);
		}
	});
	return filteredAssessments;
}

export function getTopicGroups(topics_) {
	const topics = [];
	const topicGroups = {};
	const topicGroupsByTopicId = {};

	topics_.forEach(topic => {
		const showTopic = topic.sub_topics.some(subtopic => {
			return !subtopic.hide;
		});
		if (showTopic && groupTopics[topic.name] === undefined) {
			topics.push(topic);
		} else if (showTopic) {
			if (topicGroups[groupTopics[topic.name]] === undefined) {
				topicGroups[groupTopics[topic.name]] = [];
			}
			topicGroups[groupTopics[topic.name]].push(topic);
			topicGroupsByTopicId[topic._id] = groupTopics[topic.name];
			topic.sub_topics.forEach(subtopic => {
				topicGroupsByTopicId[subtopic._id] = groupTopics[topic.name];
			});
		}
	});
	return { topics, topicGroups, topicGroupsReverse: topicGroupsByTopicId };
}

export function checkMobileNumber(number) {
	const filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
	return filter.test(number) && number.length === 10;
}

export function getPhaseFromSubscription(subscriptions, currentSupergroup) {
	let activePhase = '';
	subscriptions.forEach(subscription => {
		if (subscription.group === currentSupergroup) {
			subscription.subgroups.forEach(sg => {
				sg.phases.forEach(ph => {
					if (ph.active) activePhase = ph.phase;
				});
			});
		}
	});
	return activePhase;
}

export function getCurrentSupergroup() {
	const { supergroups } = window.config;
	if (supergroups && supergroups.length === 1) return supergroups[0]._id;
	return localStorage.getItem('currentSupergroup');
}

export function flushSubmissionsFromLocalStorage(id) {
	const keys = Object.keys(localStorage);
	keys.forEach(k => {
		if (k.length === 26 && k[0] === 's' && k[1] === '-' && k !== `s-${id}`) {
			localStorage.removeItem(k);
		} else if (
			k.length === 28 &&
			k[0] === 'e' &&
			k[1] === 'x' &&
			k[2] === 'p' &&
			k[3] === '-' &&
			k !== `exp-${id}`
		) {
			localStorage.removeItem(k);
		}
	});
}

export function isAccessGranted(subscriptions) {
	let accessGranted = true;
	subscriptions.forEach(subscription => {
		subscription.subgroups.forEach(group => {
			group.phases.forEach(phase => {
				if (phase.active && phase.isAccessGranted === false) {
					accessGranted = false;
				}
			});
		});
	});
	return accessGranted;
}

export function getRevocationReason(subscriptions) {
	let revocationReason = {};
	subscriptions.forEach(subscription => {
		subscription.subgroups.forEach(group => {
			group.phases.forEach(phase => {
				if (phase.active && phase.isAccessGranted === false) {
					revocationReason = phase.revocationReason;
				}
			});
		});
	});
	return revocationReason;
}

export function shouldSendEmail(subscriptions) {
	const { customHeaderComponent } = window.config;

	if (customHeaderComponent === 'reliable') {
		return false;
	} else {
		return true;
	}
}

export function renameWrapper(wrapper, phase) {
	let newname = wrapper.name;
	let newslang = wrapper.slang;
	let newavailablefrom = wrapper.availableFrom;
	let newexpireson = wrapper.expiresOn;
	wrapper.phases.forEach(p => {
		if (p.phase.toString() == phase) {
			if (p.name) newname = p.name;
			if (p.slang) newslang = p.slang;
			if (p.expiresOn) newexpireson = p.expiresOn;
		}
	});
	wrapper.name = newname;
	wrapper.slang = newslang;
	wrapper.availableFrom = newavailablefrom;
	wrapper.expiresOn = newexpireson;
	return wrapper;
}
