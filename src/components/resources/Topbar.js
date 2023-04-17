import React from 'react';
import { Link } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import PREPLEAF_LOGO from '../images/logo.svg';
import { URLS } from '../urls';

const { Header, Content, Footer } = Layout;

const Topbar = ({ position = 'absolute' }) => {
	return (
		<Header
			style={{
				display: 'flex',
				position,
				zIndex: 1000,
				width: '100%',
				background: 'transparent',
			}}
		>
			<a style={{ cursor: 'pointer' }} href={URLS.prepleaf} alt-="prepleaf-logo">
				<img style={{ height: '40px' }} src={PREPLEAF_LOGO} />
			</a>
			<Link
				className="portal-link desktop-only"
				to={URLS.landingPage}
				style={{ color: 'white', margin: '0px 16px' }}
			>
				Preparation Portal
			</Link>
			<a
				className="portal-link desktop-only"
				href={URLS.mentorshipPortal}
				style={{ color: 'white', margin: '0px 16px' }}
			>
				Mentors
			</a>
			<a
				className="portal-link desktop-only"
				href={URLS.workshops}
				style={{ color: 'white', margin: '0px 16px' }}
			>
				Workshops
			</a>
			<div style={{ flex: 1 }} />
			<Link
				className="portal-link"
				to={URLS.landingPage}
				style={{ color: 'white', margin: '0px 16px' }}
			>
				Login
			</Link>
			<div className="user-wrapper"></div>
		</Header>
	);
};
export default Topbar;

// import { URLS } from '../urls';

// import PREPLEAF_LOGO from '../images/logo.svg';

// import './Resources.css';

// export class Topbar extends React.Component {
// 	render() {
// 		return (
// 			<div style={{ backgroundColor: '#282828', paddingTop: 8, paddingBottom: 8 }}>
// 				<div
// 					style={{
// 						margin: '0px 72px',
// 						display: 'flex',
// 						justifyContent: 'space-between',
// 					}}
// 				>
// 					<div style={{ display: 'flex' }}>
// 						<a href="/" style={{ display: 'flex', alignItems: 'center' }}>
// 							<img height={28} src={PREPLEAF_LOGO} alt="Prepleaf logo" />
// 						</a>
// 						<a
// 							style={{
// 								marginLeft: 40,
// 								marginRight: 10,
// 								padding: '4px 8px',
// 								color: 'white',
// 								fontSize: 18,
// 							}}
// 							href={URLS.landingPage}
// 							className="extra-items"
// 						>
// 							Preparation Portal
// 						</a>
// 						<a
// 							style={{
// 								marginLeft: 10,
// 								marginRight: 10,
// 								padding: '4px 8px',
// 								color: 'white',
// 								fontSize: 18,
// 							}}
// 							href={URLS.mentorshipPortal}
// 							className="extra-items"
// 						>
// 							Mentorship
// 						</a>
// 					</div>
// 					<div style={{ display: 'flex' }} className="extra-items">
// 						<a
// 							style={{
// 								marginLeft: 10,
// 								marginRight: 10,
// 								padding: '4px 8px',
// 								color: 'white',
// 								fontSize: 18,
// 							}}
// 							href={URLS.landingPage}
// 						>
// 							Login
// 						</a>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// export default Topbar;
