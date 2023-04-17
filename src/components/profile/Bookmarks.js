import React from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/es/modal';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { URLS } from '../urls.js';
import { AiFillPlusCircle } from 'react-icons/ai';

import Bucket from './Bucket';

import { updateBuckets } from '../api/ApiAction';

import './Bookmark.css';

const colors = [
	{ color: '#ee4c48', light: 'rgba(238, 76, 72, 1)' },
	{ color: '#f4a451', light: 'rgba(244, 164, 81, 1)' },
	{ color: '#f4ce56', light: 'rgba(244, 206, 86, 1)' },
	{ color: '#68ca48', light: 'rgba(104, 202, 72, 1)' },
	{ color: '#55b8f3', light: 'rgba(85, 184, 243, 1)' },
	{ color: '#cf85e1', light: 'rgba(207, 133, 225, 1)' },
	{ color: '#a4a4a7', light: 'rgba(164, 164, 167, 1)' },
];

class Bookmarks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bookmarks: [],
			buckets: [],
			selectedBucket: '',
			showModal: false,
			bucketName: '',
			selectedColor: 3,
		};
	}

	componentWillMount() {
		this.getBuckets();
	}

	getBuckets = () => {
		fetch(URLS.backendUsers + '/buckets', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
			.then(response => response.json())
			.then(responseJson => {
				if (responseJson.success) {
					const selectedBucket =
						responseJson.buckets && responseJson.buckets.length
							? responseJson.buckets[0]._id
							: '';
					this.props.updateBuckets(responseJson.buckets);
					this.setState({ selectedBucket });
				}
			})
			.catch(error => {});
	};

	selectBucket = id => {
		this.setState({ selectedBucket: id });
	};

	showModal = () => {
		this.setState({ showModal: true });
	};

	addBucket = () => {
		const { bucketName, selectedColor } = this.state;
		if (!bucketName) {
			//
		} else {
			fetch(URLS.backendBucket + '/add', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					name: bucketName,
					color: colors[selectedColor].color,
				}),
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						this.setState({ showModal: false });
						this.getBuckets();
						// const selectedBucket =
						// 	responseJson.buckets && responseJson.buckets.length
						// 		? responseJson.buckets[0]._id
						// 		: '';
						// this.setState({ buckets: responseJson.buckets, selectedBucket });
					}
				})
				.catch(error => {});
		}
	};

	updateBucketName = e => {
		this.setState({ bucketName: e.target.value });
	};

	updateColor = selectedColor => {
		this.setState({ selectedColor });
	};

	renderBookmarks = () => {
		let { selectedBucket, showModal, bucketName, selectedColor } = this.state;

		const { Buckets } = this.props;

		let { Topics } = this.props;
		let topic_dict = {};
		let sub_topic_dict = {};
		Topics.forEach(topic => {
			topic_dict[topic._id] = topic.name;
			topic.sub_topics.forEach(sub_topic => {
				sub_topic_dict[sub_topic._id] = sub_topic.name;
			});
		});

		const bucketsMap = {};
		Buckets.forEach(bucket => {
			bucketsMap[bucket._id] = bucket;
		});

		return (
			<div>
				<div style={{ display: 'flex', marginBottom: 12 }}>
					{Buckets.map(bucket => {
						const style =
							selectedBucket === bucket._id
								? {
										fontWeight: 500,
										borderRadius: 100,
										padding: '3px 16px',
										backgroundColor: bucket.color,
										color: 'white',
										border: '1px solid ' + bucket.color,
										marginRight: 12,
										cursor: 'pointer',
								  }
								: {
										fontWeight: 500,
										borderRadius: 100,
										padding: '3px 16px',
										marginRight: 12,
										color: bucket.color,
										border: '1px solid ' + bucket.color,
										cursor: 'pointer',
								  };
						return (
							<div style={style} onClick={this.selectBucket.bind(this, bucket._id)}>
								{bucket.name}
							</div>
						);
					})}
					{Buckets.length < 5 ? (
						<div
							style={{
								fontWeight: 500,
								borderRadius: 100,
								padding: '3px 16px',
								// color: bucket.color,
								border: '1px solid #888888',
								cursor: 'pointer',
							}}
							onClick={this.showModal}
						>
							<AiFillPlusCircle /> Add a Bucket
						</div>
					) : null}
				</div>
				<Bucket Topics={Topics} bucket={bucketsMap[selectedBucket]} />
				<Modal
					title="Add Bucket"
					visible={showModal}
					footer={null}
					onCancel={() => {
						this.setState({ showModal: false });
					}}
					bodyStyle={{ display: 'flex', flexDirection: 'column' }}
				>
					<Input
						placeholder="Bucket name"
						value={bucketName}
						onChange={this.updateBucketName}
						style={{ width: 240 }}
					/>

					<div style={{ marginTop: 12 }}>
						<div>Tags...</div>
						<div style={{ display: 'flex' }}>
							{colors.map((c, idx) => {
								if (selectedColor === idx) {
									return (
										<div
											style={{
												width: 18,
												height: 18,
												backgroundColor: c.light,
												borderRadius: 100,
												margin: 4,
												border: '2px solid ' + c.color,
												cursor: 'pointer',
											}}
										></div>
									);
								} else {
									return (
										<div
											style={{
												width: 18,
												height: 18,
												backgroundColor: c.light,
												borderRadius: 100,
												margin: 4,
												border: '2px solid white',
												cursor: 'pointer',
											}}
											onClick={this.updateColor.bind(this, idx)}
										></div>
									);
								}
							})}
						</div>
					</div>

					<Button
						style={{ marginTop: 12, width: 120 }}
						type="primary"
						onClick={this.addBucket}
						disabled={!bucketName}
					>
						Add
					</Button>
				</Modal>
			</div>
		);
	};

	render() {
		let bookmarks = this.renderBookmarks();
		return <div>{bookmarks}</div>;
	}
}

const mapStateToProps = state => ({
	Buckets: state.api.Buckets,
	Topics: state.api.Topics,
});

const mapDispatchToProps = dispatch => {
	return {
		updateBuckets: buckets => dispatch(updateBuckets(buckets)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Bookmarks);
