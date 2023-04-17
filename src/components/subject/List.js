import React from 'react';
import { map } from 'lodash';
import { Button, Col, Row, Spin } from 'antd';
import SubjectTile from 'components/subject/Tile';
import { useGetAllPhaseSubjects } from './hook';
import { AiOutlineFrown, AiOutlineReload } from 'react-icons/ai';

function SubjectList({
	phase,
	onClickItem,
	itemComponent,
	itemComponentPropsGetter,
}) {
	const { subjects, isFetching, isError, refetch } = useGetAllPhaseSubjects([
		phase,
	]);

	if (isError) {
		return (
			<div style={{ display: 'flex' }}>
				<AiOutlineFrown style={{ fontSize: 32 }} />
				<div>Failed to load subjects.</div>
				<div>
					<Button icon={<AiOutlineReload />} onClick={refetch}>
						Reload
					</Button>
				</div>
			</div>
		);
	}
	if (isFetching) {
		return (
			<div>
				<div>
					<Spin />
				</div>
				<div>Loading subjects...</div>
			</div>
		);
	}

	return (
		<Row gutter={[16, 16]}>
			{map(subjects, subject => (
				<Col key={subject._id} xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
					<SubjectTile
						onClick={onClickItem}
						component={itemComponent}
						componentPropsGetter={itemComponentPropsGetter}
						subject={subject}
						width="100%"
					/>
				</Col>
			))}
		</Row>
	);
}

SubjectList.defaultProps = {
	itemComponent: 'div',
	itemComponentPropsGetter: () => ({}),
	onClickItem: () => {},
};
export default SubjectList;
