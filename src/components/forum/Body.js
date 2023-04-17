import React, { useMemo } from 'react';
import { Typography } from 'antd';
import { split } from 'lodash';

const { Paragraph } = Typography;

const getTextNodes = text => {
	return split(text, '\n');
};

function BodyView({ body, bodyType }) {
	const text = body ? body.text : null;
	const textNodes = useMemo(() => getTextNodes(text), [text]);
	if (bodyType === 'text') {
		return (
			<Paragraph>
				{textNodes.map((text, index) => (
					<React.Fragment key={index}>
						{text}
						<br />
					</React.Fragment>
				))}
			</Paragraph>
		);
	}
	return <div>Unsupported format</div>;
}

export default BodyView;
