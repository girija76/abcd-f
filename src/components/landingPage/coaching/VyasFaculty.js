import React from 'react';
import './vyasfaculty.scss';

const PrinceSir = () => {
	const { url, clientName, logoDark, logoDarkHeight } = window.config;
	const altText = `${clientName} logo`;
	return (
		<div class="vyasfaculty">
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
				src="https://static.prepleaf.com/brand/vyas-banner.jpg"
			/>
		</div>
	);
};

export default PrinceSir;
