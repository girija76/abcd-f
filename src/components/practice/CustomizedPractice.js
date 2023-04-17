import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import classnames from 'classnames';
import { map, size } from 'lodash';
import { useSelector } from 'react-redux';
import { GoSettings } from 'react-icons/go';
import { withRouter } from 'react-router-dom';
import {
	Button,
	Checkbox,
	Col,
	Modal,
	Row,
	Space,
	Tooltip,
	Typography,
} from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { createLinkForSession } from 'utils/session';
import { getTopicGroups } from 'components/libs/lib';
import './CustomizedPractice.scss';

const { Title } = Typography;

const SubTopicSelectionView = ({
	_id: id,
	isSelected,
	name,
	onSelectTopics,
	onUnselectTopics,
}) => {
	const handleToggle = useCallback(() => {
		if (isSelected) {
			onUnselectTopics([id]);
		} else {
			onSelectTopics([id]);
		}
	}, [onSelectTopics, onUnselectTopics, id, isSelected]);
	return (
		<Checkbox
			style={{ padding: '8px 16px', margin: 0 }}
			checked={isSelected}
			onChange={handleToggle}
		>
			{name}
		</Checkbox>
	);
};

const TopicSelectionView = ({
	isDefaultCollapsed,
	name,
	selectedSubTopics,
	subTopics,
	onUnselectTopics,
	onSelectTopics,
	difficulty,
}) => {
	const [height, setHeight] = useState(0);
	const subTopicListRef = useRef();
	const [isCollapsed, setIsCollapsed] = useState(isDefaultCollapsed);
	const areAllSelected = useMemo(
		() =>
			!subTopics.some(subTopic => selectedSubTopics.indexOf(subTopic._id) === -1),
		[subTopics, selectedSubTopics]
	);
	const isSomeSelected = subTopics.some(
		subTopic => selectedSubTopics.indexOf(subTopic._id) > -1
	);
	const handleToggleCollapse = useCallback(() => {
		setIsCollapsed(!isCollapsed);
	}, [isCollapsed]);
	const handleToggleAll = useCallback(() => {
		if (areAllSelected) {
			onUnselectTopics(subTopics.map(s => s._id));
		} else {
			onSelectTopics(
				subTopics.map(s => s._id).filter(s => selectedSubTopics.indexOf(s) === -1)
			);
		}
	}, [
		subTopics,
		areAllSelected,
		selectedSubTopics,
		onSelectTopics,
		onUnselectTopics,
	]);
	useEffect(() => {
		if (isCollapsed) {
			setHeight(0);
		} else {
			setHeight(subTopicListRef.current.scrollHeight);
		}
	}, [isCollapsed]);
	if (difficulty.Easy + difficulty.Medium + difficulty.Hard === 0) {
		return null;
	}
	return (
		<div
			className={classnames('customized-practice-starter', {
				selected: isSomeSelected,
			})}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'stretch',
				}}
			>
				<Checkbox
					onChange={handleToggleAll}
					checked={areAllSelected}
					indeterminate={!areAllSelected && isSomeSelected}
					style={{
						flexGrow: 1,
						padding: '8px 16px',
						alignItems: 'center',
						display: 'flex',
					}}
				>
					{name}
				</Checkbox>
				<div
					style={{
						flexGrow: 0,
						display: 'flex',
						justifyContent: 'flex-end',
						outline: 'none',
					}}
					tabIndex={0}
					onClick={handleToggleCollapse}
				>
					<Button
						ghost
						type="text"
						size="large"
						icon={isCollapsed ? <CaretDownOutlined /> : <CaretUpOutlined />}
					></Button>
				</div>
			</div>
			<div style={{ height, transition: 'height ease 300ms', overflow: 'hidden' }}>
				<div
					ref={subTopicListRef}
					style={{
						display: 'flex',
						flexDirection: 'column',
						background: '#f5f6f7',
						borderRadius: '0 0 8px 8px',
						overflow: 'hidden',
					}}
				>
					{subTopics.map(subTopic => {
						return (
							<SubTopicSelectionView
								isSelected={selectedSubTopics.indexOf(subTopic._id) > -1}
								_id={subTopic._id}
								name={subTopic.name}
								onSelectTopics={onSelectTopics}
								onUnselectTopics={onUnselectTopics}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const isTopicVisible = topic => {
	if (!topic) {
		return false;
	}
	const difficulty = topic.difficulty;
	if (difficulty && difficulty.Easy + difficulty.Medium + difficulty.Hard > 0) {
		return true;
	}
	return false;
};

const CustomizedPractice = ({ open: isOpen, onClose, history: { push } }) => {
	const { topicGroups, numberOfTopics } = useSelector(state => {
		const { topics, topicGroups } = getTopicGroups(
			state.api.Topics.filter(isTopicVisible)
		);
		if (size(topicGroups)) {
			let numberOfTopics = 0;
			map(topicGroups, topicGroup => {
				numberOfTopics += size(topicGroup);
			});
			return { topicGroups, numberOfTopics };
		} else {
			return {
				topicGroups: {
					All: topics,
				},
				numberOfTopics: size(topics),
			};
		}
	});
	const isDefaultCollapsed = numberOfTopics > 2;
	const [selectedSubTopics, setSelectedSubTopics] = useState([]);
	const [levelsBySubTopics, setLevelsBySubTopics] = useState({});
	const handleConfirm = () => {
		onClose();
		const link = createLinkForSession({
			filters: selectedSubTopics.map(s => ({
				subTopic: s,
				levels: levelsBySubTopics[s],
			})),
			config: {},
			title: 'Customized Practice',
		});
		push(link);
	};
	const handleSelectTopics = useCallback(
		subTopics => {
			setSelectedSubTopics([...selectedSubTopics, ...subTopics]);
		},
		[selectedSubTopics]
	);
	const handleUnselectTopics = useCallback(
		subTopics => {
			setSelectedSubTopics(
				selectedSubTopics.filter(s => subTopics.indexOf(s) === -1)
			);
		},
		[selectedSubTopics]
	);
	return (
		<Modal
			title="Select the topics you want to practice"
			okText="Start Practice Session"
			onCancel={onClose}
			closable={false}
			onOk={handleConfirm}
			okButtonProps={{
				'data-ga-on': 'click',
				'data-ga-event-label': 'Start Practice Session',
				'data-ga-event-category': 'Practice Custom',
				'data-ga-event-action': 'Start Session',
			}}
			visible={isOpen}
			centered
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				{map(topicGroups, (topics, name) => {
					return (
						<div key={name}>
							<Title level={4}>{name}</Title>
							<Space direction="vertical" style={{ width: '100%' }}>
								{topics.map(topic => {
									return (
										<TopicSelectionView
											isDefaultCollapsed={isDefaultCollapsed}
											difficulty={topic.difficulty}
											subTopics={topic.sub_topics}
											selectedSubTopics={selectedSubTopics}
											key={topic._id}
											name={topic.name}
											onSelectTopics={handleSelectTopics}
											onUnselectTopics={handleUnselectTopics}
										/>
									);
								})}
							</Space>
						</div>
					);
				})}
			</Space>
		</Modal>
	);
};

const CustomizedPracticeContent = withRouter(CustomizedPractice);

const CustomizedPracticeButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [key, setKey] = useState(1);
	const [incrementBy, setIncrementBy] = useState(0);
	const handleClose = () => {
		setIsOpen(false);
	};
	const handleOpen = () => {
		setIsOpen(true);
	};
	useEffect(() => {
		if (incrementBy) {
			setKey(key + incrementBy);
			setIncrementBy(0);
		}
	}, [incrementBy, key]);
	useEffect(() => {
		if (!isOpen) {
			setTimeout(() => setIncrementBy(1), 300);
		} else {
			setIncrementBy(0);
		}
	}, [isOpen]);

	return (
		<React.Fragment>
			<Tooltip
				placement="bottomRight"
				title="Practice multiple topics or your choice"
			>
				<Button
					data-ga-on="click"
					data-ga-event-action="click"
					data-ga-event-category="Practice Custom"
					data-ga-event-label="Customized Practice"
					onClick={handleOpen}
					block
					size="middle"
					type="link"
				>
					<Row style={{ flexWrap: 'nowrap' }}>
						<Col style={{ display: 'flex', alignItems: 'center' }}>
							<GoSettings />
						</Col>
						<Col>
							<span style={{ marginLeft: 8 }}>Customized Practice</span>
						</Col>
					</Row>
				</Button>
			</Tooltip>
			<CustomizedPracticeContent key={key} onClose={handleClose} open={isOpen} />
		</React.Fragment>
	);
};

export default CustomizedPracticeButton;
