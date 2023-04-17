import React, { Component } from 'react';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';

import Editor from '../Editor';

import { URLS } from '../urls.js';

const customStyleMap = {
	super: { verticalAlign: 'super', fontSize: '.8rem' },
	sub: { verticalAlign: 'sub', fontSize: '0.8rem' },
	equation: { marginLeft: '1px', marginRight: '1px', fontStyle: 'italic' },
};

class TopicNote extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			note: undefined,
			editMode: false,
		};
	}

	componentWillMount() {
		const { id } = this.props;
		const token = localStorage.getItem('token');
		fetch(`${URLS.backendTopics}/defaultnote/${id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Token ' + token,
			},
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					this.setState({ note: responseJson.topicNote });
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.id && nextProps.id !== this.props.id) {
			const token = localStorage.getItem('token');
			fetch(`${URLS.backendTopics}/defaultnote/${nextProps.id}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Token ' + token,
				},
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						this.setState({
							note: responseJson.topicNote,
							editMode: false,
						});
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}

	noteRef = ref => {
		this['note-ref'] = ref;
	};

	editNote = () => this.setState({ editMode: true });
	cancelEdit = () => this.setState({ editMode: false });

	updateNote = () => {
		const { id: sid } = this.props;
		const { note } = this.state;
		const id = note ? note._id : null;
		const data = this['note-ref'].value;
		const token = localStorage.getItem('token');
		fetch(URLS.backendTopics + '/updatenote', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Token ' + token,
			},
			body: JSON.stringify({ id, data, sid, preferred: false }),
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					this.setState({
						note: responseJson.topicNote,
						editMode: false,
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	render() {
		const { note, editMode } = this.state;
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				{note !== undefined ? (
					<div style={{ width: '100%' }}>
						{note !== null ? (
							<div>
								{!editMode ? (
									<Editor
										key={note._id}
										rawContent={note.note.rawContent}
										customStyleMap={customStyleMap}
									/>
								) : (
									<Editor
										readOnly={false}
										customRef={this.noteRef}
										rawContent={note.note.rawContent}
									/>
								)}
							</div>
						) : (
							<div>
								{!editMode ? (
									<div>Coming Soon...</div>
								) : (
									<Editor
										readOnly={false}
										customRef={this.noteRef}
										rawContent={undefined}
									/>
								)}
							</div>
						)}
						<div style={{ display: 'flex', marginTop: 18, alignItems: 'center' }}>
							<div style={{ flex: 1 }}>
								{note ? <span>Credits: </span> : null}
								{note ? (
									<span style={{ fontWeight: 'bold' }}>{note.user.username}</span>
								) : null}
							</div>
							{editMode ? (
								<div>
									<Button
										type="danger"
										onClick={this.cancelEdit}
										style={{ marginRight: 12 }}
									>
										Cancel
									</Button>
									<Button type="primary" onClick={this.updateNote}>
										Update
									</Button>
								</div>
							) : (
								<Button type="primary" onClick={this.editNote}>
									Edit
								</Button>
							)}
						</div>
					</div>
				) : (
					<Spin />
				)}
			</div>
		);
	}
}

/*

<TeXEditor
								customRef={this.questionRef}
								rawContent={content.rawContent}
							/>

							*/

export default TopicNote;
