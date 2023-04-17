/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from 'antd/es/card';
import MarksDistribution from '../plots/MarksDistribution';
import Button from 'antd/es/button';

import { URLS } from '../urls';

import './AnalysisPartTwo.css';

const getViewTime = (numberOfTimesTracked = 0) => {
	if (numberOfTimesTracked < 5) {
		return Math.pow(3, numberOfTimesTracked) * 4000;
	}
	return -1;
};

const AnalysisPartTwo = props => {
	const {
		hist,
		coreHist,
		percent,
		percentile,
		maxMarks,
		nintypercentile,
		isGraphReady,
		autoGrade,
		id,
	} = props;

	const viewportAnalyticsCallTimeoutId = useRef(null);
	const graphRef = useRef(null);

	const [numberOfTimesTracked, setNumberOfTimesTracked] = useState(0);
	const [width, setWidth] = useState(window.innerWidth);
	const distributionWidth = useMemo(() => {
		let distributionWidth =
			width <= 1024
				? width - 80 - 48 - 24 - 30
				: 0.72 * (width - 32 * 2 - 24 * 2 - 200 - 50 * 2);

		if (width < 900) {
			distributionWidth = Math.max(500, width) - 48 - 24 - 30;
		}
		return distributionWidth;
	}, [width]);
	useEffect(() => {
		window.addEventListener('resize', () => {
			setWidth(window.innerWidth);
		});
	}, []);

	useEffect(() => {
		let observer;
		if (graphRef.current) {
			const handleSroll = (entries, observer) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					if (!viewportAnalyticsCallTimeoutId.current) {
						const afterTime = getViewTime(numberOfTimesTracked);
						if (afterTime > -1) {
							viewportAnalyticsCallTimeoutId.current = setTimeout(() => {
								viewportAnalyticsCallTimeoutId.current = null;
								window.ga('send', 'event', {
									eventAction: 'View Graph',
									eventCategory: 'Analysis',
									eventLabel: 'Rank in Percentile, Test analysis Section #2',
									eventValue: Math.floor(afterTime / 1000),
									nonInteraction: true,
								});
								setNumberOfTimesTracked(numberOfTimesTracked + 1);
							}, afterTime);
						}
					}
				} else if (viewportAnalyticsCallTimeoutId.current) {
					clearTimeout(viewportAnalyticsCallTimeoutId.current);
					viewportAnalyticsCallTimeoutId.current = null;
				}
			};
			observer = new IntersectionObserver(handleSroll, {
				rootMargin: '0px',
				threshold: 0.87,
			});
			observer.observe(graphRef.current);
		}
		return () => {
			observer && observer.disconnect();
		};
	}, [numberOfTimesTracked]);

	const histogram = autoGrade ? coreHist : hist;

	return (
		<Card
			style={{ width: '100%' }}
			bodyStyle={{
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
			}}
		>
			<div
				style={{ display: 'flex', width: '100%' }}
				className="distribution-review-container"
			>
				<div style={{ flex: 2 }}>
					{histogram ? (
						<div
							style={{
								padding: '10px 10px',
								width: '100%',
							}}
							ref={graphRef}
						>
							<MarksDistribution
								isGraphReady={isGraphReady}
								hist={autoGrade ? coreHist : hist}
								percent={percent}
								percentile={percentile}
								width={distributionWidth}
								nintypercentile={(100 * nintypercentile) / maxMarks}
								maxMarks={maxMarks}
								autoGrade={false}
							/>
						</div>
					) : null}
				</div>
				<div
					style={{
						display: 'flex',
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div style={{ fontSize: 16, textAlign: 'center' }}>
						See how you have performed
					</div>
					<Link
						data-ga-on="click"
						data-ga-event-action="click"
						data-ga-event-category="Review Questions"
						data-ga-event-label="Page: Analysis, Position: Section 2"
						to={`${URLS.analysisQuestion}?id=${id}`}
						style={{ margin: 12 }}
					>
						<Button type="primary" size="large">
							Review Questions
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
};

export default AnalysisPartTwo;
