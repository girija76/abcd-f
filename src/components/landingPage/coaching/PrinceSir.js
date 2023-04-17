import React from 'react';
import './princesir.scss';

const PrinceSir = () => {
	const {
		url,
		clientName,
		logoDark,

		logoDarkHeight,
	} = window.config;
	const altText = `${clientName} logo`;
	return (
		<div
			class="princesir"
			style={{
				height: 500,
				minHeight: 500,
				overflow: 'hidden',
				width: '100%',
			}}
		>
			<div style={{ marginLeft: 78, marginTop: 32 }}>
				<a
					href={url}
					style={{ display: 'inline-block' }}
					className={`prepleaf-logo`}
				>
					<img alt={altText} src={logoDark} height={logoDarkHeight}></img>
				</a>
			</div>
			<img
				alt=""
				style={{ opacity: 0 }}
				src="https://static.prepleaf.com/brand/princesir.png"
			/>
		</div>
	);
};

export default PrinceSir;
