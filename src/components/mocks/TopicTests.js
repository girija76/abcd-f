import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import TopicTests from './components/TopicTests';
import './styles.css';

import { useWindowSize } from 'utils/hooks';
import { isLite } from 'utils/config';

const TopicTestsWrapper = ({ mode, activePhase, match }) => {
	let path = window.location.pathname;
	let key_ = 'default';
	if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
	if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
	const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';
	const { width } = useWindowSize();
	const isMobileUI = useMemo(() => width < 900, [width]);

	return (
		<div
			className={classnames({
				'no-margin': true,
			})}
		>
			<div
				className="content-and-rsb-container"
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				<Helmet>
					{mode === 'demo' ? (
						<link
							rel="canonical"
							href={`https://${subDomain}.prepleaf.com/demo/${key_}/topic-tests`}
						/>
					) : null}
					<title>{window.config.metaData.demoTopicTests.title}</title>
					<meta
						name="description"
						content={window.config.metaData.demoTopicTests.description}
					/>
				</Helmet>
				<div style={{ width: '100%' }}>
					<TopicTests
						match={match}
						isMobileUI={isMobileUI}
						mode={mode}
						isMobile
						activePhase={activePhase}
					/>
				</div>
			</div>
		</div>
	);
};

export default TopicTestsWrapper;
