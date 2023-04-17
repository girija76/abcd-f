import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Button, Card, Input } from 'antd';
import './DiscussionInput.css';
import { URLS } from '../urls.js';

const { TextArea } = Input;

const tabList = [
	{
		key: 'tab1',
		tab: 'Comment',
	},
];

export class DiscussionInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: '',
			key: 'tab1',
		};
	}

	onTabChange = (key, type) => {
		this.setState({ [type]: key });
	};

	onComment = comment => this.setState({ comment: comment.target.value });

	post = () => {
		let {
			UserData: { _id },
			aid,
		} = this.props;
		let { comment, key } = this.state;
		if (!comment || !comment.trim()) {
			return;
		}
		fetch(URLS.backendDiscussion + '/comment', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				uid: _id,
				aid: aid,
				kind: key === 'tab1' ? 1 : key === 'tab2' ? 2 : 3,
				text: comment,
			}),
		})
			.then(response => response.json())
			.then(responseJson => {
				this.props.updateThreads(responseJson.threads); //check if thread is present in response
				this.setState({ comment: '' });
			});
	};

	render() {
		let { key, comment } = this.state;
		let {
			UserData: { dp },
			disableMaxWidth,
		} = this.props;
		let thumbnailPic = dp;
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
								flex: 1,
								alignItems: 'start',
								maxWidth: 940,
						  }
				}
			>
				<Card
					style={{ marginTop: 10, width: '100%' }}
					title="Discussion"
					bodyStyle={{ paddingTop: 5, paddingBottom: 10 }}
					headStyle={{ borderBottom: 0 }}
					className="discussion-input-card"
				>
					<div style={{ display: 'flex' }}>
						<Avatar
							src={thumbnailPic}
							size="large"
							style={{ margin: 3, marginRight: 10 }}
						/>
						<Card
							className="compete-card"
							headStyle={{ fontSize: 24 }}
							style={{ flex: 1 }}
							tabList={tabList}
							activeTabKey={key}
							onTabChange={key => {
								this.onTabChange(key, 'key');
							}}
						>
							<TextArea
								rows={4}
								style={{ resize: 'none' }}
								onChange={this.onComment}
								value={comment}
							/>
						</Card>
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
				</Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionInput);
