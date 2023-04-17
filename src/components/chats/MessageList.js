import { Avatar } from 'antd';
import Tooltip from 'antd/es/tooltip';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { get, map } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { userIdSelector } from 'selectors/user';
import { createItemsById } from 'utils/store';

dayjs.extend(advancedFormat);

function MessageList({ items, members }) {
	const membersById = useMemo(() => createItemsById(members, '_id'), [members]);
	const userId = useSelector(userIdSelector);
	return (
		<div style={{ padding: '4px 0' }}>
			{map(items, (item, index) => {
				const previousMessageCreator = get(items, [index - 1, 'createdBy']);
				const creatorIsSameAsPrevious = item.createdBy === previousMessageCreator;
				const { type, text } = item.data;
				const createdBy = membersById[item.createdBy];
				const isMyMessage = userId === createdBy._id;
				const isMentorMessage = createdBy.role !== 'user';
				if (type === 'text') {
					return (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start',
								flexWrap: 'wrap',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'flex-start',
									marginRight: 4,
								}}
							>
								<Avatar
									src={createdBy.dp}
									style={{
										borderRadius: '50%',
										margin: '4px',
										background: '#fafafa',
										padding: 0,
										border: isMentorMessage
											? '2px solid rgb(255, 140, 140)'
											: 'solid 2px transparent',
										visibility: creatorIsSameAsPrevious ? 'hidden' : '',
									}}
								/>
							</div>
							<Tooltip title={dayjs(item.createdAt).format('hh:mm A, DD MMM YYYY')}>
								<div
									style={{
										background: isMyMessage ? 'rgb(0, 132, 255)' : 'rgb(228, 230, 235)',
										color: isMyMessage ? 'white' : 'black',
										padding: '6px 15px',
										borderRadius: 30,
									}}
								>
									{text}
								</div>
							</Tooltip>
						</div>
					);
				}
				return <div>Unsupported message</div>;
			})}
		</div>
	);
}

export default MessageList;
