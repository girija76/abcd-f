import { Button, Modal, Space, Tooltip } from 'antd';
import { get } from 'lodash';
import React from 'react';
import {
	AiOutlineCalendar,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineEye,
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { roleSelector, userIdSelector } from 'selectors/user';
import { useBoolean } from 'use-boolean';
import { getLabelForResourceType } from 'utils/playlist';
import VideoViewers from '../analytics/VideoViewers';
import EditPlaylistItem from './EditPlaylistItem';
import RemovePlaylistItem from './RemovePlaylistItem';
import EditResource from './Resource';
import { URLS } from 'components/urls';

const buttonIconStyle = { marginRight: 6, fontSize: '1.25em' };
const buttonStyle = { display: 'inline-flex', alignItems: 'center' };
function PlaylistItemActions({
	playlistId,
	availableFrom,
	availableTill,
	_id: playlistItemId,
	resourceType,
	resource,
	onRefresh,
}) {
	const history = useHistory();
	const location = useLocation();

	const [
		isEditingAvailability,
		openAvailability,
		closeAvailability,
	] = useBoolean(false);
	const [isDeletingItem, openIsDeletingItem, closeIsDeletingItem] = useBoolean(
		false
	);
	const [
		isEditingResource,
		openResourceEditor,
		closeResourceEditor,
	] = useBoolean(false);
	const [isShowingViwers, showViewers, hideViwers] = useBoolean(false);

	const role = useSelector(roleSelector);
	const userId = useSelector(userIdSelector);
	const resourceLabel = getLabelForResourceType(resourceType);
	const hasPermissionToEditResource = get(resource, 'createdBy') === userId;

	if (role === 'user') {
		return null;
	}

	const currentPageURL = `${location.pathname}${location.search}`;

	const showSubmissions = () => {
		history.push({
			pathname: `${URLS.learningCenterAssignmentPlaylists}/playlist/submission/${resource._id}`,
			state: {
				backPageURL: currentPageURL,
				itemName: resource.title,
			},
		});
	};

	return (
		<>
			<Space style={{ marginTop: 6, flexWrap: 'wrap' }}>
				<Tooltip title={`Change availability dates of ${resourceLabel}`}>
					<Button
						onClick={openAvailability}
						icon={<AiOutlineCalendar style={buttonIconStyle} />}
						style={buttonStyle}
					>
						Edit Date
					</Button>
				</Tooltip>
				<Tooltip
					title={
						hasPermissionToEditResource
							? null
							: `This ${resourceLabel} was created by someone else.`
					}
				>
					<Button
						onClick={openResourceEditor}
						icon={<AiOutlineEdit style={buttonIconStyle} />}
						style={buttonStyle}
						disabled={!hasPermissionToEditResource}
					>
						Edit {resourceLabel}
					</Button>
				</Tooltip>
				<Tooltip title={`Remove ${resourceLabel} from playlist`}>
					<Button
						onClick={openIsDeletingItem}
						icon={<AiOutlineDelete style={buttonIconStyle} />}
						style={buttonStyle}
					>
						Remove
					</Button>
				</Tooltip>
				{resourceType === 'Video' ? (
					<Tooltip title="View viewers">
						<Button
							style={buttonStyle}
							icon={<AiOutlineEye style={buttonIconStyle} />}
							onClick={showViewers}
						>
							Viewers
						</Button>
					</Tooltip>
				) : null}

				{resourceType === 'Assignment' ? (
					<Tooltip title="View Submissions">
						<Button
							style={buttonStyle}
							icon={<AiOutlineEye style={buttonIconStyle} />}
							onClick={showSubmissions}
						>
							Submissions
						</Button>
					</Tooltip>
				) : null}
			</Space>

			{isEditingAvailability ? (
				<EditPlaylistItem
					availableFrom={availableFrom}
					availableTill={availableTill}
					playlistId={playlistId}
					playlistItemId={playlistItemId}
					onCancel={closeAvailability}
					isVisible={isEditingAvailability}
					resource={resource}
					onComplete={() => {
						closeAvailability();
						onRefresh && onRefresh();
					}}
				/>
			) : null}
			{isDeletingItem ? (
				<RemovePlaylistItem
					playlistId={playlistId}
					playlistItemId={playlistItemId}
					resource={resource}
					isVisible={isDeletingItem}
					onCancel={closeIsDeletingItem}
					onComplete={() => {
						closeIsDeletingItem();
						onRefresh && onRefresh();
					}}
				/>
			) : null}
			{isEditingResource ? (
				<EditResource
					resource={resource}
					resourceType={resourceType}
					isVisible={isEditingResource}
					onCancel={closeResourceEditor}
					onComplete={() => {
						closeResourceEditor();
						onRefresh && onRefresh();
					}}
				/>
			) : null}
			{isShowingViwers ? (
				<VideoViewers
					resource={resource}
					isVisible={isShowingViwers}
					onCancel={hideViwers}
				/>
			) : null}
		</>
	);
}

export default PlaylistItemActions;
