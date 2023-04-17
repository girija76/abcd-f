import React, { useMemo } from 'react';
import { Typography } from 'antd';
import TestLink from '../TestLink';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TestLinkMobile from '../TestLinkMobile';

const { Title } = Typography;
function SubSection({ label, items, backUrl }) {
	const breakpoints = useBreakpoint();
	const TestLinkComponent = useMemo(
		() => (!breakpoints.md ? TestLinkMobile : TestLink),
		[breakpoints.md]
	);
	return (
		<div>
			<Title
				level={4}
				style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}
			>
				<Link
					to={backUrl}
					style={{
						background: 'none',
						border: 'none',
						display: 'flex',
						alignItems: 'center',
						height: 44,
						width: 44,
						cursor: 'pointer',
						color: 'inherit',
					}}
				>
					<MdArrowBack style={{ fontSize: 30 }} />
				</Link>{' '}
				{label}
			</Title>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				{items.map(item => {
					return <TestLinkComponent test={item} key={item._id} />;
				})}
			</div>
		</div>
	);
}

export default SubSection;
