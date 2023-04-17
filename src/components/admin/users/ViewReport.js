import { Button, message, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { AiOutlineCloudDownload, AiOutlineEye } from 'react-icons/ai';
import { useBoolean } from 'use-boolean';
import LiveTestReport from 'components/reports/LiveTest';
import { BiArrowBack } from 'react-icons/bi';
import Title from 'antd/lib/typography/Title';
import reportApi from 'apis/report';
import { isNetworkError } from 'utils/axios';
import { downloadCSVFile } from 'utils/csv';
import { convertArrayToCSV } from 'convert-array-to-csv';
import { map } from 'lodash';

const ViewReportButton = ({ _id, name, username }) => {
	const [isReportVisible, showReport, hideReport] = useBoolean(false);
	const [isPrinting, setIsPrinting] = useState(false);

	const printableElementRef = useRef();

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

		pdf.save(`${username}-report.pdf`);
	};

	const downloadCsvReport = () => {
		reportApi
			.getCsvReport(_id)
			.then(response => {
				if (response.success) {
					const header = [
						'Assessment Name',
						'Marks Scored',
						'Average Marks',
						"Topper's Marks",
						'Percentile',
						'Percentile (Cumulitive)',
						"Chemistry Marks(User's)",
						'Chemistry (Average)',
						"Chemistry Marks(Topper's)",
						'Chemistry (Percentile)',
						'Chemistry (Cumulitive Percentile)',
						"Physics Marks(User's)",
						'Physics (Average)',
						"Physics Marks(Topper's)",
						'Physics (Percentile)',
						'Physics (Cumulitive Percentile)',
						"Mathematics Marks(User's)",
						'Mathematics (Average)',
						"Mathematics Marks(Topper's)",
						'Mathematics (Percentile)',
						'Mathematics (Cumulitive Percentile)',
					];
					downloadCSVFile(
						convertArrayToCSV(
							map(response.report, item => [
								item.name,
								item.userMarks,
								item.avgMarks,
								item.topperMarks,
								item.percentile,
								item.cumPercentile,
								item.userChemMarks,
								item.chemAvgMarks,
								item.topperChemMarks,
								item.chemPercentile,
								item.cumChemPercentile,
								item.userPhyMarks,
								item.phyAvgMarks,
								item.topperPhyMarks,
								item.phyPercentile,
								item.cumPhyPercentile,
								item.userMathMarks,
								item.mathAvgMarks,
								item.topperMathMarks,
								item.mathPercentile,
								item.cumMathPercentile,
							]),
							{ header }
						),
						`user-report-${username}-${_id}.csv`
					);
				} else {
					message.error('Error occurred while downloading user report');
				}
			})
			.catch(error => {
				if (isNetworkError(error)) {
					message.error('Network error occurred while downloading user report.');
				} else {
					message.error('Unknown error occurred while downloading user report.');
				}
			});
	};

	const handleDownload = async () => {
		setIsPrinting(true);
		try {
			await printElement(printableElementRef.current);
		} catch (e) {
		} finally {
			setIsPrinting(false);
		}
	};
	return (
		<>
			<Button
				style={{ display: 'inline-flex', alignItems: 'center' }}
				onClick={showReport}
				icon={<AiOutlineEye style={{ fontSize: '1.25rem', marginRight: 6 }} />}
			>
				Report
			</Button>

			<Modal
				width="80%"
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Button onClick={hideReport}>
							<BiArrowBack />
						</Button>
						<Title level={4} style={{ margin: 13, flex: 1 }}>
							{name}'s Report
						</Title>

						<Space style={{ paddingRight: '.5rem' }}>
							<Button
								// loading={isPrinting}
								onClick={downloadCsvReport}
								type="primary"
								style={{ display: 'flex' }}
								icon={
									<AiOutlineCloudDownload
										style={{ fontSize: '1.4em', marginRight: 8, marginTop: 2 }}
									/>
								}
							>
								CSV
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
								PDF
							</Button>
						</Space>
					</div>
				}
				visible={isReportVisible}
				centered
				closable={false}
				bodyStyle={{ padding: 0 }}
				footer={
					<Button type="primary" onClick={hideReport}>
						Ok
					</Button>
				}
				extra
			>
				<LiveTestReport printableElementRef={printableElementRef} userId={_id} />
			</Modal>
		</>
	);
};

export default ViewReportButton;
