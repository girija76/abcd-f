import React from 'react';
import { Helmet } from 'react-helmet';
import SeriesTestsMobile from './SeriesTestsMobile';
import SeriesTestsDesktop from './SeriesTestsDesktop';

import '../styles.css';

class TopicTests extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
		console.log('topic test called');
	}

	render() {
		const { mode, activePhase, series } = this.props;

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		return (
			<div>
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
					<div
						className="tests-wrapper-mobile"
						style={{ width: '100%', backgroundColor: '#fafafa' }}
					>
						<SeriesTestsMobile
							mode={mode}
							activePhase={activePhase}
							series={series}
						/>
					</div>
					<div className="content-wrapper">
						<div
							className="content-and-rsb-container"
							style={{
								display: 'flex',
								alignItems: 'flex-start',
								width: '100%',
							}}
						>
							<div className="tests-wrapper-desktop" style={{ width: '100%' }}>
								<SeriesTestsDesktop
									mode={mode}
									activePhase={activePhase}
									series={series}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TopicTests;
