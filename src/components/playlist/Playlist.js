import React, { useMemo } from 'react';
import classnames from 'classnames';
import { generatePath, Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import PlaylistItem from './PlaylistItem';
import { createGroups } from 'utils/video';
import { URLS } from 'components/urls';
import { wideLogo } from 'utils/config';

const Group = ({ playlistId, label, items, query }) => {
	return (
		<div className="playlist-group">
			<h4 className="playlist-group-title">
				{label} ({items.length})
			</h4>

			<div className="playlist-group-item-list-container">
				<div className="playlist-group-item-list">
					{items.map(item => {
						return (
							<PlaylistItem
								showActions
								playlistId={playlistId}
								query={query}
								{...item}
								key={item._id}
								viewDirection="horizontal"
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const Playlist = ({
	_id,
	hasAccessToContent,
	title,
	items,
	query,
	setting,
}) => {
	const groups = useMemo(
		() =>
			createGroups(items, setting && setting.groupBy, undefined, {
				showDemoVideosSeparately: !hasAccessToContent,
			}),
		[hasAccessToContent, items, setting]
	);
	const themeClass = useMemo(
		() => (setting && setting.theme ? `theme__${setting.theme}` : ''),
		[setting]
	);
	return (
		<div className={classnames('playlist', themeClass)}>
			<div className="playlist-group-list">
				{groups.map(({ items, label }, index) => {
					return (
						<Group
							query={query}
							playlistId={_id}
							label={label}
							key={index}
							items={items}
						/>
					);
				})}
			</div>
		</div>
	);
};

export const PlaylistPreview = ({
	_id,
	title,
	items,
	query,
	thumbNailsUrls,
	hasAccessToContent,
	setting,
	serviceMachineNames,
	resourceType,
	onClick,
	isCreateNew,
}) => {
	let thumbnail;
	try {
		if (thumbNailsUrls[0]) {
			thumbnail = thumbNailsUrls[0];
		} else {
			thumbnail = items[0].resource.thumbNailsUrls[0];
		}
	} catch (e) {}
	if (!thumbnail) {
		thumbnail = wideLogo;
	}
	const thumbnailViewThemeClass =
		setting && setting.thumbnailViewTheme
			? `theme__${setting.thumbnailViewTheme}`
			: '';
	const thumbnailBackgroundColor =
		setting && setting.thumbnailBackgroundColor
			? setting.thumbnailBackgroundColor
			: '#fff';

	const link = generatePath(URLS.learningCenterPlaylist, {
		resourceType: `${
			resourceType === 'Book' ? 'ResourceDocument' : resourceType
		}s`,
	});
	return (
		<>
			<div
				onClick={onClick}
				style={{ backgroundColor: thumbnailBackgroundColor }}
				className={classnames('playlist-preview', thumbnailViewThemeClass)}
			>
				{!isCreateNew && !hasAccessToContent ? (
					<Link
						to={`${URLS.cart}?i=${encodeURIComponent(
							JSON.stringify(serviceMachineNames)
						)}`}
					>
						<span className="playlist-preview-action-icon-button">
							<FaCrown className="playlist-preview-action-icon" />
							<span>Buy Now</span>
						</span>
					</Link>
				) : null}
				{isCreateNew ? (
					<span style={{ cursor: 'pointer' }}>
						<div
							className="playlist-preview__width-restriction playlist-preview-thumbnail"
							style={{
								fontSize: 96,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#f0f0f0',
								borderRadius: 4,
							}}
						>
							+
						</div>
						<div className="playlist-preview__width-restriction playlist-preview-title">
							Create New Playlist
						</div>
					</span>
				) : (
					<Link to={`${link}?p=${_id}${query ? `&${query}` : ''}`}>
						<div
							className="playlist-preview__width-restriction playlist-preview-thumbnail"
							style={{
								backgroundImage: `url("${thumbnail}")`,
							}}
						></div>
						<div className="playlist-preview__width-restriction playlist-preview-title">
							{title}
						</div>
						<div
							className={classnames('playlist-preview__action-view-demo', {
								visible: !isCreateNew && !hasAccessToContent,
							})}
						>
							View Demo
						</div>
					</Link>
				)}
			</div>
		</>
	);
};

export default Playlist;
