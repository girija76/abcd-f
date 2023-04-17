import React from 'react';
import { Button, Tooltip } from 'antd';
import {
	CheckCircleOutlined,
	SyncOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as selectors from 'selectors/liveTest';
import dayjs from 'dayjs';
import { getCriticalSyncInfo } from 'utils/assessment';

const syncErrorLimit = 3;
function Progress({ onClickTrySync }) {
	const isSyncing = useSelector(selectors.isSyncing);
	const syncFailCount = useSelector(selectors.syncFailCount);
	const lastSyncedAt = useSelector(state =>
		dayjs(selectors.lastSyncedAt(state))
	);
	const hasCriticalInfoSyncPending = useSelector(
		state =>
			getCriticalSyncInfo(state) !== selectors.lasySyncedCriticalInfoString(state)
	);
	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<div style={{ maxWidth: 250 }}>
				{isSyncing ? (
					<span>
						<SyncOutlined style={{ marginRight: 4 }} rotate /> Saving progress
					</span>
				) : syncFailCount > syncErrorLimit ? (
					<span>
						<div>
							<WarningOutlined style={{ marginRight: 4, color: 'red' }} />
							Error saving progress.
						</div>
						<span>Last saved {lastSyncedAt.fromNow()}</span>
						<Tooltip title="Save my progress now">
							<Button
								onClick={onClickTrySync}
								style={{ marginLeft: 4 }}
								size="small"
								icon={<SyncOutlined />}
							/>
						</Tooltip>
					</span>
				) : syncFailCount > 0 ? (
					<span>
						<WarningOutlined style={{ marginRight: 4, color: '#ffc107' }} />
						Progress saved {lastSyncedAt.fromNow()}
					</span>
				) : hasCriticalInfoSyncPending ? (
					<span>Last saved {lastSyncedAt.fromNow()}</span>
				) : (
					<span>
						<CheckCircleOutlined
							size="small"
							style={{ marginRight: 4, color: '#4baf4f' }}
						/>
						<span>Progress saved</span>
					</span>
				)}
			</div>
			{process.env.NODE_ENV === 'development' ? (
				<Button size="small" onClick={onClickTrySync}>
					Sync
				</Button>
			) : null}
		</div>
	);
}

export default Progress;
