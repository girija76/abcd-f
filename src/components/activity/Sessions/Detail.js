import React from 'react';
import DetailMobile from './DetailMobile';
import DetailDesktop from './DetailDesktop';

import './styles.scss';

const SessionDetail = props => {
	console.log('check activePhase', props);
	return (
		<div>
			<div className="detail-wrapper-desktop">
				<DetailDesktop {...props} />
			</div>
			<div className="content-wrapper detail-wrapper-mobile">
				<DetailMobile {...props} />
			</div>
		</div>
	);
};

export default SessionDetail;
