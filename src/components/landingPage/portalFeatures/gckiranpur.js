import React from 'react';
import { Carousel, Divider } from 'antd';
import LazyLoadImageNativeDetector from 'components/LazyLoadImage';
import { useWindowSize } from 'utils/hooks';

const gallaryBaseUrl = 'https://static.prepseed.com/brand/gckiranpur/album';
const imageNames = [];
for (let i = 0; i < 10; i++) {
	imageNames.push(`${gallaryBaseUrl}/${i + 1}.jpeg`);
}

const SlideComponent = ({ src }) => {
	const { height: viewportHeight, width: viewportWdith } = useWindowSize();
	const maxWidth = viewportWdith;
	const height = Math.min(600, viewportHeight, 0.75 * maxWidth);
	const contentStyle = {
		height: height + 64,
		color: '#fff',
		lineHeight: '160px',
		textAlign: 'center',
		background: '#e0e0e0',
		padding: '32px 0',
	};
	return (
		<div style={contentStyle}>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ maxHeight: height, maxWidth: '100%' }}>
					<LazyLoadImageNativeDetector
						src={src}
						style={{ maxHeight: height, maxWidth }}
					/>
				</div>
			</div>
		</div>
	);
};

const tiles = [
	{ label: 'No student', text: '1000+' },
	{ label: 'Girls', text: '677' },
	{ label: 'Boys', text: '375' },
	{
		label: 'Faculty',
		text: '12',
	},
	{ label: 'Streams', text: 'Arts & Science' },
];
const singleTextTiles = [
	'Sports facility',
	'Library facility',
	'8 acre campus',
];

function GCKiranpurPage(props) {
	return (
		<div>
			<div style={{ padding: '2rem 0 3rem' }}>
				<div
					style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
				>
					{tiles.map(tile => (
						<div
							style={{
								width: 200,
								height: 200,
								borderRadius: 100,
								alignItems: 'center',
								justifyContent: 'center',
								display: 'flex',
								flexDirection: 'column',
								textAlign: 'center',
								backgroundColor: 'rgba(196, 255, 233,.65)',
								margin: 12,
							}}
						>
							<span>{tile.label}</span>
							<span style={{ fontSize: '1.5rem' }}>{tile.text}</span>
						</div>
					))}
				</div>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{singleTextTiles.map(tile => (
						<>
							<div style={{ margin: '.5rem 1rem' }}>
								<span style={{ fontSize: '1.5rem' }}>{tile}</span>
							</div>
							<Divider type="vertical" style={{ height: 24 }} />
						</>
					))}
				</div>
			</div>
			<Carousel autoplay>
				{imageNames.map(imageUrl => (
					<div key={imageUrl}>
						<SlideComponent src={imageUrl} />
					</div>
				))}
			</Carousel>
		</div>
	);
}

export default GCKiranpurPage;
