import { Button, Space, Tabs } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LiveTestReport from 'components/reports/LiveTest';
import Attendance from 'components/reports/components/Attendance';
import VideoAnalytics from 'components/reports/components/VideoAnalytics';
import { useRouteMatch } from 'react-router';
import Scoreboard from 'components/reports/components/Scoreboard';
import { AiOutlineCloudDownload, AiOutlineReload } from 'react-icons/ai';
import { enableScoreboard, showVideos } from 'utils/config';

const allTabList = [
	{
		key: 'video',
		tab: 'Video',
		component: VideoAnalytics,
	},
	{
		key: 'attendance',
		tab: 'Attendance',
		component: Attendance,
	},
	{
		key: 'scoreboard',
		tab: 'Scoreboard',
		component: Scoreboard,
	},
	{
		key: 'live-test',
		tab: 'Live Test',
		component: LiveTestReport,
	},
];

const tabList = allTabList.filter(
	f =>
		(f.key === 'scoreboard' ? enableScoreboard : true) &&
		(f.key === 'video' ? showVideos : true) &&
		(f.key === 'attendance' ? showVideos : true)
);

const renderByTabKeyDefault = {};
tabList.forEach(({ key }) => {
	renderByTabKeyDefault[key] = 0;
});

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const printElement = async element => {
	const html2canvas = await import(
		/* webpackChunkName: "html2canvas"*/ 'html2canvas'
	);

	await delay(100);
	const canvas = await html2canvas.default(element);

	const imgData = canvas.toDataURL('image/png');

	const imgWidth = 208;
	const imgHeight = (canvas.height * imgWidth) / canvas.width;

	const { jsPDF } = await import(/* webpackChunkName: "jspdf"*/ 'jspdf');

	const pdf = new jsPDF('p', 'mm', 'a4');
	const pageHeight = pdf.internal.pageSize.getHeight();
	const pageWidth = pdf.internal.pageSize.getWidth();

	pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

	const pagecount = Math.ceil(imgHeight / pageHeight);

	if (pagecount > 0) {
		let j = 1;
		while (j !== pagecount) {
			pdf.addPage('l', 'mm', 'a4');
			pdf.addImage(imgData, 'JPEG', 0, -(j * pageHeight), pageWidth, 0);
			j++;
		}
	}

	pdf.save('report.pdf');
};

function ReportsRoute({ match: { url: matchedUrl }, history }) {
	const [renderByTabKey, setRenderByTabKey] = useState({});
	const [isPrinting, setIsPrinting] = useState(false);

	const routeMatch = useRouteMatch({
		path: `${matchedUrl}/:matchedTabKey`,
	});
	const activeTabKey = routeMatch ? routeMatch.params.matchedTabKey : null;
	const printableElementRef = useRef();

	useEffect(() => {
		if (!activeTabKey) {
			history.replace(`${matchedUrl}/${tabList[0].key}`);
		}
	}, [activeTabKey, history, matchedUrl]);

	const handleRefresh = useCallback(() => {
		setRenderByTabKey({
			...renderByTabKey,
			[activeTabKey]: (renderByTabKey[activeTabKey] || 0) + 1,
		});
	}, [activeTabKey, renderByTabKey]);

	const handleDownload = async () => {
		setIsPrinting(true);
		try {
			await printElement(printableElementRef.current);
		} catch (e) {
		} finally {
			setIsPrinting(false);
		}
	};

	const handleTabChange = key => {
		history.push(`${matchedUrl}/${key}`);
	};
	return (
		<div style={{ marginBottom: 64 }}>
			<Tabs
				style={{ background: '#fff' }}
				onChange={handleTabChange}
				activeKey={activeTabKey}
				tabBarExtraContent={
					<Space style={{ paddingRight: '.5rem' }}>
						<Button
							onClick={handleRefresh}
							style={{ display: 'flex' }}
							icon={
								<AiOutlineReload
									style={{ fontSize: '1.3em', marginRight: 8, marginTop: 2 }}
								/>
							}
						>
							Refresh
						</Button>
						<Button
							loading={isPrinting}
							onClick={handleDownload}
							type="primary"
							style={{ display: 'flex' }}
							icon={
								<AiOutlineCloudDownload
									style={{ fontSize: '1.4em', marginRight: 8, marginTop: 2 }}
								/>
							}
						>
							Download
						</Button>
					</Space>
				}
			>
				{tabList.map(tabItem => {
					const TabComponent = tabItem.component;
					return (
						<Tabs.TabPane tab={tabItem.tab} key={tabItem.key}>
							<TabComponent
								refreshKey={renderByTabKey[tabItem.key]}
								printableElementRef={printableElementRef}
								isPrinting={isPrinting}
								onRefresh={handleRefresh}
							/>
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		</div>
	);
}

export default ReportsRoute;
