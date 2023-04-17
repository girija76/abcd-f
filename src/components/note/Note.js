import React from 'react';
import { connect } from 'react-redux';
import Card from 'antd/es/card';
import Input from 'antd/es/input';

import { updateNote } from 'actions/session';

import './Note.css';

const { TextArea } = Input;

class Note extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			text: props.note.data,
		};
	}
	save = (text, saveNow) => {
		clearTimeout(this.timer);
		clearTimeout(this.justSavedTimeout);
		this.setState({ hasJustSaved: false });
		this.timer = setTimeout(
			() => {
				const { updateNote } = this.props;
				this.setState({ isSaving: true, error: null, hasJustSaved: false });
				updateNote(text)
					.then(() => {
						this.setState({ isSaving: false, hasJustSaved: true });
						this.justSavedTimeout = setTimeout(() => {
							this.setState({ hasJustSaved: false });
						}, 5000);
						if (this.saveAfterSave) {
							this.saveAfterSave = false;
							this.save(this.state.text, saveNow);
						}
					})
					.catch(error => {
						this.setState({ isSaving: false, error: error.message });
					});
			},
			saveNow ? 0 : 2000
		);
	};
	onChange = e => {
		const text = e.target.value;
		this.setState({ text });
		const { isSaving } = this.state;
		if (isSaving) {
			this.saveAfterSave = true;
		} else {
			this.save(text);
		}
	};

	render() {
		const { note: savedNote, viewOnly } = this.props;
		const { hasJustSaved, isSaving, error } = this.state;
		let note = savedNote;
		if (!viewOnly) {
			note.data = this.state.text;
		}

		const screenWidth = window.innerWidth;
		return (
			<div className="note-wrapper">
				{viewOnly ? (
					<div
						style={{
							width: '100%',
							boxShadow:
								'0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12)',
						}}
					>
						<div
							style={{
								display: 'flex',
								backgroundColor: '#FDB200',
								borderBottom: '1px solid #dadada',
								padding: '8px 16px',
							}}
						>
							<div className="question-category" style={{ flex: 1, color: 'white' }}>
								Note
							</div>
						</div>
						<div
							style={{
								color: '#586E75',
								backgroundColor: '#FFF8E4',
								padding: '10px 15px',
								fontSize: 14,
								minHeight: 170,
							}}
						>
							{note.data
								.replace('\r\n', '\n')
								.split('\n')
								.map((chunk, idx) => {
									if (idx) {
										return (
											<span key={`chunk-${idx}`}>
												<br />
												{chunk}
											</span>
										);
									} else {
										return <span key={`chunk-${idx}`}>{chunk}</span>;
									}
								})}
						</div>
					</div>
				) : (
					<div>
						<Card
							bodyStyle={{ padding: 0 }}
							headStyle={{ borderBottom: '2px solid #e8e8e8' }}
							title={
								<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
									<div className="note-header">Note</div>
								</div>
							}
							className="note-card"
						>
							<TextArea
								className="custom-text-area"
								autosize={{
									minRows: screenWidth > 1280 ? 15 : 12,
									maxRows: screenWidth > 1280 ? 15 : 12,
								}}
								onChange={this.onChange}
								value={note.data}
							/>
						</Card>
						<div style={{ padding: 5 }}>
							{hasJustSaved ? (
								'Saved'
							) : isSaving ? (
								'Saving'
							) : error ? (
								<span style={{ color: 'red' }}>
									{error.indexOf('NetworkError') > -1
										? 'Network error'
										: 'Failed to update note'}
								</span>
							) : null}
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	if (ownProps.note) {
		return {};
	}
	const { sessionId } = ownProps;
	const session = state.session.sessionsById[sessionId];
	return {
		note: session.note,
	};
};

const mapDispatchToProps = {
	updateNote,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const { sessionId } = ownProps;
	return {
		...ownProps,
		...stateProps,
		...dispatchProps,
		updateNote: text => dispatchProps.updateNote(sessionId, text),
	};
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Note);
