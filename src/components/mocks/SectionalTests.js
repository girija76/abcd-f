import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Route, Switch } from 'react-router-dom';
import SectionalTestsMobile from './SectionalTestsMobile';
import SectionalTestsDesktop from './SectionalTestsDesktop';

import './Mocks.css';

import { URLS } from '../urls';

const extraTabNames = {
	'5d10e43944c6e111d0a17d0c': 'Section Tests (Non-CAT)',
};

const titles = {
	default: 'Sectional Tests - Preparation Portal',
	cat: 'Sectional Tests - CAT',
	placement: 'Sectional Tests - Placement',
	jee: 'Sectional Tests - IIT-JEE',
};

const mocks = {
	default: URLS.mocks,
	cat: URLS.catMocks,
	placement: URLS.placementMocks,
};

const sections_ = {
	default: URLS.sectionalTests,
	cat: URLS.catSectionalTests,
	placement: URLS.placementSectionalTests,
	jee: URLS.jeeSectionalTests,
};

class Mocks extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { mode, activePhase } = this.props;

		let path = window.location.pathname;
		let key_ = 'default';
		if (mode === 'demo' && path.indexOf('cat') !== -1) key_ = 'cat';
		if (mode === 'demo' && path.indexOf('placement') !== -1) key_ = 'placement';
		const subDomain = mode ? (key_ === 'placement' ? 'jobs' : key_) : 'prepare';

		return (
			<div>
				<Helmet>
					{mode === 'demo' ? (
						<link
							rel="canonical"
							href={`https://${subDomain}.prepleaf.com/demo/${key_}/sectional-tests`}
						/>
					) : null}
					<title>{window.config.metaData.demoSectionalTests.title}</title>
					<meta
						name="description"
						content={window.config.metaData.demoSectionalTests.description}
					/>
				</Helmet>
				<div
					className="tests-wrapper-mobile"
					style={{ width: '100%', marginTop: 20 }}
				>
					<SectionalTestsMobile mode={mode} activePhase={activePhase} />
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
							<SectionalTestsDesktop mode={mode} activePhase={activePhase} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Mocks;
