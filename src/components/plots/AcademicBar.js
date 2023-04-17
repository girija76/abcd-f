import React from 'react';
import './academic_bar.scss';

const AcademicBar = ({ data, type, width }) => {
	const bars = [];
	let maxQuestion = 0;
	data.forEach(({ correct, incorrect, unattempted, topic }) => {
		const total = correct + incorrect + unattempted;
		maxQuestion = Math.max(maxQuestion, total);
		bars.push({
			label: topic,
			correct,
			incorrect,
			unattempted,
			total,
		});
	});
	const barThickness = [60, 50, 40, 30][bars.length] || 30;
	const spacing = [0, 25, 20, 15][bars.length] || 15;
	return (
		<div className="academic-bar">
			<div
				style={{
					display: 'flex',
					alignItems: 'stretch',
					justifyContent: 'center',
					width,
					margin: '0 20px',
					width: '100%',
					maxWidth: '800px',
				}}
			>
				<div className="left-side" style={{ marginRight: '20px' }}>
					<div className="label-list">
						{bars.map((item, index) => (
							<div
								key={index}
								style={{
									marginBottom: `${spacing}px`,
									height: `${barThickness}px`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'flex-end',
								}}
							>
								{item.label}
							</div>
						))}
					</div>
				</div>
				<div className="right-side" style={{ flexGrow: 1 }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							minWidth: '200px',
							width: '100%',
						}}
					>
						{data.map(({ total, correct, incorrect, unattempted }) => {
							return (
								<div
									style={{
										height: `${barThickness}px`,
										width: `${(100 * total) / maxQuestion}%`,
										display: 'flex',
										alignItems: 'stretch',
										marginBottom: `${spacing}px`,
										color: '#333',
										textAlign: 'center',
										lineHeight: `${barThickness}px`,
									}}
								>
									<div
										style={{
											minWidth: `${(100 * correct) / total}%`,
											backgroundColor: 'rgba(80, 195, 70,.9)',
											overflow: 'hidden',
										}}
									>
										{correct}
									</div>
									<div
										style={{
											minWidth: `${(100 * incorrect) / total}%`,
											backgroundColor: 'rgba(255, 50, 50,.6)',
											overflow: 'hidden',
										}}
									>
										{incorrect}
									</div>
									<div
										style={{
											minWidth: `${(100 * unattempted) / total}%`,
											backgroundColor: '#546e7a',
											color: '#fff',
											overflow: 'hidden',
										}}
									>
										{unattempted}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<div className="graph-legend-list">
				<div className="item">
					<span
						className="graph-legend-color"
						style={{ backgroundColor: 'rgba(80, 195, 70,.9)' }}
					/>
					Correct
				</div>
				<div className="item">
					<span
						className="graph-legend-color"
						style={{ backgroundColor: 'rgba(255, 50, 50,.6)' }}
					/>
					Incorrect
				</div>
				<div className="item">
					<span
						className="graph-legend-color"
						style={{ backgroundColor: '#546e7a' }}
					/>
					Unattempted
				</div>
			</div>
		</div>
	);
};

export default AcademicBar;
