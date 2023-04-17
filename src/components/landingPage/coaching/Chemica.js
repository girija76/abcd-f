import React from 'react';

const Chemica = () => {
	const {
		url,
		clientName,
		logoDark,

		logoDarkHeight,
	} = window.config;
	const altText = `${clientName} logo`;
	return (
		<div
			class="chemica"
			style={{
				height: 400,
				minHeight: 400,
				background:
					'linear-gradient(rgba(155,155,155,0), rgba(155,155,155,0)),url("https://s3.amazonaws.com/thinkific-import/233264/iFEFD3Y3S7eFpwhIbgxt_thinkfic%20image.jpg")',
				backgroundPosition: 'right top',
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
				src="https://s3.amazonaws.com/thinkific-import/233264/iFEFD3Y3S7eFpwhIbgxt_thinkfic%20image.jpg"
			/>
		</div>
	);
};

export default Chemica;
