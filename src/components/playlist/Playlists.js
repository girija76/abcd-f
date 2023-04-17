import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, some } from 'lodash';
import { PlaylistPreview } from './Playlist';
import { createPlaylistGroups } from 'utils/video';
import './styles.scss';
import { roleSelector } from 'selectors/user';
import { isAtLeastMentor } from 'utils/auth';
import CreatePlaylist from './admin/create/Playlist';

const selectActivePhase = state => {
	const activeSuperGroupId = localStorage.currentSupergroup;
	const activeSuperGroup = filter(
		state.api.UserData.subscriptions,
		({ group }) => group === activeSuperGroupId
	)[0];
	let activePhaseId = '';
	try {
		some(activeSuperGroup.subgroups, subgroup => {
			return some(subgroup.phases, phase => {
				if (phase.active) {
					activePhaseId = phase.phase._id;
					return true;
				}
			});
		});
	} catch (e) {}
	return activePhaseId;
};

const Playlists = ({ queryToPass, playlists, resourceType, onRefresh }) => {
	const [playlistGroups, setPlaylistGroups] = useState([]);
	const activePhase = useSelector(selectActivePhase);
	const role = useSelector(roleSelector);
	useEffect(() => {
		setPlaylistGroups(createPlaylistGroups(activePhase, playlists));
	}, [activePhase, playlists]);
	return (
		<div className="playlists-root">
			{playlistGroups.map(({ items, label }, index) => {
				return (
					<React.Fragment key={`${index}-${typeof label === 'string' ? label : ''}`}>
						{label && label.toLowerCase() !== 'others' ? (
							<h3 className="playlists-group-title">{label}</h3>
						) : null}
						<div className="playlist-list">
							{items.map(playlist => {
								return (
									<PlaylistPreview
										query={queryToPass}
										key={playlist._id}
										{...playlist}
									/>
								);
							})}
							{isAtLeastMentor(role) ? (
								<CreatePlaylist
									onRefresh={onRefresh}
									subject={label}
									resourceType={resourceType}
								/>
							) : null}
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default Playlists;
