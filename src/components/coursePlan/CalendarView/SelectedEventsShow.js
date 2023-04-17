import React, { useMemo } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import { useWindowSize } from 'utils/hooks';
import CoursePlanEvent from '../components/CoursePlanEvent';

const singleItemColumnProps = {
	xs: 24,
};

const multipleItemsColumnProps = {
	xs: 24,
	md: 12,
	lg: 8,
};

function SelectedEventsShow({
	show,
	title,
	events,
	onClose,
	isSingleItem,
	afterChange,
}) {
	const { width } = useWindowSize();
	const modalWidth = useMemo(
		() =>
			isSingleItem
				? width < 500
					? '100%'
					: 500
				: width < 600
				? '100%'
				: width < 1200
				? '90%'
				: '80%',
		[isSingleItem, width]
	);
	return (
		<Modal
			closable={false}
			footer={
				<Button type="primary" onClick={onClose}>
					Close
				</Button>
			}
			width={modalWidth}
			centered
			title={title}
			visible={show}
			onCancel={onClose}
		>
			{Array.isArray(events) && events.length ? (
				<div style={{ padding: 4 }}>
					<Row gutter={[8, 8]}>
						{events.map((event, index) => {
							return (
								<Col
									{...(isSingleItem ? singleItemColumnProps : multipleItemsColumnProps)}
									key={index}
								>
									<CoursePlanEvent {...event} afterChange={afterChange} />
								</Col>
							);
						})}
					</Row>
				</div>
			) : (
				<div>Nothing in here</div>
			)}
		</Modal>
	);
}

export default SelectedEventsShow;
