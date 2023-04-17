import React from 'react';
import InTime from './InTime';
import LiveIcon from './LiveIcon';

const DATE_FORMAT = 'D MMM, hh:mm A';

function PlaylistItemAvailabilityText({
	isLiveNow,
	isAvailable,
	isAvailableInFuture,
	availableFrom,
	availableTill,
	isAvailableIndefinite,
	hasAccess,
	isLiveVideo,
	hasStreamed,
	liveFrom,
	onLive,
}) {
	return (
		<div>
			{isLiveNow ? (
				<div
					style={{
						color: 'green',
						display: 'flex',
						alignItems: 'center',
						marginTop: 4,
					}}
				>
					<LiveIcon color="green" size={16} />
					<span style={{ marginLeft: 4 }}>Live now</span>
				</div>
			) : null}
			{!isAvailable && isAvailableInFuture && availableFrom ? (
				<div>Available at: {availableFrom.format(DATE_FORMAT)}</div>
			) : null}
			{isAvailable && !isAvailableIndefinite && availableTill ? (
				<div>Available till: {availableTill.format(DATE_FORMAT)}</div>
			) : null}
			{!isAvailable &&
			!isAvailableIndefinite &&
			!isAvailableInFuture &&
			hasAccess !== false ? (
				<div>Expired</div>
			) : null}
			{isLiveVideo && !isLiveNow && !hasStreamed ? (
				<div>
					Live <InTime date={liveFrom} onEnd={onLive} />
				</div>
			) : null}
		</div>
	);
}

export default PlaylistItemAvailabilityText;
