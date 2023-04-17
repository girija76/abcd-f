import axios from 'axios';
import { URLS } from 'components/urls';

export function exportCSVFile(headers, items, fileTitle) {
	if (headers) {
		items.unshift(headers);
	}

	// Convert Object to JSON
	var jsonObject = JSON.stringify(items);

	var csv = convertToCSV(jsonObject);

	var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

	var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) {
		// IE 10+
		navigator.msSaveBlob(blob, exportedFilenmae);
	} else {
		var link = document.createElement('a');
		if (link.download !== undefined) {
			// feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', exportedFilenmae);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

export const questionFormatToCSV = async (response, topic) => {
	const topics = await getTopics();
	const data = [];
	for (let i = 0; i < response.length; i++) {
		data.push({
			index: i + 1,
			...response[i],
			topic: getNameOfTopic(response[i].topic, 'topic', topics),
			sub_topic: getNameOfTopic(response[i].sub_topic, '', topics),
		});
	}
	exportCSVFile(
		[
			'Question No',
			'Correct Marks',
			'Incorrect Marks',
			'Type',
			'Correct Answer',
			'Topic',
			'Sub Topic',
		],
		data,
		'QuestionFormat'
	);
};

export const getTopics = async () => {
	let topics = [];
	await axios
		.get(`${URLS.backendTopics}/getAll`, {
			withCredentials: true,
			headers: { Authorization: `Token ${window.localStorage.getItem('token')}` },
		})
		.then(async response => {
			topics = response.data;
		})
		.catch(err => {
			console.log(err);
		});
	return topics;
};

export const getNameOfTopic = (id, type, topicArray) => {
	if (type === 'topic') {
		for (let i = 0; i < topicArray.length; i++) {
			if (topicArray[i]._id === id) return topicArray[i].name;
		}
	} else {
		for (let i = 0; i < topicArray.length; i++) {
			for (let j = 0; j < topicArray[i].sub_topics.length; j++) {
				if (topicArray[i].sub_topics[j]._id === id)
					return topicArray[i].sub_topics[j].name;
			}
		}
	}
};
