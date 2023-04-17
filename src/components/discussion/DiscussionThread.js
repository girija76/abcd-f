import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Button, Card, Input, List, Modal } from 'antd';
import './DiscussionInput.css';
import { URLS } from '../urls.js';

import {
	LikeOutlined,
	LikeFilled,
	DislikeOutlined,
	DislikeFilled,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

const tabList = [
	{
		key: 'tab1',
		tab: 'Comments',
	},
];

export class DiscussionThread extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			key: 'tab1',
			threads: [],
			reply: '',
			replyThread: '',
			editConfirmation: false,
			deleteConfirmation: false,
			comment: {},
			creply: {},
			commentText: '',
			replyText: '',
		};
	}

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
	};

	replyThread = id => this.setState({ replyThread: id });

	onReply = reply => this.setState({ reply: reply.target.value });

	post = () => {
		const {
			UserData: { _id },
		} = this.props;
		const { reply, replyThread } = this.state;
		fetch(`${URLS.backendDiscussion}/reply`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ uid: _id, tid: replyThread, text: reply }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({ reply: '' });
				this.props.updateThreads(responseJson.threads); // check if thread is present in response
			});
	};

	upvote = id => {
		fetch(`${URLS.backendDiscussion}/upvote`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ tid: id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateThreads(responseJson.threads);
			});
	};

	downvote = id => {
		fetch(`${URLS.backendDiscussion}/downvote`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ tid: id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateThreads(responseJson.threads);
			});
	};

	removeupvote = id => {
		fetch(`${URLS.backendDiscussion}/removeupvote`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ tid: id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateThreads(responseJson.threads);
			});
	};

	removedownvote = id => {
		fetch(`${URLS.backendDiscussion}/removedownvote`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ tid: id }),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateThreads(responseJson.threads);
			});
	};

	deleteComment = comment =>
		this.setState({ deleteConfirmation: true, comment });

	deleteReply = (creply, comment) => {
		this.setState({ deleteConfirmation: true, creply, comment });
	};

	editComment = comment =>
		this.setState({ editConfirmation: true, comment, commentText: comment.text });

	editReply = (creply, comment) =>
		this.setState({
			editConfirmation: true,
			creply,
			comment,
			replyText: creply.text,
		});

	onEdit = text => {
		const { comment, creply } = this.state;
		if (creply._id) {
			this.setState({ replyText: text.target.value });
		} else if (comment._id) {
			this.setState({ commentText: text.target.value });
		}
	};

	delete = () => {
		const { comment, creply } = this.state;
		if (creply._id) {
			fetch(`${URLS.backendDiscussion}/deleteReply`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ id: creply._id, cid: comment._id }),
			})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({ deleteConfirmation: false, comment: {}, creply: {} });
					this.props.updateThreads(responseJson.discussion.threads);
				});
		} else if (comment._id) {
			fetch(`${URLS.backendDiscussion}/deleteComment`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ id: comment._id }),
			})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({ deleteConfirmation: false, comment: {} });
					this.props.updateThreads(responseJson.discussion.threads);
				});
		}
	};

	edit = () => {
		const { comment, creply, commentText, replyText } = this.state;
		if (creply._id) {
			fetch(`${URLS.backendDiscussion}/editReply`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ id: creply._id, cid: comment._id, text: replyText }),
			})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({
						editConfirmation: false,
						comment: {},
						creply: {},
						commentText: '',
						replyText: '',
					});
					this.props.updateThreads(responseJson.discussion.threads);
				});
		} else if (comment._id) {
			fetch(`${URLS.backendDiscussion}/editComment`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ id: comment._id, text: commentText }),
			})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({ editConfirmation: false, comment: {}, commentText: '' });
					this.props.updateThreads(responseJson.discussion.threads);
				});
		}
	};

	renderOption = thread => {
		const {
			UserData: { _id },
		} = this.props;
		const id = thread._id;

		let upvoted = false;
		let downvoted = false;
		thread.upvotes.forEach(u => {
			if (u === _id) upvoted = true;
		});
		thread.downvotes.forEach(d => {
			if (d === _id) downvoted = true;
		});

		return (
			<div style={{ display: 'flex', marginTop: 8 }}>
				<div
					style={{
						cursor: 'pointer',
						display: 'flex',
					}}
					onClick={
						upvoted ? this.removeupvote.bind(this, id) : this.upvote.bind(this, id)
					}
				>
					{upvoted ? (
						<LikeFilled style={{ marginTop: 3 }} />
					) : (
						<LikeOutlined style={{ marginTop: 3 }} />
					)}
					<span style={{ marginLeft: 3 }}>{thread.upvotes.length}</span>
				</div>
				<div
					style={{
						padding: '0px 10px',
						cursor: 'pointer',
						display: 'flex',
					}}
					onClick={
						downvoted
							? this.removedownvote.bind(this, id)
							: this.downvote.bind(this, id)
					}
				>
					{downvoted ? (
						<DislikeFilled theme="filled" style={{ marginTop: 4 }} />
					) : (
						<DislikeOutlined style={{ marginTop: 4 }} />
					)}
					<span style={{ marginLeft: 3 }}>{thread.downvotes.length}</span>
				</div>
				<div
					style={{ paddingLeft: 10, cursor: 'pointer' }}
					onClick={this.replyThread.bind(this, id)}
				>
					Reply
				</div>
			</div>
		);
	};

	renderFooter = thread => {
		const {
			UserData: { dp },
		} = this.props;
		const id = thread._id;
		let { reply, replyThread } = this.state;

		return (
			<div style={{ marginTop: 5 }}>
				{replyThread === id ? (
					<div style={{ marginTop: 5 }}>
						<div style={{ display: 'flex' }}>
							<Avatar src={dp} size="small" style={{ margin: 3, marginRight: 10 }} />
							<TextArea
								rows={4}
								style={{ resize: 'none' }}
								onChange={this.onReply}
								value={reply}
							/>
						</div>
						<div
							style={{
								float: 'right',
								marginTop: 10,
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Button type="primary" onClick={this.post}>
								Post
							</Button>
						</div>
					</div>
				) : null}
			</div>
		);
	};

	renderItem = item => {
		const {
			UserData: { role, username },
		} = this.props;
		return (
			<List.Item.Meta
				avatar={<Avatar src={item.user.dp} size="small" />}
				title={
					<div style={{ display: 'flex' }}>
						<div style={{ flex: 1 }}>{item.user.username}</div>
						{username === item.user.username || role === 'super' ? (
							<div style={{ display: 'flex' }}>
								{username === item.user.username ? (
									<EditOutlined
										style={{ marginRight: 12, cursor: 'pointer' }}
										onClick={this.editComment.bind(this, item)}
									/>
								) : null}
								<DeleteOutlined
									style={{ cursor: 'pointer', color: 'red' }}
									onClick={this.deleteComment.bind(this, item)}
								/>
							</div>
						) : null}
					</div>
				}
				description={
					<div>
						<div>
							{item.text
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
						{this.renderOption(item)}
						<div>
							{item.threads.length ? (
								<List
									itemLayout="horizontal"
									dataSource={item.threads}
									renderItem={item2 => (
										<List.Item>
											<List.Item.Meta
												avatar={<Avatar src={item2.user.dp} size="small" />}
												title={
													<div style={{ display: 'flex' }}>
														<div style={{ flex: 1 }}>{item2.user.username}</div>
														{username === item2.user.username ? (
															<div style={{ display: 'flex' }}>
																<EditOutlined
																	style={{ marginRight: 12, cursor: 'pointer' }}
																	onClick={this.editReply.bind(this, item2, item)}
																/>
																<DeleteOutlined
																	style={{ cursor: 'pointer', color: 'red' }}
																	onClick={this.deleteReply.bind(this, item2, item)}
																/>
															</div>
														) : null}
													</div>
												}
												description={item2.text
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
											/>
										</List.Item>
									)}
								/>
							) : null}
						</div>
						<div>{this.renderFooter(item)}</div>
					</div>
				}
			/>
		);
	};

	renderTabContent = () => {
		let { threads } = this.props;
		let comments = [];
		threads.forEach(thread => {
			if (thread.kind === 1) comments.push(thread);
		});
		let solutions = [];
		threads.forEach(thread => {
			if (thread.kind === 2) solutions.push(thread);
		});
		let errors = [];
		threads.forEach(thread => {
			if (thread.kind === 3) errors.push(thread);
		});

		comments.reverse();

		return {
			tab1: (
				<List
					itemLayout="horizontal"
					dataSource={comments}
					renderItem={item => <List.Item>{this.renderItem(item)}</List.Item>}
				/>
			),
		};
	};

	render() {
		let {
			key,
			deleteConfirmation,
			editConfirmation,
			creply,
			replyText,
			commentText,
		} = this.state;

		const { disableMaxWidth } = this.props;

		const contentList = this.renderTabContent();

		return (
			<div
				style={
					disableMaxWidth
						? {
								display: 'flex',
								margin: '10px 10px',
								flex: 1,
								alignItems: 'start',
						  }
						: {
								display: 'flex',
								margin: '10px 0px',
								flex: 1,
								alignItems: 'start',
								maxWidth: 940,
						  }
				}
			>
				<Card
					style={{ marginTop: 0, width: '100%' }}
					bodyStyle={{ paddingTop: 5, paddingBottom: 10 }}
					className="discussion-thread-card"
					tabList={tabList}
					activeTabKey={key}
					onTabChange={key => {
						this.onTabChange(key, 'key');
					}}
				>
					{contentList[key]}
				</Card>
				<Modal
					title={creply._id ? 'Delete Reply' : 'Delete Comment'}
					visible={deleteConfirmation}
					onOk={this.delete}
					onCancel={() =>
						this.setState({ deleteConfirmation: false, comment: {}, creply: {} })
					}
				>
					Are you sure you want to delete this {creply._id ? 'reply' : 'comment'}?
				</Modal>
				<Modal
					title={creply._id ? 'Edit Reply' : 'Edit Comment'}
					visible={editConfirmation}
					onOk={this.edit}
					onCancel={() =>
						this.setState({ editConfirmation: false, comment: {}, creply: {} })
					}
				>
					<TextArea
						rows={4}
						style={{ resize: 'none' }}
						onChange={this.onEdit}
						value={creply._id ? replyText : commentText}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		UserData: state.api.UserData,
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionThread);
