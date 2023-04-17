import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, List } from 'antd';

import { getList as getSessionList } from 'actions/session';
import Item from './ListItem';

import './listitem.scss';

const SessionView = connect((state, ownProps) => {
	const session = state.session.sessionsById[ownProps.id];
	return {
		session,
		topics: state.api.Topics,
	};
})(({ session, topics, title }) => <Item session={session} Topics={topics} />);

const SessionList = () => {
	const [fetchState, setFetchState] = useState('fetching');
	const [errorMessage, setErrorMessage] = useState('');
	const items = useSelector(state => state.session.sessions);
	const dispatch = useDispatch();
	const handleFetchSessionList = useCallback(() => {
		dispatch(getSessionList())
			.then(() => {
				setFetchState('fetched');
			})
			.catch(e => {
				setFetchState('failed');
				setErrorMessage(e.message || 'Some error occurred while loading session');
			});
	}, [dispatch]);
	useEffect(() => {
		handleFetchSessionList();
	}, [handleFetchSessionList]);

	return (
		<div className="session-list-wrapper">
			{fetchState === 'fetched' || fetchState === 'fetching' ? (
				<List
					loading={fetchState === 'fetching'}
					itemLayout="horizontal"
					dataSource={items}
					renderItem={sessionId => <SessionView key={sessionId} id={sessionId} />}
					className="sessions-list"
				/>
			) : (
				<div style={{ textAlign: 'center' }}>
					<div style={{ color: '#f5222d', fontSize: '1.2em', marginBottom: 10 }}>
						{errorMessage}
					</div>
					<div>
						<Button
							type="primary"
							size="large"
							onClick={handleFetchSessionList}
							icon="reload"
							shape="round"
						>
							Try again
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SessionList;
