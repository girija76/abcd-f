import React from 'react';
import { Typography, Grid, Space, Button, Divider, Row, Col } from 'antd';
import { wideLogo, name } from 'utils/config';
import { useWindowSize } from 'utils/hooks';
import LazyLoadImageNativeDetector from 'components/LazyLoadImage';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const { useBreakpoint } = Grid;

const StudentWithWaves = ({ mobile }) => {
	const { width: windowWidth } = useWindowSize();
	const width = !mobile && windowWidth < 700 ? 400 : windowWidth;

	const studentImageWidth = Math.min(width, 400);
	const studentImageHeight = (567 / 500) * studentImageWidth;
	const waveWidth = Math.min(width, studentImageWidth * 1.2);
	const waveHeight = (675 / 641) * waveWidth;
	const extraWaveHeight = Math.max(waveHeight - studentImageHeight, 0);
	const finalDivWidth = Math.max(waveWidth, studentImageWidth);

	const showTextInLine = width < 1075;

	return (
		<div
			style={{
				position: 'relative',
				marginRight: 30,
				display: mobile ? '' : 'flex',
				justifyContent: 'center',
			}}
		>
			<span
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					top: showTextInLine ? 0 : 40,
					left: showTextInLine ? '' : -100,
					right: showTextInLine ? 10 : 0,
					width: showTextInLine ? 120 : 130,
					height: showTextInLine ? 100 : 133,
					background: '#8E77FF',
					borderRadius: 10,
					color: '#FFFFFF',
					padding: 12,
					zIndex: 10,
				}}
			>
				<b>1.6 Lacs+</b>
				<div>JEE-Main</div>
				<div>Selections</div>
			</span>
			<span
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					top: showTextInLine ? 120 : -30,
					right: showTextInLine ? 10 : 50,
					width: showTextInLine ? 120 : 130,
					height: showTextInLine ? 100 : 133,
					background: '#C065E1',
					borderRadius: 10,
					color: '#FFFFFF',
					padding: 12,
					zIndex: 10,
				}}
			>
				<div>Prepared with </div>
				<b>20+ years</b>
				<div>of Experience</div>
			</span>
			<span
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					bottom: showTextInLine ? '' : 75,
					top: showTextInLine ? 240 : '',
					right: showTextInLine ? 10 : -15,
					width: 120,
					height: showTextInLine ? 100 : 123,
					background: '#FFB538',
					borderRadius: 10,
					color: '#FFFFFF',
					padding: 12,
					zIndex: 10,
				}}
			>
				<div>50,000+ </div>
				<b>IITians</b>
				<div>Made</div>
			</span>
			<div
				style={{
					position: 'relative',
					paddingTop: 20,
					width: finalDivWidth,
					height: studentImageHeight,
					display: mobile ? 'flex' : '',
					justifyContent: mobile ? 'center' : '',
					overflow: 'hidden',
				}}
			>
				<img
					style={{
						width: waveWidth,
						position: 'absolute',
						bottom: -1 * extraWaveHeight,
						left: 0,
					}}
					alt="waves"
					src="https://static.prepseed.com/brand/resonance/graphics/background-waves.svg"
				/>

				<LazyLoadImageNativeDetector
					style={{
						zIndex: 4,
						position: 'absolute',
						bottom: 0,
						width: studentImageWidth,
						height: studentImageHeight,
						left: '50%',
						marginLeft: -studentImageWidth / 2,
					}}
					alt="Student with Books"
					src={[
						{
							type: 'image/webp',
							url: 'https://static.prepseed.com/brand/resonance/graphics/student.webp',
						},
						{
							type: 'image/png',
							url: 'https://static.prepseed.com/brand/resonance/graphics/student.png',
						},
					]}
				/>
			</div>
		</div>
	);
};

const scheduledTests = [
	{
		name: 'Test 1',
		duration: '3 hours',
		date: '19 July',
	},
	{
		name: 'Test 2',
		duration: '3 hours',
		date: '21 July',
	},
	{
		name: 'Test 3',
		duration: '3 hours',
		date: '23 July',
	},
	{
		name: 'Test 4',
		duration: '3 hours',
		date: '25 July',
	},
];

const howWillThisHelp = [
	{
		heading:
			'Practice quality questions in a time bound series made by experts and crack JEE-Mains.',
		graphicUrl:
			'https://static.prepseed.com/brand/resonance/graphics/quality-questions.svg',
	},
	{
		heading: 'Develop a habit to attempt each question at a faster pace.',
		graphicUrl:
			'https://static.prepseed.com/brand/resonance/graphics/faster-pace.svg',
	},
	{
		heading:
			'Get Insights for formulating a strategy to pick up the right questions first.',
		graphicUrl:
			'https://static.prepseed.com/brand/resonance/graphics/strategy-to-pick.svg',
	},
];
const buyServicePlanLink =
	'/dashboard/cart?sp=60ec1c8864abb70cc0e3e925&flow=buy&prefer=sign_up&sign_up_subGroup=60ec070812b7a80dbd6957ea&sign_up_superGroup=5dd95e8097bc204881be3f2c&sign_up_phase=60ec070812b7a80dbd6957ec';

