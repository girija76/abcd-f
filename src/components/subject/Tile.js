import React, { useMemo } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

function SubjectTile({
	subject,
	width = 256,
	height = 150,
	onClick,
	component: RootComponent,
	componentPropsGetter,
}) {
	const rootComponentProps = useMemo(
		() => (componentPropsGetter ? componentPropsGetter(subject) : {}),
		[componentPropsGetter, subject]
	);
	return (
		<RootComponent
			onClick={onClick}
			{...rootComponentProps}
			style={{ display: 'flex' }}
		>
			<div
				style={{
					backgroundColor: subject.color,
					borderRadius: 8,
					width: width,
					height,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<img
					alt={subject.name}
					src={subject.thumbnail}
					style={{ maxWidth: 64, maxHeight: 64, marginBottom: 8 }}
				/>
				<Title style={{ margin: 0, color: subject.textColor }} level={4}>
					{subject.name}
				</Title>
			</div>
		</RootComponent>
	);
}

export default SubjectTile;