function Resonance() {
	const breakpoints = useBreakpoint();
	const mobileUI = !breakpoints.md;
	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap"
				rel="stylesheet"
			></link>
			<div style={{ width: '100%', backgroundColor: '#F6F6F6' }}>
				<div style={{ maxWidth: 1100, margin: 'auto' }}>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							padding: mobileUI ? '1.5rem 1.5rem 0' : '1.5rem',
							marginBottom: '2rem',
						}}
					>
						<div style={{ marginBottom: mobileUI ? '1rem' : 0 }}>
							<img src={wideLogo} alt={name} />
						</div>
						<Space
							style={mobileUI ? { width: '100%', justifyContent: 'space-evenly' } : {}}
						>
							<Link to="/registration/sign_in">
								<Button type="link" ghost style={{ color: '#313131' }}>
									Sign In
								</Button>
							</Link>
							<Link to="/registration/create_account?flow=buy&phase=60ec070812b7a80dbd6957ec&subGroup=60ec070812b7a80dbd6957ea&superGroup=5dd95e8097bc204881be3f2c">
								<Button
									type="primary"
									ghost
									style={{
										color: '#84A500',
										borderColor: '#84A500',
										borderWidth: 2,
										height: 40,
									}}
								>
									Try for Free
								</Button>
							</Link>
						</Space>
					</div>
					<div
						style={{
							display: 'flex',
							flexWrap: 'nowrap',
							justifyContent: 'space-between',
							padding: mobileUI ? 0 : '1.5rem 1.5rem 0',
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								width: mobileUI ? '100%' : '',
							}}
						>
							<div
								style={{ padding: mobileUI ? '0 1.5rem' : 0, marginBottom: '2rem' }}
							>
								<Title
									level={2}
									style={{
										marginBottom: '0rem',
										color: '#363636',
										fontFamily: 'Ubuntu',
									}}
								>
									IIT-JEE Test Series
								</Title>
								<Title
									level={4}
									style={{ marginTop: 0, color: '#363636', fontFamily: 'Ubuntu' }}
								>
									with AI-powered learning
								</Title>
							</div>
							{mobileUI ? <StudentWithWaves mobile /> : null}
							<div style={{ padding: mobileUI ? '1.5rem' : 0 }}>
								<Title
									level={3}
									style={{ color: '#363636', fontFamily: 'Ubuntu', fontWeight: 400 }}
								>
									Improve your JEE-Mains Score by 10%
								</Title>
								<div
									style={{
										display: 'flex',
										alignItems: mobileUI ? 'center' : 'flex-start',
										flexDirection: mobileUI ? 'row' : 'column',
										justifyContent: mobileUI ? 'space-between' : 'flex-start',
									}}
								>
									<Text
										style={{
											color: '#BAD648',
											fontWeight: 'bold',
											fontSize: '2rem',
											fontFamily: 'Ubuntu',
										}}
									>
										₹599
									</Text>
									<Link to={buyServicePlanLink}>
										<Button
											size="large"
											style={{
												backgroundColor: '#84A500',
												color: '#fff',
												borderColor: '#84A500',
											}}
										>
											Enroll Now
										</Button>
									</Link>
								</div>
							</div>
						</div>
						{!mobileUI ? <StudentWithWaves /> : null}
					</div>
					<div
						style={{
							backgroundColor: '#fff',
							borderRadius: 10,
							display: 'flex',
							flexWrap: mobileUI ? 'wrap' : '',
							justifyContent: 'space-evenly',
							alignItems: 'center',
							textAlign: 'center',
							padding: '1.5rem',
						}}
					>
						<Title
							style={{ fontFamily: 'Ubuntu', fontWeight: 500, minWidth: 80 }}
							level={4}
						>
							4 Tests
						</Title>
						<Divider style={{ height: '50px' }} type="vertical" />
						<Title
							style={{ fontFamily: 'Ubuntu', fontWeight: 500, minWidth: 80 }}
							level={4}
						>
							1 Week
						</Title>
						{mobileUI ? (
							<Divider type="horizontal" />
						) : (
							<Divider style={{ height: '50px' }} type="vertical" />
						)}
						<Title
							style={{ fontFamily: 'Ubuntu', fontWeight: 500, minWidth: 135 }}
							level={4}
						>
							Improve <br />
							Your Speed
						</Title>
						<Divider style={{ height: '50px' }} type="vertical" />
						<Title
							style={{ fontFamily: 'Ubuntu', fontWeight: 500, minWidth: 135 }}
							level={4}
						>
							Improve <br />
							Your Strategy
						</Title>
					</div>
					<div style={{ margin: '1.5rem', marginTop: '8rem' }}>
						<Title
							level={3}
							style={{ fontWeight: 400, fontFamily: 'Ubuntu', marginBottom: '2rem' }}
						>
							Test Schedule
						</Title>
						<Row gutter={[12, 12]}>
							{scheduledTests.map(({ name, date, duration }) => (
								<Col xs={24} md={12} key={name}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											backgroundColor: '#fff',
											borderRadius: 8,
											padding: '1rem',
											alignItems: 'center',
										}}
									>
										<Title level={4} style={{ fontFamily: 'Ubuntu', marginBottom: 0 }}>
											{name}
										</Title>
										<Text type="secondary" style={{ marginBottom: 0 }}>
											{duration}
										</Text>
										<Title
											type="success"
											level={4}
											style={{ fontFamily: 'Ubuntu', marginBottom: 0, marginTop: 0 }}
										>
											{date}
										</Title>
									</div>
								</Col>
							))}
						</Row>
					</div>
					<div style={{ margin: '1.5rem', marginTop: '8rem' }}>
						<Title
							level={3}
							style={{ fontWeight: 400, fontFamily: 'Ubuntu', marginBottom: '2rem' }}
						>
							How Will this Help?
						</Title>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								justifyContent: mobileUI ? 'center' : 'space-between',
							}}
						>
							{howWillThisHelp.map(({ heading, graphicUrl }) => (
								<div key={heading} style={{ maxWidth: 250, marginBottom: '3rem' }}>
									<LazyLoadImageNativeDetector
										src={graphicUrl}
										style={{ width: '100%' }}
									/>
									<Title level={4} style={{ fontFamily: 'Ubuntu', fontWeight: 500 }}>
										{heading}
									</Title>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Resonance;
